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
  var AreaScreenView = require( 'AREA_MODEL_COMMON/view/AreaScreenView' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/model/GenericAreaModel' );
  var GenericAreaNode = require( 'AREA_MODEL_COMMON/view/GenericAreaNode' );
  var GenericLayoutSelectionNode = require( 'AREA_MODEL_COMMON/view/GenericLayoutSelectionNode' );
  var GenericProductNode = require( 'AREA_MODEL_COMMON/view/GenericProductNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {AreaModel} model
   * @param {number} decimalPlaces
   */
  function GenericAreaScreenView( model, decimalPlaces ) {
    assert && assert( model instanceof GenericAreaModel );
    assert && assert( typeof decimalPlaces === 'number' );

    // @private {Node}
    this.popupLayer = new Node( {
      scale: 0.7 // TODO: factor out the scale
    } );

    AreaScreenView.call( this, model, false, decimalPlaces );

    this.addChild( new GenericAreaNode( model.areas[ 0 ], model.allowExponents, model.partialProductsChoiceProperty, {
      translation: this.getAreaTranslation()
    } ) );

    this.addChild( this.popupLayer );
  }

  areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

  return inherit( AreaScreenView, GenericAreaScreenView, {
    // TODO: doc/improve
    createProductNode: function( model, decimalPlaces ) {
      var horizontalDisplayProperty = model.areas[ 0 ].getDisplayProperty( Orientation.HORIZONTAL );
      var verticalDisplayProperty = model.areas[ 0 ].getDisplayProperty( Orientation.VERTICAL );
      return new GenericProductNode( horizontalDisplayProperty, verticalDisplayProperty, model.allowExponents );
    },

    // TODO: doc/improve
    createLayoutNode: function( model, width ) {
      return new GenericLayoutSelectionNode( model.genericLayoutProperty, this.popupLayer, width );
    }
  } );
} );
