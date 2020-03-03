// Copyright 2017-2020, University of Colorado Boulder

/**
 * Colored background area for generic partitioned areas.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

/**
 * @constructor
 * @extends {Node}
 *
 * @param {Property.<PartitionedArea>} partitionedAreaProperty
 * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
 */
function GenericPartitionedAreaNode( partitionedAreaProperty, modelViewTransformProperty ) {
  const self = this;

  // We'll set the fill/size/etc. below.
  Rectangle.call( this, {} );

  // @public {Property.<PartitionedArea>} - Exposed so it can be set later
  this.partitionedAreaProperty = partitionedAreaProperty;

  // Fill
  new DynamicProperty( partitionedAreaProperty, {
    derive: 'areaProperty'
  } ).link( function( area ) {
    if ( area === null || area.coefficient === 0 ) {
      self.fill = null;
    }
    else if ( area.coefficient > 0 ) {
      self.fill = AreaModelCommonColorProfile.genericPositiveBackgroundProperty;
    }
    else {
      self.fill = AreaModelCommonColorProfile.genericNegativeBackgroundProperty;
    }
  } );

  // Visibility
  new DynamicProperty( partitionedAreaProperty, {
    derive: 'visibleProperty',
    defaultValue: false
  } ).linkAttribute( this, 'visible' );

  // Adjust our rectangle dimension/position so that we take up the bounds defined by the partitioned area. Our area
  // can change, so we need to swap out or multilink when the area changes (kept so we can dispose it)
  let rangeMultilinks = null; // {OrientationPair.<Multilink>|null}
  partitionedAreaProperty.link( function( partitionedArea ) {
    // Release any previous references
    rangeMultilinks && rangeMultilinks.forEach( function( rangeMultilink ) {
      rangeMultilink.dispose();
    } );
    rangeMultilinks = null;
    if ( partitionedArea ) {
      rangeMultilinks = partitionedArea.partitions.map( function( partition, orientation ) {
        return Property.multilink(
          [ partition.coordinateRangeProperty, modelViewTransformProperty ],
          function( range, modelViewTransform ) {
            if ( range !== null ) {
              self[ orientation.rectCoordinate ] = modelViewTransform.modelToViewX( range.min );
              self[ orientation.rectSize ] = modelViewTransform.modelToViewX( range.getLength() );
            }
          } );
      } );
    }
  } );
}

areaModelCommon.register( 'GenericPartitionedAreaNode', GenericPartitionedAreaNode );

inherit( Rectangle, GenericPartitionedAreaNode );
export default GenericPartitionedAreaNode;
