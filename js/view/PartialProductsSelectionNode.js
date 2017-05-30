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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/model/PartialProductsChoice' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {AreaModel} model
   */
  function PartialProductsSelectionNode( model ) {

    Node.call( this );


    var horizontalText = new Text( 'b', {
      font: AreaModelConstants.SYMBOL_FONT,
      fill: new DerivedProperty( [ model.partialProductsChoiceProperty, model.getColorProperty( Orientation.HORIZONTAL ) ], function( value, widthColor ) {
        return value === PartialProductsChoice.FACTORS ? widthColor : 'black';
      } )
    } );
    var verticalText = new Text( 'a', {
      font: AreaModelConstants.SYMBOL_FONT,
      fill: new DerivedProperty( [ model.partialProductsChoiceProperty, model.getColorProperty( Orientation.VERTICAL ) ], function( value, heightColor ) {
        return value === PartialProductsChoice.FACTORS ? heightColor : 'black';
      } )
    } );

    //TODO: don't require both to be built
    var iconGroup = new AlignGroup();
    var exponentsIcon = new AlignBox( this.createExponentIcon( horizontalText, verticalText ), { group: iconGroup } );
    var noExponentsIcon = new AlignBox( this.createNonExponentIcon( horizontalText, verticalText ), { group: iconGroup } );

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
        node: new AlignBox( model.allowExponents ? exponentsIcon : noExponentsIcon, { group: group } )
      }
    ];

    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ model.partialProductsChoiceProperty, radioItems ], {
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

  return inherit( Node, PartialProductsSelectionNode, {
    // TODO: doc
    createExponentIcon: function( horizontalNode, verticalNode ) {
      return new HBox( {
        children: [
          new Text( '(', {
            font: AreaModelConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ verticalNode ] } ),
          new Text( ')(', {
            font: AreaModelConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ horizontalNode ] } ),
          new Text( ')', {
            font: AreaModelConstants.SYMBOL_FONT
          } )
        ],
        spacing: 0,
        scale: 0.9
      } );
    },

    // TODO: doc
    createNonExponentIcon: function( horizontalNode, verticalNode ) {
      return new HBox( {
        children: [
          new Node( { children: [ verticalNode ] } ),
          new Text( AreaModelConstants.X_STRING, {
            font: AreaModelConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ horizontalNode ] } )
        ],
        spacing: 5
      } );
    }
  } );
} );
