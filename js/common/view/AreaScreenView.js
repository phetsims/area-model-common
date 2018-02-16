// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for generic/proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var AreaCalculationSelectionNode = require( 'AREA_MODEL_COMMON/common/view/AreaCalculationSelectionNode' );
  var AreaModel = require( 'AREA_MODEL_COMMON/common/model/AreaModel' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaModelGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelGlobals' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CalculationBox = require( 'AREA_MODEL_COMMON/proportional/view/CalculationBox' );
  var CalculationPanel = require( 'AREA_MODEL_COMMON/common/view/CalculationPanel' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductSelectionNode = require( 'AREA_MODEL_COMMON/common/view/PartialProductSelectionNode' );
  var PartitionSelectionNode = require( 'AREA_MODEL_COMMON/proportional/view/PartitionSelectionNode' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/enum/PartitionLineChoice' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TotalAreaNode = require( 'AREA_MODEL_COMMON/common/view/TotalAreaNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaModelCalculationString = require( 'string!AREA_MODEL_COMMON/areaModelCalculation' );
  var dimensionsString = require( 'string!AREA_MODEL_COMMON/dimensions' );
  var factorsString = require( 'string!AREA_MODEL_COMMON/factors' );
  var partialProductsString = require( 'string!AREA_MODEL_COMMON/partialProducts' );
  var partitionString = require( 'string!AREA_MODEL_COMMON/partition' );
  var productString = require( 'string!AREA_MODEL_COMMON/product' );
  var totalAreaOfModelString = require( 'string!AREA_MODEL_COMMON/totalAreaOfModel' );

  /**
   * @constructor
   * @extends {ScrenView}
   *
   * @param {AreaModel} model
   * @param {Object} [options]
   */
  function AreaScreenView( model, options ) {

    options = _.extend( {
      decimalPlaces: 0,
      showProductsSelection: true,
      showCalculationSelection: true,
      useTileLikeBackground: false, // {boolean} - Selected area background and products box use a light-tile-colored background
      useSimplifiedNames: false, // {boolean} - Uses "product" and "factors" to be simpler and more multiplication-like
      useLargeArea: false, // {boolean} - If true, changes the location/size of the area to take up more space
      useCalculationBox: false // {boolean} - If true, a simplified accordion box will be used for the calculation lines
    }, options );

    assert && assert( model instanceof AreaModel );
    assert && assert( typeof options.decimalPlaces === 'number' );

    var self = this;

    ScreenView.call( this );

    // @protected {boolean}
    this.useTileLikeBackground = options.useTileLikeBackground;
    this.useLargeArea = options.useLargeArea;

    var panelAlignGroup = AreaModelGlobals.panelAlignGroup;

    // Create all group-aligned content first (Panels are OK), since AccordionBoxes don't handle resizing
    //TODO: abstract method
    var productNode = this.createProductNode( model, options.decimalPlaces );
    var productBoxContent = new AlignBox( productNode, {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    // TODO: better way of handling
    var maximumArea = model.isProportional && _.max( _.map( model.areas, function( area ) {
      return area.maximumSize * area.maximumSize;
    } ) );
    var maximumProportionalString = model.isProportional && _.every( model.areas, function( area ) { return area.snapSize >= 1; } ) ? ( +maximumArea ) : '7.89';
    var areaBoxContent = new AlignBox( new TotalAreaNode( model.totalAreaProperty, model.isProportional, maximumProportionalString, this.useTileLikeBackground ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );

    var selectionButtonAlignGroup = new AlignGroup();

    // TODO: don't require this ordering of creation just for sizing. creating the "bigger" one first
    var productsSelectionPanel = this.createPanelContent( partialProductsString, panelAlignGroup,
                                                   new PartialProductSelectionNode( model, selectionButtonAlignGroup ) );
    var calculationSelectionPanel = this.createPanelContent( areaModelCalculationString, panelAlignGroup,
                                                      new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty, selectionButtonAlignGroup ) );
    // TODO: cleanup, let subtypes add bits
    var partitionSelectionPanel = null;
    if ( model instanceof ProportionalAreaModel ) {
      var currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
        derive: 'visiblePartitionOrientationProperty',
        bidirectional: true
      } );
      partitionSelectionPanel = this.createPanelContent( partitionString, panelAlignGroup, new PartitionSelectionNode( currentAreaOrientationProperty, selectionButtonAlignGroup ) );
    }
    var selectionContent = new VBox( {
      spacing: 15
    } );
    var contentChildren = [];
    if ( options.showProductsSelection ) {
      contentChildren.push( productsSelectionPanel );
    }
    if ( options.showCalculationSelection ) {
      contentChildren.push( calculationSelectionPanel );
    }
    // TODO: vary this based on the current area!
    if ( model.currentAreaProperty.value.partitionLineChoice === PartitionLineChoice.ONE ) {
      contentChildren.push( partitionSelectionPanel );
    }
    selectionContent.children = contentChildren;
    // Add separators between items
    for ( var i = 1; i < selectionContent.children.length; i += 2 ) {
      selectionContent.insertChild( i, new Line( {
        x2: AreaModelConstants.PANEL_INTERIOR_MAX,
        stroke: AreaModelColorProfile.selectionSeparatorProperty
      } ) );
    }

    var selectionPanel = new Panel( selectionContent, {
      xMargin: 15,
      yMargin: 10,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty,
      cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS
    } );

    // Create accordion boxes after all group-aligned content is created.
    // TODO: FML. product => factors, area => product.
    var productBox = this.createAccordionBox( options.useSimplifiedNames ? factorsString : dimensionsString, model.productBoxExpanded, productBoxContent );
    var areaBox = this.createAccordionBox( options.useSimplifiedNames ? productString : totalAreaOfModelString, model.totalModelBoxExpanded, areaBoxContent );

    // TODO: sizing
    var layoutNode = this.createLayoutNode && this.createLayoutNode( model, productBox.width ); // TODO: better way

    // @protected {VBox} - Available for suptype positioning relative to this.
    this.panelContainer = new VBox( {
      children: ( layoutNode ? [ layoutNode ] : [] ).concat( [
        productBox,
        areaBox,
      ].concat( options.showCalculationSelection || options.showProductsSelection ? [ selectionPanel ] : [] ) ),
      spacing: AreaModelConstants.PANEL_SPACING
    } );
    this.addChild( new AlignBox( this.panelContainer, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'top',
      margin: AreaModelConstants.PANEL_MARGIN
    } ) );


    // @protected {Node}
    if ( options.useCalculationBox ) {
      var calculationTop = AreaModelConstants.MAIN_AREA_OFFSET.y + AreaModelConstants.AREA_SIZE + AreaModelConstants.PANEL_MARGIN + 30;
      var calculationBottom = this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN - 20;
      this.calculationDisplayPanel = new CalculationBox( model, new Bounds2( 0, 0, AreaModelConstants.AREA_SIZE, calculationBottom - calculationTop ), {
        x: AreaModelConstants.MAIN_AREA_OFFSET.x,
        y: calculationTop
      } );
      // TODO: positioning
    }
    else {
      this.calculationDisplayPanel = new CalculationPanel( model );
    }
    this.addChild( this.calculationDisplayPanel );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      touchAreaDilation: 10,
      right: this.layoutBounds.right - AreaModelConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelConstants.PANEL_MARGIN
    } );
    this.addChild( resetAllButton );

    // @protected {Array.<ProportionalAreaNode>}
    this.areaNodes = model.areas.map( this.createAreaNode.bind( this, model ) );

    this.areaNodes.forEach( function( areaNode ) {
      self.addChild( areaNode );
    } );

    // Only show the current area
    model.currentAreaProperty.link( function( currentArea ) {
      self.areaNodes.forEach( function( areaNode ) {
        areaNode.visible = areaNode.area === currentArea;
      } );
    } );
  }

  areaModelCommon.register( 'AreaScreenView', AreaScreenView );

  return inherit( ScreenView, AreaScreenView, {
    /**
     * Steps the view forward, updating things that only update once a frame.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.calculationDisplayPanel.update();
    },

    /**
     * Creates a panel interior with the title left-aligned, and the content somewhat offset from the left with a
     * guaranteed margin.
     * @private
     *
     * @param {string} titleString
     * @param {AlignGroup} panelAlignGroup
     * @param {Node} content
     */
    createPanelContent: function( titleString, panelAlignGroup, content ) {
      return new VBox( {
        children: [
          new AlignBox( new Text( titleString, {
            font: AreaModelConstants.TITLE_FONT,
            maxWidth: AreaModelConstants.PANEL_INTERIOR_MAX
          } ), {
            group: panelAlignGroup,
            xAlign: 'left'
          } ),
          new AlignBox( content, {
            group: panelAlignGroup,
            xAlign: 'center',
            xMargin: 15
          } )
        ],
        spacing: 10
      } );
    },

    /**
     * Creates an accordion box with common settings.
     * @private
     *
     * @param {string} titleString
     * @param {Property.<boolean>} expandedProperty
     * @param {Node} content
     */
    createAccordionBox: function( titleString, expandedProperty, content ) {
      //TODO: We can resize these now, so set resizable?
      return new AccordionBox( content, {
        titleNode: new Text( titleString, {
          font: AreaModelConstants.TITLE_FONT,
          maxWidth: AreaModelConstants.ACCORDION_BOX_TITLE_MAX
        } ),
        expandedProperty: expandedProperty,
        contentXMargin: 15,
        contentYMargin: 12,
        fill: AreaModelColorProfile.panelBackgroundProperty,
        stroke: AreaModelColorProfile.panelBorderProperty,
        cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
        buttonTouchAreaXDilation: 5,
        buttonTouchAreaYDilation: 5,
        titleAlignX: 'left',

        // TODO: deduplicate AccordionBox options
        titleXSpacing: 8,
        buttonLength: 20,
        buttonXMargin: 10,
        buttonYMargin: 8
      } );
    },

    /**
     * Returns the ideal translation for instances of AreaNode on the main view.
     * @protected
     *
     * @returns {Vector2}
     */
    getAreaTranslation: function() {
      return this.layoutBounds.leftTop.plus( this.useLargeArea ? AreaModelConstants.LARGE_AREA_OFFSET : AreaModelConstants.MAIN_AREA_OFFSET );
    }
  } );
} );
