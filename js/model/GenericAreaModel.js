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
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   * @extends {AreaModel}
   *
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   */
  function GenericAreaModel( allowExponents ) {

    // @public {Area}
    this.genericArea = new GenericArea( allowExponents );

    AreaModel.call( this, [ this.genericArea ], allowExponents, AreaModelColorProfile.genericWidthProperty,
                                                             AreaModelColorProfile.genericHeightProperty );
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
