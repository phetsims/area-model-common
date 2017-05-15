// Copyright 2017, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
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
   * @extends {HBox}
   *
   * @param {ProportionalAreaModel} model
   * @param {number} decimalPlaces
   */
  function ProportionalProblemNode( model, decimalPlaces ) {

    var xText = new Text( AreaModelConstants.X_STRING, {
      font: AreaModelConstants.PROBLEM_X_FONT
    } );

    var children;

    // TODO: hackish! and refactor!
    var widthProperty = new Property( model.currentAreaProperty.value.totalWidthProperty.value );
    function currentWidthListener( value ) {
      widthProperty.value = value;
    }
    model.currentAreaProperty.value.totalWidthProperty.link( currentWidthListener );
    model.currentAreaProperty.lazyLink( function( newArea, oldArea ) {
      oldArea.totalWidthProperty.unlink( currentWidthListener );
      newArea.totalWidthProperty.link( currentWidthListener );
    } );
    widthProperty.link( function( value ) {
      model.currentAreaProperty.value.totalWidthProperty.value = value;
    } );

    var heightProperty = new Property( model.currentAreaProperty.value.totalHeightProperty.value );
    function currentHeightListener( value ) {
      heightProperty.value = value;
    }
    model.currentAreaProperty.value.totalHeightProperty.link( currentHeightListener );
    model.currentAreaProperty.lazyLink( function( newArea, oldArea ) {
      oldArea.totalHeightProperty.unlink( currentHeightListener );
      newArea.totalHeightProperty.link( currentHeightListener );
    } );
    heightProperty.link( function( value ) {
      model.currentAreaProperty.value.totalHeightProperty.value = value;
    } );

    var rangeProperty = new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
      return new Range( area.minimumSize, area.maximumSize );
    } );

    var staticOptions = {
      upFunction: function( value ) { return value + model.currentAreaProperty.value.snapSize; },
      downFunction: function( value ) { return value - model.currentAreaProperty.value.snapSize; },
      decimalPlaces: decimalPlaces,
      scale: 1.5
    };

    var widthPicker = new MutableOptionsNode( NumberPicker, [ widthProperty, rangeProperty ], staticOptions, {
      color: model.widthColorProperty
    } );

    var heightPicker = new MutableOptionsNode( NumberPicker, [ heightProperty, rangeProperty ], staticOptions, {
      color: model.heightColorProperty
    } );

    children = [
      heightPicker,
      xText,
      widthPicker
    ];

    HBox.call( this, {
      children: children,
      spacing: 10
    } );
  }

  areaModelCommon.register( 'ProportionalProblemNode', ProportionalProblemNode );

  return inherit( HBox, ProportionalProblemNode );
} );
