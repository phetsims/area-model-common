// Copyright 2018, University of Colorado Boulder

/**
 * Displays numbers for each square of a unit size.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
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

  // REVIEW: Doc? Does this need to be declared outside of the constructor?
  // REVIEW*: We usually declare these at this scope, so you don't get one per object (in this case, one per
  // REVIEW*: CountingAreaNode). Since we have so little of these, I'd be fine making it a property of the type
  // REVIEW*: (this.scratchVector). Does that sound better?
  
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
     * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
     * multiple times per frame.
     * @private
     */
    update: function() {
      var mvt = this.modelViewTransformProperty.value;

      // Ignore updates if we are not dirty
      if ( !this.dirty ) { return; }
      this.dirty = false;

      if ( !this.countingVisibleProperty.value ) { return; }

      // Coordinate mapping into the view
      var mapX = mvt.modelToViewX.bind( mvt );
      var mapY = mvt.modelToViewY.bind( mvt );

      var width = this.activeTotalProperties.horizontal.value;
      var height = this.activeTotalProperties.vertical.value;

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
