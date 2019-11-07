// Copyright 2017-2019, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Entry = require( 'AREA_MODEL_COMMON/game/model/Entry' );
  const EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  const GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  const GenericAreaDisplayNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaDisplayNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  const Property = require( 'AXON/Property' );
  const RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );

  // constants
  const MAX_PARTITIONS = 3; // The maximum number of partitions for a specific dimension

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
    const self = this;

    Node.call( this );

    const singleOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
    const firstOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
    const secondOffset = AreaModelCommonConstants.AREA_SIZE * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;
    const fullOffset = AreaModelCommonConstants.AREA_SIZE;

    // Background fill and stroke
    this.addChild( new Rectangle( 0, 0, AreaModelCommonConstants.AREA_SIZE, AreaModelCommonConstants.AREA_SIZE, {
      fill: AreaModelCommonColorProfile.areaBackgroundProperty,
      stroke: AreaModelCommonColorProfile.areaBorderProperty
    } ) );

    this.addChild( GenericAreaDisplayNode.createPartitionLines( areaDisplay.layoutProperty, AreaModelCommonConstants.AREA_SIZE ) );

    // Range views
    const tickVariations = {
      1: [ 0, fullOffset ],
      2: [ 0, singleOffset, fullOffset ],
      3: [ 0, firstOffset, secondOffset, fullOffset ]
    };
    Orientation.VALUES.forEach( function( orientation ) {
      const colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );
      const termListProperty = areaDisplay.totalProperties.get( orientation );
      const tickLocationsProperty = new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {
        return tickVariations[ layout.getPartitionQuantity( orientation ) ];
      } );
      self.addChild( new RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, false ) );
    } );

    // {OrientationPair.<Array.<Property.<number>>>} - The visual centers of all of the partitions.
    // This duplicates some logic from GenericArea's coordinateRangeProperty handling, but here we need the full-length
    // array every time.
    const centerProperties = OrientationPair.create( function( orientation ) {
      return [
        new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {
          const partitionCount = layout.getPartitionQuantity( orientation );
          if ( partitionCount === 1 ) {
            return fullOffset / 2;
          }
          else if ( partitionCount === 2 ) {
            return singleOffset / 2;
          }
          else if ( partitionCount === 3 ) {
            return firstOffset / 2;
          }
        } ),
        new DerivedProperty( [ areaDisplay.layoutProperty ], function( layout ) {
          const partitionCount = layout.getPartitionQuantity( orientation );
          if ( partitionCount === 2 ) {
            return ( fullOffset + singleOffset ) / 2;
          }
          else if ( partitionCount === 3 ) {
            return ( secondOffset + firstOffset ) / 2;
          }
          else {
            return 0; // no need to position here, since this will never be used with a partitionCount of 1
          }
        } ),
        new Property( ( fullOffset + secondOffset ) / 2 )
      ];
    } );

    // Partition size labels
    Orientation.VALUES.forEach( function( orientation ) {
      _.range( 0, MAX_PARTITIONS ).forEach( function( partitionIndex ) {
        const entryProperty = new DerivedProperty(
          [ areaDisplay.partitionSizeEntriesProperties.get( orientation ) ],
          function( entries ) {
            return entries[ partitionIndex ] ? entries[ partitionIndex ] : new Entry( null );
          } );
        const colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

        const label = new GameEditableLabelNode( {
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

    // Labels for each partitioned area
    _.range( 0, MAX_PARTITIONS ).forEach( function( horizontalIndex ) {
      _.range( 0, MAX_PARTITIONS ).forEach( function( verticalIndex ) {
        const entryProperty = new DerivedProperty( [ areaDisplay.partialProductEntriesProperty ], function( values ) {
          return ( values[ verticalIndex ] && values[ verticalIndex ][ horizontalIndex ] )
                 ? values[ verticalIndex ][ horizontalIndex ]
                 : new Entry( null );
        } );

        const colorProperty = new DerivedProperty( [
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

        const label = new GameEditableLabelNode( {
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

    const digitsProperty = new DerivedProperty( [ activeEntryProperty ], function( entry ) {
      return entry ? entry.digits : 1;
    } );

    const keypadOptions = {
      // padding constant allows it to fit between the area and the other panels
      x: AreaModelCommonConstants.AREA_SIZE + AreaModelCommonConstants.KEYPAD_LEFT_PADDING,
      top: 0
    };
    const noExponentKeypadPanel = new TermKeypadPanel( digitsProperty, false, false, setActiveTerm, keypadOptions );
    const exponentKeypadPanel = new TermKeypadPanel( digitsProperty, true, true, setActiveTerm, keypadOptions );

    this.addChild( noExponentKeypadPanel );
    this.addChild( exponentKeypadPanel );

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
