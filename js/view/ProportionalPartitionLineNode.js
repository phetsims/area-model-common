// Copyright 2017, University of Colorado Boulder

/**
 * Display for the partition lines in proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );

  /**
   * @constructor
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<Color>} colorProperty
   * @param {boolean} isHorizontalPartition
   */
  function ProportionalPartitionLineNode( area, modelViewTransform, colorProperty, isHorizontalPartition ) {
    assert && assert( area instanceof ProportionalArea );
    assert && assert( typeof isHorizontalPartition === 'boolean' );

    var self = this;

    Node.call( this );

    // @public {ProportionalArea}
    this.area = area;

    var handle = new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
      fill: colorProperty,
      stroke: AreaModelColorProfile.partitionLineBorderProperty
    } );

    var line = new Line( 0, 0, 0, 0, {
      stroke: AreaModelColorProfile.partitionLineStrokeProperty,
      lineWidth: 2
    } );

    this.children = [ line, handle ];

    // TODO: improve naming
    var primaryProperty = isHorizontalPartition ? area.horizontalPartitionSplitProperty : area.verticalPartitionSplitProperty;
    var secondaryProperty = isHorizontalPartition ? area.totalHeightProperty : area.totalWidthProperty;
    var ternaryProperty = isHorizontalPartition ? area.totalWidthProperty : area.totalHeightProperty;

    var primaryCoordinate = isHorizontalPartition ? 'x' : 'y';
    var secondaryCoordinate = isHorizontalPartition ? 'y' : 'x';

    var primaryTransform = ( isHorizontalPartition ? modelViewTransform.modelToViewX : modelViewTransform.modelToViewY ).bind( modelViewTransform );
    var secondaryTransform = ( isHorizontalPartition ? modelViewTransform.modelToViewY : modelViewTransform.modelToViewX ).bind( modelViewTransform );

    primaryProperty.link( function( primary ) {
      self[ primaryCoordinate ] = primaryTransform( primary );
    } );
    secondaryProperty.link( function( secondary ) {
      var offsetValue = secondaryTransform( secondary ) + AreaModelConstants.PARTITION_HANDLE_OFFSET;
      handle[ secondaryCoordinate ] = offsetValue;
      line[ secondaryCoordinate + '2' ] = offsetValue;
    } );
    ternaryProperty.link( function( ternary ) {
      // TODO: handle multitouch
      self.visible = ternary >= area.snapSize * 2 - 1e-7;
    } );
  }

  areaModelCommon.register( 'ProportionalPartitionLineNode', ProportionalPartitionLineNode );

  return inherit( Node, ProportionalPartitionLineNode );
} );
