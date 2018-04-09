// Copyright 2017-2018, University of Colorado Boulder

/**
 * Positions an edit button with a readout at the top/side of the partition.
 *
 * NOTE: This type should be persistent, so we don't need to handle unlinking of properties.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Property.<Partition|null>} activePartitionProperty
   * @param {Property.<GenericPartition|null>} partitionProperty
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  function PartitionSizeEditNode( activePartitionProperty, partitionProperty, modelViewTransformProperty, allowExponents ) {
    var self = this;

    // @public {Property.<Partition|null>} - Exposed so it can be changed after creation in pooling.
    this.partitionProperty = partitionProperty;

    var orientationProperty = new DerivedProperty( [ partitionProperty ], function( partition ) {
      return partition ? partition.orientation : Orientation.HORIZONTAL; // Default if we have none
    } );
    var sizeProperty = new DynamicProperty( partitionProperty, { derive: 'sizeProperty' } );
    var colorProperty = new DynamicProperty( partitionProperty, {
      derive: 'colorProperty',
      defaultValue: Color.MAGENTA // Should not see this, but need a valid color
    } );

    TermEditNode.call( this, orientationProperty, sizeProperty, {
      textColorProperty: colorProperty,
      borderColorProperty: colorProperty,
      isActiveProperty: new DerivedProperty( [ activePartitionProperty, partitionProperty ], function( activePartition, partition ) {
        return activePartition === partition;
      } ),
      digitCountProperty: new DerivedProperty( [ partitionProperty ], function( partition ) {
        return partition ? partition.digitCount : 1; // Default if we have none
      } ),
      allowExponentsProperty: new Property( allowExponents ),
      editCallback: function() {
        activePartitionProperty.value = partitionProperty.value;
      }
    } );

    // Primary orientation (location of range center)
    var coordinateRangeProperty = new DynamicProperty( partitionProperty, { derive: 'coordinateRangeProperty' } );
    Property.multilink( [ partitionProperty, coordinateRangeProperty, modelViewTransformProperty ], function( partition, range, modelViewTransform ) {
      if ( range && partition ) {
        self[ partition.orientation.centerCoordinate ] = partition.orientation.modelToView( modelViewTransform, range.getCenter() );
      }
    } );

    // Secondary (offsets)
    partitionProperty.link( function( partition ) {
      if ( partition ) {
        self[ partition.orientation.opposite.centerCoordinate ] = AreaModelCommonConstants.PARTITION_OFFSET.get( partition.orientation );
      }
    } );

    new DynamicProperty( partitionProperty, {
      derive: 'visibleProperty',
      defaultValue: false
    } ).linkAttribute( this, 'visible' );
  }

  areaModelCommon.register( 'PartitionSizeEditNode', PartitionSizeEditNode );

  return inherit( TermEditNode, PartitionSizeEditNode );
} );
