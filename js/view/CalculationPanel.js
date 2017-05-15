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
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {AreaModel} model
   * @param {number} width
   * @param {number} height
   * @param {Object} [nodeOptions]
   */
  function CalculationPanel( model, width, height, nodeOptions ) {

    var self = this;

    Node.call( this );

    // {number|null} - If non-null, contains the line index directly above/below the active index.
    var previousIndexProperty = new Property( null );
    var nextIndexProperty = new Property( null );

    var background = new Rectangle( 0, 0, width, height, {
      cornerRadius: 5,
      fill: AreaModelColorProfile.calculationBackgroundProperty,
      stroke: AreaModelColorProfile.calculationBorderProperty
    } );
    this.addChild( background );

    var arrowSize = 18;
    var previousArrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize / 2, -arrowSize * 0.8 ).close(), {
      fill: AreaModelColorProfile.calculationArrowUpProperty,
      cursor: 'pointer'
    } );
    // TODO: add a disabled state to the listener
    var previousListener = new FireListener( {
      fire: function() {
        if ( previousIndexProperty.value !== null ) {
          model.currentAreaProperty.value.calculationIndexProperty.value = previousIndexProperty.value;
        }
      }
    } );
    previousArrow.addInputListener( previousListener );
    previousIndexProperty.link( function( index ) {
      var enabled = index !== null;

      previousListener.interrupt();
      previousArrow.pickable = enabled;
      // TODO: improved coloring or naming
      previousArrow.fill = enabled ? AreaModelColorProfile.calculationArrowUpProperty : AreaModelColorProfile.calculationArrowDisabledProperty;
    } );

    this.addChild( previousArrow );
    var nextArrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize / 2, arrowSize * 0.8 ).close(), {
      fill: AreaModelColorProfile.calculationArrowUpProperty,
      cursor: 'pointer'
    } );
    this.addChild( nextArrow );
    var nextListener = new FireListener( {
      fire: function() {
        if ( nextIndexProperty.value !== null ) {
          model.currentAreaProperty.value.calculationIndexProperty.value = nextIndexProperty.value;
        }
      }
    } );
    nextArrow.addInputListener( nextListener );
    nextIndexProperty.link( function( index ) {
      var enabled = index !== null;

      nextListener.interrupt();
      nextArrow.pickable = enabled;
      // TODO: improved coloring or naming
      nextArrow.fill = enabled ? AreaModelColorProfile.calculationArrowUpProperty : AreaModelColorProfile.calculationArrowDisabledProperty;
    } );

    model.areaCalculationChoiceProperty.link( function( choice ) {
      previousArrow.visible = nextArrow.visible = choice === AreaCalculationChoice.LINE_BY_LINE;
    } );

    previousArrow.rightTop = background.bounds.eroded( 15 ).rightTop;
    nextArrow.rightBottom = background.bounds.eroded( 15 ).rightBottom;


    this.mutate( nodeOptions );


    var lineLayer = new Node();
    this.addChild( lineLayer );

    function update() {
      var isLineByLine = model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE;

      lineLayer.removeAllChildren();

      var activeIndex = isLineByLine ? model.currentAreaProperty.value.calculationIndexProperty.value : undefined;

      var calculationLines = new CalculationLines( model.currentAreaProperty.value, model.allowPowers, model.widthColorProperty, model.heightColorProperty ).createLines( activeIndex );
      if ( calculationLines.length ) {

        if ( isLineByLine ) {
          // TODO: cleanup
          var relativeIndex = _.findIndex( calculationLines, function( line ) { return line.isActive; } );
          var adjacentCalculationLines = [];
          if ( calculationLines[ relativeIndex - 1 ] ) {
            adjacentCalculationLines.push( calculationLines[ relativeIndex - 1 ] );
            previousIndexProperty.value = calculationLines[ relativeIndex - 1 ].index;
          }
          else {
            previousIndexProperty.value = null;
          }
          adjacentCalculationLines.push( calculationLines[ relativeIndex ] );
          if ( calculationLines[ relativeIndex + 1 ] ) {
            adjacentCalculationLines.push( calculationLines[ relativeIndex + 1 ] );
            nextIndexProperty.value = calculationLines[ relativeIndex + 1 ].index;
          }
          else {
            nextIndexProperty.value = null;
          }
          calculationLines = adjacentCalculationLines;
        }

        lineLayer.addChild( new VBox( {
          children: _.map( calculationLines, 'node' ),
          spacing: 1,
          center: background.center
        } ) );

        if ( isLineByLine ) {
          // TODO: this can cause a full refresh, and should be fixed. Also duplication with above
          model.currentAreaProperty.value.calculationIndexProperty.value = _.find( calculationLines, function( line ) { return line.isActive; } ).index;
        }
      }

    }

    model.areaCalculationChoiceProperty.link( function( choice ) {
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
      update(); // TODO: extra update on init()?
    } );

    model.currentAreaProperty.link( function( newArea, oldArea ) {
      if ( oldArea ) {
        oldArea.horizontalPartitions.concat( oldArea.verticalPartitions ).forEach( function( partition ) {
          partition.sizeProperty.unlink( update );
          partition.visibleProperty.unlink( update );
        } );
        oldArea.calculationIndexProperty.unlink( update );
      }

      newArea.horizontalPartitions.concat( newArea.verticalPartitions ).forEach( function( partition ) {
        partition.sizeProperty.lazyLink( update );
        partition.visibleProperty.lazyLink( update );
      } );
      newArea.calculationIndexProperty.link( update );

      update();
    } );
    // area.calculationIndexProperty
  }

  areaModelCommon.register( 'CalculationPanel', CalculationPanel );

  return inherit( Node, CalculationPanel, {

  } );
} );