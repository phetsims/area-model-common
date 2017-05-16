// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Area = require( 'AREA_MODEL_COMMON/model/Area' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var PartialProductsLabel = require( 'AREA_MODEL_COMMON/view/PartialProductsLabel' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TICK_LENGTH = 8; // How long the tick marks are for the range labels
  var HORIZONTAL_RANGE_OFFSET = -40; // Vertical offset from the main area for horizontal range labels
  var VERTICAL_RANGE_OFFSET = -60; // Horizontal offset from the main area for vertical range labels
  var LABEL_OFFSET = -7; // How far the label text should be from the line/ticks

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Area} area
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {boolean} isProportional
   */
  function AreaNode( area, partialProductsChoiceProperty, isProportional ) {
    assert && assert( area instanceof Area );
    assert && assert( typeof isProportional === 'boolean' );

    var self = this;

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @protected {Node} - Layers
    this.areaLayer = new Node();
    this.labelLayer = new Node();

    this.addChild( this.areaLayer );
    this.addChild( this.labelLayer );

    // @public {number}
    this.viewSize = AreaModelConstants.AREA_SIZE;

    this.initializeRangeLabel( Orientation.HORIZONTAL );
    this.initializeRangeLabel( Orientation.VERTICAL );

    var modelBounds = new Bounds2( 0, 0, area.coordinateRangeMax, area.coordinateRangeMax );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );

    // @protected {ModelViewTransform2} - Maps from coordinate range values to view values.
    this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    area.partitionedAreas.forEach( function( partitionedArea ) {
      var productLabel = new PartialProductsLabel( partialProductsChoiceProperty, partitionedArea, !isProportional );
      self.labelLayer.addChild( productLabel );

      Orientation.VALUES.forEach( function( orientation ) {
        partitionedArea.getPartition( orientation ).coordinateRangeProperty.link( function( range ) {
          if ( range !== null ) {
            productLabel[ orientation.coordinate ] = orientation.modelToView( self.modelViewTransform, range.getCenter() );
          }
        } );
      } );
    } );

    var eraseButton = new EraserButton( {
      listener: function() {
        area.reset();
      },
      centerX: VERTICAL_RANGE_OFFSET,
      centerY: HORIZONTAL_RANGE_OFFSET
    } );
    this.labelLayer.addChild( eraseButton );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode, {
    /**
     * Maps a coordinate range (from 0 to area.coordinateRangeMax) to view coordinates relative to the AreaNode's
     * origin.
     * @private
     *
     * @param {number} value
     * @returns {number}
     */
    mapCoordinate: function( value ) {
      return this.viewSize * value / this.area.coordinateRangeMax;
    },

    /**
     * Creates a range label with text and a line with start/end tick marks that covers the range.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Node}
     */
    initializeRangeLabel: function( orientation ) {
      assert && assert( Orientation.isOrientation( orientation ) );

      var self = this;

      // Color of everything
      var colorProperty = this.area.getColorProperty( orientation );

      var tickOptions = {
        x1: 0,
        y1: -TICK_LENGTH / 2,
        x2: 0,
        y2: TICK_LENGTH / 2,
        stroke: colorProperty,
        rotation: orientation === Orientation.HORIZONTAL ? 0 : Math.PI / 2
      };
      var minTick = new Line( tickOptions );
      var maxTick = new Line( tickOptions );

      var line = new Line( {
        stroke: colorProperty
      } );

      var text = new RichText( '', {
        font: AreaModelConstants.TOTAL_SIZE_READOUT_FONT,
        fill: colorProperty
      } );

      // Wrap our text in a label, so that we can handle positioning independent of bounds checks
      var label = new Node( {
        children: [ text ]
      } );
      // Coordinates that don't change.
      if ( orientation === Orientation.HORIZONTAL ) {
        label.y = HORIZONTAL_RANGE_OFFSET + LABEL_OFFSET;
      }
      else {
        label.x = VERTICAL_RANGE_OFFSET + LABEL_OFFSET;
      }

      this.labelLayer.addChild( minTick );
      this.labelLayer.addChild( maxTick );
      this.labelLayer.addChild( line );
      this.labelLayer.addChild( label );

      // Update the label text
      this.area.getTotalProperty( orientation ).link( function( sum ) {
        var hasSum = sum !== null;

        text.visible = hasSum;
        if ( hasSum ) {
          text.text = sum.toRichString();
          if ( orientation === Orientation.HORIZONTAL ) {
            text.centerBottom = Vector2.ZERO;
          }
          else {
            text.rightCenter = Vector2.ZERO;
          }
        }
      } );

      // Update the layout
      this.area.getCoordinateRangeProperty( orientation ).link( function( range ) {
        var hasRange = range !== null;

        minTick.visible = hasRange;
        maxTick.visible = hasRange;
        line.visible = hasRange;

        if ( !hasRange ) {
          return;
        }

        var min = self.mapCoordinate( range.min );
        var center = self.mapCoordinate( range.getCenter() );
        var max = self.mapCoordinate( range.max );

        // Points on each end of our line
        var minPoint = orientation === Orientation.HORIZONTAL ? new Vector2( min, HORIZONTAL_RANGE_OFFSET )
                                                              : new Vector2( VERTICAL_RANGE_OFFSET, min );
        var maxPoint = orientation === Orientation.HORIZONTAL ? new Vector2( max, HORIZONTAL_RANGE_OFFSET )
                                                              : new Vector2( VERTICAL_RANGE_OFFSET, max );

        minTick.translation = minPoint;
        maxTick.translation = maxPoint;
        line.p1 = minPoint;
        line.p2 = maxPoint;
        label[ orientation.coordinate ] = center;
      } );
    }
  } );
} );
