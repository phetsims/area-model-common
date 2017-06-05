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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Property}
   *
   * @param {Term|TermValue|number|null} value - The initial value of the property
   * @param {Object} [options] - Options passed to the Property
   */
  function EditableProperty( value, options ) {
    Property.call( this, value, options );

    // TODO: Can these be constant (not properties), and we move totalProperty to a property-property? YES

    // @public {Property.<DisplayType>} - How our property's value is displayed (or if it is editable)
    this.displayProperty = new Property( DisplayType.HIDDEN );

    // @public {Property.<number>} - How many digits are included in any editable interface.
    this.digitsProperty = new NumberProperty( 0 );

    // @public {Property.<KeypadType}
    this.keypadProperty = new Property( KeypadType.CONSTANT );
  }

  areaModelCommon.register( 'EditableProperty', EditableProperty );

  return inherit( Property, EditableProperty );
} );
