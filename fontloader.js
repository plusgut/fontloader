/*!
 * fontloader
 * https://github.com/plusgut/fontloader
 *
 * Copyright 2015 Carlo Jeske
 * Released under the MIT license
 */
function Font( opt ){
	this.success      = null;    // Callback after successfull loading
	this.error        = null;    // Callback after error loading
	this.node         = null;    // Dom node where the font should be changed
	this.fontName     = null;    // Name of the fontface
	this.fontUrl      = null;    // Name of the fonturl
	this.fallbackFont = 'arial'; // The font which should be used, when fontloading fails

	this._increment    = 0;   // Current state how often it got checked
	this._maxIncrement = 20;  // Defines how 
	this._interval     = 100; // Defines when it should be checked

	for( var index in opt ){
		if( opt.hasOwnProperty( index )){
			if( !this.hasOwnProperty( index )){
				console.info( 'The property ' + index + ' is no setting of the fontloader');
			}
			this[ index ] = opt[ index ];
		}
	}

	this._init = function() {
		if( !this.fallbackFont ) throw ('No fallbackFont was defined');
		if( !this.fontName )     throw ('No fontName was defined');
		if( !this.node )         throw ('No dom node was defined');
		this.node.style.fontFamily = this.fallbackFont;
		this._currentWidth         = this._getWidth(); // A reference value with another font is needed
		this.node.style.fontFamily = this.fontName + ',' + this.fallbackFont;
		this._checkWidth(); // Starts the interval
	};

	this._checkWidth = function() {
		if( this._currentWidth === this._getWidth()){
			this._startInterval();
		} else {
			this.success();
		}
	};

	this._startInterval = function() {
		this._increment++;
		if( this._increment > this._maxIncrement ){
			this.error();
		} else {
			window.setTimeout( this._checkWidth.bind( this ), this._interval);
		}
	};

	this._getWidth = function(){
		if( !this.node.getBBox ){
			throw 'This library currently only supports svg nodes';
		}
		var bbox = this.node.getBBox();
		// console.log(bbox.width);
		return bbox.width;
	};

	this._init();
}