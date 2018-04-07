// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  var Checkbox = require( 'SUN/Checkbox' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/enum/PartitionLineChoice' );
  var PartitionSelectionNode = require( 'AREA_MODEL_COMMON/proportional/view/PartitionSelectionNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalAreaDisplayNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaDisplayNode' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalFactorsNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalFactorsNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SceneSelectionNode = require( 'AREA_MODEL_COMMON/proportional/view/SceneSelectionNode' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var countingToggleString = require( 'string!AREA_MODEL_COMMON/countingToggle' );
  var partitionString = require( 'string!AREA_MODEL_COMMON/partition' );

  var RADIO_ICON_SIZE = 30;

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {ProportionalAreaModel} model
   * @param {Object} options
   */
  function ProportionalAreaScreenView( model, options ) {
    assert && assert( model instanceof ProportionalAreaModel );

    options = _.extend( {
      isProportional: true
    }, options );

    // @private {Node} - Scene selection, created before super call since it will be added in it.
    this.sceneSelectionNode = new SceneSelectionNode( model );

    var currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
      derive: 'visiblePartitionOrientationProperty',
      bidirectional: true
    } );

    // @private {Node} - Allows controlling which partition is currently visible (if we only show one)
    this.partitionSelectionPanel = this.createPanelContent( partitionString, AreaModelCommonGlobals.panelAlignGroup, new PartitionSelectionNode( currentAreaOrientationProperty, AreaModelCommonGlobals.selectionButtonAlignGroup ) );

    AreaScreenView.call( this, model, options );

    // Checkboxes
    var gridCheckbox = new Checkbox( this.createGridIconNode(), model.gridLinesVisibleProperty );
    var tileCheckbox = new Checkbox( this.createTileIconNode(), model.tilesVisibleProperty );
    var countingCheckbox = new Checkbox( this.createCountingIconNode(), model.countingVisibleProperty );

    var checkboxContainer = new VBox( {
      children: [ gridCheckbox, countingCheckbox, tileCheckbox ],
      align: 'left',
      spacing: 20,
      // Manual positioning works best here
      top: 50,
      left: 600
    } );
    this.addChild( checkboxContainer );

    model.currentAreaProperty.link( function( area ) {
      checkboxContainer.removeAllChildren();

      // Don't show the grid/tiles checkboxes if counting is enabled
      if ( !area.countingAvailable ) {
        checkboxContainer.addChild( gridCheckbox );
        if ( area.tilesAvailable ) {
          checkboxContainer.addChild( tileCheckbox );
        }
      }
      else {
        checkboxContainer.addChild( countingCheckbox );
      }
    } );

    // Our keyboard-accessible order
    var accessibleOrder = [];
    accessibleOrder.push( this.areaDisplayNode.areaLayer );
    accessibleOrder.push( this.areaDisplayNode.eraseButton );
    accessibleOrder.push( this.factorsBox );
    accessibleOrder.push( this.areaBox );
    accessibleOrder.push( this.productsSelectionPanel );
    accessibleOrder.push( this.calculationSelectionPanel );
    if ( this.partitionSelectionPanel ) {
      accessibleOrder.push( this.partitionSelectionPanel );
    }
    accessibleOrder.push( this.calculationNode );
    accessibleOrder.push( gridCheckbox );
    accessibleOrder.push( tileCheckbox );
    accessibleOrder.push( countingCheckbox );
    accessibleOrder.push( this.sceneSelectionNode );
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

      this.areaDisplayNode.update();
    },

    /**
     * @protected
     * @override
     *
     * @returns {Array.<Node>}
     */
    getRightSideNodes: function() {
      return AreaScreenView.prototype.getRightSideNodes.call( this ).concat( [ this.sceneSelectionNode ] );
    },

    /**
     * @protected
     * @override
     *
     * @returns {Property.<Array.<Node>>}
     */
    getSelectionNodesProperty: function() {
      var self = this;

      // Use a Property here so we don't recreate when we don't have to (just on area changes)
      var hasPartitionSelectionProperty = new DerivedProperty( [ this.model.currentAreaProperty ], function( area ) {
        return area.partitionLineChoice === PartitionLineChoice.ONE;
      } );

      // Conditionally include our partition selection on top of what else is included
      return new DerivedProperty( [ AreaScreenView.prototype.getSelectionNodesProperty.call( this ), hasPartitionSelectionProperty ], function( selectionNodes, hasPartitionSelection ) {
        return hasPartitionSelection ? selectionNodes.concat( [ self.partitionSelectionPanel ] ) : selectionNodes;
      } );
    },

    /**
     * Creates the main area display view for the screen.
     * @public
     * @override
     *
     * @param {ProportionalAreaModel} model
     * @returns {ProportionalAreaDisplayNode}
     */
    createAreaDisplayNode: function( model ) {
      return new ProportionalAreaDisplayNode( model.areaDisplay, model.partialProductsChoiceProperty, {
        gridLinesVisibleProperty: model.gridLinesVisibleProperty,
        tilesVisibleProperty: model.tilesVisibleProperty,
        countingVisibleProperty: model.countingVisibleProperty,
        useTileLikeBackground: this.useTileLikeBackground,
        useLargeArea: this.useLargeArea
      }, {
        translation: this.getDisplayTranslation()
      } );
    },

    /**
     * Creates the "factors" (dimensions) content for the accordion box.
     * @public
     * @override
     *
     * @param {ProportionalAreaModel} model
     * @param {number} decimalPlaces
     * @returns {Node}
     */
    createFactorsNode: function( model, decimalPlaces ) {
      return new ProportionalFactorsNode( model.currentAreaProperty, decimalPlaces );
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
        stroke: AreaModelCommonColorProfile.gridIconProperty
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
        fill: AreaModelCommonColorProfile.smallTileProperty,
        stroke: AreaModelCommonColorProfile.tileIconStrokeProperty,
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
        font: AreaModelCommonConstants.COUNTING_ICON_FONT
      } );
    }
  } );
} );
