// Copyright 2023, University of Colorado Boulder

/**
 * The JugglerPortrayal defines what is needed for each portrayal in Area Model Algebra and Area Model
 * Multiplication.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import areaModelCommon from '../../areaModelCommon.js';

export default class JugglerPortrayal extends RegionAndCulturePortrayal {
  /**
   *
   * @param {RegionAndCulture} regionAndCulture
   * @param levelOne { HTMLImageElement }
   * @param levelTwo { HTMLImageElement }
   * @param levelThree { HTMLImageElement }
   * @param levelFour { HTMLImageElement }
   * @param levelFive { HTMLImageElement }
   * @param levelSix { HTMLImageElement }
   * @param screenHomeIcon { HTMLImageElement }
   */
  constructor( regionAndCulture,
               levelOne, levelTwo, levelThree,
               levelFour, levelFive, levelSix,
               screenHomeIcon ) {

    super( regionAndCulture );

    this.levelOne = levelOne;
    this.levelTwo = levelTwo;
    this.levelThree = levelThree;
    this.levelFour = levelFour;
    this.levelFive = levelFive;
    this.levelSix = levelSix;
    this.screenHomeIcon = screenHomeIcon;
  }
}

areaModelCommon.register( 'JugglerPortrayal', JugglerPortrayal );