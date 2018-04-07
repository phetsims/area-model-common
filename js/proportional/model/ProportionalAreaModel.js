// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for proportional (to-scale, not generic) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonModel = require( 'AREA_MODEL_COMMON/common/model/AreaModelCommonModel' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  var ProportionalAreaDisplay = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaDisplay' );

  /**
   * @constructor
   * @extends {AreaModelCommonModel}
   *
   * @param {Array.<Object>} areaOptionObjects - An array of options objects to be passed to the ProportionalArea
   *                         constructors.
   * @param {Object} [options]
   */
  function ProportionalAreaModel( areaOptionObjects, options ) {

    options = _.extend( {
      isProportional: true,
      initialAreaBoxExpanded: true
    }, options );

    var areas = areaOptionObjects.map( function( options ) {
      return new ProportionalArea( options );
    } );

    AreaModelCommonModel.call( this, areas, areas[ 0 ], options );

    // @public {BooleanProperty}
    this.gridLinesVisibleProperty = new BooleanProperty( true );

    // @public {BooleanProperty}
    this.tilesVisibleProperty = new BooleanProperty( false );

    // @public {BooleanProperty}
    this.countingVisibleProperty = new BooleanProperty( true );

    // @public {BooleanProperty}
    this.calculationBoxVisibleProperty = new BooleanProperty( false );
  }

  areaModelCommon.register( 'ProportionalAreaModel', ProportionalAreaModel );

  return inherit( AreaModelCommonModel, ProportionalAreaModel, {
    /**
     * Returns a concrete AreaDisplay subtype
     * @protected
     *
     * @param {Property.<Area>} areaProperty
     * @returns {ProportionalAreaDisplay}
     */
    createAreaDisplay: function( areaProperty ) {
      return new ProportionalAreaDisplay( areaProperty );
    },

    /**
     * Returns a string that should be the longest string possible for our given areas.
     * @public
     *
     * @returns {string}
     */
    getMaximumAreaString: function() {
      var hasNoDecimals = _.every( this.areas, function( area ) { return area.snapSize >= 1; } );
      if ( hasNoDecimals ) {
        // Figure out the actual maximum area, and return it as a string.
        return '' + _.max( _.map( this.areas, function( area ) {
          return area.maximumSize * area.maximumSize;
        } ) );
      }
      else {
        // Should be guaranteed to only have 1 digit in front
        return '7.89';
      }
    },

    /**
     * Returns the model to its initial state.
     * @public
     * @override
     */
    reset: function() {
      AreaModelCommonModel.prototype.reset.call( this );

      this.gridLinesVisibleProperty.reset();
      this.tilesVisibleProperty.reset();
      this.countingVisibleProperty.reset();
      this.calculationBoxVisibleProperty.reset();
    }
  } );
} );
