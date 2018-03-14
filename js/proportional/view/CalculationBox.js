// Copyright 2017, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/enum/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CalculationLinesNode = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationLinesNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var calculationString = require( 'string!AREA_MODEL_COMMON/calculation' );

  /**
   * @constructor
   * @extends {AccordionBox}
   *
   * @param {ProportionalAreaModel} model
   * @param {Bounds2} bounds - Where to lay out the box in view space TODO: Pass Dimension2 instead, we don't use x/y really
   * @param {Object} [nodeOptions]
   */
  function CalculationBox( model, bounds, nodeOptions ) {

    var self = this;

    // @private {ProportionalAreaModel}
    this.model = model;

    // @private {CalculationLinesNode}
    this.calculationLinesNode = new CalculationLinesNode( model );

    var margin = 8;

    var alignBox = new AlignBox( this.calculationLinesNode, {
      // Since our AccorionBox expands by our margin, we need to set content bounds without that
      alignBounds: bounds.eroded( margin ),
      pickable: false
    } );

    AccordionBox.call( this, alignBox, _.extend( {}, AreaModelCommonConstants.ACCORDION_BOX_OPTIONS, {
      titleNode: new Text( calculationString, {
        font: AreaModelCommonConstants.TITLE_FONT,
        maxWidth: AreaModelCommonConstants.ACCORDION_BOX_TITLE_MAX
      } ),
      expandedProperty: model.calculationBoxVisibleProperty,
      contentXMargin: margin,
      contentYMargin: margin,
      contentXSpacing: -10
    } ) );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      assert && assert( choice !== AreaCalculationChoice.LINE_BY_LINE, 'Should be HIDDEN or SHOW_ALL_LINES' );
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
    } );

    // Resize things so our AccordionBox is the correct size (we can't get bounds correct intially, because of the expand button shifting content)
    alignBox.alignBounds = new Bounds2( 0, 0, alignBox.alignBounds.width - ( this.width - bounds.width ), alignBox.alignBounds.height - ( this.height - bounds.height ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'CalculationBox', CalculationBox );

  return inherit( AccordionBox, CalculationBox, {
    /**
     * Updates the content of the calculation box (if needed).
     * @public
     */
    update: function() {
      this.calculationLinesNode.update();
    }
  } );
} );
