// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for proportional (to-scale, not generic) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModel = require( 'AREA_MODEL_COMMON/common/model/AreaModel' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );

  /**
   * @constructor
   * @extends {AreaModel}
   *
   * @param {Array.<Object>} - An array of options objects to be passed to the ProportionalArea constructors.
   */
  function ProportionalAreaModel( areaOptionObjects ) {

    AreaModel.call( this, areaOptionObjects.map( function( options ) {
      return new ProportionalArea( options );
    } ), false, AreaModelColorProfile.proportionalWidthProperty, AreaModelColorProfile.proportionalHeightProperty );

    // @public {BooleanProperty}
    this.gridLinesVisibleProperty = new BooleanProperty( true );

    // @public {BooleanProperty}
    this.tilesVisibleProperty = new BooleanProperty( false );
  }

  areaModelCommon.register( 'ProportionalAreaModel', ProportionalAreaModel );

  return inherit( AreaModel, ProportionalAreaModel, {
    /**
     * Returns the model to its initial state.
     * @public
     * @override
     */
    reset: function() {
      AreaModel.prototype.reset.call( this );

      this.gridLinesVisibleProperty.reset();
      this.tilesVisibleProperty.reset();
    }
  } );
} );
