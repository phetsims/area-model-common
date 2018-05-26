// Copyright 2018, University of Colorado Boulder

/**
 * Common logic for where we have a variable number of nodes that need to be used.
 *
 * // REVIEW: it would help me understand this better if you described how we previously solved this problem, or if this
 * // REVIEW is a novel problem for this simulation.
 * // REVIEW*: Mainly novel for this sim, and had 3 basically duplicated code areas. OK for me to describe the exact
 * // REVIEW*: use case (and why this is helpful) in prose above (will do), or is something else required?
 * // REVIEW: Prose in this doc sounds great, thanks!
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @constructor
   * @extends {Node}
   *
   * So you have a Property.<Array.<Item>>, and you want to lazily create ItemNodes for each? And say each ItemNode
   * has something like itemNode.itemProperty which controls which item it displays? And if the property is null, it
   * doesn't display? Do I have the incredibly-specific helper type for you! For the LOW LOW price of moving it to a
   * common repo, YOU COULD HAVE IT TOO!
   *
   * Hopefully this doesn't become a common pattern. We have 3+ usages of it, and it cleans things up overall to have
   * the not-super-simple logic in one place. Enjoy.
   *
   * @param {Object} config
   */
  function PoolableLayerNode( config ) {
    var self = this;

    config = _.extend( {
      // required
      arrayProperty: null, // {Property.<Array.<*>>} - Property that has an array of items
      createNode: null, // {function} - function( {*} item ): {Node} - Create a node from an item
      getItemProperty: null, // {function} - function( {*} itemNode ): {Property.<*>} - ItemNode => Item Property

      // Allow providing references
      usedArray: [],
      unusedArray: [],

      // Called after we run an update.
      updatedCallback: null
    }, config );

    Node.call( this );

    var usedArray = config.usedArray;
    var unusedArray = config.unusedArray;

    config.arrayProperty.link( function( items ) {

      // Unuse all of the item nodes (set their property to null, hiding them, and put them in the unused array)
      while ( usedArray.length ) {
        var oldItemNode = usedArray.pop();
        config.getItemProperty( oldItemNode ).value = null;
        unusedArray.push( oldItemNode );
      }

      items.forEach( function( item ) {
        var itemNode;

        // Grab one from the pool
        if ( unusedArray.length ) {
          itemNode = unusedArray.pop();
          config.getItemProperty( itemNode ).value = item;
        }

        // Or create a new one
        else {
          itemNode = config.createNode( item );
          self.addChild( itemNode );
        }

        usedArray.push( itemNode );
      } );

      config.updatedCallback && config.updatedCallback();
    } );
  }

  areaModelCommon.register( 'PoolableLayerNode', PoolableLayerNode );

  return inherit( Node, PoolableLayerNode );
} );
