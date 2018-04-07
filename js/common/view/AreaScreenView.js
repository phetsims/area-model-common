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
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaModelCommonModel = require( 'AREA_MODEL_COMMON/common/model/AreaModelCommonModel' );
  var AreaModelCommonGlobals = require( 'AREA_MODEL_COMMON/common/AreaModelCommonGlobals' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CalculationBox = require( 'AREA_MODEL_COMMON/proportional/view/CalculationBox' );
  var CalculationPanel = require( 'AREA_MODEL_COMMON/common/view/CalculationPanel' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
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
   * @extends {ScreenView}
   *
   * @param {AreaModelCommonModel} model
   * @param {Object} [options]
   */
  function AreaScreenView( model, options ) {
    var self = this;

    options = _.extend( {
      decimalPlaces: 0, // {number} - How many decimal places should be shown
      showProductsSelection: true, // {boolean} - Whether we show options that let the user select the partial product style
      showCalculationSelection: true, // {boolean} - Whether we show options that let the user select the calculation style
      useTileLikeBackground: false, // {boolean} - Selected area background and products box use a light-tile-colored background
      useSimplifiedNames: false, // {boolean} - Uses "product" and "factors" to be simpler and more multiplication-like
      useLargeArea: false, // {boolean} - If true, changes the location/size of the area to take up more space
      useCalculationBox: false // {boolean} - If true, a simplified accordion box will be used for the calculation lines
    }, options );

    assert && assert( model instanceof AreaModelCommonModel );
    assert && assert( typeof options.decimalPlaces === 'number' );

    ScreenView.call( this );

    // @protected {AreaModelCommonModel}
    this.model = model;

    // @protected {boolean}
    this.useTileLikeBackground = options.useTileLikeBackground;
    this.useLargeArea = options.useLargeArea;
    this.showProductsSelection = options.showProductsSelection;
    this.showCalculationSelection = options.showCalculationSelection;

    var panelAlignGroup = AreaModelCommonGlobals.panelAlignGroup;

    var selectionButtonAlignGroup = new AlignGroup();

    // TODO: don't require this ordering of creation just for sizing. creating the "bigger" one first
    // @public {Node} - Exposed for a11y selection
    this.productsSelectionPanel = this.createPanelContent( partialProductsString, panelAlignGroup,
                                                           new PartialProductSelectionNode( model, selectionButtonAlignGroup ) );
    this.calculationSelectionPanel = this.createPanelContent( areaModelCalculationString, panelAlignGroup,
                                                              new AreaCalculationSelectionNode( model.areaCalculationChoiceProperty, selectionButtonAlignGroup ) );
    // TODO: cleanup, let subtypes add bits
    // @public {Node|null}
    this.partitionSelectionPanel = null;
    if ( model instanceof ProportionalAreaModel ) {
      var currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
        derive: 'visiblePartitionOrientationProperty',
        bidirectional: true
      } );
      this.partitionSelectionPanel = this.createPanelContent( partitionString, panelAlignGroup, new PartitionSelectionNode( currentAreaOrientationProperty, selectionButtonAlignGroup ) );
    }
    var selectionContent = new VBox( {
      spacing: 15
    } );
    // Use a Property here so we don't recreate when we don't have to (just on area changes)
    var hasPartitionSelectionProperty = new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
      return area.partitionLineChoice === PartitionLineChoice.ONE;
    } );
    hasPartitionSelectionProperty.link( function( hasPartitionSelection ) {
      var contentChildren = [];
      if ( options.showProductsSelection ) {
        contentChildren.push( self.productsSelectionPanel );
      }
      if ( options.showCalculationSelection ) {
        contentChildren.push( self.calculationSelectionPanel );
      }
      if ( hasPartitionSelection ) {
        contentChildren.push( self.partitionSelectionPanel );
      }
      selectionContent.children = contentChildren;
      // Add separators between items
      for ( var i = 1; i < selectionContent.children.length; i += 2 ) {
        selectionContent.insertChild( i, new Line( {
          x2: AreaModelCommonConstants.PANEL_INTERIOR_MAX,
          stroke: AreaModelCommonColorProfile.selectionSeparatorProperty
        } ) );
      }
    } );

    // @protected {Node} - Shows radio button groups to select partial product / calculation / partition line options.
    this.selectionPanel = new Panel( selectionContent, {
      xMargin: 15,
      yMargin: 10,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty,
      cornerRadius: AreaModelCommonConstants.PANEL_CORNER_RADIUS
    } );

    var factorsBoxContent = new AlignBox( this.createFactorsNode( model, options.decimalPlaces ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    // @protected {Node} - Exposed for a11y order
    this.factorsBox = this.createAccordionBox( options.useSimplifiedNames ? factorsString : dimensionsString, model.factorsBoxExpanded, factorsBoxContent, {
      // Cut some spacing from the exponent-enabled one, as it looks like way too much padding otherwise
      contentYSpacing: model.allowExponents ? 5 : 8
    } );

    var areaBoxContent = new AlignBox( new TotalAreaNode( model.totalAreaProperty, model.isProportional, model.isProportional ? model.getMaximumAreaString() : '', this.useTileLikeBackground ), {
      group: panelAlignGroup,
      xAlign: 'center'
    } );
    // @protected {Node} - Exposed for a11y order
    this.areaBox = this.createAccordionBox( options.useSimplifiedNames ? productString : totalAreaOfModelString, model.areaBoxExpanded, areaBoxContent );

    // @protected {VBox} - Available for subtype positioning relative to this.
    this.rightPanelContainer = new VBox( {
      children: this.getRightSideNodes(),
      spacing: AreaModelCommonConstants.PANEL_SPACING
    } );
    this.addChild( new AlignBox( this.rightPanelContainer, {
      alignBounds: this.layoutBounds,
      xAlign: 'right',
      yAlign: 'top',
      margin: AreaModelCommonConstants.PANEL_MARGIN
    } ) );

    // @protected {Node|null} - The calculation panel/box near the bottom of the screen
    this.calculationNode = null;
    if ( options.useCalculationBox ) {
      var calculationTop = AreaModelCommonConstants.MAIN_AREA_OFFSET.y + AreaModelCommonConstants.AREA_SIZE + AreaModelCommonConstants.PANEL_MARGIN + 30;
      var calculationBottom = this.layoutBounds.bottom - AreaModelCommonConstants.PANEL_MARGIN;
      this.calculationNode = new CalculationBox( model, new Bounds2( 0, 0, AreaModelCommonConstants.AREA_SIZE, calculationBottom - calculationTop ), {
        x: AreaModelCommonConstants.MAIN_AREA_OFFSET.x,
        y: calculationTop
      } );
    }
    else {
      this.calculationNode = new CalculationPanel( model );
    }
    this.addChild( this.calculationNode );

    // @protected {Node} - Reset all button
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      touchAreaDilation: 10,
      right: this.layoutBounds.right - AreaModelCommonConstants.PANEL_MARGIN,
      bottom: this.layoutBounds.bottom - AreaModelCommonConstants.PANEL_MARGIN
    } );
    this.addChild( this.resetAllButton );

    // @protected {AreaDisplayNode}
    this.areaDisplayNode = this.createAreaDisplayNode( model );
    this.addChild( this.areaDisplayNode );
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
      this.calculationNode.update();
    },

    /**
     * The content on the right side varies depending on the subtype, so we provide overriding here.
     * @protected
     *
     * @returns {Array.<Node>}
     */
    getRightSideNodes: function() {
      var children = [
        this.factorsBox,
        this.areaBox
      ];
      if ( this.showCalculationSelection || this.showProductsSelection ) {
        children.push( this.selectionPanel );
      }
      return children;
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
            font: AreaModelCommonConstants.TITLE_FONT,
            maxWidth: AreaModelCommonConstants.PANEL_INTERIOR_MAX
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
     * @param {Object} [options]
     */
    createAccordionBox: function( titleString, expandedProperty, content, options ) {
      return new AccordionBox( content, _.extend( {}, AreaModelCommonConstants.ACCORDION_BOX_OPTIONS, {
        titleNode: new Text( titleString, {
          font: AreaModelCommonConstants.TITLE_FONT,
          maxWidth: AreaModelCommonConstants.ACCORDION_BOX_TITLE_MAX
        } ),
        expandedProperty: expandedProperty,
        contentXMargin: 15,
        contentYMargin: 12
      }, options ) );
    },

    /**
     * Returns the ideal translation for instances of AreaDisplayNode on the main view.
     * @protected
     *
     * @returns {Vector2}
     */
    getDisplayTranslation: function() {
      return this.layoutBounds.leftTop.plus( this.useLargeArea ? AreaModelCommonConstants.LARGE_AREA_OFFSET : AreaModelCommonConstants.MAIN_AREA_OFFSET );
    },

    /**
     * Creates the "factors" (dimensions) content for the accordion box.
     * @public
     *
     * @param {AreaModelCommonModel} model
     * @param {number} decimalPlaces
     * @returns {Node}
     */
    createFactorsNode: function( model, decimalPlaces ) {
      throw new Error( 'abstract method, should be implemented by subtype' );
    },

    /**
     * Creates the main area display view for the screen.
     * @public
     *
     * @param {AreaModelCommonModel} model
     * @returns {AreaDisplayNode}
     */
    createAreaDisplayNode: function( model ) {
      throw new Error( 'abstract method, should be implemented by subtype' );
    }
  } );
} );
