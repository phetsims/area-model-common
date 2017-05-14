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
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {Property.<Area>} currentAreaProperty
   * @param {boolean} isProportional
   * @param {boolean} allowPowers
   * @param {number} decimalPlaces
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function ProblemNode( currentAreaProperty, isProportional, allowPowers, decimalPlaces, widthColorProperty, heightColorProperty ) {
    assert && assert( typeof isProportional === 'boolean' );

    var xText = new Text( AreaModelConstants.X_STRING, {
      font: AreaModelConstants.PROBLEM_X_FONT
    } );
    var leftParen = new Text( '(', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );
    var rightParen = new Text( ')', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );
    var bothParen = new Text( ')(', {
      font: AreaModelConstants.PROBLEM_PAREN_FONT
    } );

    var children;

    if ( isProportional ) {
      (function(){
        // TODO: hackish! and refactor!
        var widthProperty = new Property( currentAreaProperty.value.totalWidthProperty.value );
        function currentWidthListener( value ) {
          widthProperty.value = value;
        }
        currentAreaProperty.value.totalWidthProperty.link( currentWidthListener );
        currentAreaProperty.lazyLink( function( newArea, oldArea ) {
          oldArea.totalWidthProperty.unlink( currentWidthListener );
          newArea.totalWidthProperty.link( currentWidthListener );
        } );
        widthProperty.link( function( value ) {
          currentAreaProperty.value.totalWidthProperty.value = value;
        } );

        var heightProperty = new Property( currentAreaProperty.value.totalHeightProperty.value );
        function currentHeightListener( value ) {
          heightProperty.value = value;
        }
        currentAreaProperty.value.totalHeightProperty.link( currentHeightListener );
        currentAreaProperty.lazyLink( function( newArea, oldArea ) {
          oldArea.totalHeightProperty.unlink( currentHeightListener );
          newArea.totalHeightProperty.link( currentHeightListener );
        } );
        heightProperty.link( function( value ) {
          currentAreaProperty.value.totalHeightProperty.value = value;
        } );

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

        var heightPicker = new MutableOptionsNode( NumberPicker, [ heightProperty, rangeProperty ], staticOptions, {
          color: heightColorProperty
        } );

        children = [ heightPicker, new Node( { children: [ xText ] } ), widthPicker ];
      })();
    }
    else {
      var widthText = new RichText( ' ', {
        font: AreaModelConstants.PROBLEM_X_FONT,
        fill: widthColorProperty
      } );
      var heightText = new RichText( ' ', {
        font: AreaModelConstants.PROBLEM_X_FONT,
        fill: heightColorProperty
      } );
      var widthBox = new Rectangle( 0, 0, 30, 30, { stroke: widthColorProperty } );
      var heightBox = new Rectangle( 0, 0, 30, 30, { stroke: heightColorProperty } );

      var widthNode = new Node();
      var heightNode = new Node();

      currentAreaProperty.value.horizontalTotalProperty.link( function( total ) {
        if ( total === null ) {
          widthNode.children = [ widthBox ];
        }
        else {
          widthText.text = total.toRichString();
          widthNode.children = [ widthText ];
        }
      } );
      currentAreaProperty.value.verticalTotalProperty.link( function( total ) {
        if ( total === null ) {
          heightNode.children = [ heightBox ];
        }
        else {
          heightText.text = total.toRichString();
          heightNode.children = [ heightText ];
        }
      } );

      if ( allowPowers ) {
        children = [ leftParen, heightNode, bothParen, widthNode, rightParen ];
      }
      else {
        children = [ heightNode, xText, widthNode ];
      }
    }

    HBox.call( this, {
      children: children,
      spacing: 10,
      maxWidth: 230
    } );
  }

  areaModelCommon.register( 'ProblemNode', ProblemNode );

  return inherit( HBox, ProblemNode );
} );
