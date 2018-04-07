// Copyright 2018, University of Colorado Boulder

/**
 * The "Variables" screen of "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  var GenericAreaScreenView = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenVariablesString = require( 'string!AREA_MODEL_COMMON/screen.variables' );

  /**
   * @constructor
   */
  function VariablesScreen() {

    var options = {
      name: screenVariablesString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty
    };

    Screen.call( this,
      function() { return new GenericAreaModel( {
        allowExponents: true
      } ); },
      function( model ) { return new GenericAreaScreenView( model, 0 ); },
      options
    );
  }

  areaModelCommon.register( 'VariablesScreen', VariablesScreen );

  return inherit( Screen, VariablesScreen );
} );
