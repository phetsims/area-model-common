// Copyright 2023, University of Colorado Boulder

/**
 * The JugglerCharacterSet defines what is needed for each character set in Area Model Algebra and Area Model
 * Multiplication.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import areaModelCommon from '../../areaModelCommon.js';

export default class JugglerCharacterSet extends RegionAndCulturePortrayal {
  /**
   *
   * @param label { LocalizedStringProperty }
   * @param levelOne { HTMLImageElement }
   * @param levelTwo { HTMLImageElement }
   * @param levelThree { HTMLImageElement }
   * @param levelFour { HTMLImageElement }
   * @param levelFive { HTMLImageElement }
   * @param levelSix { HTMLImageElement }
   * @param screenHomeIcon { HTMLImageElement }
   * @param queryParameterValue { string }
   */
  constructor( label,
               levelOne, levelTwo, levelThree,
               levelFour, levelFive, levelSix,
               screenHomeIcon, queryParameterValue ) {

    super( label, queryParameterValue, {} );

    this.levelOne = levelOne;
    this.levelTwo = levelTwo;
    this.levelThree = levelThree;
    this.levelFour = levelFour;
    this.levelFive = levelFive;
    this.levelSix = levelSix;
    this.screenHomeIcon = screenHomeIcon;
  }
}

areaModelCommon.register( 'JugglerCharacterSet', JugglerCharacterSet );