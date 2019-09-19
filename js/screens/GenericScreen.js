// Copyright 2018, University of Colorado Boulder

/**
 * The "Generic" screen, used in "Area Model: Multiplication" and "Area Model: Algebra"
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
  const genericScreenIconImage = require( 'mipmap!AREA_MODEL_COMMON/generic-screen-icon.png' );

  // strings
  const screenGenericString = require( 'string!AREA_MODEL_COMMON/screen.generic' );

  /**
   * @constructor
   */
  function GenericScreen() {

    const options = {
      name: screenGenericString,
      backgroundColorProperty: AreaModelCommonColorProfile.backgroundProperty,
      homeScreenIcon: new Image( genericScreenIconImage )
    };

    Screen.call( this,
      function() {
        return new GenericAreaModel( {
          allowExponents: false
        } );
      },
      function( model ) { return new GenericAreaScreenView( model, 0 ); },
      options
    );
  }

  areaModelCommon.register( 'GenericScreen', GenericScreen );

  return inherit( Screen, GenericScreen );
} );
