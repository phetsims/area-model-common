// Copyright 2017-2020, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import areaModelCommon from '../../areaModelCommon.js';
import AreaModelCommonConstants from '../../common/AreaModelCommonConstants.js';
import Term from '../../common/model/Term.js';
import AreaModelCommonColorProfile from '../../common/view/AreaModelCommonColorProfile.js';

/**
 * @constructor
 * @extends {Node}
 *
 * @param {Property.<Orientation>} orientationProperty
 * @param {Property.<Term|null>} termProperty
 * @param {Object} [options]
 */
function TermEditNode( orientationProperty, termProperty, options ) {
  assert && assert( orientationProperty instanceof Property );
  assert && assert( termProperty instanceof Property );

  options = merge( {
    // {Property.<Color>} - The color of the readout text
    textColorProperty: new Property( Color.BLACK ),

    // {Property.<Color>} - The color of the border around the readout
    borderColorProperty: new Property( Color.BLACK ),

    // {Property.<boolean>} - Whether this term is the one being edited right now
    isActiveProperty: new BooleanProperty( false ),

    // {Property.<number>} - How many digits are allowed to be used for this term
    digitCountProperty: new NumberProperty( 1 ),

    // {Property.<boolean>} - Whether exponents are allowed for this term
    allowExponentsProperty: new BooleanProperty( false ),

    // {function} - Called with no arguments when this term should start being edited
    editCallback: _.noop,

    // {Font}
    font: AreaModelCommonConstants.TERM_EDIT_READOUT_FONT
  }, options );

  const self = this;

  const readoutText = new RichText( '', {
    fill: options.textColorProperty,
    font: options.font
  } );

  const readoutBackground = new Rectangle( {
    stroke: options.borderColorProperty,
    cornerRadius: 4,
    children: [
      readoutText
    ],
    // Allow clicking the readout to edit, see https://github.com/phetsims/area-model-common/issues/23
    cursor: 'pointer',
    inputListeners: [
      new FireListener( {
        fire: options.editCallback
      } )
    ]
  } );

  LayoutBox.call( this, {
    orientation: orientationProperty.value.layoutBoxOrientation,
    spacing: 4,
    children: [
      readoutBackground,
      new RectangularPushButton( {
        content: new FontAwesomeNode( 'pencil_square_o', {
          scale: 0.4,
          xMargin: 6,
          yMargin: 4
        } ),
        listener: function() {
          options.editCallback();
        },
        baseColor: AreaModelCommonColorProfile.editButtonBackgroundProperty
      } )
    ]
  } );
  orientationProperty.link( function( orientation ) {
    self.orientation = orientation.layoutBoxOrientation;
  } );

  options.isActiveProperty.link( function( isActive ) {
    readoutBackground.fill = isActive
                             ? AreaModelCommonColorProfile.editActiveBackgroundProperty
                             : AreaModelCommonColorProfile.editInactiveBackgroundProperty;
  } );

  function updateText() {
    if ( termProperty.value === null ) {
      readoutText.text = '';
    }
    else {
      readoutText.text = termProperty.value.toRichString( false );
    }

    readoutText.center = readoutBackground.selfBounds.center;
    readoutBackground.touchArea = readoutBackground.parentToLocalBounds( self.localBounds ).dilated( 6 );
  }

  function updateDigits() {
    readoutText.text = Term.getLargestGenericString( options.allowExponentsProperty.value, options.digitCountProperty.value );
    readoutBackground.rectWidth = readoutText.width + 5;
    readoutBackground.rectHeight = readoutText.height + 5;
    updateText();
  }

  termProperty.lazyLink( updateText );
  options.digitCountProperty.lazyLink( updateDigits );
  options.allowExponentsProperty.lazyLink( updateDigits );
  orientationProperty.lazyLink( updateDigits );

  updateDigits();
}

areaModelCommon.register( 'TermEditNode', TermEditNode );

inherit( LayoutBox, TermEditNode );
export default TermEditNode;