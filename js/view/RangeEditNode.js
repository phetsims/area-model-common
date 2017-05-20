// Copyright 2017, University of Colorado Boulder

/**
 * A range with an term edit label (contains a number readout).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var RangeNode = require( 'AREA_MODEL_COMMON/view/RangeNode' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/view/TermEditNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: options object
   *
   * @param {Property.<Term|null>} termProperty
   * @param {Orientation} orientation
   * @param {Property.<Range>} viewRangeProperty - Expected to be in view coordinates
   * @param {Property.<Color>} colorProperty
   * @param {Property.<Color>} borderColorProperty
   * @param {Property.<boolean>} isActiveProperty
   * @param {number} digitCount
   * @param {boolean} allowExponents
   * @param {Function} editCallback - Called when editing is triggered
   */
  function RangeEditNode( termProperty, orientation, viewRangeProperty, colorProperty, borderColorProperty, isActiveProperty, digitCount, allowExponents, editCallback ) {

    var termEditNode = new TermEditNode(
      orientation, // orientation
      termProperty, // termProperty
      colorProperty, // textColorProperty
      borderColorProperty, // borderColorProperty
      isActiveProperty, // isActiveProperty
      digitCount, // digitCount
      allowExponents, // allowExponents
      editCallback // editCallback
    );

    if ( orientation === Orientation.HORIZONTAL ) {
      termEditNode.centerY = -20;
    }
    else {
      termEditNode.centerX = -30;
    }

    RangeNode.call( this, termEditNode, orientation, viewRangeProperty, colorProperty );
  }

  areaModelCommon.register( 'RangeEditNode', RangeEditNode );

  return inherit( RangeNode, RangeEditNode );
} );
