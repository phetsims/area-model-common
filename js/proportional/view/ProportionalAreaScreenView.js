// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  var Checkbox = require( 'SUN/Checkbox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaNode' );
  var ProportionalProductNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalProductNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SceneSelectionNode = require( 'AREA_MODEL_COMMON/proportional/view/SceneSelectionNode' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var countingToggleString = require( 'string!AREA_MODEL_COMMON/countingToggle' );

  var RADIO_ICON_SIZE = 30;

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {AreaModel} model
   * @param {Object} options
   */
  function ProportionalAreaScreenView( model, options ) {
    assert && assert( model instanceof ProportionalAreaModel );

    options = _.extend( {
      isProportional: true
    }, options );

    AreaScreenView.call( this, model, options );

    // Scene selection
    var sceneSelectionNode = new SceneSelectionNode( model, {
      top: this.panelContainer.bottom + AreaModelConstants.PANEL_SPACING,
      centerX: this.panelContainer.centerX
    } );
    this.addChild( sceneSelectionNode );

    // Checkboxes
    var gridCheckbox = new Checkbox( this.createGridIconNode(), model.gridLinesVisibleProperty );
    var tileCheckbox = new Checkbox( this.createTileIconNode(), model.tilesVisibleProperty );
    var countingCheckbox = new Checkbox( this.createCountingIconNode(), model.countsVisibleProperty );

    var checkboxContainer = new VBox( {
      children: [ gridCheckbox, countingCheckbox, tileCheckbox ],
      align: 'left',
      spacing: 20,
      // Manual positioning works best here
      top: 50,
      left: 600
    } );

    model.currentAreaProperty.link( function( area ) {
      // TODO: some cleanup?
      var children = [];

      // Don't show the grid/tiles checkboxes if counting is enabled
      if ( !area.countingAvailable ) {
        children.push( gridCheckbox );
        if ( area.tilesAvailable ) {
          children.push( tileCheckbox );
        }
      }
      else {
        children.push( countingCheckbox );
      }
      checkboxContainer.children = children;
    } );

    this.addChild( checkboxContainer );

    var accessibleOrder = [];
    this.areaNodes.forEach( function( areaNode ) {
      accessibleOrder.push( areaNode.areaLayer );
    } );
    this.areaNodes.forEach( function( areaNode ) {
      accessibleOrder.push( areaNode.eraseButton );
    } );
    accessibleOrder.push( this.factorsBox );
    accessibleOrder.push( this.areaBox );
    accessibleOrder.push( this.productsSelectionPanel );
    accessibleOrder.push( this.calculationSelectionPanel );
    if ( this.partitionSelectionPanel ) {
      accessibleOrder.push( this.partitionSelectionPanel );
    }
    accessibleOrder.push( this.calculationDisplayPanel );
    accessibleOrder.push( gridCheckbox );
    accessibleOrder.push( tileCheckbox );
    accessibleOrder.push( countingCheckbox );
    accessibleOrder.push( sceneSelectionNode );
    accessibleOrder.push( this.resetAllButton );
    this.accessibleOrder = accessibleOrder;
  }

  areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

  return inherit( AreaScreenView, ProportionalAreaScreenView, {
    /**
     * Steps the view forward, updating things that only update once a frame.
     * @public
     * @override
     *
     * @param {number} dt
     */
    step: function( dt ) {
      AreaScreenView.prototype.step.call( this, dt );

      this.areaNodes.forEach( function( areaNode ) {
        if ( areaNode.visible ) {
          areaNode.update();
        }
      } );
    },

    // TODO: doc, abstract
    createAreaNode: function( model, area ) {
      //TODO: countsVisibleProperty or countingVisibleProperty? decide!
      return new ProportionalAreaNode( area, model.gridLinesVisibleProperty, model.tilesVisibleProperty, model.countsVisibleProperty, model.partialProductsChoiceProperty, this.useTileLikeBackground, this.useLargeArea, {
        translation: this.getAreaTranslation()
      } );
    },

    /**
     * Creates the "factors" (dimensions) content for the accordion box.
     * @public
     * @override
     *
     * @param {AreaModel} model
     * @param {number} decimalPlaces
     * @returns {Node}
     */
    createFactorsNode: function( model, decimalPlaces ) {
      return new ProportionalProductNode( model.currentAreaProperty, decimalPlaces );
    },

    /**
     * Creates a grid icon.
     * @private
     *
     * @returns {Node}
     */
    createGridIconNode: function() {
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
      return new Path( gridIconShape, {
        stroke: AreaModelColorProfile.gridIconProperty
      } );
    },

    /**
     * Creates a tile icon.
     * @private
     *
     * @returns {Node}
     */
    createTileIconNode: function() {
      var tileIconOptions = {
        fill: AreaModelColorProfile.smallTileProperty,
        stroke: AreaModelColorProfile.tileIconStrokeProperty,
        lineWidth: 0.5
      };
      var SMALL_TILE_ICON_SIZE = RADIO_ICON_SIZE / 10;
      return new HBox( {
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
    },

    /**
     * Creates a counting icon.
     * @private
     *
     * @returns {Node}
     */
    createCountingIconNode: function() {
      return new Text( countingToggleString, {
        font: AreaModelConstants.COUNTING_ICON_FONT
      } );
    }
  } );
} );
