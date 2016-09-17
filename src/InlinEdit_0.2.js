/**
 * @author Lars Willighagen [lars.willighagen@gmail.com]
 * @version 0.2
 * @license
 * Copyright (c) 2016 Lars Willighagen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * @class InlinEditString
 * 
 * InlinEditString
 * 
 * @param {String} string - String
 * @param {(Object[]|String)} style - String style to apply
 */

function InlinEditString ( string, style ) {
  
  if ( ! ( this instanceof InlinEditString ) )
    return new InlinEditString ( string, style )
  
  /**
   * Object containing all possible values for conversion from style to CSS.
   * 
   * @type Object
   */
  this._styleCSSLookUp = {
    bold: {
      name: 'fontWeight',
      0: '400',
      1: '700'
    },
    italic: {
      name: 'fontStyle',
      0: 'normal',
      1: 'italic'
    }
  }
  
  /**
   * Object containing default values for the style object.
   * 
   * @type Object
   */
  this._defaultStyle = {
    bold: false,
    italic: false
  }
  
  /**
   * The styled string
   *
   * @type Object
   * @default []
   */
  this.string = []
  
  /**
   * Style to css
   *
   * @method calculateStyle
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return this
   */
  this.calculateStyle = function () {
    this._log.push( {
      name: 'calculateStyle',
      version: this.currentVersion() + 1,
      arguments: Array.prototype.slice.call(arguments)
    } )
    
    var self = this
    
    self.string.map( function ( char ) {
      
      Object.keys( char.style ).forEach( function ( prop ) {
	
	var val = char.style[ prop ]
	  , defVal = self._defaultStyle[ prop ]
	  , css = self._styleCSSLookUp[ prop ]
	  , cssIsArray = Array.isArray( css )
	
	if ( cssIsArray )
	  css.forEach( function ( CSSProp ) {
	    if ( typeof defVal === 'boolean' )
	      char.css[ CSSProp.name ] = CSSProp[ val * 1 ]
	    
	    else
	      char.css[ CSSProp.name ] = val
	  } )
	
	else {
	  if ( typeof defVal === 'boolean' )
	    char.css[ css.name ] = css[ val * 1 ]
	    
	  else
	    char.css[ css.name ] = val }
	
      } )
      
    } )
    
    return this
  }
  
  /**
   * Set a style
   *
   * @method applyStyle
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return this
   */
  this.applyStyle = function ( style, value, start, end ) {
    
    this.string.map( function ( char, charIndex ) {
      if ( charIndex >= start && charIndex <= end )
	char.style[ style ] = value
      
      return char
    } )
    
    return this
  }
  
  /**
   * @method bold
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return this
   */
  this.bold = function ( start, end ) {
    this._log.push( {
      name: 'bold',
      version: this.currentVersion() + 1,
      arguments: Array.prototype.slice.call(arguments)
    } )
    
    var vList = this.string.slice( start, end ).map( function ( v ) {
      return v.style.bold
    } ).filter( function ( v, i, a ) {
      return a.indexOf( v ) === i
    } )
    
    return this.applyStyle( 'bold', ( vList.length - 1 || !vList[ 0 ] ), start, end )
  }
  
  /**
   * @method italic
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return this
   */
  this.italic = function ( start, end ) {
    this._log.push( {
      name: 'italic',
      version: this.currentVersion() + 1,
      arguments: Array.prototype.slice.call(arguments)
    } )
    
    var vList = this.string.slice( start, end ).map( function ( v ) {
      return v.style.italic
    } ).filter( function ( v, i, a ) {
      return a.indexOf( v ) === i
    } )
    
    return this.applyStyle( 'italic', ( vList.length - 1 || !vList[ 0 ] ), start, end )
  }
  
  /**
   * Set the object value
   *
   * @method set
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return this
   */
  this.set = function ( string, style ) {
    this._log.push( {
      name: 'set',
      version: this.currentVersion() + 1,
      arguments: Array.prototype.slice.call(arguments)
    } )
    
    this.string = string.split( '' ).map( function ( v, i ) {
      return {
	char: v,
	style: {},
	css: {}
      }
    } )
    
    return this
  }
    
  /**
   * Get the plain text value of the styled string
   *
   * @method toString
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return The plain text string
   */
  this.toString = function () {
    return this.string.map( function ( v ) {
      return v.char
    } ).join( '' )
  }
  
  /**
   * Get the html value of the styled string
   *
   * @method toHTML
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @param {Boolean} [asString=false] - HTML as string instead of a DOM element array
   * @return Array of HTML DOM elements
   */
  this.toHTML = function ( asString ) {
    
    var string = this.string.slice()
      , html   = []
      , href   = []
    
    string.forEach( function ( char, charIndex ) {
      
      var elm = document.createElement( 'span' )
      
      for ( var css in char.css ) {
	elm.style[ css ] = char.css[ css ]
      }
      
      elm.innerText = char.char
      
      if ( char.href ) {
	if ( !href.length || ( href[ href.length - 1 ].href === char.href ) )
	  href.push( {
	    start: i,
	    end  : i,
	    href : char.href
	  } )
	
	else
	  href[ href.length - 1 ].end += 1
	  
      }
      
      html.push( elm )
      
    } )
    
    href.forEach( function ( href, hrefIndex ) {
      
      var anchor = document.createElement( 'a' )
      
      html.slice( href.start, href.end - href.start ).forEach( function ( child ) {
	anchor.appendChild( child )
      } )
      
      anchor.setAttribute( 'href', href.href )
      
      html.splice( href.start, href.end - href.start, anchor )
      
    } )
    
    return asString ? html.map( function ( elm ) {
      var res = ''
      
      res += '<span'
      
      res += ' style="'
      Object.keys( elm.style ).forEach( function ( css ) {
	res += elm.style[ css ] && /[A-Za-z]/.test( css ) ? (
	  css.replace( /[A-Z]/g, function ( a ) {
	    return ( '-' + a.toLowerCase() )
	  } ) +
	  ':' +
	  elm.style[ css ] +
	  ';'
	) : ''
      } )
      res += '"'
      
      res += '>' + elm.textContent
      res += '</span>'
      
      return res
    } ).join( '' ) : html
    
  }
  
  /*
  -------------------------------------------------------------------------
  ----@------@@@---@@@@-------@---@-@@@@@-@@@@@-@---@--@@@--@@@@---@@@-----
  ----@-----@---@-@-----------@@-@@-@-------@---@---@-@---@-@---@-@--------
  ----@-----@---@-@--@@-------@-@-@-@@@@----@---@@@@@-@---@-@---@--@@@-----
  ----@-----@---@-@---@-------@---@-@-------@---@---@-@---@-@---@-----@----
  ----@@@@@--@@@---@@@@-------@---@-@@@@@---@---@---@--@@@--@@@@---@@@-----
  -------------------------------------------------------------------------
  */
  
  /**
   * The log, containing all logged data.
   * 
   * These are the names of each called function, together with it's input. If the `InlinEditString` is changed, the version number gets updated as well.
   * 
   * The `.reset()` function **does not** have any influence on the log. This way, you can still undo all changes.
   * 
   * <br /><br />
   * `.currentVersion()` and similar function **are not** logged, because this would be influenced by function using other functions.
   *
   * @type Object[]
   * @property {Object} 0 - The first version, indicated with version 0, containing the object as it was when it was made. The following properties are used for the following properties too.
   * @property {String} 0.name - The name of the called function. In case of the initial version, this is `"init"`.
   * @property {String} 0.version - The version of the object. Undefined when a function that doesn't change the object is called.
   * @property {Array} 0.arguments - The arguments passed in the called function.
   */
  this._log = []
  
  /**
   * 
   * @method currentVersion
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return The latest version of the object
   */
  this.currentVersion = function () {
    if ( !this._log.length )
      return 0;
    
    for ( var i = this._log.length; --i >= 0; ) {
      if ( this._log[ i ].version )
	return this._log[ i ].version }
  }
  
  /**
   * Does not change the current object.
   * 
   * @method retrieveVersion
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @param {Integer} The number of the version you want to retrieve. Illegel numbers: numbers under zero, floats, numbers above the current version of the object.
   * @return The version of the object with the version number passed. `undefined` if an illegal number is passed.
   */
  this.retrieveVersion = function ( versnum ) {
    this._log.push( {
      name: 'retrieveVersion',
      arguments: [ versnum ]
    } )
    
    if ( versnum >= 0 && versnum <= this.currentVersion() ) {
      var object = new InlinEditString( this._log[ 0 ].arguments[ 0 ], this._log[ 0 ].arguments[ 1 ] ),
	  arr    = [];
      
      for ( var i = 0; i < this._log.length; i++ ) {
	if ( this._log[ i ].version )
	  arr.push( this._log[ i ] ) }
      
      for ( var k = 1; k <= versnum; k++ ) {
	object[ arr[ k ].name ].apply( object, ( arr[ k ].arguments || [] ) ) }
      
      return object;
      
    } else return undefined;
  }
  
  /**
   * Does not change the current object. Undoes the last edit made.
   * 
   * @method undo
   * @memberof InlinEditString
   * @this InlinEditString
   * 
   * @return The last version of the object. `undefined` if used on first version.
   */
  this.undo = function () {
    return this.retrieveVersion( this.currentVersion() - 1 );
  }
  
  /**
   * Reset a `InlinEditString` object.
   * 
   * @method reset
   * @memberof InlinEditString
   * @this InlinEditString
   * @return The updated, empty parent object (except the log, the log lives)
   */
  this.reset = function () {
    this._log.push( {
      name: 'reset',
      version: this.currentVersion() + 1,
      arguments: []
    } )
    
    this.data = [],
    this._options = {};
    return this;
  }
  
  this.set( string, style )  
}