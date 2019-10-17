// Copyright 2017-2019, University of Colorado Boulder

/**
 * Supertype for proportional (to-scale, not generic) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonModel = require( 'AREA_MODEL_COMMON/common/model/AreaModelCommonModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  const ProportionalAreaDisplay = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaDisplay' );
  const TextBounds = require( 'SCENERY/util/TextBounds' );
  const Util = require( 'DOT/Util' );

  // constants
  const TEST_FONT = new PhetFont( 12 );

  /**
   * @constructor
   * @extends {AreaModelCommonModel}
   *
   * @param {Array.<Object>} areaOptionObjects - An array of options objects to be passed to the ProportionalArea
   *                         constructors.
   * @param {Object} [options]
   */
  function ProportionalAreaModel( areaOptionObjects, options ) {

    options = merge( {
      isProportional: true,
      initialAreaBoxExpanded: true
    }, options );

    const areas = areaOptionObjects.map( function( options ) {
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
      let maxString = '9';
      let maxLength = 0;
      this.areas.forEach( function( area ) {
        const representativeSize = area.snapSize + area.maximumSize;
        // Round because of floating point precision
        const string = '' + Util.toFixedNumber( representativeSize * representativeSize, 8 ); // Square for area
        const length = TextBounds.approximateCanvasWidth( TEST_FONT, string );
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
