// Copyright 2017-2018, University of Colorado Boulder

/**
 * Colored background area for generic partitioned areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<PartitionedArea>} partitionedAreaProperty
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   */
  function GenericPartitionedAreaNode( partitionedAreaProperty, modelViewTransformProperty ) {
    var self = this;

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

    // Bounds
    var rangeMultilinks = null; // {OrientationPair.<Multilink>|null}
    partitionedAreaProperty.link( function( partitionedArea ) {
      // Release any previous references
      rangeMultilinks && rangeMultilinks.forEach( function( rangeMultilink ) {
        rangeMultilink.dispose();
      } );
      rangeMultilinks = null;
      if ( partitionedArea ) {
        rangeMultilinks = partitionedArea.partitions.map( function( partition, orientation ) {
          return Property.multilink( [ partition.coordinateRangeProperty, modelViewTransformProperty ], function( range, modelViewTransform ) {
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

  return inherit( Rectangle, GenericPartitionedAreaNode );
} );
