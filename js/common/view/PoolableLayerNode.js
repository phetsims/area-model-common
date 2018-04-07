// Copyright 2018, University of Colorado Boulder

/**
 * Common logic for where we have a variable number of nodes that need to be used.
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
   * @param {Object} options
   */
  function PoolableLayerNode( options ) {
    var self = this;

    options = _.extend( {
      // REQUIRED options (again, if you think of a better name...)
      arrayProperty: null, // {Property.<Array.<*>>} - Property that has an array of items
      createNode: null, // {function} - function( {*} item ): {Node} - Create a node from an item
      getItemProperty: null, // {function} - function( {*} itemNode ): {Property.<*>} - ItemNode => Item Property

      // Allow providing references
      usedArray: [],
      unusedArray: [],

      // Called after we run an update.
      updatedCallback: null
    }, options );

    Node.call( this );

    var usedArray = options.usedArray;
    var unusedArray = options.unusedArray;

    options.arrayProperty.link( function( items ) {
      // Unuse all of the item nodes (set their property to null, hiding them, and put them in the unused array)
      while ( usedArray.length ) {
        var oldItemNode = usedArray.pop();
        options.getItemProperty( oldItemNode ).value = null;
        unusedArray.push( oldItemNode );
      }

      items.forEach( function( item ) {
        var itemNode;

        // Grab one from the pool
        if ( unusedArray.length ) {
          itemNode = unusedArray.pop();
          options.getItemProperty( itemNode ).value = item;
        }
        // Or create a new one
        else {
          itemNode = options.createNode( item );
          self.addChild( itemNode );
        }

        usedArray.push( itemNode );
      } );

      options.updatedCallback && options.updatedCallback();
    } );
  }

  areaModelCommon.register( 'PoolableLayerNode', PoolableLayerNode );

  return inherit( Node, PoolableLayerNode );
} );
