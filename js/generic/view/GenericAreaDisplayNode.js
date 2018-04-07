// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaDisplayNode = require( 'AREA_MODEL_COMMON/common/view/AreaDisplayNode' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/generic/view/GenericPartitionedAreaNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var PartitionSizeEditNode = require( 'AREA_MODEL_COMMON/generic/view/PartitionSizeEditNode' );
  var PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
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

    this.labelLayer.addChild( this.eraseButton );

    this.areaLayer.addChild( this.backgroundNode );

    // Sign-colored partition area backgrounds (effectively pooled)
    this.areaLayer.addChild( new PoolableLayerNode( {
      arrayProperty: areaDisplay.partitionedAreasProperty,
      createNode: function( partitionedArea ) {
        return new GenericPartitionedAreaNode( new Property( partitionedArea ), self.modelViewTransformProperty );
      },
      getItemProperty: function( partitionedAreaNode ) {
        return partitionedAreaNode.partitionedAreaProperty;
      }
    } ) );

    this.areaLayer.addChild( this.borderNode );

    // Partition lines
    this.areaLayer.addChild( GenericAreaDisplayNode.createPartitionLines( areaDisplay.layoutProperty, this.viewSize ) );

    // Edit readouts/buttons
    this.labelLayer.addChild( new PoolableLayerNode( {
      arrayProperty: areaDisplay.allPartitionsProperty,
      createNode: function( partition ) {
        return new PartitionSizeEditNode( areaDisplay.activePartitionProperty, new Property( partition ), self.modelViewTransformProperty, allowExponents );
      },
      getItemProperty: function( editNode ) {
        return editNode.partitionProperty;
      }
    } ) );

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
      x: this.viewSize + AreaModelCommonConstants.KEYPAD_LEFT_PADDING,
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
    }
  }, {
    /**
     * Creates a partition line (view only)
     * @private
     *
     * @param {Orientation} orientation
     * @param {number} offset
     * @param {number} viewSize - In view units, the size of the main area
     * @param {Property.<boolean>} visibilityProperty
     */
    createPartitionLine: function( orientation, offset, viewSize, visibilityProperty ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = viewSize;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      var line = new Line( {
        p1: firstPoint,
        p2: secondPoint,
        stroke: AreaModelCommonColorProfile.partitionLineStrokeProperty
      } );
      visibilityProperty.linkAttribute( line, 'visible' );
      return line;
    },

    /**
     * Creates a set of generic partition lines.
     * @public
     *
     * @param {Property.<GenericLayout>} layoutProperty
     * @param {number} viewSize
     * @returns {Node}
     */
    createPartitionLines: function( layoutProperty, viewSize ) {
      var singleOffset = viewSize * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
      var firstOffset = viewSize * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
      var secondOffset = viewSize * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;

      var resultNode = new Node();

      Orientation.VALUES.forEach( function( orientation ) {
        var hasTwoProperty = new DerivedProperty( [ layoutProperty ], function( layout ) {
          return layout.getPartitionQuantity( orientation ) === 2;
        } );
        var hasThreeProperty = new DerivedProperty( [ layoutProperty ], function( layout ) {
          return layout.getPartitionQuantity( orientation ) === 3;
        } );

        var singleLine = GenericAreaDisplayNode.createPartitionLine( orientation, singleOffset, viewSize, hasTwoProperty );
        var firstLine = GenericAreaDisplayNode.createPartitionLine( orientation, firstOffset, viewSize, hasThreeProperty );
        var secondLine = GenericAreaDisplayNode.createPartitionLine( orientation, secondOffset, viewSize, hasThreeProperty );
        resultNode.addChild( singleLine );
        resultNode.addChild( firstLine );
        resultNode.addChild( secondLine );
      } );

      return resultNode;
    }
  } );
} );
