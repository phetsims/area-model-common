// Copyright 2017, University of Colorado Boulder

/**
 * Supertype for view of Area objects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EditableProperty = require( 'AREA_MODEL_COMMON/game/model/EditableProperty' );
  var GameEditableLabelNode = require( 'AREA_MODEL_COMMON/game/view/GameEditableLabelNode' );
  var HighlightType = require( 'AREA_MODEL_COMMON/game/enum/HighlightType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadType = require( 'AREA_MODEL_COMMON/generic/enum/KeypadType' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RangeLabelNode = require( 'AREA_MODEL_COMMON/common/view/RangeLabelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermKeypadPanel = require( 'AREA_MODEL_COMMON/generic/view/TermKeypadPanel' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {GenericAreaDisplay} display
   * @param {Property.<EditableProperty.<Term|TermList|null>|null} activeEditableProperty
   */
  function GameAreaNode( display, activeEditableProperty ) {
    var self = this;

    Node.call( this );

    var singleOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_SINGLE_OFFSET;
    var firstOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_FIRST_OFFSET;
    var secondOffset = AreaModelConstants.AREA_SIZE * AreaModelConstants.GENERIC_SECOND_OFFSET;
    var fullOffset = AreaModelConstants.AREA_SIZE;

    // Background fill and stroke
    this.addChild( new Rectangle( 0, 0, AreaModelConstants.AREA_SIZE, AreaModelConstants.AREA_SIZE, {
      fill: AreaModelColorProfile.areaBackgroundProperty,
      stroke: AreaModelColorProfile.areaBorderProperty
    } ) );

    Orientation.VALUES.forEach( function( orientation ) {
      var hasTwoProperty = new DerivedProperty( [ display.layoutProperty ], function( layout ) {
        return layout.getPartitionQuantity( orientation ) === 2;
      } );
      var hasThreeProperty = new DerivedProperty( [ display.layoutProperty ], function( layout ) {
        return layout.getPartitionQuantity( orientation ) === 3;
      } );

      self.addChild( self.createPartitionLine( orientation, singleOffset, hasTwoProperty ) );
      self.addChild( self.createPartitionLine( orientation, firstOffset, hasThreeProperty ) );
      self.addChild( self.createPartitionLine( orientation, secondOffset, hasThreeProperty ) );
    } );

    // Range views
    Orientation.VALUES.forEach( function( orientation ) {
      var colorProperty = AreaModelColorProfile.getGenericColorProperty( orientation );
      var termListProperty = orientation === Orientation.HORIZONTAL ? display.horizontalTotalProperty : display.verticalTotalProperty;
      self.addChild( new RangeLabelNode( termListProperty, orientation, new Property( new Range( 0, AreaModelConstants.AREA_SIZE ) ), colorProperty ) );
    } );

    var centerProperties = {}; // TODO: doc key/value
    Orientation.VALUES.forEach( function( orientation ) {
      centerProperties[ orientation === Orientation.HORIZONTAL ] = [
        new DerivedProperty( [ display.layoutProperty ], function( layout ) {
          var quantity = layout.getPartitionQuantity( orientation );
          if ( quantity === 1 ) {
            return fullOffset / 2;
          }
          else if ( quantity === 2 ) {
            return singleOffset / 2;
          }
          else if ( quantity === 3 ) {
            return firstOffset / 2;
          }
        } ),
        new DerivedProperty( [ display.layoutProperty ], function( layout ) {
          var quantity = layout.getPartitionQuantity( orientation );
          if ( quantity === 2 ) {
            return ( fullOffset + singleOffset ) / 2;
          }
          else if ( quantity === 3 ) {
            return ( secondOffset + firstOffset ) / 2;
          }
          else {
            return 0; // no need to position here?
          }
        } ),
        new Property( ( fullOffset + secondOffset ) / 2 )
      ];
    } );

    // Partition size labels
    Orientation.VALUES.forEach( function( orientation ) {
      _.range( 0, 3 ).forEach( function( partitionIndex ) {
        // TODO: better way
        var orientationName = orientation === Orientation.HORIZONTAL ? 'horizontal' : 'vertical';

        var valuePropertyProperty = new DerivedProperty( [ display[ orientationName + 'PartitionValuesProperty' ] ], function( values ) {
          return values[ partitionIndex ] ? values[ partitionIndex ] : new EditableProperty( null );
        } );
        var colorProperty = AreaModelColorProfile.getGenericColorProperty( orientation );

        var label = new GameEditableLabelNode( valuePropertyProperty, activeEditableProperty, colorProperty, display.allowExponentsProperty, orientation, false, function() {
          activeEditableProperty.value = valuePropertyProperty.value;
        } );

        label[ orientation.opposite.coordinate ] = orientation === Orientation.HORIZONTAL ? -20 : -30;
        self.addChild( label );

        centerProperties[ orientation === Orientation.HORIZONTAL ][ partitionIndex ].link( function( location ) {
          label[ orientation.coordinate ] = location;
        } );
      } );
    } );

    _.range( 0, 3 ).forEach( function( horizontalIndex ) {
      _.range( 0, 3 ).forEach( function( verticalIndex ) {
        var valuePropertyProperty = new DerivedProperty( [ display.partialProductsProperty ], function( values ) {
          return ( values[ verticalIndex ] && values[ verticalIndex ][ horizontalIndex ] ) ? values[ verticalIndex ][ horizontalIndex ] : new EditableProperty( null );
        } );

        var colorProperty = new Property( 'black' ); // TODO

        var label = new GameEditableLabelNode( valuePropertyProperty, activeEditableProperty, colorProperty, display.allowExponentsProperty, Orientation.VERTICAL, false, function() {
          activeEditableProperty.value = valuePropertyProperty.value;
        } );
        self.addChild( label );

        centerProperties.true[ horizontalIndex ].linkAttribute( label, 'x' );
        centerProperties.false[ verticalIndex ].linkAttribute( label, 'y' );
      } );
    } );

    var digitsProperty = new DerivedProperty( [ activeEditableProperty ], function( editableProperty ) {
      return editableProperty ? editableProperty.digits : 1;
    } );

    function setActiveTerm( term ) {
      activeEditableProperty.value.value = term;
      activeEditableProperty.value.highlightProperty.value = HighlightType.NORMAL;
      activeEditableProperty.value = null;
    }
    var keypadOptions = {
      // TODO: dedup with other keypad?
      x: AreaModelConstants.AREA_SIZE + 25, // padding constant allows it to fit between the area and the other panels
      top: 0
    };
    var noExponentKeypadPanel = new TermKeypadPanel( digitsProperty, false, false, setActiveTerm, keypadOptions );
    var exponentKeypadPanel = new TermKeypadPanel( digitsProperty, true, true, setActiveTerm, keypadOptions );

    this.addChild( noExponentKeypadPanel );
    this.addChild( exponentKeypadPanel );

    noExponentKeypadPanel.visible = false;
    exponentKeypadPanel.visible = false;

    activeEditableProperty.link( function( newEditableProperty ) {
      noExponentKeypadPanel.clear();
      exponentKeypadPanel.clear();

      noExponentKeypadPanel.visible = newEditableProperty !== null && newEditableProperty.keypadType === KeypadType.CONSTANT;
      exponentKeypadPanel.visible = newEditableProperty !== null && newEditableProperty.keypadType === KeypadType.TERM;
      // TODO: entry for polynomials
    } );
  }

  areaModelCommon.register( 'GameAreaNode', GameAreaNode );

  return inherit( Node, GameAreaNode, {
    /**
     * Creates a partition line (view only)
     * @private
     *
     * TODO: dedup with GenericAreaNode
     *
     * @param {Orientation} orientation
     * @param {number} offset
     * @param
     */
    createPartitionLine: function( orientation, offset, visibilityProperty ) {
      var firstPoint = new Vector2();
      var secondPoint = new Vector2();

      firstPoint[ orientation.coordinate ] = offset;
      secondPoint[ orientation.coordinate ] = offset;
      firstPoint[ orientation.opposite.coordinate ] = AreaModelConstants.AREA_SIZE;
      secondPoint[ orientation.opposite.coordinate ] = 0;

      var line = new Line( {
        p1: firstPoint,
        p2: secondPoint,
        stroke: AreaModelColorProfile.partitionLineStrokeProperty
      } );
      visibilityProperty.linkAttribute( line, 'visible' );
      return line;
    }
  } );
} );