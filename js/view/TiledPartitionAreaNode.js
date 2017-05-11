// Copyright 2017, University of Colorado Boulder

/**
 * Displays tiles for a partitioned area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   *
   * TODO: switch to options constructor?
   *
   * @param {PartitionedArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} tilesVisibleProperty
   */
  function TiledPartitionAreaNode( partitionedArea, modelViewTransform, tilesVisibleProperty ) {
    assert && assert( partitionedArea instanceof PartitionedArea );

    var self = this;

    Node.call( this );

    Property.multilink( [ partitionedArea.visibleProperty, tilesVisibleProperty ], function( visible, tilesVisible ) {
      self.visible = visible && tilesVisible;
    } );

    var tmpRectangle = new Rectangle( {
      fill: AreaModelColorProfile.bigTileProperty // TODO: change
    } );
    this.addChild( tmpRectangle );

    partitionedArea.horizontalPartition.coordinateRangeProperty.link( function( horizontalRange ) {
      if ( horizontalRange !== null ) {
        tmpRectangle.rectX = modelViewTransform.modelToViewX( horizontalRange.min );
        tmpRectangle.rectWidth = modelViewTransform.modelToViewX( horizontalRange.getLength() );
      }
    } );
    partitionedArea.verticalPartition.coordinateRangeProperty.link( function( verticalRange ) {
      if ( verticalRange !== null ) {
        tmpRectangle.rectY = modelViewTransform.modelToViewY( verticalRange.min );
        tmpRectangle.rectHeight = modelViewTransform.modelToViewY( verticalRange.getLength() );
      }
    } );
  }

  areaModelCommon.register( 'TiledPartitionAreaNode', TiledPartitionAreaNode );

  return inherit( Node, TiledPartitionAreaNode );
} );
