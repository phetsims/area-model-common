// Copyright 2017, University of Colorado Boulder

/**
 * Shows radio buttons that allow selecting between different ways of showing area computations (or none).
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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @constructor
   */
  function AreaCalculationSelectionNode() {

    Node.call( this );

    var group = new AlignGroup();

    var radioItems = [
      {
        value: 'TODO',
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      },
      {
        value: 'YUPTODO',
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      },
      {
        value: 'VERYTODO',
        node: new AlignBox( new FontAwesomeNode( 'eye_close', { scale: 0.8 } ), { group: group } )
      }
    ];

    this.addChild( new MutableOptionsNode( RadioButtonGroup, [ new Property( 'TODO' ), radioItems ], {
      orientation: 'horizontal',
      buttonContentXMargin: 10,
      buttonContentYMargin: 10,
      selectedLineWidth: 2
    }, {
      selectedStroke: AreaModelColorProfile.radioBorderProperty,
      baseColor: AreaModelColorProfile.radioBackgroundProperty
    } ) );
  }

  areaModelCommon.register( 'AreaCalculationSelectionNode', AreaCalculationSelectionNode );

  return inherit( Node, AreaCalculationSelectionNode );
} );
