// Copyright 2017, University of Colorado Boulder

/**
 * Colored background area for generic partitioned areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/common/model/PartitionedArea' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {PartitionedArea} partitionedArea
   * @param {ModelViewTransform2} modelViewTransform
   */
  function GenericPartitionedAreaNode( partitionedArea, modelViewTransform ) {
    assert && assert( partitionedArea instanceof PartitionedArea );

    var self = this;

    // We'll set the fill/size/etc. below.
    Rectangle.call( this, {} );

    // Fill
    partitionedArea.areaProperty.link( function( area ) {
      if ( area === null || area.coefficient === 0 ) {
        self.fill = null;
      }
      else if ( area.coefficient > 0 ) {
        self.fill = AreaModelColorProfile.genericPositiveBackgroundProperty;
      }
      else {
        self.fill = AreaModelColorProfile.genericNegativeBackgroundProperty;
      }
    } );

    // Visibility
    partitionedArea.visibleProperty.linkAttribute( this, 'visible' );

    // Bounds
    partitionedArea.horizontalPartition.coordinateRangeProperty.link( function( horizontalRange ) {
      if ( horizontalRange !== null ) {
        self.rectX = modelViewTransform.modelToViewX( horizontalRange.min );
        self.rectWidth = modelViewTransform.modelToViewX( horizontalRange.getLength() );
      }
    } );
    partitionedArea.verticalPartition.coordinateRangeProperty.link( function( verticalRange ) {
      if ( verticalRange !== null ) {
        self.rectY = modelViewTransform.modelToViewY( verticalRange.min );
        self.rectHeight = modelViewTransform.modelToViewY( verticalRange.getLength() );
      }
    } );
  }

  areaModelCommon.register( 'GenericPartitionedAreaNode', GenericPartitionedAreaNode );

  return inherit( Rectangle, GenericPartitionedAreaNode );
} );
