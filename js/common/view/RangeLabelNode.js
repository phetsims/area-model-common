// Copyright 2017-2019, University of Colorado Boulder

/**
 * A range label that displays a specific TermList along a line covering the range (with start/end ticks for every
 * partition)
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../AreaModelCommonConstants.js';

// constants
const TICK_LENGTH = 10; // How long the tick marks are for the range labels

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

  const self = this;

  Node.call( this );

  const rangeOffset = ( isProportional
                        ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
                        : AreaModelCommonConstants.GENERIC_RANGE_OFFSET )[ orientation.opposite.coordinate ];

  const richText = new RichText( '', {
    font: AreaModelCommonConstants.TOTAL_SIZE_READOUT_FONT,
    fill: colorProperty
  } );

  // Constrain width on the left side (don't let it go out of the layout bounds)
  if ( orientation === Orientation.VERTICAL ) {
    const verticalRangeOffset = isProportional
                                ? AreaModelCommonConstants.PROPORTIONAL_RANGE_OFFSET
                                : AreaModelCommonConstants.GENERIC_RANGE_OFFSET;
    richText.maxWidth = AreaModelCommonConstants.MAIN_AREA_OFFSET.x + verticalRangeOffset.x - AreaModelCommonConstants.LAYOUT_SPACING;
  }

  // Update the label richText
  termListProperty.link( function( termList ) {

    const hasTerms = termList !== null && termList.terms.length > 0;

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
  const textContainer = new Node( {
    children: [ richText ]
  } );
  this.addChild( textContainer );

  // Coordinate that doesn't change. Customized offsets added
  textContainer[ orientation.opposite.coordinate ] = rangeOffset + ( orientation === Orientation.HORIZONTAL ? -3 : -5 );

  // Our main line, that the tick marks will be off of
  const line = new Line( {
    stroke: colorProperty
  } );
  this.addChild( line );

  const ticks = [];

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
        const tick = new Line( {
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

      const minLocation = tickLocations[ 0 ];
      const maxLocation = tickLocations[ tickLocations.length - 1 ];

      line.p1 = orientation.toVector( minLocation, rangeOffset );
      line.p2 = orientation.toVector( maxLocation, rangeOffset );
      textContainer[ orientation.coordinate ] = ( maxLocation + minLocation ) / 2; // centered
    }
  } );
}

areaModelCommon.register( 'RangeLabelNode', RangeLabelNode );

inherit( Node, RangeLabelNode );
export default RangeLabelNode;