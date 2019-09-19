// Copyright 2017-2019, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  const AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  const Checkbox = require( 'SUN/Checkbox' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/model/PartitionLineChoice' );
  const PartitionRadioButtonGroup = require( 'AREA_MODEL_COMMON/proportional/view/PartitionRadioButtonGroup' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ProportionalAreaDisplayNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaDisplayNode' );
  const ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  const ProportionalFactorsNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalFactorsNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneRadioButtonGroup = require( 'AREA_MODEL_COMMON/proportional/view/SceneRadioButtonGroup' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const partitionString = require( 'string!AREA_MODEL_COMMON/partition' );

  // a11y strings
  var base10AreaTilesString = AreaModelCommonA11yStrings.base10AreaTiles.value;
  var countingNumbersDescriptionString = AreaModelCommonA11yStrings.countingNumbersDescription.value;
  var countingNumbersLabelString = AreaModelCommonA11yStrings.countingNumbersLabel.value;
  var gridLinesLabelString = AreaModelCommonA11yStrings.gridLinesLabel.value;

  // constants
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
    this.sceneSelectionNode = new SceneRadioButtonGroup( model );

    var currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
      derive: 'visiblePartitionOrientationProperty',
      bidirectional: true
    } );

    // Should have its own align group, so we don't modify other sizes
    var partitionSelectionAlignGroup = new AlignGroup();

    // @private {Node} - Allows controlling which partition is currently visible (if we only show one)
    this.partitionSelectionPanel = this.createPanelContent(
      partitionString,
      AreaModelCommonGlobals.panelAlignGroup,
      new PartitionRadioButtonGroup( currentAreaOrientationProperty, partitionSelectionAlignGroup )
    );

    AreaScreenView.call( this, model, options );

    // Checkboxes
    var gridCheckbox = new Checkbox( this.createGridIconNode(), model.gridLinesVisibleProperty, {
      // a11y
      labelTagName: 'label',
      labelContent: gridLinesLabelString
    } );
    var tileCheckbox = new Checkbox( this.createTileIconNode(), model.tilesVisibleProperty, {
      // a11y
      labelTagName: 'label',
      labelContent: base10AreaTilesString
    } );
    var countingCheckbox = new Checkbox( this.createCountingIconNode(), model.countingVisibleProperty, {
      // a11y
      labelTagName: 'label',
      labelContent: countingNumbersLabelString,
      descriptionContent: countingNumbersDescriptionString
    } );

    var checkboxContainer = new VBox( {
      children: [gridCheckbox, countingCheckbox, tileCheckbox],
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

    // "Play Area" (a11y)
    this.playAreaNode.accessibleOrder = [
      this.areaDisplayNode,
      this.factorsBox,
      this.areaBox,
      this.productsSelectionPanel,
      this.calculationSelectionPanel,
      this.partitionSelectionPanel,
      this.calculationNode
    ].filter( function( node ) { return node !== undefined; } ); // this.partitionSelectionPanel may not exist

    // "Control Panel" (a11y)
    this.controlAreaNode.accessibleOrder = [
      gridCheckbox,
      tileCheckbox,
      countingCheckbox,
      this.sceneSelectionNode,
      this.resetAllButton
    ];
  }

  areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

  return inherit( AreaScreenView, ProportionalAreaScreenView, {
    /**
     * @protected
     * @override
     *
     * @returns {Array.<Node>}
     */
    getRightAlignNodes: function() {
      return AreaScreenView.prototype.getRightAlignNodes.call( this ).concat( [this.sceneSelectionNode] );
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
      var hasPartitionSelectionProperty = new DerivedProperty( [this.model.currentAreaProperty], function( area ) {
        return area.partitionLineChoice === PartitionLineChoice.ONE;
      } );

      // Conditionally include our partition selection on top of what else is included
      return new DerivedProperty(
        [AreaScreenView.prototype.getSelectionNodesProperty.call( this ), hasPartitionSelectionProperty],
        function( selectionNodes, hasPartitionSelection ) {
          return hasPartitionSelection ? selectionNodes.concat( [self.partitionSelectionPanel] ) : selectionNodes;
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
      return new ProportionalFactorsNode( model.currentAreaProperty, model.areaDisplay.activeTotalProperties, decimalPlaces );
    },

    /**
     * Creates a grid icon.
     * @private
     *
     * @returns {Node}
     */
    createGridIconNode: function() {
      var gridIconShape = new Shape()
        .moveTo( RADIO_ICON_SIZE / 4, 0 )
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
      // Hardcoded string, see https://github.com/phetsims/area-model-common/issues/104
      return new Text( '123', {
        font: AreaModelCommonConstants.COUNTING_ICON_FONT
      } );
    }
  } );
} );
