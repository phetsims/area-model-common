// Copyright 2017, University of Colorado Boulder

/**
 * Display for the partition lines in proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Orientation} orientation
   */
  function ProportionalPartitionLineNode( area, modelViewTransform, orientation ) {
    assert && assert( area instanceof ProportionalArea );
    assert && assert( Orientation.isOrientation( orientation ) );

    var self = this;

    Node.call( this );

    // @public {ProportionalArea}
    this.area = area;

    var showHintArrowsProperty = area.hasHintArrows.get( orientation );

    var minHintArrow;
    var maxHintArrow;
    //TODO: dedup
    var hintOffset = 15;
    var hintLength = 20;
    var arrowOptions = {
      fill: 'yellow',
      pickable: false
    };
    if ( orientation === Orientation.HORIZONTAL ) {
      minHintArrow = new ArrowNode( -hintOffset, 0, -( hintLength + hintOffset ), 0, arrowOptions );
      maxHintArrow = new ArrowNode( hintOffset, 0, hintLength + hintOffset, 0, arrowOptions );
    }
    else {
      minHintArrow = new ArrowNode( 0, -hintOffset, 0, -( hintLength + hintOffset ), arrowOptions );
      maxHintArrow = new ArrowNode( 0, hintOffset, 0, hintLength + hintOffset, arrowOptions );
    }
    showHintArrowsProperty.linkAttribute( minHintArrow, 'visible' );
    showHintArrowsProperty.linkAttribute( maxHintArrow, 'visible' );

    var arrowHalfLength = 10;
    var arrowHalfWidth = 10;
    var handleShape = new Shape().moveTo( -arrowHalfLength, 0 ).lineTo( arrowHalfLength, arrowHalfWidth ).lineTo( arrowHalfLength, -arrowHalfWidth ).close();
    if ( orientation === Orientation.HORIZONTAL ) {
      handleShape = handleShape.transformed( Matrix3.rotation2( Math.PI / 2 ) );
    }

    var handle = new Path( handleShape, {
      fill: area.colorProperties.get( orientation ),
      stroke: AreaModelColorProfile.partitionLineBorderProperty,
      cursor: 'pointer',
      children: [
        minHintArrow,
        maxHintArrow
      ]
    } );

    var line = new Line( 0, 0, 0, 0, {
      stroke: AreaModelColorProfile.partitionLineStrokeProperty,
      lineWidth: 2
    } );

    Node.call( this, {
      children: [
        line,
        handle
      ]
    } );

    // Relevant properties
    var partitionSplitProperty = area.partitionSplitProperties.get( orientation );
    var oppositeActiveTotalProperty = area.getActiveTotalProperty( orientation.opposite );
    var activeTotalProperty = area.getActiveTotalProperty( orientation );

    // Main coordinate (when dragging)
    partitionSplitProperty.link( function( split ) {
      self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, split === null ? 0 : split );
    } );

    // Opposite coordinate (how wide the area is in the other direction)
    oppositeActiveTotalProperty.link( function( oppositeTotal ) {
      var offsetValue = orientation.opposite.modelToView( modelViewTransform, oppositeTotal ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
      handle[ orientation.opposite.coordinate ] = offsetValue;
      line[ orientation.opposite.coordinate + '2' ] = offsetValue;
    } );

    // Visibility
    area.partitionSplitVisibleProperties.get( orientation ).linkAttribute( self, 'visible' );

    var dragHandler = new DragListener( {
      allowTouchSnag: true,
      transform: modelViewTransform,
      targetNode: this,
      drag: function( event, listener ) {
        var value = listener.modelPoint[ orientation.coordinate ];

        value = Math.round( value / area.partitionSnapSize ) * area.partitionSnapSize;
        value = Util.clamp( value, 0, activeTotalProperty.value );

        // Hint arrows disappear when the actual split changes during a drag, see https://github.com/phetsims/area-model-common/issues/68
        var currentSplitValue = partitionSplitProperty.value;
        if ( value !== currentSplitValue && value !== 0 ) {
          showHintArrowsProperty.value = false;
        }

        partitionSplitProperty.value = value;
      },

      end: function( event, listener ) {
        if ( partitionSplitProperty.value === activeTotalProperty.value ) {
          partitionSplitProperty.value = null;
        }
      }
    } );
    handle.addInputListener( dragHandler );

    // Remove splits that are at or past the current boundary.
    activeTotalProperty.link( function( total ) {
      if ( partitionSplitProperty.value >= activeTotalProperty.value ) {
        partitionSplitProperty.value = dragHandler.isPressedProperty.value ? activeTotalProperty.value : null;
      }
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  return inherit( Node, ProportionalPartitionLineNode );
} );
