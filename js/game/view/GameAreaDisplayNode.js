// Copyright 2017-2018, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  var EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var GenericAreaDisplayNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaDisplayNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GameAreaDisplay} areaDisplay
   * @param {Property.<Entry|null>} activeEntryProperty
   * @param {Property.<GameState>} gameStateProperty
   * @param {function} setActiveTerm - function( {Term|null} ) - Called when the value of the edited term should be set.
   */
  function GameAreaDisplayNode( areaDisplay, activeEntryProperty, gameStateProperty, setActiveTerm ) {
    var self = this;

    Node.call( this );

    var singleOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
    var firstOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;
    var fullOffset = AreaModelCommonConstants.AREA_SIZE;

    // Background fill and stroke
    this.addChild( new Rectangle( 0, 0, AreaModelCommonConstants.AREA_SIZE, AreaModelCommonConstants.AREA_SIZE, {
      fill: AreaModelCommonColorProfile.areaBackgroundProperty,
      stroke: AreaModelCommonColorProfile.areaBorderProperty
    } ) );

    this.addChild( GenericAreaDisplayNode.createPartitionLines( areaDisplay.layoutProperty, AreaModelCommonConstants.AREA_SIZE ) );

    // Range views
    var tickVariations = {
      1: [ 0, fullOffset ],
      2: [ 0, singleOffset, fullOffset ],
      3: [ 0, firstOffset, secondOffset, fullOffset ]
    };
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );
      var termListProperty = areaDisplay.totalProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {
        return tickVariations[ layout.getPartitionQuantity( orientation ) ];
      } );
      self.addChild( new RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, false ) );
    } );

    // {OrientationPair.<Array.<Property.<number>>>} - The visual centers of all of the partitions.
    // This duplicates some logic from GenericArea's coordinateRangeProperty handling, but here we need the full-length
    // array every time.
    var centerProperties = OrientationPair.create( function( orientation ) {
      return [
        new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {

          // REVIEW: Perhaps rename var to paritionCount?
          var quantity = layout.getPartitionQuantity( orientation );
          if ( quantity === 1 ) {
            return fullOffset / 2;
          }
          else if ( quantity === 2 ) {
            return singleOffset / 2;
          }
          else if ( quantity === 3 ) {
            return firstOffset / 2;
          }
        } ),
        new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {

          // REVIEW: Same as above
          var quantity = layout.getPartitionQuantity( orientation );
          if ( quantity === 2 ) {
            return ( fullOffset + singleOffset ) / 2;
          }
          else if ( quantity === 3 ) {
            return ( secondOffset + firstOffset ) / 2;
          }
          else {
            return 0; // no need to position here
          }
        } ),
        new Property( ( fullOffset + secondOffset ) / 2 )
      ];
    } );

    // Partition size labels
    Orientation.VALUES.forEach( function( orientation ) {
      _.range( 0, 3 ).forEach( function( partitionIndex ) {
        var entryProperty = new DerivedProperty(
          [ areaDisplay.partitionSizeEntriesProperties.get( orientation ) ],
          function( entries ) {
            return entries[ partitionIndex ] ? entries[ partitionIndex ] : new Entry( null );
          } );
        var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

        var label = new GameEditableLabelNode( {
          entryProperty: entryProperty,
          gameStateProperty: gameStateProperty,
          activeEntryProperty: activeEntryProperty,
          colorProperty: colorProperty,
          allowExponentsProperty: areaDisplay.allowExponentsProperty,
          orientation: orientation
        } );

        label[ orientation.opposite.coordinate ] = AreaModelCommonConstants.PARTITION_OFFSET.get( orientation );
        self.addChild( label );

        centerProperties.get( orientation )[ partitionIndex ].link( function( location ) {
          label[ orientation.coordinate ] = location;
        } );
      } );
    } );

    _.range( 0, 3 ).forEach( function( horizontalIndex ) {
      _.range( 0, 3 ).forEach( function( verticalIndex ) {
        var entryProperty = new DerivedProperty( [ areaDisplay.partialProductEntriesProperty ], function( values ) {
          return ( values[ verticalIndex ] && values[ verticalIndex ][ horizontalIndex ] )
            ? values[ verticalIndex ][ horizontalIndex ]
            : new Entry( null );
        } );

        var colorProperty = new DerivedProperty( [
          entryProperty,
          AreaModelCommonColorProfile.dynamicPartialProductProperty,
          AreaModelCommonColorProfile.fixedPartialProductProperty
        ], function( entry, dynamicColor, fixedColor ) {
          if ( entry && entry.type === EntryType.DYNAMIC ) {
            return dynamicColor;
          }
          else {
            return fixedColor;
          }
        } );

        var label = new GameEditableLabelNode( {
          entryProperty: entryProperty,
          gameStateProperty: gameStateProperty,
          activeEntryProperty: activeEntryProperty,
          colorProperty: colorProperty,
          allowExponentsProperty: areaDisplay.allowExponentsProperty,
          orientation: Orientation.VERTICAL,
          labelFont: AreaModelCommonConstants.GAME_PARTIAL_PRODUCT_LABEL_FONT,
          editFont: AreaModelCommonConstants.GAME_PARTIAL_PRODUCT_EDIT_FONT
        } );
        self.addChild( label );

        centerProperties.horizontal[ horizontalIndex ].linkAttribute( label, 'x' );
        centerProperties.vertical[ verticalIndex ].linkAttribute( label, 'y' );
      } );
    } );

    var digitsProperty = new DerivedProperty( [ activeEntryProperty ], function( entry ) {
      return entry ? entry.digits : 1;
    } );

    var keypadOptions = {
      // padding constant allows it to fit between the area and the other panels
      x: AreaModelCommonConstants.AREA_SIZE + AreaModelCommonConstants.KEYPAD_LEFT_PADDING,
      top: 0
    };
    var noExponentKeypadPanel = new TermKeypadPanel( digitsProperty, false, false, setActiveTerm, keypadOptions );
    var exponentKeypadPanel = new TermKeypadPanel( digitsProperty, true, true, setActiveTerm, keypadOptions );

    this.addChild( noExponentKeypadPanel );
    this.addChild( exponentKeypadPanel );

    noExponentKeypadPanel.visible = false;
    exponentKeypadPanel.visible = false;

    activeEntryProperty.link( function( newEntry ) {
      noExponentKeypadPanel.clear();
      exponentKeypadPanel.clear();

      noExponentKeypadPanel.visible = newEntry !== null && newEntry.inputMethod === InputMethod.CONSTANT;
      exponentKeypadPanel.visible = newEntry !== null && newEntry.inputMethod === InputMethod.TERM;
    } );
  }

  areaModelCommon.register( 'GameAreaDisplayNode', GameAreaDisplayNode );

  return inherit( Node, GameAreaDisplayNode );
} );
