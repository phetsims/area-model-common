// Copyright 2017, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var AreaDisplayNode = require( 'AREA_MODEL_COMMON/common/view/AreaDisplayNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/generic/view/GenericPartitionedAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PartitionSizeEditNode = require( 'AREA_MODEL_COMMON/generic/view/PartitionSizeEditNode' );
  var Property = require( 'AXON/Property' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {AreaDisplayNode}
   *
   * @param {GenericAreaDisplay} areaDisplay
   * @param {boolean} allowExponents - Whether the user is able to add powers of x.
   * @param {Property.<PartialProductsChoice>} partialProductsChoiceProperty
   * @param {Object} [nodeOptions]
   */
  function GenericAreaDisplayNode( areaDisplay, allowExponents, partialProductsChoiceProperty, nodeOptions ) {
    assert && assert( typeof allowExponents === 'boolean' );
    assert && assert( partialProductsChoiceProperty instanceof Property );

    var self = this;

    AreaDisplayNode.call( this, areaDisplay, partialProductsChoiceProperty, {
      allowExponents: allowExponents,
      isProportional: false // just here to be explicit
    } );

    var singleOffset = this.viewSize * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
    var firstOffset = this.viewSize * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = this.viewSize * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;

    this.labelLayer.addChild( this.eraseButton );

    this.areaLayer.addChild( this.backgroundNode );

    // Sign-colored partition area backgrounds (effectively pooled)
    // TODO: Come up with a general pattern for this?
    var partitionedAreaNodes = []; // {Array.<GenericPartitionedAreaNode>}
    var partitionedAreaLayer = new Node();
    this.areaLayer.addChild( partitionedAreaLayer );
    areaDisplay.partitionedAreasProperty.link( function( partitionedAreas ) {
      // Unset values for any existing ones
      partitionedAreaNodes.forEach( function( partitionedAreaNode ) {
        partitionedAreaNode.partitionedAreaProperty.value = null;
      } );

      for ( var i = 0; i < partitionedAreas.length; i++ ) {
        var partitionedArea = partitionedAreas[ i ];

        if ( partitionedAreaNodes[ i ] ) {
          partitionedAreaNodes[ i ].partitionedAreaProperty.value = partitionedArea;
        }
        else {
          var partitionedAreaNode = new GenericPartitionedAreaNode( new Property( partitionedArea ), self.modelViewTransformProperty );
          partitionedAreaLayer.addChild( partitionedAreaNode );
          partitionedAreaNodes.push( partitionedAreaNode );
        }
      }
    } );

    this.areaLayer.addChild( this.borderNode );

    // Partition lines
    Orientation.VALUES.forEach( function( orientation ) {
      var singleLine = self.createPartitionLine( orientation, singleOffset );
      var firstLine = self.createPartitionLine( orientation, firstOffset );
      var secondLine = self.createPartitionLine( orientation, secondOffset );
      self.areaLayer.addChild( singleLine );
      self.areaLayer.addChild( firstLine );
      self.areaLayer.addChild( secondLine );

      areaDisplay.layoutProperty.link( function( layout ) {
        var quantity = layout.getPartitionQuantity( orientation );
        singleLine.visible = quantity === 2;
        firstLine.visible = secondLine.visible = quantity === 3;
      } );
    } );

    // Edit readouts/buttons
    var editNodes = [];
    var editNodeLayer = new Node();
    this.labelLayer.addChild( editNodeLayer );
    areaDisplay.allPartitionsProperty.link( function( partitions ) {
      // Unset values for any existing ones
      editNodes.forEach( function( editNode ) {
        editNode.partitionProperty.value = null;
      } );

      for ( var i = 0; i < partitions.length; i++ ) {
        var partition = partitions[ i ];

        if ( editNodes[ i ] ) {
          editNodes[ i ].partitionProperty.value = partition;
        }
        else {
          var editNode = new PartitionSizeEditNode( areaDisplay.activePartitionProperty, new Property( partition ), self.modelViewTransformProperty, allowExponents );
          editNodeLayer.addChild( editNode );
          editNodes.push( editNode );
        }
      }
    } );

    //TODO: Move the keypad to the screen view
    //TODO: switching scenes drops keypad
    // Keypad
    var digitCountProperty = new DerivedProperty( [ areaDisplay.activePartitionProperty ], function( activePartition ) {
      return activePartition === null ? 1 : activePartition.digitCount;
    } );
    var termKeypadPanel = new TermKeypadPanel( digitCountProperty, allowExponents, true, function( term ) {
      // Update the size of the partition.
      areaDisplay.activePartitionProperty.value.sizeProperty.value = term;

      // Hide the keypad.
      areaDisplay.activePartitionProperty.value = null;
    }, {
      x: this.viewSize + 25, // padding constant allows it to fit between the area and the other panels
      centerY: this.viewSize / 2
    } );
    this.labelLayer.addChild( termKeypadPanel );

    // If this changes, we clear and switch to it
    areaDisplay.activePartitionProperty.link( function( newArea ) {
      termKeypadPanel.visible = newArea !== null;
      termKeypadPanel.clear();
    } );

    this.mutate( nodeOptions );
  }

  areaModelCommon.register( 'GenericAreaDisplayNode', GenericAreaDisplayNode );

  return inherit( AreaDisplayNode, GenericAreaDisplayNode, {
    /**
     * Positions all of the partial products labels.
     * @protected
     * @override
     */
    positionProductLabels: function() {
      var self = this;

      this.productLabels.forEach( function( productLabel ) {
        Orientation.VALUES.forEach( function( orientation ) {
          var range = productLabel.partitionedAreaProperty.value.partitions.get( orientation ).coordinateRangeProperty.value;
          if ( range !== null ) {
            productLabel[ orientation.coordinate ] = orientation.modelToView( self.modelViewTransformProperty.value, range.getCenter() );
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
        stroke: AreaModelCommonColorProfile.partitionLineStrokeProperty
      } );
    }
  } );
} );