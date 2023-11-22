// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import { USA_QUERY_VALUE } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import genericGameScreenIcon_png from '../../../mipmaps/genericGameScreenIcon_png.js';
import level1Icon_png from '../../../mipmaps/level1Icon_png.js';
import level2Icon_png from '../../../mipmaps/level2Icon_png.js';
import level3Icon_png from '../../../mipmaps/level3Icon_png.js';
import level4Icon_png from '../../../mipmaps/level4Icon_png.js';
import level5Icon_png from '../../../mipmaps/level5Icon_png.js';
import level6Icon_png from '../../../mipmaps/level6Icon_png.js';
import AreaModelCommonStrings from '../../AreaModelCommonStrings.js';
import JugglerCharacterSet from './JugglerCharacterSet.js';


const JugglerCharacterSetUSA = new JugglerCharacterSet(
  AreaModelCommonStrings.characterSet.unitedStatesOfAmericaStringProperty,
  level1Icon_png,
  level2Icon_png,
  level3Icon_png,
  level4Icon_png,
  level5Icon_png,
  level6Icon_png,
  genericGameScreenIcon_png,
  USA_QUERY_VALUE
);

export default JugglerCharacterSetUSA;