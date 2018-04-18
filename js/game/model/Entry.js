// Copyright 2017-2018, University of Colorado Boulder

/**
 * A logical entry whose value can be edited, and may be displayed in different ways.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  var EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  var EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Term|null} value - The initial value
   * @param {Object} [options]
   */
  function Entry( value, options ) {
    options = _.extend( {
      // Our options
      type: EntryType.GIVEN,
      displayType: EntryDisplayType.HIDDEN,
      inputMethod: InputMethod.CONSTANT,
      digits: 0,
      correctValue: null // Only used for the total coefficients
    }, options );

    // Always start off by editing null, and it should be the default value.
    if ( options.displayType === EntryDisplayType.EDITABLE ) {
      value = null;
    }

    // @public {Property.<Term|null>} - The current value of the entry
    this.valueProperty = new Property( value, {
      useDeepEquality: true,
      isValidValue: Term.isNullableTerm
    } );

    // @public {EntryType} - Whether we are dynamic/editable/given.
    this.type = options.type;

    // @public {EntryDisplayType} - Whether we are a readout or editable/hidden
    this.displayType = options.displayType;

    // @public {InputMethod} - What format should be used if we are edited? (Need different keypads or a polynomial
    // input)
    this.inputMethod = options.inputMethod;

    // @public {number}
    this.digits = options.digits;

    // @public {Term|null}
    this.correctValue = options.correctValue;

    // @public {Property.<EntryStatus>}
    this.statusProperty = new Property( EntryStatus.DIRTY );

    // @public {Property.<Term|null>} - Our value, except for null if there is an error highlight
    this.nonErrorValueProperty = new DerivedProperty( [ this.valueProperty, this.statusProperty ], function( value, highlight ) {
      return ( highlight === EntryStatus.ERROR ) ? null : value;
    } );
  }

  areaModelCommon.register( 'Entry', Entry );

  return inherit( Object, Entry );
} );
