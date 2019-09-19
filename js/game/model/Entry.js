// Copyright 2017-2018, University of Colorado Boulder

/**
 * A logical entry whose value can be edited, and may be displayed in different ways.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EntryDisplayType = require( 'AREA_MODEL_COMMON/game/model/EntryDisplayType' );
  const EntryStatus = require( 'AREA_MODEL_COMMON/game/model/EntryStatus' );
  const EntryType = require( 'AREA_MODEL_COMMON/game/model/EntryType' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  const Property = require( 'AXON/Property' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Term|null} value - The initial value
   * @param {Object} [options]
   */
  function Entry( value, options ) {
    options = _.extend( {
      type: EntryType.GIVEN,
      displayType: EntryDisplayType.HIDDEN,
      inputMethod: InputMethod.CONSTANT,
      numberOfDigits: 0,
      correctValue: null // Only used for the total coefficients
    }, options );

    // Always start off by editing null, and it should be the default value.
    if ( options.displayType === EntryDisplayType.EDITABLE ) {
      value = null;
    }

    // @public {Property.<Term|null>} - The current value of the entry
    this.valueProperty = new Property( value, {
      useDeepEquality: true,
      isValidValue: Term.isTermOrNull
    } );

    // @public {EntryType} - Whether we are dynamic/editable/given.
    this.type = options.type;

    // @public {EntryDisplayType} - Whether we are a readout or editable/hidden
    this.displayType = options.displayType;

    // @public {InputMethod} - What format should be used if we are edited? (Need different keypads or a polynomial
    // input)
    this.inputMethod = options.inputMethod;

    // @public {number}
    this.digits = options.numberOfDigits;

    // @public {Property.<EntryStatus>}
    this.statusProperty = new Property( EntryStatus.DIRTY );

    // @public {Property.<Term|null>} - Our value, except for null if there is an error highlight
    this.nonErrorValueProperty = new DerivedProperty( [ this.valueProperty, this.statusProperty ], function( value, highlight ) {
      return ( highlight === EntryStatus.INCORRECT ) ? null : value;
    } );
  }

  areaModelCommon.register( 'Entry', Entry );

  return inherit( Object, Entry );
} );
