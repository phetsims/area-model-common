// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
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
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   */
  function ProblemNode() {

    Node.call( this );

    var xText = new Text( AreaModelConstants.X_STRING, {
      font: AreaModelConstants.PROBLEM_X_FONT
    } );

    this.addChild( xText );
  }

  areaModelCommon.register( 'ProblemNode', ProblemNode );

  return inherit( Node, ProblemNode );
} );
