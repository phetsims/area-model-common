// Copyright 2017, University of Colorado Boulder

/**
 * A range label that displays a specific TermList.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var RangeNode = require( 'AREA_MODEL_COMMON/common/view/RangeNode' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<TermList|null>} termListProperty
   * @param {Orientation} orientation
   * @param {Property.<Array.<number>>} tickLocationsProperty - In view coordinates
   * @param {Property.<Color>} colorProperty
   */
  function RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty ) {

    var text = new RichText( '', {
      font: AreaModelConstants.TOTAL_SIZE_READOUT_FONT,
      fill: colorProperty
    } );

    // Wrap our text in a label, so that we can handle positioning independent of bounds checks
    var label = new Node( {
      children: [ text ]
    } );

    if ( orientation === Orientation.VERTICAL ) {
      text.maxWidth = AreaModelConstants.MAIN_AREA_OFFSET.x + AreaModelConstants.RANGE_OFFSET.x - AreaModelConstants.PANEL_MARGIN;
    }

    // Update the label text
    termListProperty.link( function( termList ) {
      var hasTerms = termList !== null && termList.terms.length > 0;

      text.visible = hasTerms;
      if ( hasTerms ) {
        text.text = termList.toRichString();
        if ( orientation === Orientation.HORIZONTAL ) {
          text.centerBottom = Vector2.ZERO;
        }
        else {
          text.rightCenter = Vector2.ZERO;
        }
      }
    } );

    RangeNode.call( this, label, orientation, tickLocationsProperty, colorProperty );
  }

  areaModelCommon.register( 'RangeLabelNode', RangeLabelNode );

  return inherit( RangeNode, RangeLabelNode );
} );
