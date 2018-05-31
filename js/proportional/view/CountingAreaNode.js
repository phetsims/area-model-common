// Copyright 2018, University of Colorado Boulder

/**
 * Displays numbers for each square of a unit size.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var scratchVector = new Vector2(); // Created so we can minimize object creation and garbage collection

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {OrientationPair.<Property.<number>>} activeTotalProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Property.<boolean>} countingVisibleProperty
   */
  function CountingAreaNode( activeTotalProperties, modelViewTransformProperty, countingVisibleProperty ) {

    Node.call( this );

    var self = this;

    // @private {OrientationPair.<Property.<number>>}
    this.activeTotalProperties = activeTotalProperties;

    // @private {Property.<ModelViewTransform2>}
    this.modelViewTransformProperty = modelViewTransformProperty;

    // @private {Property.<boolean>}
    this.countingVisibleProperty = countingVisibleProperty;

    // @private {Array.<Text>} - We reuse these to avoid GC/performance issues
    this.textNodes = [];

    // @private {boolean} - Whether we should be redrawn
    this.dirty = true;

    // Things we depend on
    function invalidate() {
      self.dirty = true;
    }

    countingVisibleProperty.link( invalidate );
    activeTotalProperties.horizontal.link( invalidate );
    activeTotalProperties.vertical.link( invalidate );
    modelViewTransformProperty.link( invalidate );

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
        fill: AreaModelCommonColorProfile.countingLabelProperty
      } );
      this.textNodes.push( text );
      this.addChild( text );
      return text;
    },

    /**
     * Returns the reusable text node with a given number.
     * @private
     *
     * @param {number} number
     * @returns {Text}
     */
    getTextNode: function( number ) {
      var text = this.textNodes[ number - 1 ];
      if ( !text ) {
        text = this.createTextNode( number );
      }
      return text;
    },

    /**
     * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
     * multiple times per frame.
     * @private
     */
    update: function() {
      var modelViewTransform = this.modelViewTransformProperty.value;

      // Ignore updates if we are not dirty
      if ( !this.dirty ) { return; }
      this.dirty = false;

      if ( !this.countingVisibleProperty.value ) { return; }

      // Coordinate mapping into the view
      var modelToViewX = modelViewTransform.modelToViewX.bind( modelViewTransform );
      var modelToViewY = modelViewTransform.modelToViewY.bind( modelViewTransform );

      var width = this.activeTotalProperties.horizontal.value;
      var height = this.activeTotalProperties.vertical.value;

      var cellNumber = 1;
      for ( var row = 0; row < height; row++ ) {
        var rowCenter = modelToViewY( row + 0.5 );

        for ( var col = 0; col < width; col++ ) {
          var colCenter = modelToViewX( col + 0.5 );

          var text = this.getTextNode( cellNumber );
          text.center = scratchVector.setXY( colCenter, rowCenter );
          text.visible = true;

          cellNumber++;
        }
      }

      // Hide the rest of the text nodes (that should NOT show up)
      for ( ; cellNumber - 1 < this.textNodes.length; cellNumber++ ) {
        this.textNodes[ cellNumber - 1 ].visible = false;
      }
    }
  } );
} );
