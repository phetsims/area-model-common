// Copyright 2023, University of Colorado Boulder

/**
 * GameScreenIcon places all the screenIcons of different region and culture representations into a single Node.
 * Each icon's visibility is controlled by the regionAndCulturePortrayalProperty.
 *
 * @author Luisa Vargas
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Node, Image } from '../../../../scenery/js/imports.js';
import areaModelCommon from '../../areaModelCommon.js';

export default class GameScreenIcon extends ScreenIcon {

  /**
   * @param { Array<JugglerCharacterSet> } characterSets
   * @param { Property<RegionAndCulturePortrayal> } regionAndCulturePortrayalProperty
   */
  constructor( characterSets, regionAndCulturePortrayalProperty ) {

    const gameScreenImages = characterSets.map( set => {
      return new Image( set.screenHomeIcon, {
        visibleProperty: new DerivedProperty( [ regionAndCulturePortrayalProperty ], portrayal => {
          return portrayal === set;
        } )
      } );
    } );

    const screenIconNode = new Node( {
      children: gameScreenImages
    } );
    super( screenIconNode, { maxIconWidthProportion: 1, maxIconHeightProportion: 1 } );
  }
}

areaModelCommon.register( 'GameScreenIcon', GameScreenIcon );