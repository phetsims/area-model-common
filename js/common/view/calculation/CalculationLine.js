// Copyright 2017, University of Colorado Boulder

/**
 * A single calculation line (for the display of the calculation panel/box)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var CalculationGroup = require( 'AREA_MODEL_COMMON/common/view/calculation/CalculationGroup' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Minus = require( 'AREA_MODEL_COMMON/common/view/calculation/Minus' );
  var MultiplyDot = require( 'AREA_MODEL_COMMON/common/view/calculation/MultiplyDot' );
  var MultiplyX = require( 'AREA_MODEL_COMMON/common/view/calculation/MultiplyX' );
  var OrientationPair = require( 'AREA_MODEL_COMMON/common/model/OrientationPair' );
  var Parentheses = require( 'AREA_MODEL_COMMON/common/view/calculation/Parentheses' );
  var PlaceholderBox = require( 'AREA_MODEL_COMMON/common/view/calculation/PlaceholderBox' );
  var Plus = require( 'AREA_MODEL_COMMON/common/view/calculation/Plus' );
  var QuestionMark = require( 'AREA_MODEL_COMMON/common/view/calculation/QuestionMark' );
  var TermText = require( 'AREA_MODEL_COMMON/common/view/calculation/TermText' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} index
   * @param {Area} area
   * @param {Property.<number|null>} activeIndexProperty
   * @param {boolean} allowExponents
   * @param {boolean} isProportional
   */
  function CalculationLine( index, area, activeIndexProperty, allowExponents, isProportional ) {
    assert && assert( typeof index === 'number' );

    var self = this;

    // @public {Node|null} - Filled in later, should be non-null outside CalculationLine usage
    this.node = null;

    // @public {number}
    this.index = index;

    // @public {CalculationLine|null} - Linked-list support for easy traversal through lines
    this.previousLine = null;
    this.nextLine = null;

    // @private {Area}
    this.area = area;

    // @private {boolean}
    this.allowExponents = allowExponents;
    this.isProportional = isProportional;

    // @private {Property.<boolean>}
    this.isActiveProperty = new DerivedProperty( [ activeIndexProperty ], function( activeIndex ) {
      return activeIndex === null || activeIndex === index;
    } );

    // @private {Property.<Color>}
    this.baseColorProperty = new DerivedProperty( [
      this.isActiveProperty,
      AreaModelCommonColorProfile.calculationActiveProperty,
      AreaModelCommonColorProfile.calculationInactiveProperty
    ], function( isActive, activeColor, inactiveColor ) {
      return isActive ? activeColor : inactiveColor;
    }, {
      useDeepEquality: true
    } );

    // @private {OrientationPair.<Property.<Color>>}
    this.orientedColorProperties = OrientationPair.create( function( orientation ) {
      return new DerivedProperty( [
        self.isActiveProperty,
        area.colorProperties.get( orientation ),
        AreaModelCommonColorProfile.calculationInactiveProperty
      ], function( isActive, activeColor, inactiveColor ) {
        return isActive ? activeColor : inactiveColor;
      }, {
        useDeepEquality: true
      } );
    } );
  }

  areaModelCommon.register( 'CalculationLine', CalculationLine );

  return inherit( Object, CalculationLine, {
    /**
     * Creates a TermText with the baseColor.
     * @public
     *
     * @param {TermList|Term} term
     * @param {boolean} excludeSign
     * @returns {TermText}
     */
    baseTermText: function( term, excludeSign ) {
      assert && assert( typeof excludeSign === 'boolean' );

      return TermText.createFromPool( term, this.baseColorProperty, excludeSign );
    },

    /**
     * Creates a TermText with the color of a specific orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @param {TermList|Term} term
     * @returns {TermText}
     */
    orientedTermText: function( orientation, term ) {
      return TermText.createFromPool( term, this.orientedColorProperties.get( orientation ), false );
    },

    /**
     * Creates a PlaceholderBox with the baseColor.
     * @public
     *
     * @returns {PlaceholderBox}
     */
    basePlaceholderBox: function() {
      return PlaceholderBox.createFromPool( this.baseColorProperty, this.allowExponents );
    },

    /**
     * Creates a PlaceholderBox with the color of a specific orientation.
     * @public
     *
     * @param {Orientation} orientation
     * @returns {PlaceholderBox}
     */
    orientedPlaceholderBox: function( orientation ) {
      return PlaceholderBox.createFromPool( this.orientedColorProperties.get( orientation ), this.allowExponents );
    },

    /**
     * Creates a MultiplyX with the specified content.
     * @public
     *
     * @param {Node} leftContent
     * @param {Node} rightContent
     * @returns {MultiplyX}
     */
    multiplyX: function( leftContent, rightContent ) {
      return MultiplyX.createFromPool( leftContent, rightContent, this.baseColorProperty );
    },

    /**
     * Creates a MultiplyX with the specified content.
     * @public
     *
     * @param {Node} leftContent
     * @param {Node} rightContent
     * @returns {MultiplyDot}
     */
    multiplyDot: function( leftContent, rightContent ) {
      return MultiplyDot.createFromPool( leftContent, rightContent, this.baseColorProperty );
    },

    /**
     * Creates a Parentheses with the specified content.
     * @public
     *
     * @param {Node} content
     * @returns {Parentheses}
     */
    parentheses: function( content ) {
      return Parentheses.createFromPool( content, this.baseColorProperty );
    },

    /**
     * Creates a QuestionMark
     * @public
     *
     * @returns {QuestionMark}
     */
    questionMark: function() {
      return QuestionMark.createFromPool( this.baseColorProperty );
    },

    /**
     * Creates a Plus
     * @public
     *
     * @returns {Plus}
     */
    plus: function() {
      return Plus.createFromPool( this.baseColorProperty );
    },

    /**
     * Creates a Minus
     * @public
     *
     * @returns {Minus}
     */
    minus: function() {
      return Minus.createFromPool( this.baseColorProperty );
    },

    /**
     * Creates a calculation group.
     * @public
     *
     * @param {Array.<Node>} nodes
     * @param {number} spacing
     * @returns {Parentheses}
     */
    group: function( nodes, spacing ) {
      return CalculationGroup.createFromPool( nodes, spacing );
    },

    /**
     * Returns the grouping of all nodes provided, with plusses in-between each node.
     * @public
     *
     * @param {Array.<Node>} nodes
     * @returns {Node}
     */
    sumGroup: function( nodes ) {
      var self = this;

      return this.group( _.flatten( nodes.map( function( node, index ) {
        return index > 0 ? [ self.plus(), node ] : [ node ];
      } ) ), AreaModelCommonConstants.CALCULATION_OP_PADDING );
    },

    /**
     * Returns a grouping of all (oriented) terms provided, with plusses in-between each term.
     * @public
     *
     * @param {Array.<Term>} terms
     * @param {Orientation} orientation
     * @returns {Node}
     */
    sumOrientedTerms: function( terms, orientation ) {
      var self = this;

      return this.sumGroup( terms.map( function( term ) {
        return self.orientedTermText( orientation, term );
      } ) );
    },

    /**
     * Returns a grouping of all (non-oriented) terms, with plusses/minuses in-between each term (depending on the sign)
     * @public
     *
     * @param {Array.<Term>} terms
     * @returns {Node}
     */
    sumOrDifferenceOfTerms: function( terms ) {
      var self = this;

      return this.group( _.flatten( terms.map( function( term, index ) {
        var result = [];

        if ( index > 0 ) {
          result.push( term.coefficient >= 0 ? self.plus() : self.minus() );
        }

        result.push( self.baseTermText( term, true ) );

        return result;
      } ) ), AreaModelCommonConstants.CALCULATION_OP_PADDING );
    },

    /**
     * Returns a grouping of all (oriented) terms provided, with plusses in-between each term (negative grouped in
     * parentheses).
     * @public
     *
     * @param {Array.<Term>} terms
     * @returns {Node}
     */
    sumWithNegativeParens: function( terms ) {
      var self = this;

      return this.sumGroup( terms.map( function( term ) {
        var text = self.baseTermText( term, false );
        if ( term.coefficient < 0 ) {
          text = self.parentheses( text );
        }
        return text;
      } ) );
    },

    /**
     * Returns an array with this lines (and any previous/next lines) in the correct order (up to 3 lines).
     * @public
     *
     * @returns {Array.<CalculationLine>}
     */
    getAdjacentLines: function() {
      var result = [ this ];
      if ( this.previousLine ) {
        result = [ this.previousLine ].concat( result );
      }
      if ( this.nextLine ) {
        result = result.concat( [ this.nextLine ] );
      }
      return result;
    },

    /**
     * Removes external references.
     * @public
     */
    dispose: function() {
      this.node.clean();

      this.orientedColorProperties.horizontal.dispose();
      this.orientedColorProperties.vertical.dispose();
      this.baseColorProperty.dispose();
      this.isActiveProperty.dispose();
    }
  } );
} );