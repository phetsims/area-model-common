// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for partial product choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  const PartialProductsChoice = {
    HIDDEN: 'HIDDEN', // e.g. nothing shown
    PRODUCTS: 'PRODUCTS', // e.g. '52'
    FACTORS: 'FACTORS' // e.g. '26 x 2'
  };

  areaModelCommon.register( 'PartialProductsChoice', PartialProductsChoice );

  // @public {Array.<PartialProductsChoice>} - All values the enumeration can take.
  PartialProductsChoice.VALUES = [
    PartialProductsChoice.HIDDEN,
    PartialProductsChoice.PRODUCTS,
    PartialProductsChoice.FACTORS
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PartialProductsChoice ); }

  return PartialProductsChoice;
} );
