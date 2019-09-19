// Copyright 2018, University of Colorado Boulder

/**
 * The "Variables" screen of "Area Model: Algebra"
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const GenericAreaModel = require( 'AREA_MODEL_COMMON/generic/model/GenericAreaModel' );
  const GenericAreaScreenView = require( 'AREA_MODEL_COMMON/generic/view/GenericAreaScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const variablesScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/variables-screen-icon.png' );

  // strings
  const screenVariablesString = require( 'string!AREA_MODEL_COMMON/screen.variables' );

  /**
   * @constructor
   */
  function VariablesScreen() {

    const options = {
      name: screenVariablesString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( variablesScreenIconImage )
    };

    Screen.call( this,
      function() {
        return new GenericAreaModel( {
          allowExponents: true
        } );
      },
      function( model ) { return new GenericAreaScreenView( model, 0 ); },
      options
    );
  }

  areaModelCommon.register( 'VariablesScreen', VariablesScreen );

  return inherit( Screen, VariablesScreen );
} );
