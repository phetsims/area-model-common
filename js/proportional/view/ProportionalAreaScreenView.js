// Copyright 2017-2020, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import AreaModelCommonGlobals from '../../common/AreaModelCommonGlobals.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';
import AreaScreenView from '../../common/view/AreaScreenView.js';
import PartitionLineChoice from '../model/PartitionLineChoice.js';
import ProportionalAreaModel from '../model/ProportionalAreaModel.js';
import PartitionRadioButtonGroup from './PartitionRadioButtonGroup.js';
import ProportionalAreaDisplayNode from './ProportionalAreaDisplayNode.js';
import ProportionalFactorsNode from './ProportionalFactorsNode.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';

const partitionString = areaModelCommonStrings.partition;
const base10AreaTilesString = areaModelCommonStrings.a11y.base10AreaTiles;
const countingNumbersDescriptionString = areaModelCommonStrings.a11y.countingNumbersDescription;
const countingNumbersLabelString = areaModelCommonStrings.a11y.countingNumbersLabel;
const gridLinesLabelString = areaModelCommonStrings.a11y.gridLinesLabel;

// constants
const RADIO_ICON_SIZE = 30;

/**
 * @constructor
 * @extends {AreaScreenView}
 *
 * @param {ProportionalAreaModel} model
 * @param {Object} [options]
 */
function ProportionalAreaScreenView( model, options ) {
  assert && assert( model instanceof ProportionalAreaModel );

  options = merge( {
    decimalPlaces: 0,
    isProportional: true
  }, options );

  // @private {Node} - Scene selection, created before super call since it will be added in it.
  this.sceneSelectionNode = new SceneRadioButtonGroup( model );

  const currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
    derive: 'visiblePartitionOrientationProperty',
    bidirectional: true
  } );

  // Should have its own align group, so we don't modify other sizes
  const partitionSelectionAlignGroup = new AlignGroup();

  // @private {Node} - Allows controlling which partition is currently visible (if we only show one)
  this.partitionSelectionPanel = this.createPanelContent(
    partitionString,
    AreaModelCommonGlobals.panelAlignGroup,
    new PartitionRadioButtonGroup( currentAreaOrientationProperty, partitionSelectionAlignGroup )
  );

  AreaScreenView.call( this, model, options );

  // Checkboxes
  const gridCheckbox = new Checkbox( this.createGridIconNode(), model.gridLinesVisibleProperty, {
    // pdom
    labelTagName: 'label',
    labelContent: gridLinesLabelString
  } );
  const tileCheckbox = new Checkbox( this.createTileIconNode(), model.tilesVisibleProperty, {
    // pdom
    labelTagName: 'label',
    labelContent: base10AreaTilesString
  } );
  const countingCheckbox = new Checkbox( this.createCountingIconNode(), model.countingVisibleProperty, {
    // pdom
    labelTagName: 'label',
    labelContent: countingNumbersLabelString,
    descriptionContent: countingNumbersDescriptionString
  } );

  const checkboxContainer = new VBox( {
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

  // "Play Area" (a11y)
  this.pdomPlayAreaNode.accessibleOrder = [
    this.areaDisplayNode,
    this.factorsBox,
    this.areaBox,
    this.productsSelectionPanel,
    this.calculationSelectionPanel,
    this.partitionSelectionPanel,
    this.calculationNode
  ].filter( function( node ) { return node !== undefined; } ); // this.partitionSelectionPanel may not exist

  // "Control Panel" (a11y)
  this.pdomControlAreaNode.accessibleOrder = [
    gridCheckbox,
    tileCheckbox,
    countingCheckbox,
    this.sceneSelectionNode,
    this.resetAllButton
  ];
}

areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

export default inherit( AreaScreenView, ProportionalAreaScreenView, {
  /**
   * @protected
   * @override
   *
   * @returns {Array.<Node>}
   */
  getRightAlignNodes: function() {
    return AreaScreenView.prototype.getRightAlignNodes.call( this ).concat( [ this.sceneSelectionNode ] );
  },

  /**
   * @protected
   * @override
   *
   * @returns {Property.<Array.<Node>>}
   */
  getSelectionNodesProperty: function() {
    const self = this;

    // Use a Property here so we don't recreate when we don't have to (just on area changes)
    const hasPartitionSelectionProperty = new DerivedProperty( [ this.model.currentAreaProperty ], function( area ) {
      return area.partitionLineChoice === PartitionLineChoice.ONE;
    } );

    // Conditionally include our partition selection on top of what else is included
    return new DerivedProperty(
      [ AreaScreenView.prototype.getSelectionNodesProperty.call( this ), hasPartitionSelectionProperty ],
      function( selectionNodes, hasPartitionSelection ) {
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
    return new ProportionalFactorsNode( model.currentAreaProperty, model.areaDisplay.activeTotalProperties, decimalPlaces );
  },

  /**
   * Creates a grid icon.
   * @private
   *
   * @returns {Node}
   */
  createGridIconNode: function() {
    const gridIconShape = new Shape()
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
    const tileIconOptions = {
      fill: AreaModelCommonColorProfile.smallTileProperty,
      stroke: AreaModelCommonColorProfile.tileIconStrokeProperty,
      lineWidth: 0.5
    };
    const SMALL_TILE_ICON_SIZE = RADIO_ICON_SIZE / 10;
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