// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display for ProportionalAreas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaDisplay = require( 'AREA_MODEL_COMMON/common/model/AreaDisplay' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {AreaDisplay}
   *
   * @param {Property.<ProportionalArea>} areaProperty
   */
  function ProportionalAreaDisplay( areaProperty ) {
    AreaDisplay.call( this, areaProperty );

    // @public {OrientationPair.<Property.<number>>}
    this.activeTotalProperties = this.wrapOrientationPairProperty( _.property( 'activeTotalProperties' ), {
      bidirectional: true
    } );

    // @public {Property.<Orientation>}
    this.visiblePartitionOrientationProperty = this.wrapProperty( _.property( 'visiblePartitionOrientationProperty' ) );

    // @public {OrientationPair.<Property.<number>>}
    this.partitionSplitProperties = this.wrapOrientationPairProperty( _.property( 'partitionSplitProperties' ), {
      bidirectional: true
    } );

    // @public {OrientationPair.<Property.<boolean>>}
    this.partitionSplitUserControlledProperties = this.wrapOrientationPairProperty( _.property( 'partitionSplitUserControlledProperties' ), {
      bidirectional: true
    } );

    // @public {Property.<number>}
    this.maximumSizeProperty = this.wrapObject( _.property( 'maximumSize' ) );
    this.snapSizeProperty = this.wrapObject( _.property( 'snapSize' ) );
    this.partitionSnapSizeProperty = this.wrapObject( _.property( 'partitionSnapSize' ) );
    this.smallTileSizeProperty = this.wrapObject( _.property( 'smallTileSize' ) );
    this.largeTileSizeProperty = this.wrapObject( _.property( 'largeTileSize' ) );

    // @public {Property.<boolean>}
    this.tilesAvailableProperty = this.wrapObject( _.property( 'tilesAvailable' ) );
    this.countingAvailableProperty = this.wrapObject( _.property( 'countingAvailable' ) );

    // @public {OrientationPair.<Property.<boolean>>}
    this.hasHintArrows = this.wrapOrientationPairProperty( _.property( 'hasHintArrows' ), {
      bidirectional: true
    } );

    // @public {OrientationPair.<Property.<boolean>>}
    this.partitionSplitVisibleProperties = this.wrapOrientationPairProperty( _.property( 'partitionSplitVisibleProperties' ) );

    // @public {OrientationPair.<Property.<number|null>>}
    this.visiblePartitionLineSplitProperties = this.wrapOrientationPairProperty( _.property( 'visiblePartitionLineSplitProperties' ) );

    // @public {OrientationPair.<Property.<ProportionalPartition>>}
    this.primaryPartitionsProperty = this.wrapOrientationPair( _.property( 'primaryPartitions' ) );
    this.secondaryPartitionsProperty = this.wrapOrientationPair( _.property( 'secondaryPartitions' ) );
  }

  areaModelCommon.register( 'ProportionalAreaDisplay', ProportionalAreaDisplay );

  return inherit( AreaDisplay, ProportionalAreaDisplay );
} );
