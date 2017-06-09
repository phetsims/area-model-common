// Copyright 2017, University of Colorado Boulder

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
    _.extend( this, options );
  }

  areaModelCommon.register( 'Orientation', Orientation );

  inherit( Object, Orientation, {
    /**
     * Returns the single coordinate transformed by the appropriate dimension.
     * @public
     *
     * @param {ModelViewTransform2} modelViewTransform
     * @param {number} value
     */
    modelToView: function( modelViewTransform, value ) {
      return modelViewTransform[ this.modelViewName ]( value );
    },

    // TODO: doc
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

  Orientation.HORIZONTAL = new Orientation( {
    coordinate: 'x',
    centerCoordinate: 'centerX',
    modelViewName: 'modelToViewX',
    minSide: 'left',
    maxSide: 'right'
  } );

  Orientation.VERTICAL = new Orientation( {
    coordinate: 'y',
    centerCoordinate: 'centerY',
    modelViewName: 'modelToViewY',
    minSide: 'top',
    maxSide: 'bottom'
  } );

  // Set up opposites as object references (circular)
  Orientation.HORIZONTAL.opposite = Orientation.VERTICAL;
  Orientation.VERTICAL.opposite = Orientation.HORIZONTAL;

  // All values the enumeration can take.
  Orientation.VALUES = [
    Orientation.HORIZONTAL,
    Orientation.VERTICAL
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Orientation ); }

  return Orientation;
} );
