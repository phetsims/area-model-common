// Copyright 2017, University of Colorado Boulder

/**
 * Shows the product or factors for a partitioned area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {PartitionedArea} partitionedArea
   * @param {boolean} allowExponents
   */
  function PartialProductsLabel( partialProductsChoiceProperty, partitionedArea, allowExponents ) {
    assert && assert( partitionedArea instanceof PartitionedArea );
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    Node.call( this );

    var text = new RichText( '', {
      font: AreaModelConstants.PARTIAL_PRODUCT_FONT
    } );
    partialProductsChoiceProperty.link( function( choice ) {
      text.font = ( choice === PartialProductsChoice.PRODUCTS ) ? AreaModelConstants.PARTIAL_PRODUCT_FONT
                                                                : AreaModelConstants.PARTIAL_FACTOR_FONT;
    } );
    this.addChild( text );

    Property.multilink( [ partitionedArea.areaProperty, partialProductsChoiceProperty, partitionedArea.visibleProperty ], function( area, choice, areaVisible ) {
      self.visible = areaVisible && ( area !== null && choice !== PartialProductsChoice.HIDDEN );
    } );

    Property.multilink( [ partitionedArea.horizontalPartition.sizeProperty, partitionedArea.verticalPartition.sizeProperty, partialProductsChoiceProperty ], function( horizontalSize, verticalSize, choice ) {
      if ( horizontalSize === null || verticalSize === null || choice === PartialProductsChoice.HIDDEN ) {
        text.text = '';
      }
      else {
        // Products
        if ( choice === PartialProductsChoice.PRODUCTS ) {
          text.text = horizontalSize.times( verticalSize ).toRichString( false );
        }
        // Factors
        else {
          if ( allowExponents ) {
            text.text = '(' + verticalSize.toRichString( false ) + ')' +
                        '(' + horizontalSize.toRichString( false ) + ')';
          }
          else {
            if ( horizontalSize.equals( verticalSize ) ) {
              assert && assert( horizontalSize.power === 0 );
              text.text = ( Math.round( 100 * horizontalSize.coefficient ) / 100 ) + '<sup>2</sup>';
            }
            else {
              text.text = verticalSize.toRichString( false ) +
                          ' ' + AreaModelConstants.X_STRING + ' ' +
                          horizontalSize.toRichString( false );
            }
          }
        }
      }
      if ( text.text.length ) {
        text.center = Vector2.ZERO;
      }
    } );
  }

  areaModelCommon.register( 'PartialProductsLabel', PartialProductsLabel );

  return inherit( Node, PartialProductsLabel );
} );
