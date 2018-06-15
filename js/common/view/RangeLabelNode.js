// Copyright 2017-2018, University of Colorado Boulder

/**
 * A range label that displays a specific TermList along a line covering the range (with start/end ticks for every
 * partition)
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TICK_LENGTH = 10; // How long the tick marks are for the range labels

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<TermList|null>} termListProperty
   * @param {Orientation} orientation
   * @param {Property.<Array.<number>>} tickLocationsProperty - In view coordinates
   * @param {Property.<Color>} colorProperty
   * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
   */
  function RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, isProportional ) {

    var self = this;

    Node.call( this );

    var rangeOffset = ( isProportional
                        ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
                        : AreaModelCommonConstants.GENERIC_RANGE_OFFSET )[ orientation.opposite.coordinate ];

    var richText = new RichText( '', {
      font: AreaModelCommonConstants.TOTAL_SIZE_READOUT_FONT,
      fill: colorProperty
    } );

    // Constrain width on the left side (don't let it go out of the layout bounds)
    if ( orientation === Orientation.VERTICAL ) {
      var verticalRangeOffset = isProportional
                                ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
                                : AreaModelCommonConstants.GENERIC_RANGE_OFFSET;
      richText.maxWidth = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + verticalRangeOffset.x - AreaModelCommonConstants.LAYOUT_SPACING;
    }

    // Update the label richText
    termListProperty.link( function( termList ) {

      // REVIEW: In another review discussion, we discussed that termList.terms.length would be >0 if the list was non-null,/
      // REVIEW: Did I understand that conversation properly?
      // REVIEW*: I believe that's only for Polynomial, not the general-case TermList
      var hasTerms = termList !== null && termList.terms.length > 0;

      richText.visible = hasTerms;
      if ( hasTerms ) {
        richText.text = termList.toRichString();

        // Relative positioning
        if ( orientation === Orientation.HORIZONTAL ) {
          richText.centerBottom = Vector2.ZERO;
        }
        else {
          richText.rightCenter = Vector2.ZERO;
        }
      }
    } );

    // Wrap our text in a label, so that we can handle positioning independent of bounds checks
    var textContainer = new Node( {
      children: [ richText ]
    } );
    this.addChild( textContainer );

    // Coordinate that doesn't change. Customized offsets added
    textContainer[ orientation.opposite.coordinate ] = rangeOffset + ( orientation === Orientation.HORIZONTAL ? -3 : -5 );

    // Our main line, that the tick marks will be off of
    var line = new Line( {
      stroke: colorProperty
    } );
    this.addChild( line );

    var ticks = [];

    // Update the layout
    tickLocationsProperty.link( function( tickLocations ) {
      assert && assert( tickLocations.length === 0 || tickLocations.length >= 2 );

      if ( tickLocations.length === 0 ) {
        ticks.forEach( function( tick ) {
          tick.visible = false;
        } );
      }
      else {

        // Add any ticks that we need
        while ( ticks.length < tickLocations.length ) {
          var tick = new Line( {
            y1: 0,
            y2: TICK_LENGTH / 2,
            stroke: colorProperty,
            rotation: orientation === Orientation.HORIZONTAL ? 0 : -Math.PI / 2
          } );
          ticks.push( tick );
          self.addChild( tick );
        }

        ticks.forEach( function( tick, index ) {
          if ( index < tickLocations.length ) {
            tick.visible = true;
            tick.translation = orientation.toVector( tickLocations[ index ], rangeOffset );

            // The first/last ticks should have a different length
            tick.y1 = ( index === 0 || index === tickLocations.length - 1 ) ? -TICK_LENGTH / 2 : 0;
          }
          else {
            tick.visible = false;
          }
        } );

        var minLocation = tickLocations[ 0 ];
        var maxLocation = tickLocations[ tickLocations.length - 1 ];

        line.p1 = orientation.toVector( minLocation, rangeOffset );
        line.p2 = orientation.toVector( maxLocation, rangeOffset );
        textContainer[ orientation.coordinate ] = ( maxLocation + minLocation ) / 2; // centered
      }
    } );
  }

  areaModelCommon.register( 'RangeLabelNode', RangeLabelNode );

  return inherit( Node, RangeLabelNode );
} );
