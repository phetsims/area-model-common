// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaNode = require( 'AREA_MODEL_COMMON/common/view/AreaNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GenericArea = require( 'AREA_MODEL_COMMON/generic/model/GenericArea' );
  var GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/generic/view/GenericPartitionedAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var PartitionSizeEditNode = require( 'AREA_MODEL_COMMON/generic/view/PartitionSizeEditNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );
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

    AreaNode.call( this, area, partialProductsChoiceProperty, allowExponents, false, false );

    var singleOffset = this.viewSize * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
    var firstOffset = this.viewSize * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = this.viewSize * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;

    // Background fill
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
    } ) );

    // Sign-colored partition area backgrounds
    area.partitionedAreas.forEach( function( partitionedArea ) {
      self.areaLayer.addChild( new GenericPartitionedAreaNode( partitionedArea, self.modelViewTransform ) );
    } );

    // Background stroke
    this.areaLayer.addChild( new Rectangle( 0, 0, this.viewSize, this.viewSize, {
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    Orientation.VALUES.forEach( function( orientation ) {
      var quantity = area.layout.getPartitionQuantity( orientation );

      if ( quantity === 2 ) {
        self.areaLayer.addChild( self.createPartitionLine( orientation, singleOffset ) );
      }
      else if ( quantity === 3 ) {
        self.areaLayer.addChild( self.createPartitionLine( orientation, firstOffset ) );
        self.areaLayer.addChild( self.createPartitionLine( orientation, secondOffset ) );
      }
    } );

    // Edit readouts/buttons
    area.allPartitions.forEach( function( partition ) {
      self.labelLayer.addChild( new PartitionSizeEditNode( area, partition, self.modelViewTransform, allowExponents ) );
    } );

    //TODO: Move the keypad to the screen view
    //TODO: switching scenes drops keypad
    // Keypad
    var digitCountProperty = new DerivedProperty( [ area.activePartitionProperty ], function( activePartition ) {
      return activePartition === null ? 1 : activePartition.digitCount;
    } );
    var termKeypadPanel = new TermKeypadPanel( digitCountProperty, allowExponents, true, function( term ) {
      // Update the size of the partition.
      area.activePartitionProperty.value.sizeProperty.value = term;

      // Hide the keypad.
      area.activePartitionProperty.value = null;
    }, {
      x: this.viewSize + 25, // padding constant allows it to fit between the area and the other panels
      centerY: this.viewSize / 2
    } );
    this.labelLayer.addChild( termKeypadPanel );

    // If this changes, we clear and switch to it
    area.activePartitionProperty.link( function( newArea ) {
      termKeypadPanel.visible = newArea !== null;
      termKeypadPanel.clear();
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaNode', GenericAreaNode );

  return inherit( AreaNode, GenericAreaNode, {
    /**
     * Positions all of the partial products labels.
     * @protected
     */
    positionProductLabels: function() {
      var self = this;

      this.productLabels.forEach( function( productLabel ) {
        Orientation.VALUES.forEach( function( orientation ) {
          var range = productLabel.partitionedArea.getPartition( orientation ).coordinateRangeProperty.value;
          if ( range !== null ) {
            productLabel[ orientation.coordinate ] = orientation.modelToView( self.modelViewTransform, range.getCenter() );
          }
        } );
      } );
    },

    /**
     * Creates a partition line (view only)
     * @private
     *
     * @param {Orientation} orientation
     * @param {number} offset
     */
    createPartitionLine: function( orientation, offset ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = this.viewSize;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      return new Line( {
        p1: firstPoint,
        p2: secondPoint,
        stroke: AreaModelColorProfile.partitionLineStrokeProperty
      } );
    }
  } );
} );
