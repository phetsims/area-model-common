// Copyright 2018, University of Colorado Boulder

/**
 * Display for ProportionalAreas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaDisplay = require( 'AREA_MODEL_COMMON/common/model/AreaDisplay' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {AreaDisplay}
   *
   * @param {Property.<ProportionalArea>} areaProperty
   */
  function ProportionalAreaDisplay( areaProperty ) {
    AreaDisplay.call( this, areaProperty );

    // @public {OrientationPair.<Property.<number>>}
    this.activeTotalProperties = this.wrapOrientationPairProperty( function( area ) {
      return area.activeTotalProperties;
    }, {
      bidirectional: true
    } );

    // @public {Property.<Orientation>}
    this.visiblePartitionOrientationProperty = this.wrapProperty( function( area ) {
      return area.visiblePartitionOrientationProperty;
    } );

    // @public {OrientationPair.<Property.<number>>}
    this.partitionSplitProperties = this.wrapOrientationPairProperty( function( area ) {
      return area.partitionSplitProperties;
    }, {
      bidirectional: true
    } );

    // @public {OrientationPair.<Property.<boolean>>}
    this.partitionSplitUserControlledProperties = this.wrapOrientationPairProperty( function( area ) {
      return area.partitionSplitUserControlledProperties;
    }, {
      bidirectional: true
    } );

    // @public {Property.<number>}
    this.maximumSizeProperty = this.wrapObject( function( area ) { return area.maximumSize; } );
    this.snapSizeProperty = this.wrapObject( function( area ) { return area.snapSize; } );
    this.partitionSnapSizeProperty = this.wrapObject( function( area ) { return area.partitionSnapSize; } );
    this.smallTileSizeProperty = this.wrapObject( function( area ) { return area.smallTileSize; } );
    this.largeTileSizeProperty = this.wrapObject( function( area ) { return area.largeTileSize; } );

    // @public {Property.<boolean>}
    this.tilesAvailableProperty = this.wrapObject( function( area ) { return area.tilesAvailable; } );
    this.countingAvailableProperty = this.wrapObject( function( area ) { return area.countingAvailable; } );

    // @public {OrientationPair.<Property.<boolean>>}
    this.hasHintArrows = this.wrapOrientationPairProperty( function( area ) {
      return area.hasHintArrows;
    }, {
      bidirectional: true
    } );

    // @public {OrientationPair.<Property.<boolean>>}
    this.partitionSplitVisibleProperties = this.wrapOrientationPairProperty( function( area ) {
      return area.partitionSplitVisibleProperties;
    } );

    // @public {OrientationPair.<Property.<number|null>>}
    this.visiblePartitionLineSplitProperties = this.wrapOrientationPairProperty( function( area ) {
      return area.visiblePartitionLineSplitProperties;
    } );

    // @public {OrientationPair.<Property.<ProportionalPartition>>}
    this.primaryPartitionsProperty = this.wrapOrientationPair( function( area ) {
      return area.primaryPartitions;
    } );
    this.secondaryPartitionsProperty = this.wrapOrientationPair( function( area ) {
      return area.secondaryPartitions;
    } );
  }

  areaModelCommon.register( 'ProportionalAreaDisplay', ProportionalAreaDisplay );

  return inherit( AreaDisplay, ProportionalAreaDisplay );
} );
