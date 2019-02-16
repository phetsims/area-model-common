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
   * @param {Object} config
   */
  function Orientation( config ) {
    config = _.extend( {
      // {string} - So you can position things like node[ orientation.coordinate ] = value
      coordinate: null,

      // {string} - So you can center things like node[ orientation.centerCoordinate ] = value
      centerCoordinate: null,

      // {string} - For handling model-view conversions of position (see orientation.modelToView).
      modelViewName: null,

      // {string} - For getting the minimal/maximal values from bounds/nodes
      minSide: null,
      maxSide: null,

      // {string} - For being able to handle Rectangles (x/y) and (width/height)
      rectCoordinate: null,
      rectSize: null,

      // {string} - The name of the orientation when used for LayoutBox
      layoutBoxOrientation: null
    }, config );

    assert && assert( typeof config.coordinate === 'string' );
    assert && assert( typeof config.centerCoordinate === 'string' );
    assert && assert( typeof config.modelViewName === 'string' );
    assert && assert( typeof config.minSide === 'string' );
    assert && assert( typeof config.maxSide === 'string' );
    assert && assert( typeof config.rectCoordinate === 'string' );
    assert && assert( typeof config.rectSize === 'string' );
    assert && assert( typeof config.layoutBoxOrientation === 'string' );

    // @public {string}
    this.coordinate = config.coordinate;
    this.centerCoordinate = config.centerCoordinate;
    this.modelViewName = config.modelViewName;
    this.minSide = config.minSide;
    this.maxSide = config.maxSide;
    this.rectCoordinate = config.rectCoordinate;
    this.rectSize = config.rectSize;
    this.layoutBoxOrientation = config.layoutBoxOrientation;

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
    toVector: function( primary, secondary ) {
      var vector = new Vector2( 0, 0 );
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
