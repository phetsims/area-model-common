// Copyright 2017-2020, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import validate from '../../../../axon/js/validate.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import areaModelCommon from '../../areaModelCommon.js';
import areaModelCommonStrings from '../../areaModelCommonStrings.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import AreaModelCommonQueryParameters from '../../common/AreaModelCommonQueryParameters.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

const factorsTimesPatternString = areaModelCommonStrings.a11y.factorsTimesPattern;
const horizontalPickerString = areaModelCommonStrings.a11y.horizontalPicker;
const horizontalPickerDescriptionString = areaModelCommonStrings.a11y.horizontalPickerDescription;
const verticalPickerString = areaModelCommonStrings.a11y.verticalPicker;
const verticalPickerDescriptionString = areaModelCommonStrings.a11y.verticalPickerDescription;

/**
 * @constructor
 * @extends {HBox}
 *
 * @param {Property.<Area>} currentAreaProperty
 * @param {OrientationPair.<Property.<number>>} - activeTotalProperties
 * @param {number} decimalPlaces - The number of decimal places to show in the picker (when needed)
 */
function ProportionalFactorsNode( currentAreaProperty, activeTotalProperties, decimalPlaces ) {
  Node.call( this );

  const self = this;

  if ( AreaModelCommonQueryParameters.rawMath ) {
    self.tagName = 'div';
    Property.multilink( activeTotalProperties.values, function( horizontalTotal, verticalTotal ) {
      self.innerContent = StringUtils.fillIn( factorsTimesPatternString, {
        width: horizontalTotal,
        height: verticalTotal
      } );
    } );
  }
  else {
    const ns = 'http://www.w3.org/1998/Math/MathML';
    const verticalNode = new Node( {

      // pdom
      tagName: 'mn',
      accessibleNamespace: ns
    } );
    activeTotalProperties.vertical.link( function( verticalTotal ) {
      verticalNode.innerContent = '' + verticalTotal;
    } );
    const horizontalNode = new Node( {

      // pdom
      tagName: 'mn',
      accessibleNamespace: ns
    } );
    activeTotalProperties.horizontal.link( function( horizontalTotal ) {
      horizontalNode.innerContent = '' + horizontalTotal;
    } );

    const mathNode = new Node( {
      tagName: 'math',
      accessibleNamespace: ns,
      children: [
        new Node( {
          tagName: 'mrow',
          accessibleNamespace: ns,
          children: [
            verticalNode,
            new Node( {
              tagName: 'mo',
              accessibleNamespace: ns,
              innerContent: '&times;'
            } ),
            horizontalNode
          ]
        } )
      ]
    } );
    this.addChild( mathNode );
  }

  this.addChild( new HBox( {
    children: [
      this.createPicker( Orientation.VERTICAL, currentAreaProperty, decimalPlaces ),
      new Text( MathSymbols.TIMES, { font: AreaModelCommonConstants.FACTORS_TERM_FONT } ),
      this.createPicker( Orientation.HORIZONTAL, currentAreaProperty, decimalPlaces )
    ],
    spacing: 10
  } ) );
}

areaModelCommon.register( 'ProportionalFactorsNode', ProportionalFactorsNode );

inherit( Node, ProportionalFactorsNode, {
  /**
   * Creates a picker that adjusts the specified orientation's total size.
   * @private
   *
   * @param {Orientation} orientation
   * @param {Property.<Area>} currentAreaProperty
   * @param {number} decimalPlaces
   */
  createPicker: function( orientation, currentAreaProperty, decimalPlaces ) {
    validate( orientation, { validValues: Orientation.VALUES } );

    // {Property.<Property<Polynomial|null>>}
    const currentTotalProperty = new DerivedProperty( [ currentAreaProperty ], function( area ) {
      return area.activeTotalProperties.get( orientation );
    } );

    // {Property.<Polynomial|null>}
    const bidirectionalProperty = new DynamicProperty( currentTotalProperty, {
      bidirectional: true
    } );

    // {Property.<Range>}
    const rangeProperty = new DerivedProperty( [ currentAreaProperty ], function( area ) {
      return new Range( area.minimumSize, area.maximumSize );
    } );

    return new NumberPicker( bidirectionalProperty, rangeProperty, {
      upFunction: function( value ) {
        return Utils.toFixedNumber( value + currentAreaProperty.value.snapSize, decimalPlaces );
      },
      downFunction: function( value ) {
        return Utils.toFixedNumber( value - currentAreaProperty.value.snapSize, decimalPlaces );
      },
      decimalPlaces: decimalPlaces,
      scale: 1.5,
      formatValue: function( value ) {
        // Epsilon chosen to avoid round-off errors while not "rounding" any values in the decimals sims improperly.
        if ( Utils.equalsEpsilon( value, Utils.roundSymmetric( value ), 1e-6 ) ) {
          return Utils.toFixed( value, 0 );
        }
        else {
          return Utils.toFixed( value, 1 );
        }
      },
      color: AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ),

      // pdom
      labelContent: orientation === Orientation.HORIZONTAL ? horizontalPickerString : verticalPickerString,
      descriptionContent: orientation === Orientation.HORIZONTAL ? horizontalPickerDescriptionString : verticalPickerDescriptionString,
      a11yMapValue: value => Utils.toFixedNumber( value, decimalPlaces )
    } );
  }
} );

export default ProportionalFactorsNode;