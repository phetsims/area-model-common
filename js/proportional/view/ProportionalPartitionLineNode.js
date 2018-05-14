// Copyright 2017-2018, University of Colorado Boulder

/**
 * Display for the partition lines in proportional screens.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleSlider = require( 'SUN/accessibility/AccessibleSlider' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  // a11y strings
  var horizontalPartitionHandleString = AreaModelCommonA11yStrings.horizontalPartitionHandle.value;
  var horizontalPartitionHandleDescriptionString = AreaModelCommonA11yStrings.horizontalPartitionHandleDescription.value;
  var verticalPartitionHandleString = AreaModelCommonA11yStrings.verticalPartitionHandle.value;
  var verticalPartitionHandleDescriptionString = AreaModelCommonA11yStrings.verticalPartitionHandleDescription.value;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalAreaDisplay} areaDisplay
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Orientation} orientation
   */
  function ProportionalPartitionLineNode( areaDisplay, modelViewTransformProperty, orientation ) {
    assert && assert( Orientation.isOrientation( orientation ) );

    var self = this;

    Node.call( this );

    // @private {ProportionalAreaDisplay}
    this.areaDisplay = areaDisplay;

    var showHintArrowsProperty = areaDisplay.hasHintArrows.get( orientation );

    var minHintArrow;
    var maxHintArrow;
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

    var handleShape = ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation );
    var handleMouseBounds = handleShape.bounds;
    var handleTouchBounds = handleMouseBounds.dilated( 5 );

    // We need to cut off the corners that would overlap between the two partition line handles, so we create a clipping
    // area and intersect with that. See https://github.com/phetsims/area-model-common/issues/80.
    var handleClipShape = new Shape().moveToPoint( handleTouchBounds.leftTop )
      .lineToPoint( handleTouchBounds.leftBottom )
      .lineToPoint( handleTouchBounds.rightBottom )
      .lineToPoint( handleTouchBounds.rightTop.blend( handleTouchBounds.rightBottom, 0.4 ) )
      .lineToPoint( handleTouchBounds.rightTop.blend( handleTouchBounds.leftTop, 0.4 ) )
      .close();
    if ( orientation === Orientation.VERTICAL ) {
      handleClipShape = handleClipShape.transformed( Matrix3.rotation2( Math.PI ) );
    }

    var handle = new Path( handleShape, {
      mouseArea: Shape.bounds( handleMouseBounds ).shapeIntersection( handleClipShape ),
      touchArea: Shape.bounds( handleTouchBounds ).shapeIntersection( handleClipShape ),
      fill: areaDisplay.colorProperties.get( orientation ),
      stroke: AreaModelCommonColorProfile.partitionLineBorderProperty,
      cursor: 'pointer',
      children: [
        minHintArrow,
        maxHintArrow
      ]
    } );

    var line = new Line( {
      stroke: AreaModelCommonColorProfile.partitionLineStrokeProperty,
      lineWidth: 2,
      cursor: 'pointer'
    } );

    Node.call( this, {
      children: [
        line,
        handle
      ]
    } );

    // Relevant properties
    var partitionSplitProperty = areaDisplay.partitionSplitProperties.get( orientation );
    var oppositeActiveTotalProperty = areaDisplay.activeTotalProperties.get( orientation.opposite );
    var activeTotalProperty = areaDisplay.activeTotalProperties.get( orientation );

    // We need to reverse the accessible property for the vertical case.
    // See https://github.com/phetsims/area-model-introduction/issues/2
    var accessibleProperty = orientation === Orientation.HORIZONTAL
      ? partitionSplitProperty
      : new DynamicProperty( new Property( partitionSplitProperty ), {
        bidirectional: true,
        map: function( v ) { return -v; },
        inverseMap: function( v ) { return -v; }
      }, {
        valueType: 'number' // AccessibleSlider doesn't want anything besides a number
      } );
    var accessibleRangeProperty = new DerivedProperty(
      [ activeTotalProperty, areaDisplay.snapSizeProperty ],
      function( total, snapSize ) {
        var size = total - snapSize;
        return orientation === Orientation.HORIZONTAL ? new Range( 0, size ) : new Range( -size, 0 );
      } );

    // a11y
    this.initializeAccessibleSlider( accessibleProperty, accessibleRangeProperty, new BooleanProperty( true ), {
      constrainValue: Util.roundSymmetric,
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 5,
      ariaOrientation: orientation.layoutBoxOrientation,
      accessibleMapValue: function( v ) {
        // Reverse the negation above for readouts
        return ( orientation === Orientation.HORIZONTAL ? 1 : -1 ) * v;
      }

      // TODO: add accessibleDecimalPlaces
    } );

    this.labelTagName = 'label';
    this.labelContent = orientation === Orientation.HORIZONTAL ? verticalPartitionHandleString : horizontalPartitionHandleString;
    this.descriptionContent = orientation === Orientation.HORIZONTAL ? verticalPartitionHandleDescriptionString : horizontalPartitionHandleDescriptionString;

    this.focusHighlight = new FocusHighlightPath( handleShape.getOffsetShape( 5 ) );
    handle.addChild( this.focusHighlight );
    this.focusHighlightLayerable = true;

    // Main coordinate (when dragging)
    Property.multilink( [ partitionSplitProperty, modelViewTransformProperty ], function( split, modelViewTransform ) {
      self[ orientation.coordinate ] = orientation.modelToView( modelViewTransform, split );
    } );

    // Opposite coordinate (how wide the area is in the other direction)
    Property.multilink(
      [ oppositeActiveTotalProperty, modelViewTransformProperty ],
      function( oppositeTotal, modelViewTransform ) {
        var offsetValue = orientation.opposite.modelToView( modelViewTransform, oppositeTotal ) +
                          AreaModelCommonConstants.PARTITION_HANDLE_OFFSET;
        handle[ orientation.opposite.coordinate ] = offsetValue;
        line[ orientation.opposite.coordinate + '2' ] = offsetValue;
        line.mouseArea = line.localBounds.dilated( 4 );
        line.touchArea = line.localBounds.dilated( 8 );
      } );

    // Visibility
    areaDisplay.partitionSplitVisibleProperties.get( orientation ).linkAttribute( self, 'visible' );

    var dragHandler;
    modelViewTransformProperty.link( function( modelViewTransform ) {
      if ( dragHandler ) {
        self.removeInputListener( dragHandler );
        dragHandler.dispose();
      }
      dragHandler = new DragListener( {
        transform: modelViewTransform,
        isUserControlledProperty: areaDisplay.partitionSplitUserControlledProperties.get( orientation ),
        drag: function( event, listener ) {
          var value = listener.modelPoint[ orientation.coordinate ];

          value = Util.roundSymmetric( value / areaDisplay.partitionSnapSizeProperty.value ) *
                  areaDisplay.partitionSnapSizeProperty.value;
          value = Util.clamp( value, 0, activeTotalProperty.value );

          // Hint arrows disappear when the actual split changes during a drag, see
          // https://github.com/phetsims/area-model-common/issues/68
          var currentSplitValue = partitionSplitProperty.value;
          if ( value !== currentSplitValue && value !== 0 ) {
            showHintArrowsProperty.value = false;
          }

          partitionSplitProperty.value = value;
        },

        end: function() {
          if ( partitionSplitProperty.value === activeTotalProperty.value ) {
            partitionSplitProperty.value = 0;
          }
        }
      } );
      self.addInputListener( dragHandler );
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  // Handle arrows
  var arrowHalfLength = 10;
  var arrowHalfWidth = 10;
  var verticalArrowShape = new Shape()
    .moveTo( -arrowHalfLength, 0 )
    .lineTo( arrowHalfLength, arrowHalfWidth )
    .lineTo( arrowHalfLength, -arrowHalfWidth )
    .close();
  var horizontalArrowShape = verticalArrowShape.transformed( Matrix3.rotation2( Math.PI / 2 ) );

  inherit( Node, ProportionalPartitionLineNode, {}, {
    HANDLE_ARROW_SHAPES: new OrientationPair( horizontalArrowShape, verticalArrowShape )
  } );

  AccessibleSlider.mixInto( ProportionalPartitionLineNode );

  return ProportionalPartitionLineNode;
} );
