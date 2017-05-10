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
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  /**
   * @constructor
   */
  function PartialProductsSelectionNode() {

    Node.call( this );

    var tmpRedColor = '#f00';
    var tmpBlueColor = '#00f';

    var group = new AlignGroup();

    var tmpProp = new Property( 'TODO' );

    var radioItems = [
      {
        value: 'TODO',
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      },
      {
        value: 'YUPTODO',
        node: new AlignBox( new Text( 'A', { font: AreaModelConstants.SYMBOL_FONT } ), { group: group } )
      },
      {
        value: 'VERYTODO',
        // TODO: when selected, highlight the a and b with colors!!!
        node: new AlignBox( new HBox( {
          children: [
            new Text( 'a', {
              font: AreaModelConstants.SYMBOL_FONT,
              fill: new DerivedProperty( [ tmpProp ], function( value ) {
                return value === 'VERYTODO' ? tmpRedColor : 'black';
              } )
            } ),
            new Text( AreaModelConstants.X_STRING, {
              font: AreaModelConstants.SYMBOL_FONT
            } ),
            new Text( 'b', {
              font: AreaModelConstants.SYMBOL_FONT,
              fill: new DerivedProperty( [ tmpProp ], function( value ) {
                return value === 'VERYTODO' ? tmpBlueColor : 'black';
              } )
            } )
          ],
          spacing: 5
        } ), { group: group } )
      }
    ];

    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ tmpProp, radioItems ], {
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
