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
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var PartialProductsChoice = require( 'AREA_MODEL_COMMON/common/enum/PartialProductsChoice' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {AreaModelCommonModel} model
   * @param {AlignGroup} selectionButtonAlignGroup
   */
  function PartialProductSelectionNode( model, selectionButtonAlignGroup ) {

    Node.call( this );

    // hardcoded strings since they shouldn't be translatable
    var templateLabels = OrientationPair.create( function( orientation ) {
      return new Text( orientation === Orientation.HORIZONTAL ? 'b' : 'a', {
        font: AreaModelCommonConstants.SYMBOL_FONT,
        fill: new DerivedProperty( [ model.partialProductsChoiceProperty, model.colorProperties.get( orientation ) ], function( value, color ) {
          return value === PartialProductsChoice.FACTORS ? color : 'black';
        } )
      } );
    } );

    // Both are built here so it is a consistent size across screens.
    var iconGroup = new AlignGroup();
    var exponentsIcon = new AlignBox( this.createExponentIcon( templateLabels ), { group: iconGroup } );
    var noExponentsIcon = new AlignBox( this.createNonExponentIcon( templateLabels ), { group: iconGroup } );

    var radioItems = [
      {
        value: PartialProductsChoice.HIDDEN,
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: selectionButtonAlignGroup } )
      },
      {
        value: PartialProductsChoice.PRODUCTS,
        node: new AlignBox( new Text( 'A', { font: AreaModelCommonConstants.SYMBOL_FONT } ), { group: selectionButtonAlignGroup } )
      },
      {
        value: PartialProductsChoice.FACTORS,
        node: new AlignBox( model.allowExponents ? exponentsIcon : noExponentsIcon, { group: selectionButtonAlignGroup } )
      }
    ];

    // RadioButtonGroup doesn't support {Color} for baseColor/selectedStroke, so we need to wrap it.
    // TODO: This is a pattern used a few times now, with the... same color? Factor out into a common place!
    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ model.partialProductsChoiceProperty, radioItems ], {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }, {
      selectedStroke: AreaModelCommonColorProfile.radioBorderProperty,
      baseColor: AreaModelCommonColorProfile.radioBackgroundProperty
    } ) );
  }

  areaModelCommon.register( 'PartialProductSelectionNode', PartialProductSelectionNode );

  return inherit( Node, PartialProductSelectionNode, {
    /**
     * Creates an 'exponents-allowed' icon based on a pair of nodes.
     * @private
     *
     * @param {OrientationPair.<Node>} nodes
     * @returns {Node}
     */
    createExponentIcon: function( nodes ) {
      return new HBox( {
        children: [
          new Text( '(', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.vertical ] } ),
          new Text( ')(', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.horizontal ] } ),
          new Text( ')', {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } )
        ],
        spacing: 0,
        scale: 0.9
      } );
    },

    /**
     * Creates an 'no-exponents' icon based on a pair of nodes.
     * @private
     *
     * @param {OrientationPair.<Node>} nodes
     * @returns {Node}
     */
    createNonExponentIcon: function( nodes ) {
      return new HBox( {
        children: [
          new Node( { children: [ nodes.vertical ] } ),
          new Text( MathSymbols.TIMES, {
            font: AreaModelCommonConstants.SYMBOL_FONT
          } ),
          new Node( { children: [ nodes.horizontal ] } )
        ],
        spacing: 5
      } );
    }
  } );
} );
