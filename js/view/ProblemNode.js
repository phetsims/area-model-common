// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   *
   * @param {Property.<Area>} currentAreaProperty
   * @param {boolean} isProportional
   * @param {number} decimalPlaces
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function ProblemNode( currentAreaProperty, isProportional, decimalPlaces, widthColorProperty, heightColorProperty ) {
    assert && assert( typeof isProportional === 'boolean' );

    var xText = new Text( AreaModelConstants.X_STRING, {
      font: AreaModelConstants.PROBLEM_X_FONT
    } );

    var children;

    if ( isProportional ) {
      // TODO: hackish!
      var widthProperty = new Property( currentAreaProperty.value.totalWidthProperty.value );

      var rangeProperty = new DerivedProperty( [ currentAreaProperty ], function( area ) {
        return new Range( area.minimumSize, area.maximumSize );
      } );

      var staticOptions = {
        upFunction: function( value ) { return value + currentAreaProperty.value.snapSize; },
        downFunction: function( value ) { return value - currentAreaProperty.value.snapSize; },
        decimalPlaces: decimalPlaces,
        scale: 1.5
      };

      var widthPicker = new MutableOptionsNode( NumberPicker, [ widthProperty, rangeProperty ], staticOptions, {
        color: widthColorProperty
      } );

      children = [ widthPicker, xText ];
    }
    else {
      children = [ xText ];
    }

    HBox.call( this, {
      children: children,
      spacing: 10
    } );
  }

  areaModelCommon.register( 'ProblemNode', ProblemNode );

  return inherit( HBox, ProblemNode );
} );
