// Copyright 2017-2019, University of Colorado Boulder

/**
 * Either a label or an edit readout/button, centered around the origin.
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
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  const EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  const GameState = require( 'AREA_MODEL_COMMON/game/model/GameState' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const Property = require( 'AXON/Property' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );
  const validate = require( 'AXON/validate' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Object} config - See constructor
   */
  function GameEditableLabelNode( config ) {

    config = merge( {
      // required
      entryProperty: null, // {Property.<Entry>}
      gameStateProperty: null, // {Property.<GameState>}
      activeEntryProperty: null, // {Property.<Entry|null>}
      colorProperty: null, // {Property.<Color>}
      allowExponentsProperty: null, // {Property.<boolean>}
      orientation: null, // {Orientation}

      // optional
      labelFont: AreaModelCommonConstants.GAME_MAIN_LABEL_FONT,
      editFont: AreaModelCommonConstants.GAME_MAIN_EDIT_FONT
    }, config );

    assert && assert( config.entryProperty instanceof Property );
    assert && assert( config.gameStateProperty instanceof Property );
    assert && assert( config.activeEntryProperty instanceof Property );
    assert && assert( config.colorProperty instanceof Property );
    assert && assert( config.allowExponentsProperty instanceof Property );
    validate( config.orientation, { validValues: Orientation.VALUES } );

    Node.call( this );

    // Helpful to break out some values
    const entryProperty = config.entryProperty;
    const gameStateProperty = config.gameStateProperty;
    const activeEntryProperty = config.activeEntryProperty;
    const colorProperty = config.colorProperty;
    const allowExponentsProperty = config.allowExponentsProperty;
    const orientation = config.orientation;

    const valueProperty = new DynamicProperty( entryProperty, {
      derive: 'valueProperty',
      bidirectional: true
    } );
    const digitsProperty = new DerivedProperty( [ entryProperty ], _.property( 'digits' ) );
    const statusProperty = new DynamicProperty( entryProperty, {
      derive: 'statusProperty'
    } );
    const isActiveProperty = new DerivedProperty(
      [ entryProperty, activeEntryProperty ],
      function( entry, activeEntry ) {
        return entry === activeEntry;
      } );

    const readoutText = new RichText( '?', {
      fill: colorProperty,
      font: config.labelFont
    } );
    this.addChild( readoutText );

    valueProperty.link( function( termOrList ) {
      readoutText.text = termOrList === null ? '?' : termOrList.toRichString( false );
      readoutText.center = Vector2.ZERO;
    } );

    const textColorProperty = new DerivedProperty(
      [ statusProperty, colorProperty, AreaModelCommonColorProfile.errorStatusProperty ],
      function( highlight, color, errorColor ) {
        if ( highlight === EntryStatus.INCORRECT ) {
          return errorColor;
        }
        else {
          return color;
        }
      } );
    const borderColorProperty = new DerivedProperty( [
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
    const termEditNode = new TermEditNode( new Property( orientation ), valueProperty, {
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
      font: config.editFont
    } );
    this.addChild( termEditNode );

    function centerTermEditNode() {
      termEditNode.center = Vector2.ZERO;
    }

    digitsProperty.link( centerTermEditNode );
    allowExponentsProperty.link( centerTermEditNode );

    Property.multilink( [ entryProperty, gameStateProperty ], function( entry, gameState ) {
      const isReadoutOverride = gameState === GameState.CORRECT_ANSWER || gameState === GameState.SHOW_SOLUTION;
      readoutText.visible = entry.displayType === EntryDisplayType.READOUT ||
                            ( isReadoutOverride && entry.displayType === EntryDisplayType.EDITABLE );
      termEditNode.visible = entry.displayType === EntryDisplayType.EDITABLE && !isReadoutOverride;
    } );
  }

  areaModelCommon.register( 'GameEditableLabelNode', GameEditableLabelNode );

  return inherit( Node, GameEditableLabelNode );
} );
