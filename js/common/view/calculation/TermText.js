// Copyright 2018, University of Colorado Boulder

/**
 * A poolable RichText for a Term with a colorProperty fill.
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );

  /**
   * @constructor
   * @extends {RichText}
   *
   * @param {TermList|Term} term
   * @param {Property.<Color>} colorProperty
   * @param {boolean} excludeSign
   */
  function TermText( term, colorProperty, excludeSign ) {
    RichText.call( this, ' ', {
      font: AreaModelCommonConstants.CALCULATION_TERM_FONT
    } );

    this.initialize( term, colorProperty, excludeSign );
  }

  areaModelCommon.register( 'TermText', TermText );

  inherit( RichText, TermText, {
    /**
     * Initializes the state of this node (could be from pool, or fresh from a constructor).
     * @public
     *
     * @param {TermList|Term} term
     * @param {Property.<Color>} colorProperty
     * @param {boolean} excludeSign - Set to true when this node will be placed after a plus or minus symbol (for example,
     *                                `x + -5` is a case to NOT exclude the sign, whereas `x - 5` is a case TO exclude it)
     * @returns {TermText}
     */
    initialize: function( term, colorProperty, excludeSign ) {
      assert && assert( term instanceof Term || term instanceof TermList );
      assert && assert( colorProperty instanceof Property );
      assert && assert( typeof excludeSign === 'boolean' || excludeSign === undefined );

      this.text = excludeSign ? term.toNoSignRichString() : term.toRichString( false );
      this.fill = colorProperty;

      return this;
    },

    /**
     * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
     * @public
     */
    clean: function() {
      this.fill = null;
      this.freeToPool();
    }
  } );

  // Standard boilerplate for pooling :(
  Poolable.mixInto( TermText, {
    constructorDuplicateFactory: function( pool ) {
      return function( term, colorProperty, excludeSign ) {
        if ( pool.length ) {
          return pool.pop().initialize( term, colorProperty, excludeSign );
        }
        else {
          return new TermText( term, colorProperty, excludeSign );
        }
      };
    }
  } );

  return TermText;
} );
