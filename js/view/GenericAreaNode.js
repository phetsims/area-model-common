// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var GenericEditNode = require( 'AREA_MODEL_COMMON/view/GenericEditNode' );
  var GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/view/GenericPartitionedAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/view/TermKeypadPanel' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * @param {GenericArea} area
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaNode( area, allowExponents, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof GenericArea );
    assert && assert( typeof allowExponents === 'boolean' );
    assert && assert( partialProductsChoiceProperty instanceof Property );

    var self = this;

    AreaNode.call( this, area, partialProductsChoiceProperty, false );

    var firstOffset = this.viewSize * AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = this.viewSize * AreaModelConstants.GENERIC_SECOND_OFFSET;

    // Background
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    // Sign-colored partition area backgrounds
    area.partitionedAreas.forEach( function( partitionedArea ) {
      self.areaLayer.addChild( new GenericPartitionedAreaNode( partitionedArea, self.modelViewTransform ) );
    } );

    Orientation.VALUES.forEach( function( orientation ) {
      // Partition line docks
      var properties = area.getPartitionLineActiveProperties( orientation );
      var dockOptions = {};
      dockOptions[ orientation.opposite.coordinate ] = self.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS;

      dockOptions[ orientation.coordinate ] = firstOffset;
      self.areaLayer.addChild( self.createDock( properties[ 0 ], dockOptions ) );

      dockOptions[ orientation.coordinate ] = secondOffset;
      self.areaLayer.addChild( self.createDock( properties[ 1 ], dockOptions ) );

      // Partition lines
      self.areaLayer.addChild( self.createPartitionLine( properties[ 0 ], orientation, firstOffset ) );
      self.areaLayer.addChild( self.createPartitionLine( properties[ 1 ], orientation, secondOffset ) );
    } );

    // Edit readouts/buttons
    area.partitions.forEach( function( partition ) {
      self.labelLayer.addChild( new GenericEditNode( area, partition, self.modelViewTransform, allowExponents ) );
    } );

    // Keypad
    this.labelLayer.addChild( new TermKeypadPanel( area.activePartitionProperty, allowExponents, {
      x: this.viewSize + 35, // padding constant allows it to fit between the area and the other panels
      centerY: this.viewSize / 2
    } ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaNode', GenericAreaNode );

  return inherit( AreaNode, GenericAreaNode, {
    /**
     * Positions all of the partial products labels.
     * @protected
     */
    positionProductLabels: function() {
      var self = this;

      this.productLabels.forEach( function( productLabel ) {
        Orientation.VALUES.forEach( function( orientation ) {
          var range = productLabel.partitionedArea.getPartition( orientation ).coordinateRangeProperty.value;
          if ( range !== null ) {
            productLabel[ orientation.coordinate ] = orientation.modelToView( self.modelViewTransform, range.getCenter() );
          }
        } );
      } );
    },

    /**
     * Creates a partition line dock that when clicked toggles whether a particular partition line exists.
     * @private
     *
     * @param {Property.<boolean>} toggleProperty
     * @param {Object} [nodeOptions]
     */
    createDock: function( toggleProperty, nodeOptions ) {
      return new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, _.extend( {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              toggleProperty.toggle();
            }
          } )
        ]
      }, nodeOptions ) );
    },

    /**
     * Creates a partition line (view only)
     * @private
     *
     * @param {Property.<boolean>} visibleProperty
     * @param {Orientation} orientation
     * @param {number} offset
     */
    createPartitionLine: function( visibleProperty, orientation, offset ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      var node = new Node( {
        children: [
          new Line( {
            p1: firstPoint,
            p2: secondPoint,
            stroke: AreaModelColorProfile.partitionLineStrokeProperty
          } ),
          new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
            translation: firstPoint,
            fill: this.area.getColorProperty( orientation ),
            stroke: AreaModelColorProfile.partitionLineBorderProperty
          } )
        ]
      } );
      visibleProperty.linkAttribute( node, 'visible' );
      return node;
    }
  } );
} );
