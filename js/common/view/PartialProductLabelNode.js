// Copyright 2017-2018, University of Colorado Boulder

/**
 * Shows the product or factors for a partitioned area over a rounded background.
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
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/enum/PartialProductsChoice' );
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
   * @param {boolean} allowExponents
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
      stroke: new DerivedProperty( [ areaProperty, AreaModelCommonColorProfile.partialProductBorderProperty ], function( area, color ) {
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

    // Text/alignment
    Property.multilink( [ horizontalSizeProperty, verticalSizeProperty, partialProductsChoiceProperty ], function( horizontalSize, verticalSize, choice ) {
      var textOptions = {
        font: ( choice === PartialProductsChoice.PRODUCTS ) ? AreaModelCommonConstants.PARTIAL_PRODUCT_FONT
          : AreaModelCommonConstants.PARTIAL_FACTOR_FONT
      };

      // Hidden
      if ( choice === PartialProductsChoice.HIDDEN ) {
        box.children = [];
      }
      // Product
      else if ( choice === PartialProductsChoice.PRODUCTS ) {
        var labelString = ( horizontalSize === null || verticalSize === null ) ? '?' : horizontalSize.times( verticalSize ).toRichString( false );
        box.children = [
          new RichText( labelString, textOptions )
        ];
      }
      // Factors
      else {
        var rectangleSize = allowExponents ? 12 : 14;
        var magicConstant = allowExponents ? 1.3 : 0; // Shifting the rectangles down, so we don't incur a large performance penalty for size-testing things
        var rectangleCenterY = new Text( ' ', textOptions ).centerY - rectangleSize / 2 + magicConstant;
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

        var horizontalNode = horizontalSize ? new RichText( horizontalSize.toRichString( false ), textOptions ) : horizontalRectangle;
        var verticalNode = verticalSize ? new RichText( verticalSize.toRichString( false ), textOptions ) : verticalRectangle;

        if ( allowExponents ) {
          box.spacing = 0;
          box.children = [
            new Text( '(', textOptions ),
            verticalNode,
            new Text( ')(', textOptions ),
            horizontalNode,
            new Text( ')', textOptions )
          ];
        }
        else {
          box.spacing = 2;
          box.children = [
            verticalNode,
            new Text( MathSymbols.TIMES, textOptions ),
            horizontalNode
          ];
        }
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
