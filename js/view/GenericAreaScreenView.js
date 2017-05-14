// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for generic screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/view/AreaScreenView' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/model/GenericAreaModel' );
  var GenericAreaNode = require( 'AREA_MODEL_COMMON/view/GenericAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );

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

    var self = this;

    AreaScreenView.call( this, model, false, decimalPlaces, AreaModelColorProfile.genericWidthProperty,
                                                            AreaModelColorProfile.genericHeightProperty );

    this.addChild( new GenericAreaNode( model.areas[ 0 ], model.allowPowers, AreaModelColorProfile.genericWidthProperty, AreaModelColorProfile.genericHeightProperty, model.partialProductsChoiceProperty, {
      // TODO: improve positioning, remove duplicated code with proportional
      x: self.layoutBounds.left + AreaModelConstants.MAIN_AREA_OFFSET.x,
      y: self.layoutBounds.top + AreaModelConstants.MAIN_AREA_OFFSET.y
    } ) );
  }

  areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

  return inherit( AreaScreenView, GenericAreaScreenView );
} );
