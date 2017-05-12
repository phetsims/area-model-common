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
  var CalculationLines = require( 'AREA_MODEL_COMMON/view/CalculationLines' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   *
   * TODO: options object
   *
   * @param {Property.<AreaCalculationChoice>} areaCalculationChoiceProperty
   * @param {Property.<Area>} currentAreaProperty
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   * @param {boolean} allowPowers
   * @param {Object} [nodeOptions]
   */
  function CalculationPanel( areaCalculationChoiceProperty, currentAreaProperty, widthColorProperty, heightColorProperty, allowPowers, nodeOptions ) {
    assert && assert( typeof allowPowers === 'boolean' );

    var self = this;

    Node.call( this );

    var background = new Rectangle( 0, 0, 800, 150, {
      cornerRadius: 5,
      fill: AreaModelColorProfile.calculationBackgroundProperty,
      stroke: AreaModelColorProfile.calculationBorderProperty
    } );
    this.addChild( background );

    this.mutate( nodeOptions );



    var lineLayer = new Node();
    this.addChild( lineLayer );

    function update() {
      lineLayer.removeAllChildren();

      var calculationLines = new CalculationLines( currentAreaProperty.value, allowPowers, widthColorProperty, heightColorProperty ).createLines( undefined );
      if ( calculationLines.length ) {
        lineLayer.addChild( new VBox( {
          children: calculationLines,
          spacing: 1,
          center: background.center
        } ) );
      }
    }

    areaCalculationChoiceProperty.link( function( choice ) {
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
      update(); // TODO: extra update on init()?
    } );

    currentAreaProperty.link( function( newArea, oldArea ) {
      if ( oldArea ) {
        oldArea.horizontalPartitions.concat( oldArea.verticalPartitions ).forEach( function( partition ) {
          partition.sizeProperty.unlink( update );
          partition.visibleProperty.unlink( update );
        } );
      }

      newArea.horizontalPartitions.concat( newArea.verticalPartitions ).forEach( function( partition ) {
        partition.sizeProperty.lazyLink( update );
        partition.visibleProperty.lazyLink( update );
      } );

      update();
    } );
    // area.calculationIndexProperty
  }

  areaModelCommon.register( 'CalculationPanel', CalculationPanel );

  return inherit( Node, CalculationPanel, {

  } );
} );
