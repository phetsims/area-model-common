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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/view/TermKeypadPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {AreaNode}
   *
   * TODO: reduce to options object
   * @param {GenericArea} area
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaNode( area, allowExponents, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( area instanceof GenericArea );
    assert && assert( typeof allowExponents === 'boolean' );

    var self = this;

    AreaNode.call( this, area, partialProductsChoiceProperty, false );

    var firstOffset = this.viewSize * AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = this.viewSize * AreaModelConstants.GENERIC_SECOND_OFFSET;

    var background = new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } );
    this.areaLayer.addChild( background );

    area.partitionedAreas.forEach( function( partitionedArea ) {
      var coloredBackground = new Rectangle( {} );

      partitionedArea.areaProperty.link( function( area ) {
        if ( area !== null ) {
          coloredBackground.fill = area.coefficient === 0 ? null
                                                          : ( area.coefficient > 0 ? AreaModelColorProfile.genericPositiveBackgroundProperty
                                                                                   : AreaModelColorProfile.genericNegativeBackgroundProperty );
        }
        else {
          coloredBackground.fill = null;
        }
      } );

      partitionedArea.visibleProperty.linkAttribute( coloredBackground, 'visible' );

      partitionedArea.horizontalPartition.coordinateRangeProperty.link( function( horizontalRange ) {
        if ( horizontalRange !== null ) {
          coloredBackground.rectX = horizontalRange.min * self.viewSize;
          coloredBackground.rectWidth = horizontalRange.getLength() * self.viewSize;
        }
      } );
      partitionedArea.verticalPartition.coordinateRangeProperty.link( function( verticalRange ) {
        if ( verticalRange !== null ) {
          coloredBackground.rectY = verticalRange.min * self.viewSize;
          coloredBackground.rectHeight = verticalRange.getLength() * self.viewSize;
        }
      } );
      self.areaLayer.addChild( coloredBackground );
    } );

    function addDock( x, y, property ) {
      self.areaLayer.addChild( new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
        fill: AreaModelColorProfile.dockBackgroundProperty,
        stroke: AreaModelColorProfile.dockBorderProperty,
        lineDash: [ 3, 3 ],
        x: x,
        y: y,
        cursor: 'pointer',
        inputListeners: [
          new FireListener( {
            fire: function() {
              property.toggle();
            }
          } )
        ]
      } ) );
    }
    addDock( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.getPartitionLineActiveProperties( Orientation.HORIZONTAL )[ 0 ] );
    addDock( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, area.getPartitionLineActiveProperties( Orientation.HORIZONTAL )[ 1 ] );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, area.getPartitionLineActiveProperties( Orientation.VERTICAL )[ 0 ] );
    addDock( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, area.getPartitionLineActiveProperties( Orientation.VERTICAL )[ 1 ] );

    function addPartitionLine( x1, y1, x2, y2, property, colorProperty ) {
      var node = new Node( {
        children: [
          new Line( x1, y1, x2, y2, {
            stroke: AreaModelColorProfile.partitionLineStrokeProperty
          } ),
          new Circle( AreaModelConstants.PARTITION_HANDLE_RADIUS, {
            x: x1,
            y: y1,
            fill: colorProperty,
            stroke: AreaModelColorProfile.partitionLineBorderProperty
          } )
        ]
      } );
      property.linkAttribute( node, 'visible' );
      self.areaLayer.addChild( node );
    }

    // TODO: consolidate with adding docks
    addPartitionLine( firstOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, area.getPartitionLineActiveProperties( Orientation.HORIZONTAL )[ 0 ], area.getColorProperty( Orientation.HORIZONTAL ) );
    addPartitionLine( secondOffset, this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, area.getPartitionLineActiveProperties( Orientation.HORIZONTAL )[ 1 ], area.getColorProperty( Orientation.HORIZONTAL ) );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, firstOffset, 0, firstOffset, area.getPartitionLineActiveProperties( Orientation.VERTICAL )[ 0 ], area.getColorProperty( Orientation.VERTICAL ) );
    addPartitionLine( this.viewSize + AreaModelConstants.PARTITION_HANDLE_RADIUS, secondOffset, 0, secondOffset, area.getPartitionLineActiveProperties( Orientation.VERTICAL )[ 1 ], area.getColorProperty( Orientation.VERTICAL ) );

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

      var BoxType = partition.isHorizontal ? HBox : VBox;

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

      var primaryName = partition.isHorizontal ? 'centerX' : 'centerY';

      partition.coordinateRangeProperty.link( function( range ) {
        if ( range ) {
          box[ primaryName ] = range.getCenter() * self.viewSize;
        }
      } );
      if ( partition.isHorizontal ) {
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

  return inherit( AreaNode, GenericAreaNode );
} );
