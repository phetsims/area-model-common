// Copyright 2017-2018, University of Colorado Boulder

/**
 * An area customized for the game screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/generic/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/common/model/PartitionedArea' );

  /**
   * @constructor
   * @extends {GenericArea}
   *
   * @param {GenericLayout} layout
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   */
  function GameArea( layout, allowExponents ) {
    assert && assert( typeof allowExponents === 'boolean' );

    GenericArea.call( this, layout, allowExponents );
  }

  areaModelCommon.register( 'GameArea', GameArea );

  return inherit( GenericArea, GameArea, {
    /**
     * Creates a partitioned area given two partitions. Overridden so that we don't hook up automatic computation of
     * this value.
     * REVIEW: Can you please elaborate what would go wrong if we did hook up automatic computation, as in the
     * REVIEW: parent implementation?  Would it make it update when it shouldn't?  Would it create a memory leak/force
     * REVIEW: us to implement dispose where one wasn't needed before?  Something else?
     * @protected
     * @override
     *
     * @param {OrientationPair.<Partition>} partitions
     * @returns {PartitionedArea}
     */
    createPartitionedArea: function( partitions ) {
      return new PartitionedArea( partitions );
    },

    /**
     * Resets the area to its initial values.
     * @public
     * @override
     */
    // REVIEW: this override should be removed
    reset: function() {
      GenericArea.prototype.reset.call( this );
    }
  } );
} );
