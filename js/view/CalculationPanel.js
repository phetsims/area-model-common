// Copyright 2017, University of Colorado Boulder

/**
 * Shows the calculation of total area from each of the partitions' sizes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/model/AreaCalculationChoice' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   *
   * @param {Property.<AreaCalculationChoice>} areaCalculationChoiceProperty
   * @param {Property.<Area>} currentAreaProperty
   * @param {boolean} allowPowers
   * @param {Object} [nodeOptions]
   */
  function CalculationPanel( areaCalculationChoiceProperty, currentAreaProperty, allowPowers, nodeOptions ) {
    assert && assert( typeof allowPowers === 'boolean' );

    var self = this;

    Node.call( this );

    var background = new Rectangle( 0, 0, 600, 90, {
      cornerRadius: 5,
      fill: AreaModelColorProfile.calculationBackgroundProperty,
      stroke: AreaModelColorProfile.calculationBorderProperty
    } );
    this.addChild( background );

    this.mutate( nodeOptions );

    areaCalculationChoiceProperty.link( function( choice ) {
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
    } );
  }

  areaModelCommon.register( 'CalculationPanel', CalculationPanel );

  return inherit( Node, CalculationPanel );
} );
