// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var GenericAreaDisplayNode = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaDisplayNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GameAreaDisplay} display
   * @param {Property.<EditableProperty|null>} activeEditableProperty
   * @param {Property.<GameState>} gameStateProperty
   * @param {function} setActiveTerm - function( {Term|null} ) - Called when the value of the edited term should be set.
   */
  function GameAreaDisplayNode( display, activeEditableProperty, gameStateProperty, setActiveTerm ) {
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

    this.addChild( GenericAreaDisplayNode.createPartitionLines( display.layoutProperty, AreaModelCommonConstants.AREA_SIZE ) );

    // Range views
    var tickVariations = {
      1: [ 0, fullOffset ],
      2: [ 0, singleOffset, fullOffset ],
      3: [ 0, firstOffset, secondOffset, fullOffset ]
    };
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );
      var termListProperty = display.totalProperties.get( orientation );
      var tickLocationsProperty = new DerivedProperty( [ display.layoutProperty ], function( layout ) {
        return tickVariations[ layout.getPartitionQuantity( orientation ) ];
      } );
      self.addChild( new RangeLabelNode( termListProperty, orientation, tickLocationsProperty, colorProperty, false ) );
    } );

    var centerProperties = {}; // TODO: doc key/value
    Orientation.VALUES.forEach( function( orientation ) {
      centerProperties[ orientation === Orientation.HORIZONTAL ] = [
        new DerivedProperty( [ display.layoutProperty ], function( layout ) {
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
        new DerivedProperty( [ display.layoutProperty ], function( layout ) {
          var quantity = layout.getPartitionQuantity( orientation );
          if ( quantity === 2 ) {
            return ( fullOffset + singleOffset ) / 2;
          }
          else if ( quantity === 3 ) {
            return ( secondOffset + firstOffset ) / 2;
          }
          else {
            return 0; // no need to position here?
          }
        } ),
        new Property( ( fullOffset + secondOffset ) / 2 )
      ];
    } );

    // Partition size labels
    Orientation.VALUES.forEach( function( orientation ) {
      _.range( 0, 3 ).forEach( function( partitionIndex ) {
        var valuePropertyProperty = new DerivedProperty( [ display.partitionValuesProperties.get( orientation ) ], function( values ) {
          return values[ partitionIndex ] ? values[ partitionIndex ] : new EditableProperty( null );
        } );
        var colorProperty = AreaModelCommonColorProfile.genericColorProperties.get( orientation );

        var label = new GameEditableLabelNode( valuePropertyProperty, gameStateProperty, activeEditableProperty, colorProperty, display.allowExponentsProperty, orientation, false );

        label[ orientation.opposite.coordinate ] = orientation === Orientation.HORIZONTAL ? -20 : -30;
        self.addChild( label );

        centerProperties[ orientation === Orientation.HORIZONTAL ][ partitionIndex ].link( function( location ) {
          label[ orientation.coordinate ] = location;
        } );
      } );
    } );

    _.range( 0, 3 ).forEach( function( horizontalIndex ) {
      _.range( 0, 3 ).forEach( function( verticalIndex ) {
        var valuePropertyProperty = new DerivedProperty( [ display.partialProductsProperty ], function( values ) {
          return ( values[ verticalIndex ] && values[ verticalIndex ][ horizontalIndex ] ) ? values[ verticalIndex ][ horizontalIndex ] : new EditableProperty( null );
        } );

        var colorProperty = new DerivedProperty( [ valuePropertyProperty, AreaModelCommonColorProfile.dynamicPartialProductProperty ], function( editableProperty, color ) {
          if ( editableProperty && editableProperty.field === Field.DYNAMIC ) {
            return color;
          }
          else {
            return 'black'; // TODO: color profile it?
          }
        } );

        var label = new GameEditableLabelNode( valuePropertyProperty, gameStateProperty, activeEditableProperty, colorProperty, display.allowExponentsProperty, Orientation.VERTICAL, false, {
          labelFont: AreaModelCommonConstants.GAME_PARTIAL_PRODUCT_LABEL_FONT,
          editFont: AreaModelCommonConstants.GAME_PARTIAL_PRODUCT_EDIT_FONT
        } );
        self.addChild( label );

        centerProperties.true[ horizontalIndex ].linkAttribute( label, 'x' );
        centerProperties.false[ verticalIndex ].linkAttribute( label, 'y' );
      } );
    } );

    var digitsProperty = new DerivedProperty( [ activeEditableProperty ], function( editableProperty ) {
      return editableProperty ? editableProperty.digits : 1;
    } );

    var keypadOptions = {
      // TODO: dedup with other keypad?
      x: AreaModelCommonConstants.AREA_SIZE + 25, // padding constant allows it to fit between the area and the other panels
      top: 0
    };
    var noExponentKeypadPanel = new TermKeypadPanel( digitsProperty, false, false, setActiveTerm, keypadOptions );
    var exponentKeypadPanel = new TermKeypadPanel( digitsProperty, true, true, setActiveTerm, keypadOptions );

    this.addChild( noExponentKeypadPanel );
    this.addChild( exponentKeypadPanel );

    noExponentKeypadPanel.visible = false;
    exponentKeypadPanel.visible = false;

    activeEditableProperty.link( function( newEditableProperty ) {
      noExponentKeypadPanel.clear();
      exponentKeypadPanel.clear();

      noExponentKeypadPanel.visible = newEditableProperty !== null && newEditableProperty.inputMethod === InputMethod.CONSTANT;
      exponentKeypadPanel.visible = newEditableProperty !== null && newEditableProperty.inputMethod === InputMethod.TERM;
    } );
  }

  areaModelCommon.register( 'GameAreaDisplayNode', GameAreaDisplayNode );

  return inherit( Node, GameAreaDisplayNode );
} );
