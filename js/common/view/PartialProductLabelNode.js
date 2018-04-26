// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows the product or factors for a partitioned area over a rounded background.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Property.<PartitionedArea|null>} partitionedAreaProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  function PartialProductLabelNode( partialProductsChoiceProperty, partitionedAreaProperty, allowExponents ) {
    assert && assert( partialProductsChoiceProperty instanceof Property );
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    Node.call( this );

    // @public {Property.<PartitionedArea|null>} - Exposed for improved positioning capability AND setting with pool
    this.partitionedAreaProperty = partitionedAreaProperty;

    var areaProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'areaProperty'
    } );
    var visibleProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'visibleProperty',
      defaultValue: false
    } );
    var horizontalSizeProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'partitions.horizontal.sizeProperty'
    } );
    var verticalSizeProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'partitions.vertical.sizeProperty'
    } );

    var background = new Rectangle( {
      cornerRadius: 3,
      stroke: new DerivedProperty(
        [ areaProperty, AreaModelCommonColorProfile.partialProductBorderProperty ],
        function( area, color ) {
          return ( area === null || area.coefficient === 0 ) ? 'transparent' : color;
        } ),
      fill: AreaModelCommonColorProfile.partialProductBackgroundProperty
    } );
    this.addChild( background );

    var box = new HBox( {
      align: 'origin'
    } );
    this.addChild( box );

    // Visibility
    Property.multilink( [ partialProductsChoiceProperty, visibleProperty ], function( choice, areaVisible ) {
      self.visible = areaVisible && ( choice !== PartialProductsChoice.HIDDEN );
    } );

    // Make sure this is understood?
    // REVIEW: Please comment what this is.
    // REVIEW*: Possibly a secret message. Investigate?
    // REVIEW: Message received, thanks!  base64: aXQncyBnb2luZyB3ZWxsIHNvIGZhciwgdGhhbmtzIQ==
    // REVIEW: I'm concerned that these values may leak out of the PhET-iO API if those
    // REVIEW: Rich texts get instrumented.  Would '' work?  Or does the string need to be a certain minimum length
    // REVIEW: or other constraints?
    // REVIEW*: I'll resolve this as part of https://github.com/phetsims/scenery/issues/769.
    // TODO: Resolve above
    var placeholderString = 'base64: aG9wZSB0aGUgY29kZSByZXZpZXcgaXMgZ29pbmcgd2VsbA==';

    // RichTexts (we reuse the same instances to prevent GC and cpu cost)
    var productRichText = new RichText( placeholderString, {
      font: AreaModelCommonConstants.PARTIAL_PRODUCT_FONT
    } );
    var factorsTextOptions = {
      font: AreaModelCommonConstants.PARTIAL_FACTOR_FONT
    };
    var horizontalRichText = new RichText( placeholderString, factorsTextOptions );
    var verticalRichText = new RichText( placeholderString, factorsTextOptions );

    var rectangleSize = allowExponents ? 12 : 14;

    // Shifting the rectangles down, so we don't incur a large performance penalty for size-testing things
    var rectangleExponentPadding = allowExponents ? 1.3 : 0;
    var rectangleCenterY = new Text( ' ', factorsTextOptions ).centerY - rectangleSize / 2 + rectangleExponentPadding;
    var horizontalRectangle = new Rectangle( 0, rectangleCenterY, rectangleSize, rectangleSize, {
      stroke: 'black',
      lineWidth: 0.7
    } );
    var verticalRectangle = new Rectangle( 0, rectangleCenterY, rectangleSize, rectangleSize, {
      stroke: 'black',
      lineWidth: 0.7
    } );
    if ( allowExponents ) {
      var exponentPadding = 2;
      horizontalRectangle.localBounds = horizontalRectangle.localBounds.dilatedX( exponentPadding );
      verticalRectangle.localBounds = verticalRectangle.localBounds.dilatedX( exponentPadding );
    }

    // Persistent text nodes (for performance)
    var leftParenNode = new Text( '(', factorsTextOptions );
    var middleParensNode = new Text( ')(', factorsTextOptions );
    var rightParenNode = new Text( ')', factorsTextOptions );
    var timesNode = new Text( MathSymbols.TIMES, factorsTextOptions );

    // Text/alignment
    Property.multilink(
      [ horizontalSizeProperty, verticalSizeProperty, partialProductsChoiceProperty ],
      function( horizontalSize, verticalSize, choice ) {
        var children;

        // Hidden
        if ( choice === PartialProductsChoice.HIDDEN ) {
          children = [];
        }

        // Product
        else if ( choice === PartialProductsChoice.PRODUCTS ) {
          productRichText.text = ( horizontalSize === null || verticalSize === null )
            ? '?'
            : horizontalSize.times( verticalSize ).toRichString( false );
          children = [ productRichText ];
        }

        // Factors
        else {

          var horizontalNode = horizontalSize
            ? horizontalRichText.setText( horizontalSize.toRichString( false ) )
            : horizontalRectangle;
          var verticalNode = verticalSize
            ? verticalRichText.setText( verticalSize.toRichString( false ) )
            : verticalRectangle;

          if ( allowExponents ) {
            box.spacing = 0;
            children = [
              leftParenNode,
              verticalNode,
              middleParensNode,
              horizontalNode,
              rightParenNode
            ];
          }
          else {
            box.spacing = 2;
            children = [
              verticalNode,
              timesNode,
              horizontalNode
            ];
          }
        }

        // So, due to performance, we REALLY don't want to remove and then add these back in. Scenery was burning a
        // chunk of CPU on some of this, and having the RichTexts not pool has been annoying enough.
        // REVIEW: would it help if we had a scenery method or option to check children before doing anything?
        // REVIEW: That is, moving this workaround into scenery/Node?
        // REVIEW*: The more I think about it, the more I think node.setChildren should be smarter about things.
        // TODO: Look into setChildren improvements that won't remove and add something back in.
        var currentChildren = box.children;
        var needsUpdate = false;
        if ( currentChildren.length !== children.length ) {
          needsUpdate = true;
        }
        else {
          for ( var i = 0; i < children.length; i++ ) {
            if ( currentChildren[ i ] !== children[ i ] ) {
              needsUpdate = true;
              break;
            }
          }
        }
        if ( needsUpdate ) {
          box.children = children;
        }

        if ( isFinite( box.width ) ) {
          box.center = Vector2.ZERO;
          background.rectBounds = box.bounds.dilatedXY( 4, 2 );
        }
      } );
  }

  areaModelCommon.register( 'PartialProductLabelNode', PartialProductLabelNode );

  return inherit( Node, PartialProductLabelNode );
} );
