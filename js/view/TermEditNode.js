// Copyright 2017, University of Colorado Boulder

/**
 * An edit button and readout for the associated term.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/AreaModelConstants' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Orientation = require( 'AREA_MODEL_COMMON/model/Orientation' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Term = require( 'AREA_MODEL_COMMON/model/Term' );

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
   * @param {number} digitCount
   * @param {boolean} allowExponents
   * @param {Function} editCallback - Called when editing is triggered
   */
  function TermEditNode( orientation, termProperty, textColorProperty, borderColorProperty, isActiveProperty, digitCount, allowExponents, editCallback ) {
    assert && assert( Orientation.isOrientation( orientation ) );
    assert && assert( termProperty instanceof Property );
    assert && assert( textColorProperty instanceof Property );
    assert && assert( borderColorProperty instanceof Property );
    assert && assert( isActiveProperty instanceof Property );
    assert && assert( typeof digitCount === 'number' );
    assert && assert( typeof allowExponents === 'boolean' );

    var readoutText = new RichText( Term.getLongestGenericString( allowExponents, digitCount ), {
      fill: textColorProperty,
      font: AreaModelConstants.EDIT_READOUT_FONT
    } );

    var readoutBackground = new Rectangle( 0, 0, readoutText.width + 5, readoutText.height + 5, {
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

    termProperty.link( function( term ) {
      if ( term === null ) {
        readoutText.text = '';
      }
      else {
        readoutText.text = term.toRichString( false );
        readoutText.center = readoutBackground.selfBounds.center;
      }
    } );

    isActiveProperty.link( function( isActive ) {
      readoutBackground.fill = isActive ? AreaModelColorProfile.editActiveBackgroundProperty
                                        : AreaModelColorProfile.editInactiveBackgroundProperty;
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

    readoutBackground.touchArea = readoutBackground.parentToLocalBounds( this.localBounds ).dilated( 6 );
  }

  areaModelCommon.register( 'TermEditNode', TermEditNode );

  return inherit( LayoutBox, TermEditNode );
} );
