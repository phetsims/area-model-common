// Copyright 2017, University of Colorado Boulder

/**
 * Enumeration for area-model calculation choices.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var PartialProductsChoice = {
    HIDDEN: 'HIDDEN',
    PRODUCTS: 'PRODUCTS',
    FACTORS: 'FACTORS'
  };

  areaModelCommon.register( 'PartialProductsChoice', PartialProductsChoice );

  PartialProductsChoice.CHOICES = [
    PartialProductsChoice.HIDDEN,
    PartialProductsChoice.PRODUCTS,
    PartialProductsChoice.FACTORS,
  ];

  return PartialProductsChoice;
} );
