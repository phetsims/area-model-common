// Copyright 2017-2019, University of Colorado Boulder

/**
 * Supertype for generic (not-to-scale) area-model models.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonModel from '../../common/model/AreaModelCommonModel.js';
import GenericArea from './GenericArea.js';
import GenericAreaDisplay from './GenericAreaDisplay.js';
import GenericLayout from './GenericLayout.js';

// constants
const DEFAULT_LAYOUT = GenericLayout.TWO_BY_TWO;

/**
 * @constructor
 * @extends {AreaModelCommonModel}
 *
 * @param {Object} [options]
 */
function GenericAreaModel( options ) {
  const self = this;

  assert && assert( options === undefined || typeof options === 'object', 'If provided, options should be an object' );

  options = merge( {
    allowExponents: false
  }, options );

  // @public {Property.<GenericLayout>} - The current layout that is visible/selected.
  this.genericLayoutProperty = new Property( DEFAULT_LAYOUT );

  const areas = GenericLayout.VALUES.map( function( layout ) {
    return new GenericArea( layout, options.allowExponents );
  } );

  const defaultArea = _.find( areas, function( area ) {
    return area.layout === DEFAULT_LAYOUT;
  } );

  AreaModelCommonModel.call( this, areas, defaultArea, options );

  // Adjust the current area based on the layout.
  this.genericLayoutProperty.link( function( layout ) {
    self.currentAreaProperty.value = _.find( self.areas, function( area ) {
      return area.layout === layout;
    } );
  } );
}

areaModelCommon.register( 'GenericAreaModel', GenericAreaModel );

export default inherit( AreaModelCommonModel, GenericAreaModel, {
  /**
   * Returns a concrete AreaDisplay subtype
   * @protected
   *
   * @param {Property.<Area>} areaProperty
   * @returns {GenericAreaDisplay}
   */
  createAreaDisplay: function( areaProperty ) {
    return new GenericAreaDisplay( areaProperty );
  },

  /**
   * Returns the model to its initial state.
   * @public
   * @override
   */
  reset: function() {
    AreaModelCommonModel.prototype.reset.call( this );

    this.genericLayoutProperty.reset();
  }
} );