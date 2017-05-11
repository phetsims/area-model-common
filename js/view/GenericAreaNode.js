// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PartialProductsLabel = require( 'AREA_MODEL_COMMON/view/PartialProductsLabel' );
  var Polynomial = require( 'AREA_MODEL_COMMON/model/Polynomial' ); // TODO: don't require this for toRichString!
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var TermAccumulator = require( 'AREA_MODEL_COMMON/view/TermAccumulator' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var enterString = require( 'string!AREA_MODEL_COMMON/enter' );

  /**
   * @constructor
   *
   * TODO: reduce to options object
   * @param {GenericArea} area
   * @param {boolean} allowPowers - Whether the user is able to add powers of x.
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaNode( area, allowPowers, widthColorProperty, heightColorProperty, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof GenericArea );
    assert && assert( typeof allowPowers === 'boolean' );

    var self = this;

    AreaNode.call( this, area );

    // TODO: should be deprecated in this location, grab locations from the model???
    var firstOffset = this.viewSize * 0.55;
    var secondOffset = this.viewSize * 0.83;

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.addChild( background );

    function addDock( x, y, property ) {
      self.addChild( new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        x: x,
        y: y,
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              property.toggle();
            }
          } )
        ]
      } ) );
    }
    addDock( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.firstHorizontalPartitionLineActiveProperty );
    addDock( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.secondHorizontalPartitionLineActiveProperty );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, area.firstVerticalPartitionLineActiveProperty );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, area.secondVerticalPartitionLineActiveProperty );

    function addPartitionLine( x1, y1, x2, y2, property, colorProperty ) {
      var node = new Node( {
        children: [
          new Line( x1, y1, x2, y2, {
            stroke: AreaModelColorProfile.partitionLineStrokeProperty
          } ),
          new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
            x: x1,
            y: y1,
            fill: colorProperty,
            stroke: AreaModelColorProfile.partitionLineBorderProperty
          } )
        ]
      } );
      property.linkAttribute( node, 'visible' );
      self.addChild( node );
    }

    // TODO: consolidate with adding docks
    addPartitionLine( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, area.firstHorizontalPartitionLineActiveProperty, widthColorProperty );
    addPartitionLine( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, area.secondHorizontalPartitionLineActiveProperty, widthColorProperty );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, firstOffset, area.firstVerticalPartitionLineActiveProperty, heightColorProperty );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, secondOffset, area.secondVerticalPartitionLineActiveProperty, heightColorProperty );

    // TODO: refactor/cleanup
    function createEditButton( BoxType, partition, digitCount, colorProperty ) {

      // TODO: better way to test for size
      var sampleString;
      if ( allowPowers ) {
        sampleString = '-9x<sup>2</sup>';
      }
      else {
        // TODO: consider using \u2212
        sampleString = '-' + _.range( 0, digitCount ).map( function() { return '9'; } ).join( '' );
      }
      var richText = new RichText( sampleString, {
        fill: colorProperty,
        font: AreaModelConstants.EDIT_READOUT_FONT
      } );

      var background = new Rectangle( 0, 0, richText.width + 10, richText.height + 5, {
        stroke: colorProperty,
        cornerRadius: 4,
        children: [
          richText
        ]
      } );

      partition.sizeProperty.link( function( size ) {
        if ( size === null ) {
          richText.text = '';
        }
        else {
          richText.text = new Polynomial( [ size ] ).toRichString();
          richText.center = background.selfBounds.center;
        }
      } );

      area.activePartitionProperty.link( function( activePartition ) {
        background.fill = activePartition === partition ? AreaModelColorProfile.editActiveBackgroundProperty
                                                        : AreaModelColorProfile.editInactiveBackgroundProperty;
      } );

      var box = new BoxType( {
        spacing: 7,
        children: [
          background,
          new MutableOptionsNode( RectangularPushButton, [], {
            content: new FontAwesomeNode( 'pencil_square_o', {
              scale: 0.4
            } ),
            listener: function() {
              area.activePartitionProperty.value = partition;
            }
          }, {
            baseColor: AreaModelColorProfile.editButtonBackgroundProperty
          } )
        ]
      } );
      self.addChild( box );

      var primaryName = partition.isHorizontal ? 'centerX' : 'centerY';

      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          box[ primaryName ] = range.getCenter() * self.viewSize;
        }
      } );
      if ( partition.isHorizontal ) {
        box.centerY = -20;
      }
      else {
        box.centerX = -30;
      }
      partition.visibleProperty.linkAttribute( box, 'visible' );
    }

    createEditButton( HBox, area.leftPartition, 3, widthColorProperty );
    createEditButton( HBox, area.middleHorizontalPartition, 2, widthColorProperty );
    createEditButton( HBox, area.rightPartition, 1, widthColorProperty );
    createEditButton( VBox, area.topPartition, 3, heightColorProperty );
    createEditButton( VBox, area.middleVerticalPartition, 2, heightColorProperty );
    createEditButton( VBox, area.bottomPartition, 1, heightColorProperty );

    // TODO: reuse these from keypad?
    var PLUS_CHAR = '\u002b';
    var MINUS_CHAR = '\u2212';

    var noPowerLayout = [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
    ];
    // TODO: make note about Key's type docs for the first parameter
    var powerLayout = [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ],
      [ null, new Key( new RichText( 'x<sup>2</sup>', { font: AreaModelConstants.KEYPAD_FONT } ), Keys.XSQUARED ), new Key( 'x', Keys.X ) ],
    ];

    // TODO: pass number of digits allowed
    var termAccumulator = new TermAccumulator();

    var keypad = new Keypad( allowPowers ? powerLayout : noPowerLayout, {
      accumulator: termAccumulator
    } );

    var readout = new RichText( '', {
      font: AreaModelConstants.KEYPAD_READOUT_FONT
    } );
    termAccumulator.termProperty.link( function( term ) {
      readout.text = term === null ? ' ' : new Polynomial( [ term ] ).toRichString();
    } );

    var keypadPanel = new Panel( new VBox( {
      children: [
        readout, // TODO: wrap in a border
        keypad,
        new RectangularPushButton( {
          content: new Text( enterString, { font: AreaModelConstants.KEYPAD_FONT } ),
          baseColor: 'white',
          xMargin: 15,
          yMargin: 5,
          listener: function() {
            area.activePartitionProperty.value.sizeProperty.value = termAccumulator.termProperty.value;
            area.activePartitionProperty.value = null;
          }
        } )
      ],
      spacing: 10
    } ), {
      x: this.viewSize + 35,
      cornerRadius: 5,
      xMargin: 15,
      yMargin: 15,
      centerY: this.viewSize / 2,
      fill: AreaModelColorProfile.keypadPanelBackgroundProperty,
      stroke: AreaModelColorProfile.keypadPanelBorderProperty
    } );
    this.addChild( keypadPanel );

    area.activePartitionProperty.link( function( newArea ) {
      keypadPanel.visible = newArea !== null;
      keypad.clear();
    } );

    // TODO: remove duplication with proportional (only changed to true and MVT)
    area.partitionedAreas.forEach( function( partitionedArea ) {
      var productLabel = new PartialProductsLabel( partialProductsChoiceProperty, partitionedArea, true );
      self.addChild( productLabel );
      partitionedArea.horizontalPartition.coordinateRangeProperty.link( function( horizontalRange ) {
        if ( horizontalRange !== null ) {
          productLabel.x = self.viewSize * horizontalRange.getCenter();
        }
      } );
      partitionedArea.verticalPartition.coordinateRangeProperty.link( function( verticalRange ) {
        if ( verticalRange !== null ) {
          productLabel.y = self.viewSize * verticalRange.getCenter();
        }
      } );
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaNode', GenericAreaNode );

  return inherit( AreaNode, GenericAreaNode );
} );
