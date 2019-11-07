// Copyright 2017-2019, University of Colorado Boulder

/**
 * View for GenericArea.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const AreaDisplayNode = require( 'AREA_MODEL_COMMON/common/view/AreaDisplayNode' );
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const GenericPartitionedAreaNode = require( 'AREA_MODEL_COMMON/generic/view/GenericPartitionedAreaNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const PartitionSizeEditNode = require( 'AREA_MODEL_COMMON/generic/view/PartitionSizeEditNode' );
  const PoolableLayerNode = require( 'AREA_MODEL_COMMON/common/view/PoolableLayerNode' );
  const Property = require( 'AXON/Property' );
  const TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );
  const Vector2 = require( 'DOT/Vector2' );

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

    const self = this;

    AreaDisplayNode.call( this, areaDisplay, partialProductsChoiceProperty, {
      allowExponents: allowExponents,
      isProportional: false
    } );

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
        return new PartitionSizeEditNode(
          areaDisplay.activePartitionProperty,
          new Property( partition ),
          self.modelViewTransformProperty,
          allowExponents
        );
      },
      getItemProperty: function( editNode ) {
        return editNode.partitionProperty;
      }
    } ) );

    // Keypad
    const digitCountProperty = new DerivedProperty( [ areaDisplay.activePartitionProperty ], function( activePartition ) {
      return activePartition === null ? 1 : activePartition.digitCount;
    } );
    const termKeypadPanel = new TermKeypadPanel( digitCountProperty, allowExponents, true, function( term ) {
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
      const self = this;

      this.productLabels.forEach( function( productLabel ) {
        Orientation.VALUES.forEach( function( orientation ) {
          const range = productLabel.partitionedAreaProperty.value.partitions.get( orientation ).coordinateRangeProperty.value;
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
      const firstPoint = new Vector2( 0, 0 );
      const secondPoint = new Vector2( 0, 0 );

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = viewSize;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      const line = new Line( {
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
      const singleOffset = viewSize * AreaModelCommonConstants.GENERIC_SINGLE_OFFSET;
      const firstOffset = viewSize * AreaModelCommonConstants.GENERIC_FIRST_OFFSET;
      const secondOffset = viewSize * AreaModelCommonConstants.GENERIC_SECOND_OFFSET;

      const resultNode = new Node();

      Orientation.VALUES.forEach( function( orientation ) {
        const hasTwoProperty = new DerivedProperty( [ layoutProperty ], function( layout ) {
          return layout.getPartitionQuantity( orientation ) === 2;
        } );
        const hasThreeProperty = new DerivedProperty( [ layoutProperty ], function( layout ) {
          return layout.getPartitionQuantity( orientation ) === 3;
        } );

        const singleLine = GenericAreaDisplayNode.createPartitionLine( orientation, singleOffset, viewSize, hasTwoProperty );
        const firstLine = GenericAreaDisplayNode.createPartitionLine( orientation, firstOffset, viewSize, hasThreeProperty );
        const secondLine = GenericAreaDisplayNode.createPartitionLine( orientation, secondOffset, viewSize, hasThreeProperty );
        resultNode.addChild( singleLine );
        resultNode.addChild( firstLine );
        resultNode.addChild( secondLine );
      } );

      return resultNode;
    }
  } );
} );
