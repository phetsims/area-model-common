// Copyright 2017, University of Colorado Boulder

/**
 * Shows a combo box that allows selecting between different layouts
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AreaModelColorProfile = require( 'AREA_MODEL_COMMON/common/view/AreaModelColorProfile' );
  var areaModelCommon = require( 'AREA_MODEL_COMMON/areaModelCommon' );
  var AreaModelConstants = require( 'AREA_MODEL_COMMON/common/AreaModelConstants' );
  var AreaModelQueryParameters = require( 'AREA_MODEL_COMMON/common/AreaModelQueryParameters' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ComboBox = require( 'SUN/ComboBox' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var GenericLayout = require( 'AREA_MODEL_COMMON/generic/model/GenericLayout' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {ComboBox}
   *
   * @param {Property.<GenericLayout>} genericLayoutProperty
   * @param {Node} listParent
   * @param {number} width
   */
  function GenericLayoutSelectionNode( genericLayoutProperty, listParent, width ) {
    Node.call( this );

    var self = this;

    width -= 1; //TODO: don't have to subtract off the double half stroke width here!

    var scale = 0.7;

    //TODO: refactor so this may not be needed if we ditch the ComboBox
    var items = GenericLayout.VALUES.map( function( layout ) {
      return {
        node: new HBox( {
          children: [
            createLayoutIcon( layout.size, 1 ),
            new Text( layout.size.height + 'x' + layout.size.width, {
              font: AreaModelConstants.LAYOUT_FONT
            } )
          ],
          spacing: 20
        } ),
        value: layout
      };
    } );

    if ( AreaModelQueryParameters.combobox ) {
      // TODO: better way!
      var currentComboChromeWidth = 74.5; // empirically determined, but easy to break in the future
      var maxItemWidth = Math.max.apply( Math, _.map( _.map( items, 'node' ), 'width' ) );
      var extraPadding = width / scale - currentComboChromeWidth - maxItemWidth;
      items.forEach( function( item ) {
        item.node = new AlignBox( item.node, { rightMargin: extraPadding } );
      } );

      this.addChild( new ComboBox( items, genericLayoutProperty, listParent, {
        // TODO
        scale: scale
      } ) );
    }
    else {
      var maxItemHeight = Math.max.apply( Math, _.map( _.map( items, 'node' ), 'height' ) );
      var itemMargin = 6;
      var arrowMargin = 8;

      var rectHeight = maxItemHeight * scale + 2 * itemMargin;
      var rectangle = new Rectangle( {
        rectWidth: width,
        rectHeight: maxItemHeight * scale + 2 * itemMargin,
        fill: 'white',
        stroke: 'black',
        cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
        cursor: 'pointer'
      } );
      this.addChild( rectangle );

      var arrowSize = 15;
      var arrow = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize, 0 ).lineTo( arrowSize * 0.5, arrowSize * 0.9 ).close(), {
        fill: 'black',
        right: rectangle.right - arrowMargin,
        centerY: rectangle.centerY,
        pickable: false
      } );
      this.addChild( arrow );

      var separatorX = arrow.left - arrowMargin;
      this.addChild( new Line( {
        x1: separatorX,
        y1: 0,
        x2: separatorX,
        y2: rectHeight,
        lineWidth: 0.5,
        stroke: 'black',
        pickable: false
      } ) );

      var currentLabel = new Node( {
        scale: scale, // TODO: get rid of scale when we don't need it for the ComboBox
        pickable: false
      } );
      genericLayoutProperty.link( function( layout ) {
        currentLabel.children = [
          _.find( items, function( item ) {
            return item.value === layout;
          } ).node
        ];
        currentLabel.left = itemMargin;
        currentLabel.centerY = rectangle.centerY;
      } );
      this.addChild( currentLabel );

      var popup = new Rectangle( {
        rectWidth: separatorX,
        rectHeight: separatorX,
        fill: 'white',
        stroke: 'black',
        cornerRadius: AreaModelConstants.PANEL_CORNER_RADIUS,
        pickable: true
      } );

      var buttonSpacing = 12;
      var buttonsNode = new VBox( {
        children: [ 1, 2, 3 ].map( function( numVertical ) {
          return new HBox( {
            children: [ 1, 2, 3 ].map( function( numHorizontal ) {
              var layout = GenericLayout.fromValues( numHorizontal, numVertical );
              var icon = createLayoutIcon( layout.size, 0.7 );
              icon.pickable = false; // TODO: annoying that we have to specify this?
              var cornerRadius = 3;
              var background = Rectangle.roundedBounds( icon.bounds.dilated( cornerRadius ), cornerRadius, cornerRadius, {
                cursor: 'pointer'
              } );
              var listener = new FireListener( {
                fire: function() {
                  genericLayoutProperty.value = layout;
                  visibleProperty.value = false; // hide
                }
              } );
              background.stroke = new DerivedProperty( [ genericLayoutProperty, AreaModelColorProfile.radioBorderProperty ], function( currentLayout, highlightColor ) {
                if ( currentLayout === layout ) {
                  return highlightColor;
                }
                else {
                  return 'transparent';
                }
              } );
              background.fill = new DerivedProperty( [ listener.isHoveringProperty ], function( isHovering ) {
                if ( isHovering ) {
                  return 'rgb(240,240,240)'; // TODO: extract
                }
                else {
                  return 'transparent';
                }
              } );

              return new Node( {
                children: [ background, icon ],
                inputListeners: [ listener ]
              } );
            } ),
            spacing: buttonSpacing
          } );
        } ),
        spacing: buttonSpacing
      } );
      var panelMargin = 20;
      buttonsNode.scale( ( popup.width - 2 * panelMargin ) / buttonsNode.width );
      buttonsNode.center = popup.center;
      popup.addChild( buttonsNode );

      var visibleProperty = new BooleanProperty( false );
      popup.addInputListener( {
        down: function( event ) {
          event.handle();
        }
      } );
      //TODO: input cleanup! Messy. Bad! Make Input Listeners Great Again!
      var dismissListener = {
        down: function( event ) {
          if ( !event.trail.isExtensionOf( self.getUniqueTrail() ) ) {
            visibleProperty.value = false;
          }
        }
      };
      visibleProperty.lazyLink( function( visible ) {
        if ( visible ) {
          var matrix = self.getUniqueTrail().getMatrixTo( listParent.getUniqueTrail() );
          popup.setScaleMagnitude( matrix.getScaleVector().x );
          // TODO: handle scale sometime maybe?
          popup.leftTop = matrix.timesVector2( rectangle.leftBottom );
          listParent.addChild( popup );

          phet.joist.display.addInputListener( dismissListener );
        }
        else {
          listParent.removeChild( popup );

          phet.joist.display.removeInputListener( dismissListener );
        }
      } );

      rectangle.addInputListener( {
        down: function( event ) {
          visibleProperty.toggle();
        }
      } );
    }
  }

  areaModelCommon.register( 'GenericLayoutSelectionNode', GenericLayoutSelectionNode );

  /**
   * Creates a layout icon based on the given size.
   * @private
   *
   * @param {Dimension2} size
   * @param {number} lineWidth
   * @returns {Node}
   */
  function createLayoutIcon( size, lineWidth ) {
    var length = 30;
    var shape = new Shape().rect( 0, 0, length, length );
    if ( size.width === 2 ) {
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_SINGLE_OFFSET, 0 ).verticalLineTo( length );
    }
    else if ( size.width === 3 ) {
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_FIRST_OFFSET, 0 ).verticalLineTo( length );
      shape.moveTo( length * AreaModelConstants.GENERIC_ICON_SECOND_OFFSET, 0 ).verticalLineTo( length );
    }
    if ( size.height === 2 ) {
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_SINGLE_OFFSET ).horizontalLineTo( length );
    }
    else if ( size.height === 3 ) {
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_FIRST_OFFSET ).horizontalLineTo( length );
      shape.moveTo( 0, length * AreaModelConstants.GENERIC_ICON_SECOND_OFFSET ).horizontalLineTo( length );
    }
    return new Path( shape, {
      lineWidth: lineWidth,
      stroke: AreaModelColorProfile.layoutGridProperty,
      fill: 'white' //TODO colorit
    } );
  }

  return inherit( Node, GenericLayoutSelectionNode );
} );
