// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelCommonConstants = require( 'AREA_MODEL_COMMON/common/AreaModelCommonConstants' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Orientation = require( 'AREA_MODEL_COMMON/common/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/common/model/Term' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: options object?
   *
   * @param {Orientation} orientation
   * @param {Property.<Term|null>} termProperty
   * @param {Property.<Color>} textColorProperty
   * @param {Property.<Color>} borderColorProperty
   * @param {Property.<boolean>} isActiveProperty
   * @param {Property.<number>} digitCountProperty
   * @param {Property.<boolean>} allowExponentsProperty
   * @param {function} editCallback - Called when editing is triggered
   */
  function TermEditNode( orientation, termProperty, textColorProperty, borderColorProperty, isActiveProperty, digitCountProperty, allowExponentsProperty, editCallback ) {
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( termProperty instanceof Property );
    assert && assert( textColorProperty instanceof Property );
    assert && assert( borderColorProperty instanceof Property );
    assert && assert( isActiveProperty instanceof Property );
    assert && assert( digitCountProperty instanceof Property );
    assert && assert( allowExponentsProperty instanceof Property );

    var self = this;

    var readoutText = new RichText( '#covfefe', {
      fill: textColorProperty,
      font: AreaModelCommonConstants.EDIT_READOUT_FONT
    } );

    var readoutBackground = new Rectangle( {
      stroke: borderColorProperty,
      cornerRadius: 4,
      children: [
        readoutText
      ],
      // Allow clicking the readout to edit, see https://github.com/phetsims/area-model-common/issues/23
      cursor: 'pointer',
      inputListeners: [
        new FireListener( {
          fire: editCallback
        } )
      ]
    } );

    LayoutBox.call( this, {
      orientation: orientation === Orientation.HORIZONTAL ? 'horizontal' : 'vertical',
      spacing: 4,
      children: [
        readoutBackground,
        new MutableOptionsNode( RectangularPushButton, [], {
          content: new FontAwesomeNode( 'pencil_square_o', {
            scale: 0.4,
            xMargin: 6,
            yMargin: 4
          } ),
          listener: function() {
            editCallback();
          }
        }, {
          baseColor: AreaModelColorProfile.editButtonBackgroundProperty
        } )
      ]
    } );

    isActiveProperty.link( function( isActive ) {
      readoutBackground.fill = isActive ? AreaModelColorProfile.editActiveBackgroundProperty
                                        : AreaModelColorProfile.editInactiveBackgroundProperty;
    } );

    function layout() {
      readoutText.center = readoutBackground.selfBounds.center;
      readoutBackground.touchArea = readoutBackground.parentToLocalBounds( self.localBounds ).dilated( 6 );
    }

    function updateText() {
      if ( termProperty.value === null ) {
        readoutText.text = '-';
      }
      else {
        readoutText.text = termProperty.value.toRichString( false );
      }
      layout();
    }

    function updateDigits() {
      readoutText.text = Term.getLongestGenericString( allowExponentsProperty.value, digitCountProperty.value );
      readoutBackground.rectWidth = readoutText.width + 5;
      readoutBackground.rectHeight = readoutText.height + 5;
      updateText();
    }

    termProperty.lazyLink( updateText );
    digitCountProperty.lazyLink( updateDigits );
    allowExponentsProperty.lazyLink( updateDigits );

    updateDigits();
  }

  areaModelCommon.register( 'TermEditNode', TermEditNode );

  return inherit( LayoutBox, TermEditNode );
} );
