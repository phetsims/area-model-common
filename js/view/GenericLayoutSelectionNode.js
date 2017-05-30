// Copyright 2017, University of Colorado Boulder

/**
 * Shows a combo box that allows selecting between different layouts
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var ComboBox = require( 'SUN/ComboBox' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/model/GenericLayout' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {ComboBox}
   *
   * @param {Property.<GenericLayout>} genericLayoutProperty
   * @param {Node} listParent
   * @param {number} width
   */
  function GenericLayoutSelectionNode( genericLayoutProperty, listParent, width ) {


    var items = GenericLayout.VALUES.map( function( layout ) {
      return {
        node: new HBox( {
          children: [
            createLayoutIcon( layout.size ),
            new Text( layout.size.height + 'x' + layout.size.width, {
              font: AreaModelConstants.LAYOUT_FONT
            } )
          ],
          spacing: 20
        } ),
        value: layout
      };
    } );

    // TODO: better way!
    var currentComboChromeWidth = 74.5; // empirically determined, but easy to break in the future
    var maxItemWidth = Math.max.apply( Math, _.map( _.map( items, 'node' ), 'width' ) );
    var scale = 0.7;
    var extraPadding = width / scale - currentComboChromeWidth - maxItemWidth;
    items.forEach( function( item ) {
      item.node = new AlignBox( item.node, { rightMargin: extraPadding } );
    } );

    ComboBox.call( this, items, genericLayoutProperty, listParent, {
      // TODO
      scale: scale
    } );
  }

  areaModelCommon.register( 'GenericLayoutSelectionNode', GenericLayoutSelectionNode );

  /**
   * Creates a layout icon based on the given size.
   * @private
   *
   * @param {Dimension2} size
   * @returns {Node}
   */
  function createLayoutIcon( size ) {
    var length = 30;
    var shape = new Shape().rect( 0, 0, length, length );
    if ( size.width === 2 ) {
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_SINGLE_OFFSET, 0 ).verticalLineTo( length );
    }
    else if ( size.width === 3 ) {
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_FIRST_OFFSET, 0 ).verticalLineTo( length );
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_SECOND_OFFSET, 0 ).verticalLineTo( length );
    }
    if ( size.height === 2 ) {
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_SINGLE_OFFSET ).horizontalLineTo( length );
    }
    else if ( size.height === 3 ) {
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_FIRST_OFFSET ).horizontalLineTo( length );
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_SECOND_OFFSET ).horizontalLineTo( length );
    }
    return new Path( shape, {
      stroke: AreaModelColorProfile.layoutGridProperty
    } );
  }

  return inherit( ComboBox, GenericLayoutSelectionNode );
} );
