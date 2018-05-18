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

  // TODO: Make sure all of these are used
  var AreaModelCommonA11yStrings = {
    areaEqualsPattern: {
      value: 'Area equals {{area}}'
    },
    areaGrid: {
      value: 'Area grid'
    },
    areaGridRectanglePattern: {
      value: '{{height}} by {{width}} rectangle.'
    },
    base10AreaTiles: {
      value: 'Base 10 area tiles'
    },
    betweenCalculationLines: {
      value: 'is equivalent to '
    },
    // TODO: Box or Accordion?
    calculationAccordionTitle: {
      value: 'Calculation'
    },
    calculationBoxDescription: {
      value: 'Show or hide the calculation.'
    },
    countingNumbersDescription: {
      value: 'Count each unit of area'
    },
    countingNumbersLabel: {
      value: 'Counting numbers'
    },
    countingNumbersPattern: {
      value: 'Area units count to {{count}}.'
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
    factorsBoxDescription: {
      value: 'Show or hide the factors.'
    },
    factorsTimesPattern: {
      value: '{{height}} times {{width}}'
    },
    gridLinesLabel: {
      value: 'Grid lines'
    },
    hidePartialProducts: {
      value: 'Hide partial products'
    },
    horizontalDimensionCapitalized: {
      value: 'Width'
    },
    horizontalPartition: {
      value: 'Horizontal partition'
    },
    horizontalPartitionHandle: {
      value: 'Horizontal partition handle'
    },
    horizontalPartitionHandleDescription: {
      value: 'Partition rectangle into two smaller areas by splitting the height.'
    },
    horizontalPicker: {
      value: 'Width'
    },
    horizontalPickerDescription: {
      value: 'Change the dimensions of the rectangle.'
    },
    multiplyDescription: {
      value: 'Play with multiplication by interacting with an area model.'
    },
    onePartialProductFactorPattern: {
      value: 'No partition set. Product factors are {{first}}.'
    },
    onePartialProductPattern: {
      value: 'No partition set. Product is {{first}}.'
    },
    partitionDescription: {
      value: 'Partition your area model and explore the distributive property.'
    },
    partitionSelectionDescription: {
      value: 'Switch between vertical and horizontal partition lines.'
    },
    placeholder: {
      value: 'empty'
    },
    productBox: {
      value: 'Product'
    },
    productTimesPattern: {
      value: '{{left}} times {{right}}'
    },
    productBoxDescription: {
      value: 'Show or hide the product.'
    },
    quantityPattern: {
      value: 'left parenthesis {{content}} right parenthesis'
    },
    questionMark: {
      value: 'undefined'
    },
    sceneSelectionPattern: {
      value: '{{height}} by {{width}}'
    },
    showPartialProductFactors: {
      value: 'Show partial product factors'
    },
    showPartialProducts: {
      value: 'Show partial products'
    },
    sumMinus: {
      value: 'minus'
    },
    sumPlus: {
      value: 'plus'
    },
    threePartitionsSplit: {
      value: '{{partition}} of {{size}} split into {{size1}}, {{size2}} and {{size3}}.'
    },
    threeSceneSelectionDescriptionPattern: {
      value: 'Switch between a {{first}}, {{second}} and {{third}} board.'
    },
    twoPartialProductFactorsPattern: {
      value: 'There are two partitions. Partial product factors are {{first}} and {{second}}.'
    },
    twoPartialProductsPattern: {
      value: 'There are two partitions. Partial products are {{first}} and {{second}}.'
    },
    twoPartitionsSplit: {
      value: '{{partition}} of {{size}} split into {{size1}} and {{size2}}.'
    },
    twoSceneSelectionDescriptionPattern: {
      value: 'Switch between a {{first}} and {{second}} board.'
    },
    verticalDimensionCapitalized: {
      value: 'Height'
    },
    verticalPartition: {
      value: 'Vertical partition'
    },
    verticalPartitionHandle: {
      value: 'Vertical partition handle'
    },
    verticalPartitionHandleDescription: {
      value: 'Partition rectangle into two smaller areas by splitting the width.'
    },
    verticalPicker: {
      value: 'Height'
    },
    verticalPickerDescription: {
      value: 'Change the dimensions of the rectangle.'
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
