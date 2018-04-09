// Copyright 2018, University of Colorado Boulder

/**
 * Handling for creating all calculation lines for a given area/etc.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaCalculationChoice = require( 'AREA_MODEL_COMMON/common/enum/AreaCalculationChoice' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DistributionLine = require( 'AREA_MODEL_COMMON/common/view/calculation/DistributionLine' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var ExpandedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/ExpandedLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusesLine = require( 'AREA_MODEL_COMMON/common/view/calculation/MinusesLine' );
  var MultipliedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/MultipliedLine' );
  var OrderedLine = require( 'AREA_MODEL_COMMON/common/view/calculation/OrderedLine' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var QuestionMarkLine = require( 'AREA_MODEL_COMMON/common/view/calculation/QuestionMarkLine' );
  var SumLine = require( 'AREA_MODEL_COMMON/common/view/calculation/SumLine' );
  var TermList = require( 'AREA_MODEL_COMMON/common/model/TermList' );
  var TotalsLine = require( 'AREA_MODEL_COMMON/common/view/calculation/TotalsLine' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {VBox}
   *
   * @param {AreaModelCommonModel} model
   */
  function CalculationLinesNode( model ) {
    var self = this;

    VBox.call( this, {
      spacing: 1
    } );

    // @public {Property.<boolean>} - Whether there are previous/next lines (when in line-by-line mode)
    this.previousEnabledProperty = new BooleanProperty( false );
    this.nextEnabledProperty = new BooleanProperty( false );

    // @public {Property.<Array.<CalculationLine>>} - All of our "current" lines
    this.calculationLinesProperty = new Property( [] );

    // @public {Emitter} - Fired whenever the displayed appearance has updated.
    this.displayUpdatedEmitter = new Emitter();

    // @private {AreaModelCommonModel}
    this.model = model;

    // @private {boolean} - Whether the actual CalculationLinesNode need updating.
    this.linesDirty = true;

    // @private {boolean} - Whether the display of the lines (index/visibility change) needs updating.
    this.displayDirty = true;

    // @private {Property.<number>} - The current index (for whatever area)
    this.areaIndexProperty = new DynamicProperty( model.currentAreaProperty, {
      derive: 'calculationIndexProperty',
      bidirectional: true
    } );

    // @private {Property.<number|null>} - The effective current index (for whatever area) that we will use for display
    this.effectiveIndexProperty = new DerivedProperty(
      [ this.areaIndexProperty, model.areaCalculationChoiceProperty ],
      function( index, choice ) {
        return choice === AreaCalculationChoice.LINE_BY_LINE ? index : null;
      } );

    var setLinesDirty = function() { self.linesDirty = true; };
    var setDisplayDirty = function() { self.displayDirty = true; };

    // Listen for changes that would make the display need an update
    model.areaCalculationChoiceProperty.lazyLink( setDisplayDirty );
    this.areaIndexProperty.lazyLink( setDisplayDirty );

    // Listen for changes that would make everything need an update
    model.currentAreaProperty.link( function( newArea, oldArea ) {
      if ( oldArea ) {
        oldArea.allPartitions.forEach( function( partition ) {
          partition.sizeProperty.unlink( setLinesDirty );
          partition.visibleProperty.unlink( setLinesDirty );
        } );
      }

      newArea.allPartitions.forEach( function( partition ) {
        partition.sizeProperty.lazyLink( setLinesDirty );
        partition.visibleProperty.lazyLink( setLinesDirty );
      } );

      setLinesDirty();

      self.update();
    } );
  }

  areaModelCommon.register( 'CalculationLinesNode', CalculationLinesNode );

  return inherit( VBox, CalculationLinesNode, {
    /**
     * Called whenever the calculation may need an update.
     * @public
     */
    update: function() {
      // Don't update anything if things are hidden
      if ( this.model.areaCalculationChoiceProperty.value === AreaCalculationChoice.HIDDEN ) {
        return;
      }

      this.updateLines();
      this.updateDisplay();
    },

    /**
     * Moves the display to the previous line.
     * @public
     */
    moveToPreviousLine: function() {
      var activeLine = this.getActiveLine();
      if ( activeLine.previousLine ) {
        this.areaIndexProperty.value = activeLine.previousLine.index;
      }
    },

    /**
     * Moves the display to the next line.
     * @public
     */
    moveToNextLine: function() {
      var activeLine = this.getActiveLine();
      if ( activeLine.nextLine ) {
        this.areaIndexProperty.value = activeLine.nextLine.index;
      }
    },

    /**
     * Update the internally-stored calculation lines.
     * @private
     */
    updateLines: function() {
      if ( !this.linesDirty ) {
        return;
      }

      // As a sanity check, just remove all children here (so we don't leak things)
      this.removeAllChildren();

      // Release line references that we had before
      this.calculationLinesProperty.value.forEach( function( calculationLine ) {
        calculationLine.dispose();
      } );

      // Create new lines
      this.calculationLinesProperty.value = CalculationLinesNode.createLines(
        this.model.currentAreaProperty.value,
        this.effectiveIndexProperty,
        this.model.allowExponents,
        this.model.isProportional
      );

      this.linesDirty = false;
      this.displayDirty = true;
    },

    /**
     * Update the display of the calculation lines.
     * @private
     */
    updateDisplay: function() {
      if ( !this.displayDirty ) {
        return;
      }

      // As a sanity check, just remove all children here (so we don't leak things)
      this.removeAllChildren();

      var displayedLines = this.calculationLinesProperty.value;

      // If we are in line-by-line mode, display adjacent lines
      if ( this.model.areaCalculationChoiceProperty.value === AreaCalculationChoice.LINE_BY_LINE ) {

        var activeLine = this.getActiveLine();
        displayedLines = activeLine.getAdjacentLines();

        this.previousEnabledProperty.value = !!activeLine.previousLine;
        this.nextEnabledProperty.value = !!activeLine.nextLine;
      }
      else {
        this.previousEnabledProperty.value = false;
        this.nextEnabledProperty.value = false;
      }

      this.children = _.map( displayedLines, 'node' );
      this.displayDirty = false;
      this.displayUpdatedEmitter.emit();
    },

    /**
     * Returns the first active line, or null otherwise.
     * @private
     *
     * @returns {CalculationLine|null}
     */
    getActiveLine: function() {
      var activeLine = this.calculationLinesProperty.value.find( function( line ) {
        return line.isActiveProperty.value;
      } ) || null;

      // If no line is currently active (maybe it was removed?), switch to the next-best line
      if ( !activeLine ) {
        var nextBestLine = null;
        var lastIndex = this.areaIndexProperty.value;
        this.calculationLinesProperty.value.forEach( function( calculationLine ) {
          if ( calculationLine.index <= lastIndex ) {
            nextBestLine = calculationLine;
          }
        } );

        // Update the index property to point to the correct line
        this.areaIndexProperty.value = nextBestLine.index;
        activeLine = nextBestLine;
      }

      return activeLine;
    }
  }, {
    /**
     * Creates an array of calculation lines.
     * @private
     *
     * @param {Area} area
     * @param {Property.<number|null>} activeIndexProperty - null when all lines should be active
     * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
     * @param {boolean} isProportional - Whether the area is shown as proportional (instead of generic)
     * @returns {Array.<CalculationLine>}
     */
    createLines: function( area, activeIndexProperty, allowExponents, isProportional ) {
      // Whether there are ANY shown partitions for a given orientation
      var horizontalEmpty = area.getDefinedPartitions( Orientation.HORIZONTAL ).length === 0;
      var verticalEmpty = area.getDefinedPartitions( Orientation.VERTICAL ).length === 0;

      // If both are empty, show a question mark
      if ( horizontalEmpty && verticalEmpty ) {
        return [ new QuestionMarkLine( area, activeIndexProperty, allowExponents, isProportional ) ];
      }
      // If only one is empty, show boxes
      else if ( horizontalEmpty || verticalEmpty ) {
        return [ new TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) ];
      }

      var horizontalTermList = area.getTermList( Orientation.HORIZONTAL );
      var verticalTermList = area.getTermList( Orientation.VERTICAL );

      var horizontalTerms = horizontalTermList.terms;
      var verticalTerms = verticalTermList.terms;

      // The total/sum for each orientation
      var horizontalPolynomial = area.totalProperties.horizontal.value;
      var verticalPolynomial = area.totalProperties.vertical.value;

      // E.g. for ( 2 ) * ( 3 + x ), the result will be the terms 6 and 2x.
      var multipliedTermList = new TermList( _.flatten( verticalTerms.map( function( verticalTerm ) {
        return horizontalTerms.map( function( horizontalTerm ) {
          return horizontalTerm.times( verticalTerm );
        } );
      } ) ) );
      var orderedTermList = multipliedTermList.orderedByExponent();
      var totalPolynomial = area.totalAreaProperty.value;

      // Logic for what calculation lines are needed
      var needsExpansion = !allowExponents && ( !horizontalTermList.equals( horizontalPolynomial ) ||
                                                !verticalTermList.equals( verticalPolynomial ) );
      var needsDistribution = horizontalTermList.terms.length !== 1 || verticalTermList.terms.length !== 1;
      var needsMultiplied = needsDistribution && !multipliedTermList.equals( totalPolynomial );
      var needsOrdered = needsMultiplied && !orderedTermList.equals( multipliedTermList ) &&
                         !( orderedTermList.equals( totalPolynomial ) &&
                         ( !allowExponents || !orderedTermList.hasNegativeTerm() ) );
      var needsMinuses = needsMultiplied && allowExponents &&
                         orderedTermList.hasNegativeTerm() && !orderedTermList.equals( totalPolynomial );

      // Add the actual lines
      var lines = [];
      // e.g. ( -x + x^2 )( x^2 - x ) <--- example used for everything except the ExpansionLine
      lines.push( new TotalsLine( area, activeIndexProperty, allowExponents, isProportional ) );
      if ( needsExpansion ) {
        // e.g. ( -5 + 2 )( 7 + 3 ) <---- if we have a proportional one where Totals Line is e.g. -3 * 10
        lines.push( new ExpandedLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsDistribution ) {
        // e.g. (-x)(x^2) + (-x)(-x) + (x^2)(x^2) + (x^2)(-x)
        lines.push( new DistributionLine( horizontalTerms, verticalTerms, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsMultiplied ) {
        // e.g. (-x^3) + x^2 + x^4 + (-x^3)
        lines.push( new MultipliedLine( multipliedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsOrdered ) {
        // e.g. x^4 + (-x^3) + (-x^3) + x^2
        lines.push( new OrderedLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      if ( needsMinuses ) {
        // e.g. x^4 - x^3 - x^3 + x^2
        lines.push( new MinusesLine( orderedTermList, area, activeIndexProperty, allowExponents, isProportional ) );
      }
      // e.g. x^4 - 2x^3 + x^2
      lines.push( new SumLine( area, activeIndexProperty, allowExponents, isProportional ) );

      // Link the lines together, so it is easy to traverse
      for ( var i = 1; i < lines.length; i++ ) {
        lines[ i - 1 ].nextLine = lines[ i ];
        lines[ i ].previousLine = lines[ i - 1 ];
      }

      return lines;
    }
  } );
} );
