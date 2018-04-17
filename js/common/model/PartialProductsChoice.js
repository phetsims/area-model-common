// Copyright 2017-2018, University of Colorado Boulder

/**
 * Enumeration for partial product choices.
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

  // @public {Array.<PartialProductsChoice>} - All values the enumeration can take.
  // REVIEW: The e.g. documentation seems it belongs with the declarations above, not with the VALUES below.
  PartialProductsChoice.VALUES = [
    PartialProductsChoice.HIDDEN, // e.g. nothing shown
    PartialProductsChoice.PRODUCTS, // e.g. '52'
    PartialProductsChoice.FACTORS // e.g. '26 x 2'
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PartialProductsChoice ); }

  return PartialProductsChoice;
} );
