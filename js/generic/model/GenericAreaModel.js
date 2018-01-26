// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for generic (not-to-scale) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModel = require( 'AREA_MODEL_COMMON/common/model/AreaModel' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var GenericArea = require( 'AREA_MODEL_COMMON/generic/model/GenericArea' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/generic/model/GenericLayout' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  var DEFAULT_LAYOUT = GenericLayout.TWO_BY_TWO;

  /**
   * @constructor
   * @extends {AreaModel}
   *
   * @param {Object} [options]
   */
  function GenericAreaModel( options ) {
    var self = this;

    assert && assert( options === undefined || typeof options === 'object', 'If provided, options should be an object' );

    options = _.extend( {
      allowExponents: false
    }, options );

    // @public {Property.<GenericLayout>}
    this.genericLayoutProperty = new Property( DEFAULT_LAYOUT );

    var areas = GenericLayout.VALUES.map( function( layout ) {
      return new GenericArea( layout, options.allowExponents );
    } );

    var defaultArea = _.find( areas, function( area ) {
      return area.layout === DEFAULT_LAYOUT;
    } );

    AreaModel.call( this, areas, defaultArea, options );

    // Adjust the current area based on the layout.
    this.genericLayoutProperty.link( function( layout ) {
      self.currentAreaProperty.value = _.find( self.areas, function( area ) {
        return area.layout === layout;
      } );
    } );
  }

  areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

  return inherit( AreaModel, GenericAreaModel, {
    /**
     * Returns the model to its initial state.
     * @public
     * @override
     */
    reset: function() {
      AreaModel.prototype.reset.call( this );

      this.genericLayoutProperty.reset();
    }
  } );
} );
