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

  // All values the enumeration can take.
  PartialProductsChoice.CHOICES = [
    PartialProductsChoice.HIDDEN,
    PartialProductsChoice.PRODUCTS,
    PartialProductsChoice.FACTORS,
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PartialProductsChoice ); }

  return PartialProductsChoice;
} );
