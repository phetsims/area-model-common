// Copyright 2017, University of Colorado Boulder

/**
 * Displays tiles for a partitioned area.
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

    // @private {boolean} - Whether we should be redrawn
    this.dirty = true;

    // Things we depend on
    function invalidate() {
      self.dirty = true;
    }
    countingVisibleProperty.link( invalidate );
    area.activeWidthProperty.link( invalidate );
    area.activeHeightProperty.link( invalidate );
  }

  areaModelCommon.register( 'CountingAreaNode', CountingAreaNode );

  return inherit( Node, CountingAreaNode, {
    /**
     * Updates the view for tiled areas (since it is somewhat expensive to re-draw, and we don't want it being done
     * multiple times per frame.
     * @private
     */
    update: function() {

      // Ignore updates if we are not dirty
      if ( !this.dirty ) { return; }
      this.dirty = false;

      this.removeAllChildren();

      if ( !this.countingVisibleProperty.value ) { return; }

      // Coordinate mapping into the view
      var mapX = this.modelViewTransform.modelToViewX.bind( this.modelViewTransform );
      var mapY = this.modelViewTransform.modelToViewY.bind( this.modelViewTransform );

      var width = this.area.activeWidthProperty.value;
      var height = this.area.activeHeightProperty.value;

      var number = 1;
      for ( var row = 0; row < height; row++ ) {
        for ( var col = 0; col < width; col++ ) {
          // TODO: Don't GC churn this, they can be shared EASILY
          // TODO: PERFORMANCE
          this.addChild( new Text( number, {
            font: AreaModelCommonConstants.COUNTING_FONT,
            fill: AreaModelCommonColorProfile.countingLabelProperty,
            centerX: mapX( col + 0.5 ),
            centerY: mapY( row + 0.5 )
          } ) );

          number++;
        }
      }
    }
  } );
} );
