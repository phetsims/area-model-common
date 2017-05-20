// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY_PHET/RichText' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * @param {Area} area
   * @param {GenericPartition} partition
   * @param {ModelViewTransform2} modelViewTransform
   */
  function PartitionSizeLabelNode( area, partition, modelViewTransform ) {

    var self = this;

    var richText = new RichText( 'NOT_EVER_VISIBLE', {
      font: AreaModelConstants.PROPORTIONAL_PARTITION_READOUT_FONT,
      fill: partition.colorProperty
    } );
    richText.centerY = 0; // Vertically center once

    // Text label
    partition.sizeProperty.link( function( size ) {
      if ( size === null ) {
        richText.text = '';
      }
      else {
        richText.text = size.toRichString( false );
        richText.centerX = 0;
      }
    } );

    Node.call( this, {
      children: [ richText ]
    } );

    // Primary coordinate
    partition.coordinateRangeProperty.link( function( range ) {
      if ( range ) {
        self[ partition.orientation.coordinate ] = partition.orientation.modelToView( modelViewTransform, range.getCenter() );
      }
    } );

    // Secondary coordinate
    if ( partition.orientation === Orientation.HORIZONTAL ) {
      this.y = -15;
    }
    else {
      this.x = -20;
    }

    // Visibility
    Property.multilink( [ partition.visibleProperty, area.getTermListProperty( partition.orientation ) ], function( visible, termList ) {
      self.visible = visible && termList !== null && termList.terms.length > 1;
    } );
  }

  areaModelCommon.register( 'PartitionSizeLabelNode', PartitionSizeLabelNode );

  return inherit( Node, PartitionSizeLabelNode );
} );
