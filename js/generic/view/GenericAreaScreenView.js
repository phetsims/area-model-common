// Copyright 2017-2020, University of Colorado Boulder

/**
 * Supertype screenview for generic screens.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import areaModelCommon from '../../areaModelCommon.js';
import OrientationPair from '../../common/model/OrientationPair.js';
import AreaScreenView from '../../common/view/AreaScreenView.js';
import GenericAreaModel from '../model/GenericAreaModel.js';
import GenericAreaDisplayNode from './GenericAreaDisplayNode.js';
import GenericFactorsNode from './GenericFactorsNode.js';
import GenericLayoutSelectionNode from './GenericLayoutSelectionNode.js';

/**
 * @constructor
 * @extends {AreaScreenView}
 *
 * @param {GenericAreaModel} model
 * @param {number} decimalPlaces
 */
function GenericAreaScreenView( model, decimalPlaces ) {
  assert && assert( model instanceof GenericAreaModel );
  assert && assert( typeof decimalPlaces === 'number' );

  // @private {Node}
  this.popupLayer = new Node();

  // @private {Node|null} - Will be filled in with getRightAlignNodes (we need lazy creation here unfortunately).
  // We need to construct it later when factorsBox.width is defined (so we can properly size it), but we can't wait
  // until the supertype is fully constructed since then our right align setup will have been constructed fully.
  this.layoutSelectionNode = null;

  AreaScreenView.call( this, model, {
    isProportional: false,
    decimalPlaces: decimalPlaces
  } );

  this.addChild( this.popupLayer );
}

areaModelCommon.register( 'GenericAreaScreenView', GenericAreaScreenView );

inherit( AreaScreenView, GenericAreaScreenView, {
  /**
   * @protected
   * @override
   *
   * @returns {Array.<Node>}
   */
  getRightAlignNodes: function() {
    assert && assert( !this.layoutSelectionNode, 'Should not be called multiple times or it will leak memory' );

    this.layoutSelectionNode = new GenericLayoutSelectionNode(
      this.model.genericLayoutProperty,
      this.popupLayer,
      this.factorsBox.width
    );
    return [ this.layoutSelectionNode ].concat( AreaScreenView.prototype.getRightAlignNodes.call( this ) );
  },

  /**
   * Creates the main area display view for the screen.
   * @public
   * @override
   *
   * @param {GenericAreaModel} model
   * @returns {GenericAreaDisplayNode}
   */
  createAreaDisplayNode: function( model ) {
    return new GenericAreaDisplayNode( model.areaDisplay, model.allowExponents, model.partialProductsChoiceProperty, {
      translation: this.getDisplayTranslation()
    } );
  },

  /**
   * Creates the "factors" (dimensions) content for the accordion box.
   * @public
   * @override
   *
   * @param {GenericAreaModel} model
   * @param {number} decimalPlaces
   * @returns {Node}
   */
  createFactorsNode: function( model, decimalPlaces ) {
    const dynamicProperties = OrientationPair.create( function( orientation ) {
      return new DynamicProperty( new DerivedProperty( [ model.currentAreaProperty ], function( area ) {
        return area.displayProperties.get( orientation );
      } ) );
    } );
    return new GenericFactorsNode( dynamicProperties, new Property( model.allowExponents ) );
  }
} );

export default GenericAreaScreenView;