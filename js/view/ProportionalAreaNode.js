// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalArea = require( 'AREA_MODEL_COMMON/model/ProportionalArea' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   *
   * @param {ProportionalArea} area
   * @param {Property.<boolean>} gridLinesVisibleProperty
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaNode( area, gridLinesVisibleProperty, nodeOptions ) {
    assert && assert( area instanceof ProportionalArea );

    AreaNode.call( this, area );

    var modelBounds = new Bounds2( 0, 0, area.maximumSize, area.maximumSize );
    var viewBounds = new Bounds2( 0, 0, this.viewSize, this.viewSize );
    this.modelViewTransform = ModelViewTransform2.createRectangleMapping( modelBounds, viewBounds );

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.addChild( background );

    var gridLineWidth = 0.5;
    var halfGridLineWidth = gridLineWidth / 2;
    var gridLineShape = new Shape();
    for ( var i = area.snapSize; i < area.maximumSize; i += area.snapSize ) {
      var x = this.modelViewTransform.modelToViewX( i );
      var y = this.modelViewTransform.modelToViewY( i );

      gridLineShape.moveTo( halfGridLineWidth, y );
      gridLineShape.lineTo( this.viewSize - halfGridLineWidth, y );

      gridLineShape.moveTo( x, halfGridLineWidth );
      gridLineShape.lineTo( x, this.viewSize - halfGridLineWidth );
    }
    var gridLineNode = new Path( gridLineShape, {
      stroke: AreaModelColorProfile.gridLineProperty
    } );
    gridLinesVisibleProperty.linkAttribute( gridLineNode, 'visible' );
    this.addChild( gridLineNode );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaNode', ProportionalAreaNode );

  return inherit( AreaNode, ProportionalAreaNode );
} );
