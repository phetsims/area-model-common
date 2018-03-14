// Copyright 2017, University of Colorado Boulder

/**
 * Positions an edit button with a readout at the top/side of the partition.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/generic/view/TermEditNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GenericArea} area
   * @param {GenericPartition} partition
   * @param {ModelViewTransform2} modelViewTransform
   * @param {boolean} allowExponents
   */
  function PartitionSizeEditNode( area, partition, modelViewTransform, allowExponents ) {
    var self = this;

    //TODO: abstract out to be like how the game is edited?

    TermEditNode.call( this, partition.orientation, partition.sizeProperty, {
      textColorProperty: partition.colorProperty,
      borderColorProperty: partition.colorProperty,
      isActiveProperty: new DerivedProperty( [ area.activePartitionProperty ], function( activePartition ) {
        return activePartition === partition;
      } ),
      digitCountProperty: new Property( partition.digitCount ),
      allowExponentsProperty: new Property( allowExponents ),
      editCallback: function() {
        area.activePartitionProperty.value = partition;
      }
    } );

    // Primary orientation (location of range center)
    partition.coordinateRangeProperty.link( function( range ) {
      if ( range ) {
        self[ partition.orientation.centerCoordinate ] = partition.orientation.modelToView( modelViewTransform, range.getCenter() );
      }
    } );

    //TODO: factor out offsets with game view?
    // Secondary (offsets)
    if ( partition.orientation === Orientation.HORIZONTAL ) {
      this.centerY = -20;
    }
    else {
      this.centerX = -30;
    }

    partition.visibleProperty.linkAttribute( this, 'visible' );
  }

  areaModelCommon.register( 'PartitionSizeEditNode', PartitionSizeEditNode );

  return inherit( TermEditNode, PartitionSizeEditNode );
} );
