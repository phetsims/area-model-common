// Copyright 2017-2018, University of Colorado Boulder

/**
 * Either horizontal or vertical, with helper values.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {Object} options - Placed directly on the object.
   */
  function Orientation( options ) {

    // REVIEW: this style of creating object makes it impossible for IDEA to track down usages.  For instance:
    // REVIEW: ProportionalAreaDisplayNode has orientation.minSide which IDEA reports as unused.  If I change the constructor
    // REVIEW: to read this.minSide = minSide, then IDEA can find it.  I recommend to use the "required arguments"
    // REVIEW: strategy for this case.  This will also permit visibility annotations, centralized doc, etc.
    _.extend( this, options );

    // @public {Orientation|null} - Will be filled in after construction.
    this.opposite = null;
  }

  areaModelCommon.register( 'Orientation', Orientation );

  inherit( Object, Orientation, {
    /**
     * Returns the single coordinate transformed by the appropriate dimension.
     * @public
     *
     * @param {ModelViewTransform2} modelViewTransform
     * @param {number} value
     * @returns {number}
     */
    modelToView: function( modelViewTransform, value ) {
      return modelViewTransform[ this.modelViewName ]( value );
    },

    /**
     * Creates a vector (primary,secondary) for horizontal orientations, and (secondary,primary) for vertical
     * orientations.
     * @public
     *
     * @param {number} primary
     * @param {number} secondary
     * @returns {Vector2}
     */
    // REVIEW: Rename toVector
    vector: function( primary, secondary ) {
      var vector = new Vector2();
      vector[ this.coordinate ] = primary;
      vector[ this.opposite.coordinate ] = secondary;
      return vector;
    }
  }, {
    /**
     * Returns whether the input is an orientation (for ease of assertions)
     * @public
     *
     * @param {*} orientation
     * @returns {boolean}
     */
    isOrientation: function( orientation ) {
      return orientation === Orientation.HORIZONTAL || orientation === Orientation.VERTICAL;
    }
  } );

  // @public {Orientation}
  Orientation.HORIZONTAL = new Orientation( {
    coordinate: 'x',
    centerCoordinate: 'centerX',
    modelViewName: 'modelToViewX',
    minSide: 'left',
    maxSide: 'right',
    rectCoordinate: 'rectX',
    rectSize: 'rectWidth',
    layoutBoxOrientation: 'horizontal'
  } );

  // @public {Orientation}
  Orientation.VERTICAL = new Orientation( {
    coordinate: 'y',
    centerCoordinate: 'centerY',
    modelViewName: 'modelToViewY',
    minSide: 'top',
    maxSide: 'bottom',
    rectCoordinate: 'rectY',
    rectSize: 'rectHeight',
    layoutBoxOrientation: 'vertical'
  } );

  // Set up opposites as object references (circular)
  Orientation.HORIZONTAL.opposite = Orientation.VERTICAL;
  Orientation.VERTICAL.opposite = Orientation.HORIZONTAL;

  // @public {Array.<Orientation>} - All values the enumeration can take.
  Orientation.VALUES = [
    Orientation.HORIZONTAL,
    Orientation.VERTICAL
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Orientation ); }

  return Orientation;
} );
