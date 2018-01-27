// Copyright 2017, University of Colorado Boulder

/**
 * Supertype screenview for proportional screens.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaScreenView = require( 'AREA_MODEL_COMMON/common/view/AreaScreenView' );
  var Checkbox = require( 'SUN/Checkbox' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PartitionLineChoice = require( 'AREA_MODEL_COMMON/proportional/enum/PartitionLineChoice' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProportionalAreaModel = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalAreaModel' );
  var ProportionalAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaNode' );
  var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  var ProportionalProductNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalProductNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SceneSelectionNode = require( 'AREA_MODEL_COMMON/proportional/view/SceneSelectionNode' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  var countingToggleString = require( 'string!AREA_MODEL_COMMON/countingToggle' );

  var RADIO_ICON_SIZE = 30;

  /**
   * @constructor
   * @extends {AreaScreenView}
   *
   * @param {AreaModel} model
   * @param {Object} options
   */
  function ProportionalAreaScreenView( model, options ) {
    assert && assert( model instanceof ProportionalAreaModel );

    var self = this;

    options = _.extend( {
      isProportional: true
    }, options );

    AreaScreenView.call( this, model, options );

    // Scene selection
    this.addChild( new SceneSelectionNode( model, {
      top: this.panelContainer.bottom + AreaModelConstants.PANEL_SPACING,
      centerX: this.panelContainer.centerX
    } ) );

    var currentAreaOrientationProperty = new DynamicProperty( model.currentAreaProperty, {
      derive: 'visiblePartitionOrientationProperty',
      bidirectional: true
    } );

    // Radio buttons
    var orientationRadioButtons = OrientationPair.create( function( orientation ) {
      return new AquaRadioButton( currentAreaOrientationProperty, orientation, self.createPartitionOrientationIcon( orientation ), {
        radius: 9
      } );
    } );

    // Checkboxes
    var gridCheckbox = new Checkbox( this.createGridIconNode(), model.gridLinesVisibleProperty );
    var countingCheckbox = new Checkbox( this.createCountingIconNode(), model.countsVisibleProperty );
    var tileCheckbox = new Checkbox( this.createTileIconNode(), model.tilesVisibleProperty );

    var checkboxContainer = new VBox( {
      children: [ gridCheckbox, countingCheckbox, tileCheckbox ],
      align: 'left',
      spacing: 20,
      // Manual positioning works best here
      top: 50,
      left: 600
    } );

    model.currentAreaProperty.link( function( area ) {
      // TODO: some cleanup?
      var children = [];

      if ( area.partitionLineChoice === PartitionLineChoice.ONE ) {
        children.push( orientationRadioButtons.horizontal );
        children.push( orientationRadioButtons.vertical );
      }

      // Don't show the grid/tiles checkboxes if counting is enabled
      if ( !area.countingAvailable ) {
        children.push( gridCheckbox );
        if ( area.tilesAvailable ) {
          children.push( tileCheckbox );
        }
      }
      else {
        children.push( countingCheckbox );
      }
      checkboxContainer.children = children;
    } );

    this.addChild( checkboxContainer );
  }

  areaModelCommon.register( 'ProportionalAreaScreenView', ProportionalAreaScreenView );

  return inherit( AreaScreenView, ProportionalAreaScreenView, {
    /**
     * Steps the view forward, updating things that only update once a frame.
     * @public
     * @override
     *
     * @param {number} dt
     */
    step: function( dt ) {
      AreaScreenView.prototype.step.call( this, dt );

      this.areaNodes.forEach( function( areaNode ) {
        if ( areaNode.visible ) {
          areaNode.update();
        }
      } );
    },

    // TODO: doc, abstract
    createAreaNode: function( model, area ) {
      //TODO: countsVisibleProperty or countingVisibleProperty? decide!
      return new ProportionalAreaNode( area, model.gridLinesVisibleProperty, model.tilesVisibleProperty, model.countsVisibleProperty, model.partialProductsChoiceProperty, this.useTileLikeBackground, this.useLargeArea, {
        translation: this.getAreaTranslation()
      } );
    },

    // TODO: doc
    createProductNode: function( model, decimalPlaces ) {
      return new ProportionalProductNode( model.currentAreaProperty, decimalPlaces );
    },

    /**
     * Creates a grid icon.
     * @private
     *
     * @returns {Node}
     */
    createGridIconNode: function() {
      var gridIconShape = new Shape().moveTo( RADIO_ICON_SIZE / 4, 0 )
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
        stroke: AreaModelColorProfile.gridIconProperty
      } );
    },

    /**
     * Creates an icon showing a switch to partition lines of a given orientation.
     * @private
     *
     * @param {Orientation} orientation
     * @returns {Node}
     */
    createPartitionOrientationIcon: function( orientation ) {
      var size = RADIO_ICON_SIZE * 1.2;
      var background = new Rectangle( 0, 0, size, size, {
        stroke: AreaModelColorProfile.partitionLineIconBorderProperty,
        fill: AreaModelColorProfile.partitionLineIconBackgroundProperty
      } );

      var p1 = new Vector2();
      var p2 = new Vector2();

      p1[ orientation.coordinate ] = size * 2 / 3;
      p2[ orientation.coordinate ] = size * 2 / 3;
      p2[ orientation.opposite.coordinate ] = size * 1.1;

      background.addChild( new Line( p1, p2, {
        stroke: AreaModelColorProfile.partitionLineIconLineProperty
      } ) );

      var handleShape = ProportionalPartitionLineNode.HANDLE_ARROW_SHAPES.get( orientation );

      background.addChild( new Path( handleShape, {
        fill: AreaModelColorProfile.proportionalColorProperties.get( orientation ),
        scale: 0.5,
        translation: p2
      } ) );

      return background;
    },

    /**
     * Creates a tile icon.
     * @private
     *
     * @returns {Node}
     */
    createTileIconNode: function() {
      var tileIconOptions = {
        fill: AreaModelColorProfile.smallTileProperty,
        stroke: AreaModelColorProfile.tileIconStrokeProperty,
        lineWidth: 0.5
      };
      var SMALL_TILE_ICON_SIZE = RADIO_ICON_SIZE / 10;
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
      return new Text( countingToggleString, {
        font: AreaModelConstants.COUNTING_ICON_FONT
      } );
    }
  } );
} );
