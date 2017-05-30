// Copyright 2017, University of Colorado Boulder

/**
 * All possible layouts available via the drop-down box.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );

  /**
   * @constructor
   * @extends {Object}
   * @private (use enumeration of objects)
   *
   * @param {Dimension2} size
   */
  function GenericLayout( size ) {
    // @public {Dimension2} - Dimension describes how many partitions are available in each orientation.
    this.size = size;
  }

  areaModelCommon.register( 'GenericLayout', GenericLayout );

  inherit( Object, GenericLayout, {
    /**
     * Returns the number of partitions for the specific orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {number}
     */
    getPartitionQuantity: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      return orientation === Orientation.HORIZONTAL ? this.size.width : this.size.height;
    }
  } );

  // @public {GenericLayout}
  GenericLayout.ONE_BY_ONE = new GenericLayout( new Dimension2( 1, 1 ) );
  GenericLayout.ONE_BY_TWO = new GenericLayout( new Dimension2( 1, 2 ) );
  GenericLayout.ONE_BY_THREE = new GenericLayout( new Dimension2( 1, 3 ) );
  GenericLayout.TWO_BY_ONE = new GenericLayout( new Dimension2( 2, 1 ) );
  GenericLayout.TWO_BY_TWO = new GenericLayout( new Dimension2( 2, 2 ) );
  GenericLayout.TWO_BY_THREE = new GenericLayout( new Dimension2( 2, 3 ) );
  GenericLayout.THREE_BY_ONE = new GenericLayout( new Dimension2( 3, 1 ) );
  GenericLayout.THREE_BY_TWO = new GenericLayout( new Dimension2( 3, 2 ) );
  GenericLayout.THREE_BY_THREE = new GenericLayout( new Dimension2( 3, 3 ) );

  // @public {Array.<GenericLayout>} - All values the enumeration can take.
  GenericLayout.VALUES = [
    GenericLayout.ONE_BY_ONE,
    GenericLayout.ONE_BY_TWO,
    GenericLayout.ONE_BY_THREE,
    GenericLayout.TWO_BY_ONE,
    GenericLayout.TWO_BY_TWO,
    GenericLayout.TWO_BY_THREE,
    GenericLayout.THREE_BY_ONE,
    GenericLayout.THREE_BY_TWO,
    GenericLayout.THREE_BY_THREE
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GenericLayout ); }

  return GenericLayout;
} );
