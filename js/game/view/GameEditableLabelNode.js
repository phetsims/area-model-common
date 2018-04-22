// Copyright 2017-2018, University of Colorado Boulder

/**
 * Either a label or an edit readout/button, centered around the origin.
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
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  var EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  var GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Object} options - See constructor
   */
  function GameEditableLabelNode( options ) {

    options = _.extend( {
      // REQUIRED options (yes, I know it's an oxymoron, and I'd like to have a better name for this options)
      // REVIEW: Move to the new config pattern
      // They are marked as null for now
      entryProperty: null, // {Property.<Entry>}
      gameStateProperty: null, // {Property.<GameState>}
      activeEntryProperty: null, // {Property.<Entry|null>}
      colorProperty: null, // {Property.<Color>}
      allowExponentsProperty: null, // {Property.<boolean>}
      orientation: null, // {Orientation}

      labelFont: AreaModelCommonConstants.GAME_MAIN_LABEL_FONT,
      editFont: AreaModelCommonConstants.GAME_MAIN_EDIT_FONT
    }, options );

    Node.call( this );

    // Helpful to break out some options
    var entryProperty = options.entryProperty;
    var gameStateProperty = options.gameStateProperty;
    var activeEntryProperty = options.activeEntryProperty;
    var colorProperty = options.colorProperty;
    var allowExponentsProperty = options.allowExponentsProperty;
    var orientation = options.orientation;

    var valueProperty = new DynamicProperty( entryProperty, {
      derive: 'valueProperty',
      bidirectional: true
    } );
    var digitsProperty = new DerivedProperty( [ entryProperty ], _.property( 'digits' ) );
    var statusProperty = new DynamicProperty( entryProperty, {
      derive: 'statusProperty'
    } );
    var isActiveProperty = new DerivedProperty(
      [ entryProperty, activeEntryProperty ],
      function( entry, activeEntry ) {
        return entry === activeEntry;
      } );

    var readoutText = new RichText( '?', {
      fill: colorProperty,
      font: options.labelFont
    } );
    this.addChild( readoutText );

    valueProperty.link( function( termOrList ) {
      readoutText.text = termOrList === null ? '?' : termOrList.toRichString( false );
      readoutText.center = Vector2.ZERO;
    } );

    var textColorProperty = new DerivedProperty(
      [ statusProperty, colorProperty, AreaModelCommonColorProfile.errorStatusProperty ],
      function( highlight, color, errorColor ) {
        if ( highlight === EntryStatus.ERROR ) {
          return errorColor;
        }
        else {
          return color;
        }
      } );
    var borderColorProperty = new DerivedProperty( [
      statusProperty,
      colorProperty,
      AreaModelCommonColorProfile.errorStatusProperty,
      AreaModelCommonColorProfile.dirtyStatusProperty
    ], function( highlight, color, errorColor, dirtyColor ) {
      if ( highlight === EntryStatus.NORMAL ) {
        return color;
      }
      else if ( highlight === EntryStatus.DIRTY ) {
        return dirtyColor;
      }
      else {
        return errorColor;
      }
    } );
    var termEditNode = new TermEditNode( new Property( orientation ), valueProperty, {
      textColorProperty: textColorProperty,
      borderColorProperty: borderColorProperty,
      isActiveProperty: isActiveProperty,
      digitCountProperty: digitsProperty,
      allowExponentsProperty: allowExponentsProperty,
      editCallback: function() {
        if ( gameStateProperty.value === GameState.WRONG_FIRST_ANSWER ) {
          gameStateProperty.value = GameState.SECOND_ATTEMPT;
        }
        if ( activeEntryProperty.value !== entryProperty.value ) {
          activeEntryProperty.value = entryProperty.value;
        }
        else {
          // Pressing on the edit button when that keypad is already open will instead close the keypad.
          // See https://github.com/phetsims/area-model-common/issues/127
          activeEntryProperty.value = null;
        }
      },
      font: options.editFont
    } );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }

    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    Property.multilink( [ entryProperty, gameStateProperty ], function( entry, gameState ) {
      var isReadoutOverride = gameState === GameState.CORRECT_ANSWER || gameState === GameState.SHOW_SOLUTION;
      readoutText.visible = entry.displayType === EntryDisplayType.READOUT ||
                            ( isReadoutOverride && entry.displayType === EntryDisplayType.EDITABLE );
      termEditNode.visible = entry.displayType === EntryDisplayType.EDITABLE && !isReadoutOverride;
    } );
  }

  areaModelCommon.register( 'GameEditableLabelNode', GameEditableLabelNode );

  return inherit( Node, GameEditableLabelNode );
} );
