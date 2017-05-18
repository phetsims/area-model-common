// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
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
  var TermEditNode = require( 'AREA_MODEL_COMMON/view/TermEditNode' );

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

    // TODO: isErrorState handling for the color?
    TermEditNode.call( this,
      partition.orientation, // orientation
      partition.sizeProperty, // termProperty
      partition.colorProperty, // textColorProperty
      partition.colorProperty, // borderColorProperty
      // isActiveProperty
      new DerivedProperty( [ area.activePartitionProperty ], function( activePartition ) {
        return activePartition === partition;
      } ),
      partition.digitCount, // digitCount
      allowExponents, // allowExponents
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
