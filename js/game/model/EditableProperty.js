// Copyright 2017, University of Colorado Boulder

/**
 * A property whose value can be edited, and may be displayed in different ways.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/enum/DisplayType' );
  var GameValue = require( 'AREA_MODEL_COMMON/game/enum/GameValue' );
  var HighlightType = require( 'AREA_MODEL_COMMON/game/enum/HighlightType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/enum/InputMethod' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Property}
   *
   * @param {Term|TermValue|number|null} value - The initial value of the property
   * @param {Object} [options] - Options passed to the Property
   */
  function EditableProperty( value, options ) {
    options = _.extend( {
      // Property option
      useDeepEquality: true,

      // Our options
      gameValue: GameValue.GIVEN,
      displayType: DisplayType.HIDDEN,
      inputMethod: InputMethod.CONSTANT,
      digits: 0
    }, options );

    // Always start off by editing null, and it should be the default value.
    //TODO: do this elsewhere?
    if ( options.displayType === DisplayType.EDITABLE ) {
      value = null;
    }

    Property.call( this, value, options );

    //TODO: cleanup which of these are necessary once game is done

    // @public {GameValue}
    this.gameValue = options.gameValue;

    // @public {DisplayType}
    this.displayType = options.displayType;

    // @public {InputMethod}
    this.inputMethod = options.inputMethod;

    // @public {number}
    this.digits = options.digits;

    // @public {Property.<HighlightType>} - TODO doc
    this.highlightProperty = new Property( HighlightType.DIRTY );

    // TODO doc
    this.nonErrorValueProperty = new DerivedProperty( [ this, this.highlightProperty ], function( value, highlight ) {
      return ( highlight === HighlightType.ERROR ) ? null : value;
    } );
  }

  areaModelCommon.register( 'EditableProperty', EditableProperty );

  return inherit( Property, EditableProperty );
} );
