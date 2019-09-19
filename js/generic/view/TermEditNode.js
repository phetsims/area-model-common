// Copyright 2017-2018, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * NOTE: This type is designed to be persistent, and will not need to release references to avoid memory leaks.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  const AreaModelCommonColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelCommonColorProfile' );
  const AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const FireListener = require( 'SCENERY/listeners/FireListener' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

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

    options = _.extend( {
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

    var self = this;

    var readoutText = new RichText( '', {
      fill: options.textColorProperty,
      font: options.font
    } );

    var readoutBackground = new Rectangle( {
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

  return inherit( LayoutBox, TermEditNode );
} );
