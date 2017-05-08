// Copyright 2017, University of Colorado Boulder

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonModel = require( 'AREA_MODEL_COMMON/area-model-common/model/AreaModelCommonModel' );
  var AreaModelCommonScreenView = require( 'AREA_MODEL_COMMON/area-model-common/view/AreaModelCommonScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @constructor
   */
  function AreaModelCommonScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new AreaModelCommonModel(); },
      function( model ) { return new AreaModelCommonScreenView( model ); },
      options
    );
  }

  areaModelCommon.register( 'AreaModelCommonScreen', AreaModelCommonScreen );

  return inherit( Screen, AreaModelCommonScreen );
} );