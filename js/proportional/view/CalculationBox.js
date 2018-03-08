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
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CalculationLines = require( 'AREA_MODEL_COMMON/common/view/CalculationLines' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

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

    var margin = 8;

    var lineContainer = new VBox( {
      spacing: 1
    } );

    var alignBox = new AlignBox( lineContainer, {
      // Since our AccorionBox expands by our margin, we need to set content bounds without that
      // TODO: This is an initial "guess". We still need to resize later :(
      alignBounds: bounds.eroded( margin ),

      // TODO: remove need to make this unpickable
      pickable: false
    } );

    AccordionBox.call( this, alignBox, {
      resize: true,
      cornerRadius: 5,
      fill: AreaModelCommonColorProfile.panelBackgroundProperty,
      stroke: AreaModelCommonColorProfile.panelBorderProperty,
      contentXMargin: margin,
      contentYMargin: margin,
      contentXSpacing: -10,
      titleNode: new Text( calculationString, {
        font: AreaModelCommonConstants.TITLE_FONT,
        maxWidth: AreaModelCommonConstants.ACCORDION_BOX_TITLE_MAX
      } ),
      expandedProperty: model.calculationBoxVisibleProperty,
      titleAlignX: 'left',
      cursor: 'pointer',
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,

      // TODO: deduplicate AccordionBox options
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8
    } );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      assert && assert( choice !== AreaCalculationChoice.LINE_BY_LINE, 'Should be HIDDEN or SHOW_ALL_LINES' );
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
    } );

    var dirty = true;

    function makeDirty() {
      dirty = true;
    }

    function update() {
      if ( model.areaCalculationChoiceProperty.value === AreaCalculationChoice.HIDDEN || !dirty ) {
        return;
      }

      dirty = false;

      var calculationLines = new CalculationLines( model.currentAreaProperty.value, model.allowExponents, model.isProportional ).createLines( undefined );

      lineContainer.children = _.map( calculationLines, 'node' );
    }

    model.areaCalculationChoiceProperty.lazyLink( makeDirty );

    // TODO: can we deduplicate this with CalculationPanel?
    model.currentAreaProperty.link( function( newArea, oldArea ) {
      if ( oldArea ) {
        oldArea.allPartitions.forEach( function( partition ) {
          partition.sizeProperty.unlink( makeDirty );
          partition.visibleProperty.unlink( makeDirty );
        } );
        oldArea.calculationIndexProperty.unlink( makeDirty );
      }

      newArea.allPartitions.forEach( function( partition ) {
        partition.sizeProperty.lazyLink( makeDirty );
        partition.visibleProperty.lazyLink( makeDirty );
      } );
      newArea.calculationIndexProperty.link( makeDirty );

      update();
    } );

    //TODO: better
    this.update = update;

    // Resize things so our AccordionBox is the correct size (we can't get bounds correct intially, because of the expand button shifting content)
    alignBox.alignBounds = new Bounds2( 0, 0, alignBox.alignBounds.width - ( this.width - bounds.width ), alignBox.alignBounds.height - ( this.height - bounds.height ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'CalculationBox', CalculationBox );

  return inherit( AccordionBox, CalculationBox );
} );
