// Copyright 2017-2018, University of Colorado Boulder

/**
 * A range label that displays a specific TermList along a line covering the range (with start/end ticks for every
 * partition)
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 * // REVIEW: I'd recommend changing the wording of the "This type should be persistent" (in all relevant files) to be something more like:
 * // REVIEW: "This type is designed to be persistent" or "Instances of this type persist for the lifetime of the simulation"
 * // REVIEW: Using the word "should" has a connotation that "it *should*, but maybe it doesn't"
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

    // REVIEW: rename to richText or textNode
    var text = new RichText( '', {
      font: AreaModelCommonConstants.TOTAL_SIZE_READOUT_FONT,
      fill: colorProperty
    } );

    // Constrain width on the left side (don't let it go out of the layout bounds)
    if ( orientation === Orientation.VERTICAL ) {

      // REVIEW: Eliminate extraneous parentheses
      var verticalRangeOffset = ( isProportional
        ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
        : AreaModelCommonConstants.GENERIC_RANGE_OFFSET );
      text.maxWidth = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + verticalRangeOffset.x - AreaModelCommonConstants.LAYOUT_SPACING;
    }

    // Update the label text
    termListProperty.link( function( termList ) {

      // REVIEW: In another review discussion, we discussed that termList.terms.length would be >0 if the list was non-null,/
      // REVIEW: Did I understand that conversation properly?
      var hasTerms = termList !== null && termList.terms.length > 0;

      text.visible = hasTerms;
      if ( hasTerms ) {
        text.text = termList.toRichString();

        // Relative positioning
        if ( orientation === Orientation.HORIZONTAL ) {
          text.centerBottom = Vector2.ZERO;
        }
        else {
          text.rightCenter = Vector2.ZERO;
        }
      }
    } );

    // Wrap our text in a label, so that we can handle positioning independent of bounds checks
    var textContainer = new Node( {
      children: [ text ]
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
            tick.translation = orientation.vector( tickLocations[ index ], rangeOffset );

            // REVIEW: please comment to explain the logic on this line
            tick.y1 = ( index === 0 || index === tickLocations.length - 1 ) ? -TICK_LENGTH / 2 : 0;
          }
          else {
            tick.visible = false;
          }
        } );

        var minLocation = tickLocations[ 0 ];
        var maxLocation = tickLocations[ tickLocations.length - 1 ];

        line.p1 = orientation.vector( minLocation, rangeOffset );
        line.p2 = orientation.vector( maxLocation, rangeOffset );
        textContainer[ orientation.coordinate ] = ( maxLocation + minLocation ) / 2; // centered
      }
    } );
  }

  areaModelCommon.register( 'RangeLabelNode', RangeLabelNode );

  return inherit( Node, RangeLabelNode );
} );
