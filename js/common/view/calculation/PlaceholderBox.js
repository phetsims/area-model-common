// Copyright 2018-2021, University of Colorado Boulder

/**
 * A rectangle meant as a placeholder in the calculation lines (poolable).
 *
 * This is pooled for performance, as recreating the view structure had unacceptable performance/GC characteristics.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../../axon/js/Property.js';
import Poolable from '../../../../../phet-core/js/Poolable.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import areaModelCommon from '../../../areaModelCommon.js';
import areaModelCommonStrings from '../../../areaModelCommonStrings.js';

const placeholderString = areaModelCommonStrings.a11y.placeholder;

class PlaceholderBox extends Rectangle {
  /**
   * @param {Property.<Color>} colorProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  constructor( colorProperty, allowExponents ) {

    super( 0, 0, 16, 16, {
      lineWidth: 0.7,

      // pdom
      tagName: 'mi',
      pdomNamespace: 'http://www.w3.org/1998/Math/MathML',
      innerContent: placeholderString
    } );

    // @public {string}
    this.accessibleText = placeholderString;

    this.initialize( colorProperty, allowExponents );
  }

  /**
   * @public
   *
   * @param {Property.<Color>} colorProperty
   * @param {boolean} allowExponents - Whether exponents (powers of x) are allowed
   */
  initialize( colorProperty, allowExponents ) {
    assert && assert( colorProperty instanceof Property );
    assert && assert( typeof allowExponents === 'boolean' );

    this.stroke = colorProperty;
    this.localBounds = this.selfBounds.dilatedX( allowExponents ? 2 : 0 );
  }

  /**
   * Clears the state of this node (releasing references) so it can be freed to the pool (and potentially GC'ed).
   * @public
   */
  clean() {
    this.stroke = null;
    this.freeToPool();
  }
}

areaModelCommon.register( 'PlaceholderBox', PlaceholderBox );

Poolable.mixInto( PlaceholderBox );

export default PlaceholderBox;