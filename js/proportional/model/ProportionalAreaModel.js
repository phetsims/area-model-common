// Copyright 2017-2018, University of Colorado Boulder

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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  var ProportionalAreaDisplay = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaDisplay' );
  var TextBounds = require( 'SCENERY/util/TextBounds' );
  var Util = require( 'DOT/Util' );

  // constants
  var TEST_FONT = new PhetFont( 12 );

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
      var maxString = '9';
      var maxLength = 0;
      this.areas.forEach( function( area ) {
        var representativeSize = area.snapSize + area.maximumSize;
        // Round because of floating point precision
        var string = '' + Util.toFixedNumber( representativeSize * representativeSize, 8 ); // Square for area
        var length = TextBounds.approximateCanvasWidth( TEST_FONT, string );
        if ( length > maxLength ) {
          maxLength = length;
          maxString = string;
        }
      } );
      return maxString;
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
