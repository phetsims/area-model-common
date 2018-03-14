// Copyright 2017, University of Colorado Boulder

/**
 * Displays numbers for each square of a unit size.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  var scratchVector = new Vector2();

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalArea} area
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} countingVisibleProperty
   */
  function CountingAreaNode( area, modelViewTransform, countingVisibleProperty ) {

    Node.call( this );

    var self = this;

    // @private {ProportionalArea}
    this.area = area;

    // @private {ModelViewTransform}
    this.modelViewTransform = modelViewTransform;

    // @private {Property.<boolean>}
    this.countingVisibleProperty = countingVisibleProperty;

    // @private {Array.<Text>} - We reuse these to avoid GC/performance issues
    this.textNodes = [];
    // TODO: test if we should preallocate a number of these?

    // @private {boolean} - Whether we should be redrawn
    this.dirty = true;

    // Things we depend on
    function invalidate() {
      self.dirty = true;
    }
    countingVisibleProperty.link( invalidate );
    area.activeTotalProperties.horizontal.link( invalidate );
    area.activeTotalProperties.vertical.link( invalidate );

    countingVisibleProperty.linkAttribute( this, 'visible' );
  }

  areaModelCommon.register( 'CountingAreaNode', CountingAreaNode );

  return inherit( Node, CountingAreaNode, {
    /**
     * Creates a reusable text node with a given number.
     * @private
     *
     * @param {number} number
     * @returns {Text}
     */
    createTextNode: function( number ) {
      var text = new Text( number, {
        font: AreaModelCommonConstants.COUNTING_FONT,
        fill: AreaModelCommonColorProfile.countingLabelProperty,
      } );
      this.textNodes.push( text );
      this.addChild( text );
      return text;
    },

    /**
     * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
     * multiple times per frame.
     * @private
     */
    update: function() {

      // Ignore updates if we are not dirty
      if ( !this.dirty ) { return; }
      this.dirty = false;

      if ( !this.countingVisibleProperty.value ) { return; }

      // Coordinate mapping into the view
      var mapX = this.modelViewTransform.modelToViewX.bind( this.modelViewTransform );
      var mapY = this.modelViewTransform.modelToViewY.bind( this.modelViewTransform );

      var width = this.area.activeTotalProperties.horizontal.value;
      var height = this.area.activeTotalProperties.vertical.value;

      var number = 1;
      for ( var row = 0; row < height; row++ ) {
        var rowCenter = mapY( row + 0.5 );

        for ( var col = 0; col < width; col++ ) {
          var colCenter = mapX( col + 0.5 );

          var text = this.textNodes[ number - 1 ];
          // lazy creation (in case)
          if ( !text ) {
            text = this.createTextNode( number );
          }
          text.center = scratchVector.setXY( colCenter, rowCenter );
          text.visible = true;

          number++;
        }
      }

      // Hide the rest of the text nodes (that should NOT show up)
      for ( ; number - 1 < this.textNodes.length; number++ ) {
        this.textNodes[ number - 1 ].visible = false;
      }
    }
  } );
} );
