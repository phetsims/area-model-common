// Copyright 2018, University of Colorado Boulder

/**
 * Single location of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );

  var AreaModelCommonA11yStrings = {
    areaGrid: {
      value: 'Area Grid'
    },
    dragHandle: {
      value: 'Drag handle'
    },
    erase: {
      value: 'Erase'
    },
    factorsBox: {
      value: 'Factors'
    },
    horizontalPartitionHandle: {
      value: 'Horizontal partition handle'
    },
    horizontalPicker: {
      value: 'Width'
    },
    productBox: {
      value: 'Product'
    },
    verticalPartitionHandle: {
      value: 'Vertical partition handle'
    },
    verticalPicker: {
      value: 'Height'
    }
  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( var key in AreaModelCommonA11yStrings ) {
      AreaModelCommonA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( AreaModelCommonA11yStrings ); }

  areaModelCommon.register( 'AreaModelCommonA11yStrings', AreaModelCommonA11yStrings );

  return AreaModelCommonA11yStrings;
} );
