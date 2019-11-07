// Copyright 2017-2019, University of Colorado Boulder

/**
 * Displays and allows editing of the total width and height of the contained area.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonA11yStrings = require( 'AREA_MODEL_COMMON/AreaModelCommonA11yStrings' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const AreaModelCommonQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelCommonQueryParameters' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const validate = require( 'AXON/validate' );

  // a11y strings
  const factorsTimesPatternString = AreaModelCommonA11yStrings.factorsTimesPattern.value;
  const horizontalPickerString = AreaModelCommonA11yStrings.horizontalPicker.value;
  const horizontalPickerDescriptionString = AreaModelCommonA11yStrings.horizontalPickerDescription.value;
  const verticalPickerString = AreaModelCommonA11yStrings.verticalPicker.value;
  const verticalPickerDescriptionString = AreaModelCommonA11yStrings.verticalPickerDescription.value;

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
        // a11y
        tagName: 'mn',
        accessibleNamespace: ns
      } );
      activeTotalProperties.vertical.link( function( verticalTotal ) {
        verticalNode.innerContent = '' + verticalTotal;
      } );
      const horizontalNode = new Node( {
        // a11y
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

  return inherit( Node, ProportionalFactorsNode, {
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
          return Util.toFixedNumber( value + currentAreaProperty.value.snapSize, decimalPlaces );
        },
        downFunction: function( value ) {
          return Util.toFixedNumber( value - currentAreaProperty.value.snapSize, decimalPlaces );
        },
        decimalPlaces: decimalPlaces,
        scale: 1.5,
        formatValue: function( value ) {
          // Epsilon chosen to avoid round-off errors while not "rounding" any values in the decimals sims improperly.
          if ( Util.equalsEpsilon( value, Util.roundSymmetric( value ), 1e-6 ) ) {
            return Util.toFixed( value, 0 );
          }
          else {
            return Util.toFixed( value, 1 );
          }
        },
        color: AreaModelCommonColorProfile.proportionalColorProperties.get( orientation ),

        // a11y
        labelContent: orientation === Orientation.HORIZONTAL ? horizontalPickerString : verticalPickerString,
        descriptionContent: orientation === Orientation.HORIZONTAL ? horizontalPickerDescriptionString : verticalPickerDescriptionString,
        a11yMapValue: value => Util.toFixedNumber( value, decimalPlaces )
      } );
    }
  } );
} );
