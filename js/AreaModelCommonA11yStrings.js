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
    areaEqualsPattern: {
      value: 'Area equals {{area}}'
    },
    areaGrid: {
      value: 'Area grid'
    },
    controlPanel: {
      value: 'Control panel'
    },
    countingNumbersDescription: {
      value: 'Count each unit of area'
    },
    countingNumbersLabel: {
      value: 'Counting numbers'
    },
    dragHandle: {
      value: 'Drag handle'
    },
    dragHandleDescriptionPattern: {
      value: 'Drag the handle to build a rectangle up to {{height}} by {{width}}.'
    },
    erase: {
      value: 'Erase'
    },
    eraseDescription: {
      value: 'Clear the rectangle and build a new one.'
    },
    factorsBox: {
      value: 'Factors'
    },
    gridLinesLabel: {
      value: 'Grid lines'
    },
    horizontalPartitionHandle: {
      value: 'Horizontal partition handle'
    },
    horizontalPicker: {
      value: 'Width'
    },
    multiplyDescription: {
      value: 'Play with multiplication by interacting with an area model.'
    },
    partitionDescription: {
      value: 'Partition your area model and explore the distributive property.'
    },
    playArea: {
      value: 'Play area'
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
