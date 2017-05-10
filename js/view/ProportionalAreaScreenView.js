// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/view/AreaScreenView' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalAreaNode = require( 'AREA_MODEL_COMMON/view/ProportionalAreaNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SceneSelectionNode = require( 'AREA_MODEL_COMMON/view/SceneSelectionNode' );
  var Shape = require( 'KITE/Shape' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var RADIO_ICON_SIZE = 30;

  /**
   * @constructor
   *
   * @param {AreaModel} model
   */
  function ProportionalAreaScreenView( model ) {
    var self = this;

    AreaScreenView.call( this, model, AreaModelColorProfile.proportionalWidthProperty,
                                      AreaModelColorProfile.proportionalHeightProperty );

    var areaNodes = model.areas.map( function( area ) {
      return new ProportionalAreaNode( area, model.gridLinesVisibleProperty, {
        // TODO: improve positioning
        left: self.layoutBounds.top + 70,
        top: self.layoutBounds.left + 70
      } );
    } );

    areaNodes.forEach( function( areaNode ) {
      self.addChild( areaNode );
    } );

    // Only show the current area
    model.currentAreaProperty.link( function( currentArea ) {
      areaNodes.forEach( function( areaNode ) {
        areaNode.visible = areaNode.area === currentArea;
      } );
    } );

    var sceneSelectionNode = new SceneSelectionNode( model, {
      top: this.panelContainer.bottom + AreaModelConstants.PANEL_SPACING,
      centerX: this.panelContainer.centerX
    } );
    this.addChild( sceneSelectionNode );

    var gridIconShape = new Shape().moveTo( RADIO_ICON_SIZE / 4, 0 )
                                   .lineTo( RADIO_ICON_SIZE / 4, RADIO_ICON_SIZE )
                                   .moveTo( RADIO_ICON_SIZE / 2, 0 )
                                   .lineTo( RADIO_ICON_SIZE / 2, RADIO_ICON_SIZE )
                                   .moveTo( RADIO_ICON_SIZE * 3 / 4, 0 )
                                   .lineTo( RADIO_ICON_SIZE * 3 / 4, RADIO_ICON_SIZE )
                                   .moveTo( 0, RADIO_ICON_SIZE / 4 )
                                   .lineTo( RADIO_ICON_SIZE, RADIO_ICON_SIZE / 4 )
                                   .moveTo( 0, RADIO_ICON_SIZE / 2 )
                                   .lineTo( RADIO_ICON_SIZE, RADIO_ICON_SIZE / 2 )
                                   .moveTo( 0, RADIO_ICON_SIZE * 3 / 4 )
                                   .lineTo( RADIO_ICON_SIZE, RADIO_ICON_SIZE * 3 / 4 );
    var gridIconNode = new Path( gridIconShape, {
      stroke: AreaModelColorProfile.gridIconProperty
    } );

    var tileIconOptions = {
      fill: AreaModelColorProfile.smallTileProperty,
      stroke: AreaModelColorProfile.tileIconStrokeProperty,
      lineWidth: 0.5
    };
    var SMALL_TILE_ICON_SIZE = RADIO_ICON_SIZE / 10;
    var tileIconNode = new HBox( {
      children: [
        new Rectangle( 0, 0, RADIO_ICON_SIZE, RADIO_ICON_SIZE, tileIconOptions ),
        new Rectangle( 0, 0, SMALL_TILE_ICON_SIZE, RADIO_ICON_SIZE, tileIconOptions ),
        new VBox( {
          children: [
            new Rectangle( 0, 0, SMALL_TILE_ICON_SIZE, SMALL_TILE_ICON_SIZE, tileIconOptions ),
            new Rectangle( 0, 0, SMALL_TILE_ICON_SIZE, SMALL_TILE_ICON_SIZE, tileIconOptions ),
            new Rectangle( 0, 0, SMALL_TILE_ICON_SIZE, SMALL_TILE_ICON_SIZE, tileIconOptions )
          ],
          spacing: 0
        } )
      ],
      align: 'top',
      spacing: RADIO_ICON_SIZE / 8
    } );

    var gridCheckbox = new CheckBox( gridIconNode, model.gridLinesVisibleProperty );
    var tileCheckbox = new CheckBox( tileIconNode, model.tilesVisibleProperty );

    this.addChild( new VBox( {
      children: [
        gridCheckbox,
        tileCheckbox
      ],
      align: 'left',
      spacing: 20,
      // TODO: better positioning
      top: 50,
      left: 600
    } ) );
  }

  areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

  return inherit( AreaScreenView, ProportionalAreaScreenView );
} );
