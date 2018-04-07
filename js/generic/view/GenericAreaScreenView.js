// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for generic screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var GenericAreaDisplayNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaDisplayNode' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  var GenericLayoutSelectionNode = require( 'AREA_MODEL_COMMON/generic/view/GenericLayoutSelectionNode' );
  var GenericFactorsNode = require( 'AREA_MODEL_COMMON/generic/view/GenericFactorsNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {GenericAreaModel} model
   * @param {number} decimalPlaces TODO: to options?
   */
  function GenericAreaScreenView( model, decimalPlaces ) {
    assert && assert( model instanceof GenericAreaModel );
    assert && assert( typeof decimalPlaces === 'number' );

    // @private {Node}
    this.popupLayer = new Node( {
      scale: 0.7 // TODO: factor out the scale
    } );

    // @private {Node|null} - Will be filled in with getRightSideNodes (we need lazy creation here unfortunately).
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
    getRightSideNodes: function() {
      this.layoutSelectionNode = new GenericLayoutSelectionNode( this.model.genericLayoutProperty, this.popupLayer, this.factorsBox.width );
      return [ this.layoutSelectionNode ].concat( AreaScreenView.prototype.getRightSideNodes.call( this ) );
    },

    /**
     * Creates the main area display view for the screen.
     * @public
     * @override
     *
     * @param {GenericAreaModel} model
     * @param {GenericAreaDisplay} areaDisplay
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
      var dynamicProperties = OrientationPair.create( function( orientation ) {
        return new DynamicProperty( new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
          return area.displayProperties.get( orientation );
        } ) );
      } );
      return new GenericFactorsNode( dynamicProperties, new Property( model.allowExponents ) );
    }
  } );
} );
