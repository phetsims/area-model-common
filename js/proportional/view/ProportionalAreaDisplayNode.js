// Copyright 2017, University of Colorado Boulder

/**
 * View for ProportionalArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  // var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  // var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  // var BooleanProperty = require( 'AXON/BooleanProperty' );
  // var CountingAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/CountingAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  // var Property = require( 'AXON/Property' );
  // var ProportionalArea = require( 'AREA_MODEL_COMMON/proportional/model/ProportionalArea' );
  var ProportionalAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaNode' );
  // var ProportionalAreaGridLinesNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalAreaGridLinesNode' );
  // var ProportionalDragHandle = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalDragHandle' );
  // var ProportionalPartitionLineNode = require( 'AREA_MODEL_COMMON/proportional/view/ProportionalPartitionLineNode' );
  // var Range = require( 'DOT/Range' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var Text = require( 'SCENERY/nodes/Text' );
  // var TiledAreaNode = require( 'AREA_MODEL_COMMON/proportional/view/TiledAreaNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProportionalAreaDisplay} areaDisplay
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [options]
   * @param {Object} [nodeOptions]
   */
  function ProportionalAreaDisplayNode( areaDisplay, partialProductsChoiceProperty, options, nodeOptions ) {

    var self = this;

    Node.call( this );

    // TODO: Remove the workaround here. This leaks memory like nuts. seriously
    areaDisplay.areaProperty.link( function( area ) {
      self.children = [
        new ProportionalAreaNode( area, partialProductsChoiceProperty, options )
      ];
    } );

    // TODO: remove stubs
    this.areaLayer = new Node();
    this.eraseButton = new Node();

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'ProportionalAreaDisplayNode', ProportionalAreaDisplayNode );

  return inherit( Node, ProportionalAreaDisplayNode, {
    update: function() {
      // TODO
      this.children[ 0 ].update();
    }
  } );
} );
