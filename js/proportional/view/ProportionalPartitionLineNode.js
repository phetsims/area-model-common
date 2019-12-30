// Copyright 2017-2019, University of Colorado Boulder

/**
 * Display for the partition lines in proportional screens.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AccessibleSlider = require( 'SUN/accessibility/AccessibleSlider' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Shape = require( 'KITE/Shape' );
  const Utils = require( 'DOT/Utils' );
  const validate = require( 'AXON/validate' );

  // a11y strings
  const horizontalPartitionHandleString = AreaModelCommonA11yStrings.horizontalPartitionHandle.value;
  const horizontalPartitionHandleDescriptionString = AreaModelCommonA11yStrings.horizontalPartitionHandleDescription.value;
  const verticalPartitionHandleString = AreaModelCommonA11yStrings.verticalPartitionHandle.value;
  const verticalPartitionHandleDescriptionString = AreaModelCommonA11yStrings.verticalPartitionHandleDescription.value;

  /**
   * @mixes AccessibleSlider
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalAreaDisplay} areaDisplay
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Orientation} orientation
   */
  function ProportionalPartitionLineNode( areaDisplay, modelViewTransformProperty, orientation ) {
    validate( orientation, { validValues: Orientation.VALUES } );

    const self = this;

    Node.call( this );

    // @private {ProportionalAreaDisplay}
    this.areaDisplay = areaDisplay;

    const showHintArrowsProperty = areaDisplay.hasHintArrows.get( orientation );

    let minHintArrow;
    let maxHintArrow;
    const hintOffset = 15;
    const hintLength = 20;
    const arrowOptions = {
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

    const handleShape = ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation );
    const handleMouseBounds = handleShape.bounds;
    const handleTouchBounds = handleMouseBounds.dilated( 5 );

    // We need to cut off the corners that would overlap between the two partition line handles, so we create a clipping
    // area and intersect with that. See https://github.com/phetsims/area-model-common/issues/80.
    let handleClipShape = new Shape().moveToPoint( handleTouchBounds.leftTop )
      .lineToPoint( handleTouchBounds.leftBottom )
      .lineToPoint( handleTouchBounds.rightBottom )
      .lineToPoint( handleTouchBounds.rightTop.blend( handleTouchBounds.rightBottom, 0.4 ) )
      .lineToPoint( handleTouchBounds.rightTop.blend( handleTouchBounds.leftTop, 0.4 ) )
      .close();
    if ( orientation === Orientation.VERTICAL ) {
      handleClipShape = handleClipShape.transformed( Matrix3.rotation2( Math.PI ) );
    }

    const handle = new Path( handleShape, {
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

    const line = new Line( {
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
    const partitionSplitProperty = areaDisplay.partitionSplitProperties.get( orientation );
    const oppositeActiveTotalProperty = areaDisplay.activeTotalProperties.get( orientation.opposite );
    const activeTotalProperty = areaDisplay.activeTotalProperties.get( orientation );

    // We need to reverse the accessible property for the vertical case.
    // See https://github.com/phetsims/area-model-introduction/issues/2
    const accessibleProperty = orientation === Orientation.HORIZONTAL
                               ? partitionSplitProperty
                               : new DynamicProperty( new Property( partitionSplitProperty ), {
        bidirectional: true,
        map: function( v ) { return -v; },
        inverseMap: function( v ) { return -v; }
      }, {
        valueType: 'number' // AccessibleSlider doesn't want anything besides a number
      } );
    const accessibleRangeProperty = new DerivedProperty(
      [ activeTotalProperty, areaDisplay.snapSizeProperty ],
      function( total, snapSize ) {
        const size = total - snapSize;
        return orientation === Orientation.HORIZONTAL ? new Range( 0, size ) : new Range( -size, 0 );
      } );

    // a11y
    this.initializeAccessibleSlider( accessibleProperty, accessibleRangeProperty, new BooleanProperty( true ), {
      constrainValue: Utils.roundSymmetric,
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 5,
      ariaOrientation: orientation.layoutBoxOrientation,
      a11yMapValue: function( v ) {
        // Reverse the negation above for readouts
        return ( orientation === Orientation.HORIZONTAL ? 1 : -1 ) * v;
      },
      roundToStepSize: true
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
        const offsetValue = orientation.opposite.modelToView( modelViewTransform, oppositeTotal ) +
                            AreaModelCommonConstants.PARTITION_HANDLE_OFFSET;
        handle[ orientation.opposite.coordinate ] = offsetValue;
        line[ orientation.opposite.coordinate + '2' ] = offsetValue;
        line.mouseArea = line.localBounds.dilated( 4 );
        line.touchArea = line.localBounds.dilated( 8 );
      } );

    // Visibility
    areaDisplay.partitionSplitVisibleProperties.get( orientation ).linkAttribute( self, 'visible' );

    let dragHandler;
    modelViewTransformProperty.link( function( modelViewTransform ) {
      if ( dragHandler ) {
        self.removeInputListener( dragHandler );
        dragHandler.dispose();
      }
      dragHandler = new DragListener( {
        transform: modelViewTransform,
        drag: function( event, listener ) {
          let value = listener.modelPoint[ orientation.coordinate ];

          value = Utils.roundSymmetric( value / areaDisplay.partitionSnapSizeProperty.value ) *
                  areaDisplay.partitionSnapSizeProperty.value;
          value = Utils.clamp( value, 0, activeTotalProperty.value );

          // Hint arrows disappear when the actual split changes during a drag, see
          // https://github.com/phetsims/area-model-common/issues/68
          const currentSplitValue = partitionSplitProperty.value;
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
      dragHandler.isUserControlledProperty.link( function( controlled ) {
        areaDisplay.partitionSplitUserControlledProperties.get( orientation ).value = controlled;
      } );
      self.addInputListener( dragHandler );
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  // Handle arrows
  const arrowHalfLength = 10;
  const arrowHalfWidth = 10;
  const verticalArrowShape = new Shape()
    .moveTo( -arrowHalfLength, 0 )
    .lineTo( arrowHalfLength, arrowHalfWidth )
    .lineTo( arrowHalfLength, -arrowHalfWidth )
    .close();
  const horizontalArrowShape = verticalArrowShape.transformed( Matrix3.rotation2( Math.PI / 2 ) );

  inherit( Node, ProportionalPartitionLineNode, {}, {
    HANDLE_ARROW_SHAPES: new OrientationPair( horizontalArrowShape, verticalArrowShape )
  } );

  AccessibleSlider.mixInto( ProportionalPartitionLineNode );

  return ProportionalPartitionLineNode;
} );
