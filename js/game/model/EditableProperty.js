// Copyright 2017-2018, University of Colorado Boulder

/**
 * A property whose value can be edited, and may be displayed in different ways.
 * // REVIEW: Please comment why it is appropriate to extend Property in this case, and why subtyping is more appropriate
 * // REVIEW: than using composition for this problem.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplayType = require( 'AREA_MODEL_COMMON/game/model/DisplayType' );
  var Field = require( 'AREA_MODEL_COMMON/game/model/Field' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/model/Highlight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InputMethod = require( 'AREA_MODEL_COMMON/game/model/InputMethod' );
  var Property = require( 'AXON/Property' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Property}
   *
   * @param {Term|null} value - The initial value of the property
   * @param {Object} [options] - Options passed to the Property
   */
  function EditableProperty( value, options ) {
    options = _.extend( {

      // Property options
      useDeepEquality: true,
      isValidValue: Term.isNullableTerm,

      // Our options
      field: Field.GIVEN,
      displayType: DisplayType.HIDDEN,
      inputMethod: InputMethod.CONSTANT,
      digits: 0,
      correctValue: null // Only used for the total coefficients
    }, options );

    // Always start off by editing null, and it should be the default value.
    if ( options.displayType === DisplayType.EDITABLE ) {
      value = null;
    }

    Property.call( this, value, options );

    // @public {Field} - Whether we are dynamic/editable/given.
    this.field = options.field;

    // @public {DisplayType} - Whether we are a readout or editable/hidden
    this.displayType = options.displayType;

    // @public {InputMethod} - What format should be used if we are edited? (Need different keypads or a polynomial
    // input)
    this.inputMethod = options.inputMethod;

    // @public {number}
    this.digits = options.digits;

    // @public {Term|null}
    this.correctValue = options.correctValue;

    // @public {Property.<Highlight>}
    this.highlightProperty = new Property( Highlight.DIRTY );

    // @public {Property.<Term|null>} - Our value, except for null if there is an error highlight
    this.nonErrorValueProperty = new DerivedProperty( [ this, this.highlightProperty ], function( value, highlight ) {
      return ( highlight === Highlight.ERROR ) ? null : value;
    } );
  }

  areaModelCommon.register( 'EditableProperty', EditableProperty );

  return inherit( Property, EditableProperty );
} );
