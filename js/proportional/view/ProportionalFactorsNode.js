// Copyright 2017-2021, University of Colorado Boulder

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
import areaModelCommonColorProfile from '../../common/view/areaModelCommonColorProfile.js';

const factorsTimesPatternString = areaModelCommonStrings.a11y.factorsTimesPattern;
const horizontalPickerString = areaModelCommonStrings.a11y.horizontalPicker;
const horizontalPickerDescriptionString = areaModelCommonStrings.a11y.horizontalPickerDescription;
const verticalPickerString = areaModelCommonStrings.a11y.verticalPicker;
const verticalPickerDescriptionString = areaModelCommonStrings.a11y.verticalPickerDescription;

class ProportionalFactorsNode extends Node {
  /**
   * @param {Property.<Area>} currentAreaProperty
   * @param {OrientationPair.<Property.<number>>} - activeTotalProperties
   * @param {number} decimalPlaces - The number of decimal places to show in the picker (when needed)
   */
  constructor( currentAreaProperty, activeTotalProperties, decimalPlaces ) {
    super();

    if ( AreaModelCommonQueryParameters.rawMath ) {
      this.tagName = 'div';
      Property.multilink( activeTotalProperties.values, ( horizontalTotal, verticalTotal ) => {
        this.innerContent = StringUtils.fillIn( factorsTimesPatternString, {
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
        pdomNamespace: ns
      } );
      activeTotalProperties.vertical.link( verticalTotal => {
        verticalNode.innerContent = `${verticalTotal}`;
      } );
      const horizontalNode = new Node( {

        // pdom
        tagName: 'mn',
        pdomNamespace: ns
      } );
      activeTotalProperties.horizontal.link( horizontalTotal => {
        horizontalNode.innerContent = `${horizontalTotal}`;
      } );

      const mathNode = new Node( {
        tagName: 'math',
        pdomNamespace: ns,
        children: [
          new Node( {
            tagName: 'mrow',
            pdomNamespace: ns,
            children: [
              verticalNode,
              new Node( {
                tagName: 'mo',
                pdomNamespace: ns,
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

  /**
   * Creates a picker that adjusts the specified orientation's total size.
   * @private
   *
   * @param {Orientation} orientation
   * @param {Property.<Area>} currentAreaProperty
   * @param {number} decimalPlaces
   */
  createPicker( orientation, currentAreaProperty, decimalPlaces ) {
    validate( orientation, { validValues: Orientation.VALUES } );

    // {Property.<Property.<Polynomial|null>>}
    const currentTotalProperty = new DerivedProperty( [ currentAreaProperty ], area => area.activeTotalProperties.get( orientation ) );

    // {Property.<Polynomial|null>}
    const bidirectionalProperty = new DynamicProperty( currentTotalProperty, {
      bidirectional: true
    } );

    // {Property.<Range>}
    const rangeProperty = new DerivedProperty( [ currentAreaProperty ], area => new Range( area.minimumSize, area.maximumSize ) );

    return new NumberPicker( bidirectionalProperty, rangeProperty, {
      incrementFunction: value => Utils.toFixedNumber( value + currentAreaProperty.value.snapSize, decimalPlaces ),
      decrementFunction: value => Utils.toFixedNumber( value - currentAreaProperty.value.snapSize, decimalPlaces ),
      decimalPlaces: decimalPlaces,
      scale: 1.5,
      formatValue: value => {
        // Epsilon chosen to avoid round-off errors while not "rounding" any values in the decimals sims improperly.
        if ( Utils.equalsEpsilon( value, Utils.roundSymmetric( value ), 1e-6 ) ) {
          return Utils.toFixed( value, 0 );
        }
        else {
          return Utils.toFixed( value, 1 );
        }
      },
      color: areaModelCommonColorProfile.proportionalColorProperties.get( orientation ),

      // pdom
      labelContent: orientation === Orientation.HORIZONTAL ? horizontalPickerString : verticalPickerString,
      descriptionContent: orientation === Orientation.HORIZONTAL ? horizontalPickerDescriptionString : verticalPickerDescriptionString,
      a11yMapPDOMValue: value => Utils.toFixedNumber( value, decimalPlaces )
    } );
  }
}

areaModelCommon.register( 'ProportionalFactorsNode', ProportionalFactorsNode );

export default ProportionalFactorsNode;