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
  var DisplayType = require( 'AREA_MODEL_COMMON/model/DisplayType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/model/KeypadType' );
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
      displayType: DisplayType.HIDDEN,
      keypadType: KeypadType.CONSTANT,
      digits: 0
    }, options );

    // Always start off by editing null, and it should be the default value.
    //TODO: do this elsewhere?
    if ( options.displayType === DisplayType.EDITABLE ) {
      value = null;
    }

    Property.call( this, value, options );

    // @public {DisplayType}
    this.displayType = options.displayType;

    // @public {KeypadType}
    this.keypadType = options.keypadType;

    // @public {number}
    this.digits = options.digits;
  }

  areaModelCommon.register( 'EditableProperty', EditableProperty );

  return inherit( Property, EditableProperty );
} );
