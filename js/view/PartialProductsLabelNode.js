// Copyright 2017, University of Colorado Boulder

/**
 * Shows the product or factors for a partitioned area.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var PartitionedArea = require( 'AREA_MODEL_COMMON/model/PartitionedArea' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: generalize? don't rely on the partitionedArea?
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {PartitionedArea} partitionedArea
   * @param {boolean} allowExponents
   */
  function PartialProductsLabelNode( partialProductsChoiceProperty, partitionedArea, allowExponents ) {
    assert && assert( partialProductsChoiceProperty instanceof Property );
    assert && assert( partitionedArea instanceof PartitionedArea );
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    Node.call( this );

    // TODO: pull this reference, check where it is used
    // @public {PartitionedArea}
    this.partitionedArea = partitionedArea;

    var background = new Rectangle( {
      cornerRadius: 3,
      stroke: new DerivedProperty( [ partitionedArea.areaProperty, AreaModelColorProfile.partialProductBorderProperty ], function( area, color ) {
        return ( area === null || area.coefficient === 0 ) ? 'transparent' : color;
      } ),
      fill: AreaModelColorProfile.partialProductBackgroundProperty
    } );
    this.addChild( background );

    var box = new HBox();
    this.addChild( box );

    // Visibility
    Property.multilink( [ partialProductsChoiceProperty, partitionedArea.visibleProperty ], function( choice, areaVisible ) {
      self.visible = areaVisible && ( choice !== PartialProductsChoice.HIDDEN );
    } );

    // Text/alignment
    Property.multilink( [ partitionedArea.horizontalPartition.sizeProperty, partitionedArea.verticalPartition.sizeProperty, partialProductsChoiceProperty ], function( horizontalSize, verticalSize, choice ) {
      var textOptions = {
        font: ( choice === PartialProductsChoice.PRODUCTS ) ? AreaModelConstants.PARTIAL_PRODUCT_FONT
                                                            : AreaModelConstants.PARTIAL_FACTOR_FONT
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
        // Sometimes we can write something as a square, e.g. '8^2'
        if ( horizontalSize && verticalSize && horizontalSize.equals( verticalSize ) && !allowExponents ) {
          assert && assert( horizontalSize.power === 0 );
          box.children = [
            new RichText( ( Math.round( 100 * horizontalSize.coefficient ) / 100 ) + '<sup>2</sup>', textOptions )
          ];
        }
        else {
          var rectangleSize = allowExponents ? 12 : 14;
          var horizontalRectangle = new Rectangle( 0, 0, rectangleSize, rectangleSize, { stroke: 'black', lineWidth: 0.7 } );
          var verticalRectangle = new Rectangle( 0, 0, rectangleSize, rectangleSize, { stroke: 'black', lineWidth: 0.7 } );
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
            box.spacing = 3;
            box.children = [
              verticalNode,
              new Text( AreaModelConstants.X_STRING, textOptions ),
              horizontalNode,
            ];
          }
        }
      }
      if ( isFinite( box.width ) ) {
        box.center = Vector2.ZERO;
        background.rectBounds = box.bounds.dilatedXY( 4, 2 );
      }
    } );
  }

  areaModelCommon.register( 'PartialProductsLabelNode', PartialProductsLabelNode );

  return inherit( Node, PartialProductsLabelNode );
} );
