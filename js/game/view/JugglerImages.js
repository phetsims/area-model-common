// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Level Juggler in this sim. Collects the images to support selecting a different
 * juggler character for localization.
 *
 * @author Luisa Vargas
 */

import areaModelCommon from '../../areaModelCommon.js';
import JugglerCharacterSetUSA from './JugglerCharacterSetUSA.js';

const JugglerImages = {
  JUGGLER_CHARACTER_SETS: [
    JugglerCharacterSetUSA
  ]
};

areaModelCommon.register( 'JugglerImages', JugglerImages );
export default JugglerImages;