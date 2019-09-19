// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype screenview for generic screens.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const GenericAreaDisplayNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaDisplayNode' );
  const GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  const GenericFactorsNode = require( 'AREA_MODEL_COMMON/generic/view/GenericFactorsNode' );
  const GenericLayoutSelectionNode = require( 'AREA_MODEL_COMMON/generic/view/GenericLayoutSelectionNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {GenericAreaModel} model
   * @param {number} decimalPlaces
   */
  function GenericAreaScreenView( model, decimalPlaces ) {
    assert && assert( model instanceof GenericAreaModel );
    assert && assert( typeof decimalPlaces === 'number' );

    // @private {Node}
    this.popupLayer = new Node();

    // @private {Node|null} - Will be filled in with getRightAlignNodes (we need lazy creation here unfortunately).
    // We need to construct it later when factorsBox.width is defined (so we can properly size it), but we can't wait
    // until the supertype is fully constructed since then our right align setup will have been constructed fully.
    this.layoutSelectionNode = null;

    AreaScreenView.call( this, model, {
      isProportional: false,
      decimalPlaces: decimalPlaces
    } );

    this.addChild( this.popupLayer );
  }

  areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

  return inherit( AreaScreenView, GenericAreaScreenView, {
    /**
     * @protected
     * @override
     *
     * @returns {Array.<Node>}
     */
    getRightAlignNodes: function() {
      assert && assert( !this.layoutSelectionNode, 'Should not be called multiple times or it will leak memory' );

      this.layoutSelectionNode = new GenericLayoutSelectionNode(
        this.model.genericLayoutProperty,
        this.popupLayer,
        this.factorsBox.width
      );
      return [ this.layoutSelectionNode ].concat( AreaScreenView.prototype.getRightAlignNodes.call( this ) );
    },

    /**
     * Creates the main area display view for the screen.
     * @public
     * @override
     *
     * @param {GenericAreaModel} model
     * @returns {GenericAreaDisplayNode}
     */
    createAreaDisplayNode: function( model ) {
      return new GenericAreaDisplayNode( model.areaDisplay, model.allowExponents, model.partialProductsChoiceProperty, {
        translation: this.getDisplayTranslation()
      } );
    },

    /**
     * Creates the "factors" (dimensions) content for the accordion box.
     * @public
     * @override
     *
     * @param {GenericAreaModel} model
     * @param {number} decimalPlaces
     * @returns {Node}
     */
    createFactorsNode: function( model, decimalPlaces ) {
      const dynamicProperties = OrientationPair.create( function( orientation ) {
        return new DynamicProperty( new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
          return area.displayProperties.get( orientation );
        } ) );
      } );
      return new GenericFactorsNode( dynamicProperties, new Property( model.allowExponents ) );
    }
  } );
} );
