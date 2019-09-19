// Copyright 2018-2019, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/model/AreaCalculationChoice' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonAccordionBox = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonAccordionBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CalculationLinesNode = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLinesNode' );
  const inherit = require( 'PHET_CORE/inherit' );

  // strings
  const calculationString = require( 'string!AREA_MODEL_COMMON/calculation' );

  // a11y strings
  const calculationBoxTitleString = AreaModelCommonA11yStrings.calculationBoxTitle.value;
  const calculationBoxDescriptionString = AreaModelCommonA11yStrings.calculationBoxDescription.value;

  // constants
  const MARGIN = 8;

  /**
   * @constructor
   * @extends {AreaModelCommonAccordionBox}
   *
   * @param {ProportionalAreaModel} model
   * @param {Bounds2} bounds - Where to lay out the box in view space
   * @param {Object} [nodeOptions]
   */
  function CalculationBox( model, bounds, nodeOptions ) {

    const self = this;

    // @private {ProportionalAreaModel}
    this.model = model;

    // @private {CalculationLinesNode}
    this.calculationLinesNode = new CalculationLinesNode( model );

    const alignBox = new AlignBox( this.calculationLinesNode, {
      // Since our AccordionBox expands by our MARGIN, we need to set content bounds without that
      alignBounds: bounds.eroded( MARGIN ),
      pickable: false
    } );

    AreaModelCommonAccordionBox.call( this, calculationString, model.calculationBoxVisibleProperty, alignBox, {
      // Different margins than our other accordion boxes
      contentXMargin: MARGIN,
      contentYMargin: MARGIN,

      // Different spacing
      maxTitleWidth: 290,

      // We don't have room for the normal spacing, so we need to make things closer together than they normally are.
      contentXSpacing: -10,

      // a11y
      labelTagName: 'h3',
      labelContent: calculationBoxTitleString,
      titleBarOptions: {
        descriptionContent: calculationBoxDescriptionString
      }
    } );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      assert && assert( choice !== AreaCalculationChoice.LINE_BY_LINE, 'Should be HIDDEN or SHOW_ALL_LINES' );
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
    } );

    // Resize things so our AccordionBox is the correct size (we can't get bounds correct initially, because of the
    // expand button shifting content)
    alignBox.alignBounds = new Bounds2(
      0,
      0,
      alignBox.alignBounds.width - ( this.width - bounds.width ),
      alignBox.alignBounds.height - ( this.height - bounds.height )
    );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'CalculationBox', CalculationBox );

  return inherit( AreaModelCommonAccordionBox, CalculationBox, {
    /**
     * Updates the content of the calculation box (if needed).
     * @public
     */
    update: function() {
      this.calculationLinesNode.update();
    }
  } );
} );
