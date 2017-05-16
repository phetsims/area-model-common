// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/view/AreaNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var GenericArea = require( 'AREA_MODEL_COMMON/model/GenericArea' );
  var GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/view/GenericPartitionedAreaNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/view/TermKeypadPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * @param {GenericArea} area
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaNode( area, allowExponents, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof GenericArea );
    assert && assert( typeof allowExponents === 'boolean' );
    assert && assert( partialProductsChoiceProperty instanceof Property );

    var self = this;

    AreaNode.call( this, area, partialProductsChoiceProperty, false );

    var firstOffset = this.viewSize * AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = this.viewSize * AreaModelConstants.GENERIC_SECOND_OFFSET;

    // Background
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    // Sign-colored partition area backgrounds
    area.partitionedAreas.forEach( function( partitionedArea ) {
      self.areaLayer.addChild( new GenericPartitionedAreaNode( partitionedArea, self.modelViewTransform ) );
    } );

    Orientation.CHOICES.forEach( function( orientation ) {
      // Partition line docks
      var properties = area.getPartitionLineActiveProperties( orientation );
      var dockOptions = {};
      dockOptions[ Orientation.getCoordinateName( Orientation.opposite( orientation ) ) ] = self.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS;

      dockOptions[ Orientation.getCoordinateName( orientation ) ] = firstOffset;
      self.areaLayer.addChild( self.createDock( properties[ 0 ], dockOptions ) );

      dockOptions[ Orientation.getCoordinateName( orientation ) ] = secondOffset;
      self.areaLayer.addChild( self.createDock( properties[ 1 ], dockOptions ) );

      // Partition lines
      self.areaLayer.addChild( self.createPartitionLine( properties[ 0 ], orientation, firstOffset ) );
      self.areaLayer.addChild( self.createPartitionLine( properties[ 1 ], orientation, secondOffset ) );
    } );

    function getSampleString( digitCount ) {
      if ( allowExponents ) {
        return '-9x<sup>2</sup>';
      }
      else {
        // TODO: consider using \u2212
        return '-' + _.range( 0, digitCount ).map( function() { return '9'; } ).join( '' );
      }
    }

    // TODO: refactor/cleanup
    function createEditButton( partition ) {

      // TODO: better way to test for size
      var sampleString = getSampleString( partition.digitCount );
      var richText = new RichText( sampleString, {
        fill: partition.colorProperty,
        font: AreaModelConstants.EDIT_READOUT_FONT
      } );

      var background = new Rectangle( 0, 0, richText.width + 5, richText.height + 5, {
        stroke: partition.colorProperty,
        cornerRadius: 4,
        children: [
          richText
        ]
      } );

      partition.sizeProperty.link( function( size ) {
        if ( size === null ) {
          richText.text = '';
        }
        else {
          richText.text = size.toRichString( false );
          richText.center = background.selfBounds.center;
        }
      } );

      area.activePartitionProperty.link( function( activePartition ) {
        background.fill = activePartition === partition ? AreaModelColorProfile.editActiveBackgroundProperty
                                                        : AreaModelColorProfile.editInactiveBackgroundProperty;
      } );

      var BoxType = partition.orientation === Orientation.HORIZONTAL ? HBox : VBox;

      var box = new BoxType( {
        spacing: 4,
        children: [
          background,
          new MutableOptionsNode( RectangularPushButton, [], {
            content: new FontAwesomeNode( 'pencil_square_o', {
              scale: 0.4,
              xMargin: 6,
              yMargin: 4
            } ),
            listener: function() {
              area.activePartitionProperty.value = partition;
            }
          }, {
            baseColor: AreaModelColorProfile.editButtonBackgroundProperty
          } )
        ]
      } );
      self.labelLayer.addChild( box );

      var primaryName = Orientation.getCenterCoordinateName( partition.orientation );

      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          box[ primaryName ] = range.getCenter() * self.viewSize;
        }
      } );
      if ( partition.orientation === Orientation.HORIZONTAL ) {
        box.centerY = -20;
      }
      else {
        box.centerX = -30;
      }
      partition.visibleProperty.linkAttribute( box, 'visible' );
    }
    area.partitions.forEach( createEditButton );

    // Keypad
    this.labelLayer.addChild( new TermKeypadPanel( area.activePartitionProperty, allowExponents, {
      x: this.viewSize + 35, // padding constant allows it to fit between the area and the other panels
      centerY: this.viewSize / 2
    } ) );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaNode', GenericAreaNode );

  return inherit( AreaNode, GenericAreaNode, {
    /**
     * Creates a partition line dock that when clicked toggles whether a particular partition line exists.
     * @private
     *
     * @param {Property.<boolean>} toggleProperty
     * @param {Object} [nodeOptions]
     */
    createDock: function( toggleProperty, nodeOptions ) {
      return new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, _.extend( {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              toggleProperty.toggle();
            }
          } )
        ]
      }, nodeOptions ) );
    },

    /**
     * Creates a partition line (view only)
     * @private
     *
     * @param {Property.<boolean>} visibleProperty
     * @param {Orientation} orientation
     * @param {number} offset
     */
    createPartitionLine: function( visibleProperty, orientation, offset ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ Orientation.getCoordinateName( orientation ) ] = offset;
      secondPoint[ Orientation.getCoordinateName( orientation ) ] = offset;
      firstPoint[ Orientation.getCoordinateName( Orientation.opposite( orientation ) ) ] = this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS;
      secondPoint[ Orientation.getCoordinateName( Orientation.opposite( orientation ) ) ] = 0;

      var node = new Node( {
        children: [
          new Line( {
            p1: firstPoint,
            p2: secondPoint,
            stroke: AreaModelColorProfile.partitionLineStrokeProperty
          } ),
          new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
            translation: firstPoint,
            fill: this.area.getColorProperty( orientation ),
            stroke: AreaModelColorProfile.partitionLineBorderProperty
          } )
        ]
      } );
      visibleProperty.linkAttribute( node, 'visible' );
      return node;
    }
  } );
} );
