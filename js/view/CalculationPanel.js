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
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
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
   * @param {Object} [nodeOptions]
   */
  function CalculationPanel( model, nodeOptions ) {

    var self = this;

    Node.call( this );

    // {number|null} - If non-null, contains the line index directly above/below the active index.
    var previousIndexProperty = new Property( null );
    var nextIndexProperty = new Property( null );

    var background = new Rectangle( 0, 0, 0, 0, {
      cornerRadius: 5,
      fill: AreaModelColorProfile.panelBackgroundProperty,
      stroke: AreaModelColorProfile.panelBorderProperty
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

    this.mutate( nodeOptions );


    var lineLayer = new Node();
    this.addChild( lineLayer );

    function update() {
      var isLineByLine = model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE;

      lineLayer.removeAllChildren();

      var activeIndex = isLineByLine ? model.currentAreaProperty.value.calculationIndexProperty.value : undefined;

      var calculationLines = new CalculationLines( model.currentAreaProperty.value, model.allowExponents ).createLines( activeIndex );
      if ( calculationLines.length ) {
        var maxLineWidth = _.reduce( calculationLines, function( max, line ) {
          return Math.max( max, line.node.width );
        }, 0 );

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
          spacing: 1
        } ) );

        if ( isLineByLine ) {
          // TODO: this can cause a full refresh, and should be fixed. Also duplication with above
          model.currentAreaProperty.value.calculationIndexProperty.value = _.find( calculationLines, function( line ) { return line.isActive; } ).index;
        }

        var backgroundBounds = lineLayer.bounds;

        // If we removed lines for the "line-by-line", make sure we take up enough room to not change size.
        if ( backgroundBounds.width < maxLineWidth ) {
          backgroundBounds = backgroundBounds.dilatedX( ( maxLineWidth - backgroundBounds.width ) / 2 );
        }

        // Add some space around the lines
        backgroundBounds = backgroundBounds.dilated( 5 );

        // Add some space for the next/previous buttonss
        if ( isLineByLine ) {
          backgroundBounds.maxX += 25;
        }

        // Minimum width of the area size
        if ( backgroundBounds.width < AreaModelConstants.AREA_SIZE ) {
          backgroundBounds = backgroundBounds.dilatedX( ( AreaModelConstants.AREA_SIZE - backgroundBounds.width ) / 2 );
        }

        // Minimum height
        if ( backgroundBounds.height < 120 ) {
          backgroundBounds = backgroundBounds.dilatedY( ( 120 - backgroundBounds.height ) / 2 );
        }

        background.rectBounds = backgroundBounds;
        previousArrow.rightTop = backgroundBounds.eroded( 5 ).rightTop;
        nextArrow.rightBottom = backgroundBounds.eroded( 5 ).rightBottom;

        // TODO: don't hardcode layoutBounds!
        self.centerY = 618 - AreaModelConstants.PANEL_MARGIN - 75;
        self.centerX = AreaModelConstants.MAIN_AREA_OFFSET.x + AreaModelConstants.AREA_SIZE / 2;
        if ( self.left < AreaModelConstants.PANEL_MARGIN ) {
          self.left = AreaModelConstants.PANEL_MARGIN;
        }
      }

    }

    model.areaCalculationChoiceProperty.link( function( choice ) {
      self.visible = choice !== AreaCalculationChoice.HIDDEN;
      update(); // TODO: extra update on init()?
    } );

    model.currentAreaProperty.link( function( newArea, oldArea ) {
      if ( oldArea ) {
        oldArea.partitions.forEach( function( partition ) {
          partition.sizeProperty.unlink( update );
          partition.visibleProperty.unlink( update );
        } );
        oldArea.calculationIndexProperty.unlink( update );
      }

      newArea.partitions.forEach( function( partition ) {
        partition.sizeProperty.lazyLink( update );
        partition.visibleProperty.lazyLink( update );
      } );
      newArea.calculationIndexProperty.link( update );

      update();
    } );
  }

  areaModelCommon.register( 'CalculationPanel', CalculationPanel );

  return inherit( Node, CalculationPanel, {

  } );
} );
