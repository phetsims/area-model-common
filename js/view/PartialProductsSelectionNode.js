// Copyright 2017, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing partial products in partitioned areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<PartialProductsChoice} partialProductsChoiceProperty
   * @param {Property.<Color>} widthColorProperty
   * @param {Property.<Color>} heightColorProperty
   */
  function PartialProductsSelectionNode( partialProductsChoiceProperty, widthColorProperty, heightColorProperty ) {

    Node.call( this );

    var group = new AlignGroup();

    var radioItems = [
      {
        value: PartialProductsChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      },
      {
        value: PartialProductsChoice.PRODUCTS,
        node: new AlignBox( new Text( 'A', { font: AreaModelConstants.SYMBOL_FONT } ), { group: group } )
      },
      {
        value: PartialProductsChoice.FACTORS,
        // TODO: when selected, highlight the a and b with colors!!!
        node: new AlignBox( new HBox( {
          children: [
            new Text( 'a', {
              font: AreaModelConstants.SYMBOL_FONT,
              fill: new DerivedProperty( [ partialProductsChoiceProperty, heightColorProperty ], function( value, heightColor ) {
                return value === PartialProductsChoice.FACTORS ? heightColor : 'black';
              } )
            } ),
            new Text( AreaModelConstants.X_STRING, {
              font: AreaModelConstants.SYMBOL_FONT
            } ),
            new Text( 'b', {
              font: AreaModelConstants.SYMBOL_FONT,
              fill: new DerivedProperty( [ partialProductsChoiceProperty, widthColorProperty ], function( value, widthColor ) {
                return value === PartialProductsChoice.FACTORS ? widthColor : 'black';
              } )
            } )
          ],
          spacing: 5
        } ), { group: group } )
      }
    ];

    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ partialProductsChoiceProperty, radioItems ], {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2
    }, {
      selectedStroke: AreaModelColorProfile.radioBorderProperty,
      baseColor: AreaModelColorProfile.radioBackgroundProperty
    } ) );
  }

  areaModelCommon.register( 'PartialProductsSelectionNode', PartialProductsSelectionNode );

  return inherit( Node, PartialProductsSelectionNode );
} );
