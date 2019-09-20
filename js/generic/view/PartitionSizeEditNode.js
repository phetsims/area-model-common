// Copyright 2017-2019, University of Colorado Boulder

/**
 * Positions an edit button with a readout at the top/side of the partition.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const Property = require( 'AXON/Property' );
  const TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );

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
    const self = this;

    // @public {Property.<Partition|null>} - Exposed so it can be changed after creation in pooling.
    this.partitionProperty = partitionProperty;

    const orientationProperty = new DerivedProperty( [ partitionProperty ], function( partition ) {
      return partition ? partition.orientation : Orientation.HORIZONTAL; // Default if we have none
    } );
    const sizeProperty = new DynamicProperty( partitionProperty, { derive: 'sizeProperty' } );
    const colorProperty = new DynamicProperty( partitionProperty, {
      derive: 'colorProperty',
      defaultValue: Color.MAGENTA // Should not see this, but need a valid color
    } );

    TermEditNode.call( this, orientationProperty, sizeProperty, {
      textColorProperty: colorProperty,
      borderColorProperty: colorProperty,
      isActiveProperty: new DerivedProperty(
        [ activePartitionProperty, partitionProperty ],
        function( activePartition, partition ) {
          return activePartition === partition;
        } ),
      digitCountProperty: new DerivedProperty( [ partitionProperty ], function( partition ) {
        return partition ? partition.digitCount : 1; // Default if we have none
      } ),
      allowExponentsProperty: new Property( allowExponents ),
      editCallback: function() {
        if ( activePartitionProperty.value !== partitionProperty.value ) {
          activePartitionProperty.value = partitionProperty.value;
        }
        else {
          // Pressing on the edit button when that keypad is already open will instead close the keypad.
          // See https://github.com/phetsims/area-model-common/issues/127
          activePartitionProperty.value = null;
        }
      }
    } );

    // Primary orientation (location of range center)
    const coordinateRangeProperty = new DynamicProperty( partitionProperty, { derive: 'coordinateRangeProperty' } );
    Property.multilink(
      [ partitionProperty, coordinateRangeProperty, modelViewTransformProperty ],
      function( partition, range, modelViewTransform ) {
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
