// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GenericArea} area
   * @param {GenericPartition} partition
   * @param {ModelViewTransform2} modelViewTransform
   * @param {boolean} allowExponents
   */
  function GenericEditNode( area, partition, modelViewTransform, allowExponents ) {

    var self = this;

    var readoutText = new RichText( Term.getLongestGenericString( allowExponents, partition.digitCount ), {
      fill: partition.colorProperty,
      font: AreaModelConstants.EDIT_READOUT_FONT
    } );

    var readoutBackground = new Rectangle( 0, 0, readoutText.width + 5, readoutText.height + 5, {
      stroke: partition.colorProperty,
      cornerRadius: 4,
      children: [
        readoutText
      ]
    } );

    partition.sizeProperty.link( function( size ) {
      if ( size === null ) {
        readoutText.text = '';
      }
      else {
        readoutText.text = size.toRichString( false );
        readoutText.center = readoutBackground.selfBounds.center;
      }
    } );

    area.activePartitionProperty.link( function( activePartition ) {
      readoutBackground.fill = activePartition === partition ? AreaModelColorProfile.editActiveBackgroundProperty
                                                             : AreaModelColorProfile.editInactiveBackgroundProperty;
    } );

    LayoutBox.call( this, {
      orientation: partition.orientation === Orientation.HORIZONTAL ? 'horizontal' : 'vertical',
      spacing: 4,
      children: [
        readoutBackground,
        new MutableOptionsNode( RectangularPushButton, [], {
          content: new FontAwesomeNode( 'pencil_square_o', {
            scale: 0.4,
            xMargin: 6,
            yMargin: 4
          } ),
          listener: function() {
            // Make it the active partition
            area.activePartitionProperty.value = partition;
          }
        }, {
          baseColor: AreaModelColorProfile.editButtonBackgroundProperty
        } )
      ]
    } );

    // Primary orientation (location of range center)
    partition.coordinateRangeProperty.link( function( range ) {
      if ( range ) {
        var modelToView = ( partition.orientation === Orientation.HORIZONTAL ? modelViewTransform.modelToViewX : modelViewTransform.modelToViewY ).bind( modelViewTransform );
        self[ Orientation.getCenterCoordinateName( partition.orientation ) ] = modelToView( range.getCenter() );
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

  areaModelCommon.register( 'GenericEditNode', GenericEditNode );

  return inherit( LayoutBox, GenericEditNode );
} );
