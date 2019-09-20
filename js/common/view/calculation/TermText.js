// Copyright 2018-2019, University of Colorado Boulder

/**
 * A poolable RichText for a Term with a colorProperty fill.
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Poolable = require( 'PHET_CORE/Poolable' );
  const Property = require( 'AXON/Property' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  const TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {RichText}
   *
   * @param {TermList|Term} term
   * @param {Property.<Color>} colorProperty
   * @param {boolean} excludeSign
   */
  function TermText( term, colorProperty, excludeSign ) {
    assert && assert( term instanceof Term || term instanceof TermList );
    assert && assert( colorProperty instanceof Property );
    assert && assert( typeof excludeSign === 'boolean' || excludeSign === undefined );

    const text = excludeSign ? term.toNoSignRichString() : term.toRichString( false );

    // @public {string}
    this.accessibleText = text;

    if ( !this.initialized ) {
      this.initialized = true;

      RichText.call( this, ' ', {
        font: AreaModelCommonConstants.CALCULATION_TERM_FONT,

        // a11y
        tagName: 'mn',
        accessibleNamespace: 'http://www.w3.org/1998/Math/MathML'
      } );
    }

    this.mutate( {
      text: text,
      fill: colorProperty,
      innerContent: text
    } );
  }

  areaModelCommon.register( 'TermText', TermText );

  inherit( RichText, TermText, {
    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      this.fill = null;
      this.freeToPool();
    }
  } );

  Poolable.mixInto( TermText );

  return TermText;
} );
