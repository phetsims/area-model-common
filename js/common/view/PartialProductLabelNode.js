// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows the product or factors for a partitioned area over a rounded background.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/model/PartialProductsChoice' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

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

    const self = this;

    Node.call( this );

    // @public {Property.<PartitionedArea|null>} - Exposed for improved positioning capability AND setting with pool
    this.partitionedAreaProperty = partitionedAreaProperty;

    const areaProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'areaProperty'
    } );
    const visibleProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'visibleProperty',
      defaultValue: false
    } );
    const horizontalSizeProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'partitions.horizontal.sizeProperty'
    } );
    const verticalSizeProperty = new DynamicProperty( partitionedAreaProperty, {
      derive: 'partitions.vertical.sizeProperty'
    } );

    const background = new Rectangle( {
      cornerRadius: 3,
      stroke: new DerivedProperty(
        [ areaProperty, AreaModelCommonColorProfile.partialProductBorderProperty ],
        function( area, color ) {
          return ( area === null || area.coefficient === 0 ) ? 'transparent' : color;
        } ),
      fill: AreaModelCommonColorProfile.partialProductBackgroundProperty
    } );
    this.addChild( background );

    const box = new HBox( {
      align: 'origin'
    } );
    this.addChild( box );

    // Visibility
    Property.multilink( [ partialProductsChoiceProperty, visibleProperty ], function( choice, areaVisible ) {
      self.visible = areaVisible && ( choice !== PartialProductsChoice.HIDDEN );
    } );

    // RichTexts (we reuse the same instances to prevent GC and cpu cost)
    const productRichText = new RichText( '', {
      font: AreaModelCommonConstants.PARTIAL_PRODUCT_FONT
    } );
    const factorsTextOptions = {
      font: AreaModelCommonConstants.PARTIAL_FACTOR_FONT
    };
    const horizontalRichText = new RichText( '', factorsTextOptions );
    const verticalRichText = new RichText( '', factorsTextOptions );

    const rectangleSize = allowExponents ? 12 : 14;

    // Shifting the rectangles down, so we don't incur a large performance penalty for size-testing things
    const rectangleExponentPadding = allowExponents ? 1.3 : 0;
    const rectangleCenterY = new Text( ' ', factorsTextOptions ).centerY - rectangleSize / 2 + rectangleExponentPadding;
    const horizontalRectangle = new Rectangle( 0, rectangleCenterY, rectangleSize, rectangleSize, {
      stroke: 'black',
      lineWidth: 0.7
    } );
    const verticalRectangle = new Rectangle( 0, rectangleCenterY, rectangleSize, rectangleSize, {
      stroke: 'black',
      lineWidth: 0.7
    } );
    if ( allowExponents ) {
      const exponentPadding = 2;
      horizontalRectangle.localBounds = horizontalRectangle.localBounds.dilatedX( exponentPadding );
      verticalRectangle.localBounds = verticalRectangle.localBounds.dilatedX( exponentPadding );
    }

    // Persistent text nodes (for performance)
    const leftParenNode = new Text( '(', factorsTextOptions );
    const middleParensNode = new Text( ')(', factorsTextOptions );
    const rightParenNode = new Text( ')', factorsTextOptions );
    const timesNode = new Text( MathSymbols.TIMES, factorsTextOptions );

    // Text/alignment
    Property.multilink(
      [ horizontalSizeProperty, verticalSizeProperty, partialProductsChoiceProperty ],
      function( horizontalSize, verticalSize, choice ) {
        let children;

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

          const horizontalNode = horizontalSize
                               ? horizontalRichText.setText( horizontalSize.toRichString( false ) )
                               : horizontalRectangle;
          const verticalNode = verticalSize
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

        box.children = children;

        if ( isFinite( box.width ) ) {
          box.center = Vector2.ZERO;
          background.rectBounds = box.bounds.dilatedXY( 4, 2 );
        }
      } );
  }

  areaModelCommon.register( 'PartialProductLabelNode', PartialProductLabelNode );

  return inherit( Node, PartialProductLabelNode );
} );
