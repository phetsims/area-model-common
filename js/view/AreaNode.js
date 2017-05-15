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
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Area} area
   */
  function AreaNode( area ) {
    assert && assert( area instanceof Area );

    var self = this;

    Node.call( this );

    // @public {Area}
    this.area = area;

    // @public {number}
    this.viewSize = AreaModelConstants.AREA_SIZE;

    var markSize = 4;
    var horizontalLineOffset = -40;
    var verticalLineOffset = -60;
    var labelOffset = -7;

    var horizontalLeftMark = new Line( 0, -markSize + horizontalLineOffset, 0, markSize + horizontalLineOffset, {
      stroke: area.widthColorProperty
    } );
    this.addChild( horizontalLeftMark );
    var horizontalRightMark = new Line( 0, -markSize + horizontalLineOffset, 0, markSize + horizontalLineOffset, {
      stroke: area.widthColorProperty
    } );
    this.addChild( horizontalRightMark );
    var horizontalLine = new Line( 0, horizontalLineOffset, 0, horizontalLineOffset, {
      stroke: area.widthColorProperty
    } );
    this.addChild( horizontalLine );
    var horizontalRichText = new RichText( '', {
      font: AreaModelConstants.TOTAL_SIZE_READOUT_FONT,
      fill: area.widthColorProperty
    } );
    var horizontalLabel = new Node( {
      children: [ horizontalRichText ],
      y: horizontalLineOffset + labelOffset
    } );
    this.addChild( horizontalLabel );

    var verticalLeftMark = new Line( -markSize + verticalLineOffset, 0, markSize + verticalLineOffset, 0, {
      stroke: area.heightColorProperty
    } );
    this.addChild( verticalLeftMark );
    var verticalRightMark = new Line( -markSize + verticalLineOffset, 0, markSize + verticalLineOffset, 0, {
      stroke: area.heightColorProperty
    } );
    this.addChild( verticalRightMark );
    var verticalLine = new Line( verticalLineOffset, 0, verticalLineOffset, 0, {
      stroke: area.heightColorProperty
    } );
    this.addChild( verticalLine );
    var verticalRichText = new RichText( '', {
      font: AreaModelConstants.TOTAL_SIZE_READOUT_FONT,
      fill: area.heightColorProperty
    } );
    var verticalLabel = new Node( {
      children: [ verticalRichText ],
      x: verticalLineOffset + labelOffset
    } );
    this.addChild( verticalLabel );

    area.horizontalTotalProperty.link( function( sum ) {
      horizontalRichText.visible = sum !== null;
      if ( sum !== null ) {
        horizontalRichText.text = sum.toRichString();
        horizontalRichText.centerBottom = Vector2.ZERO;
      }
    } );

    area.verticalTotalProperty.link( function( sum ) {
      verticalRichText.visible = sum !== null;
      if ( sum !== null ) {
        verticalRichText.text = sum.toRichString();
        verticalRichText.rightCenter = Vector2.ZERO;
      }
    } );

    area.getCoordinateRangeProperty( Orientation.HORIZONTAL ).link( function( horizontalRange ) {
      horizontalLeftMark.visible = horizontalRange !== null;
      horizontalRightMark.visible = horizontalRange !== null;
      horizontalLine.visible = horizontalRange !== null;

      if ( horizontalRange === null ) {
        return;
      }

      function map( value ) {
        return self.viewSize * ( self.tempMap ? self.tempMap( value ) : value );
      }

      var min = map( horizontalRange.min );
      var center = map( horizontalRange.getCenter() );
      var max = map( horizontalRange.max );

      horizontalLeftMark.x1 = min;
      horizontalLeftMark.x2 = min;
      horizontalRightMark.x1 = max;
      horizontalRightMark.x2 = max;
      horizontalLine.x1 = min;
      horizontalLine.x2 = max;
      horizontalLabel.x = center;
    } );

    area.getCoordinateRangeProperty( Orientation.VERTICAL ).link( function( verticalRange ) {
      verticalLeftMark.visible = verticalRange !== null;
      verticalRightMark.visible = verticalRange !== null;
      verticalLine.visible = verticalRange !== null;

      if ( verticalRange === null ) {
        return;
      }

      function map( value ) {
        return self.viewSize * ( self.tempMap ? self.tempMap( value ) : value );
      }

      var min = map( verticalRange.min );
      var center = map( verticalRange.getCenter() );
      var max = map( verticalRange.max );

      verticalLeftMark.y1 = min;
      verticalLeftMark.y2 = min;
      verticalRightMark.y1 = max;
      verticalRightMark.y2 = max;
      verticalLine.y1 = min;
      verticalLine.y2 = max;
      verticalLabel.y = center;
    } );

    var eraseButton = new EraserButton( {
      listener: function() {
        area.reset();
      },
      centerX: verticalLineOffset,
      centerY: horizontalLineOffset
    } );
    this.addChild( eraseButton );
  }

  areaModelCommon.register( 'AreaNode', AreaNode );

  return inherit( Node, AreaNode );
} );
