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
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var TermEditNode = require( 'AREA_MODEL_COMMON/view/TermEditNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: Generalize parameters (like others) and add an options object. Don't rely in actual Partition reference
   * @param {GenericArea} area TODO type doc needs updating?
   * @param {GenericPartition} partition
   * @param {ModelViewTransform2} modelViewTransform
   * @param {boolean} allowExponents
   */
  function PartitionSizeEditNode( area, partition, modelViewTransform, allowExponents ) {
    var self = this;

    // TODO: isErrorState handling for the color?
    // TODO: options object
    TermEditNode.call( this,
      partition.orientation, // orientation
      partition.sizeProperty, // termProperty
      partition.colorProperty, // textColorProperty
      partition.colorProperty, // borderColorProperty TODO pass in
      // isActiveProperty
      new DerivedProperty( [ area.activePartitionProperty ], function( activePartition ) {
        return activePartition === partition;
      } ),
      new Property( partition.digitCount ), // digitCountProperty
      new Property( allowExponents ), // allowExponentsProperty
      // editCallback
      function() {
        area.activePartitionProperty.value = partition;
      }
    );

    // Primary orientation (location of range center)
    partition.coordinateRangeProperty.link( function( range ) {
      if ( range ) {
        self[ partition.orientation.centerCoordinate ] = partition.orientation.modelToView( modelViewTransform, range.getCenter() );
      }
    } );

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
