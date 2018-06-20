// Copyright 2018, University of Colorado Boulder

/**
 * A rectangle meant as a placeholder in the calculation lines (poolable).
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // a11y strings
  var placeholderString = AreaModelCommonA11yStrings.placeholder.value;

  /**
   * @constructor
   * @extends {Rectangle}
   *
   * @param {Property.<Color>} colorProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  function PlaceholderBox( colorProperty, allowExponents ) {
    assert && assert( colorProperty instanceof Property );
    assert && assert( typeof allowExponents === 'boolean' );

    if ( !this.initialized ) {
      this.initialized = true;

      // @public {string}
      this.accessibleText = placeholderString;

      Rectangle.call( this, 0, 0, 16, 16, {
        lineWidth: 0.7,

        // a11y
        tagName: 'mi',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML',
        innerContent: placeholderString
      } );
    }

    this.stroke = colorProperty;
    this.localBounds = this.selfBounds.dilatedX( allowExponents ? 2 : 0 );
  }

  areaModelCommon.register( 'PlaceholderBox', PlaceholderBox );

  inherit( Rectangle, PlaceholderBox, {
    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      this.stroke = null;
      this.freeToPool();
    }
  } );

  Poolable.mixInto( PlaceholderBox );

  return PlaceholderBox;
} );
