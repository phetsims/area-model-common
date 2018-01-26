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
  var GenericProductNode = require( 'AREA_MODEL_COMMON/generic/view/GenericProductNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {AreaModel} model
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
    // TODO: doc, abstract
    createAreaNode: function( model, area ) {
      return new GenericAreaNode( area, model.allowExponents, model.partialProductsChoiceProperty, {
        translation: this.getAreaTranslation()
      } );
    },

    // TODO: doc/improve
    createProductNode: function( model, decimalPlaces ) {
      //TODO: don't duplicate horizontal/vertical here
      var horizontalDisplayProperty = new DynamicProperty( new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
        return area.displayProperties.get( Orientation.HORIZONTAL );
      } ) );
      var verticalDisplayProperty = new DynamicProperty( new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
        return area.displayProperties.get( Orientation.VERTICAL );
      } ) );
      return new GenericProductNode( horizontalDisplayProperty, verticalDisplayProperty, new Property( model.allowExponents ) );
    },

    // TODO: doc/improve
    createLayoutNode: function( model, width ) {
      return new GenericLayoutSelectionNode( model.genericLayoutProperty, this.popupLayer, width );
    }
  } );
} );
