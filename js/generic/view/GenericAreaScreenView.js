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
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  var GenericAreaNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaNode' );
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
   * @param {AreaModelCommonModel} model
   * @param {number} decimalPlaces TODO: to options?
   */
  function GenericAreaScreenView( model, decimalPlaces ) {
    assert && assert( model instanceof GenericAreaModel );
    assert && assert( typeof decimalPlaces === 'number' );

    // @private {Node}
    this.popupLayer = new Node( {
      scale: 0.7 // TODO: factor out the scale
    } );

    AreaScreenView.call( this, model, {
      isProportional: false,
      decimalPlaces: decimalPlaces
    } );

    this.addChild( this.popupLayer );
  }

  areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

  return inherit( AreaScreenView, GenericAreaScreenView, {
    /**
     * Creates the "area" (product) content for the accordion box.
     * @public
     * @override
     *
     * @param {AreaModelCommonModel} model
     * @param {Area} area
     * @returns {AreaNode}
     */
    createAreaNode: function( model, area ) {
      return new GenericAreaNode( area, model.allowExponents, model.partialProductsChoiceProperty, {
        translation: this.getAreaTranslation()
      } );
    },

    /**
     * Creates the "factors" (dimensions) content for the accordion box.
     * @public
     * @override
     *
     * @param {AreaModelCommonModel} model
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
    },

    // TODO: doc/improve
    createLayoutNode: function( model, width ) {
      return new GenericLayoutSelectionNode( model.genericLayoutProperty, this.popupLayer, width );
    }
  } );
} );
