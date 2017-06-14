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
  var Field = require( 'AREA_MODEL_COMMON/game/enum/Field' );
  var Highlight = require( 'AREA_MODEL_COMMON/game/enum/Highlight' );
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
      field: Field.GIVEN,
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

    // @public {Field}
    this.field = options.field;

    // @public {DisplayType}
    this.displayType = options.displayType;

    // @public {InputMethod}
    this.inputMethod = options.inputMethod;

    // @public {number}
    this.digits = options.digits;

    // @public {Property.<Highlight>} - TODO doc
    this.highlightProperty = new Property( Highlight.DIRTY );

    // TODO doc
    this.nonErrorValueProperty = new DerivedProperty( [ this, this.highlightProperty ], function( value, highlight ) {
      return ( highlight === Highlight.ERROR ) ? null : value;
    } );
  }

  areaModelCommon.register( 'EditableProperty', EditableProperty );

  return inherit( Property, EditableProperty );
} );
