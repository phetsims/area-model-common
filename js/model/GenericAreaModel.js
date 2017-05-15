// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for generic (not-to-scale) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModel = require( 'AREA_MODEL_COMMON/model/AreaModel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   * @extends {AreaModel}
   *
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowPowers ) {

    // @public {Area}
    this.genericArea = new GenericArea( allowPowers );

    AreaModel.call( this, [ this.genericArea ], allowPowers );
  }

  areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

  return inherit( AreaModel, GenericAreaModel, {
    /**
     * Returns the model to its initial state.
     * @public
     * @override
     */
    reset: function() {
      AreaModel.prototype.reset.call( this );
    },

    // TODO: remove before production
    toMax: function() {
      this.genericArea.leftPartition.sizeProperty.value = new Term( -9, 2 );
      this.genericArea.middleHorizontalPartition.sizeProperty.value = new Term( -9, 1 );
      this.genericArea.rightPartition.sizeProperty.value = new Term( -9, 0 );
      this.genericArea.topPartition.sizeProperty.value = new Term( -9, 2 );
      this.genericArea.middleVerticalPartition.sizeProperty.value = new Term( -9, 1 );
      this.genericArea.bottomPartition.sizeProperty.value = new Term( -9, 0 );
      this.genericArea.firstHorizontalPartitionLineActiveProperty.value = true;
      this.genericArea.secondHorizontalPartitionLineActiveProperty.value = true;
      this.genericArea.firstVerticalPartitionLineActiveProperty.value = true;
      this.genericArea.secondVerticalPartitionLineActiveProperty.value = true;
    }
  } );
} );
