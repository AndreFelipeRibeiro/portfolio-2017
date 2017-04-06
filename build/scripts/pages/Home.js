/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Hammer = __webpack_require__(2);

	var transitionEnd = __webpack_require__(3);

	var BaseGallery = __webpack_require__(4);
	var Pagination = __webpack_require__(5);

	var IS_MOBILE_OS = __webpack_require__(7);

	var Home = function () {
	  function Home() {
	    _classCallCheck(this, Home);

	    this.$portfolio = document.getElementById('portfolio');
	    this.$coverGalleryWrapper = this.$portfolio.getElementsByClassName('cover-gallery-wrapper')[0];
	    this.$coverGallery = this.$portfolio.getElementsByClassName('cover-gallery')[0];
	    this.$coverGalleryImagery = this.$portfolio.getElementsByClassName('cover-gallery-imagery')[0];
	    this.$coverGalleryText = this.$portfolio.getElementsByClassName('cover-gallery-text')[0];
	    this.$coverImages = Array.from(this.$coverGalleryImagery.getElementsByClassName('imagery'));
	    this.$coverTexts = Array.from(this.$coverGalleryText.getElementsByClassName('text'));

	    this.$coverPagination = this.$portfolio.getElementsByClassName('cover-gallery-pagination')[0];
	    this.$paginationDivider = this.$coverPagination.getElementsByClassName('divider')[0];
	    this.$paginationTimer = this.$paginationDivider.getElementsByClassName('timer')[0];
	    this.$activePageWrapper = this.$coverPagination.getElementsByClassName('active-page-wrapper')[0];

	    this.$gridGalleryWrapper = this.$portfolio.getElementsByClassName('grid-gallery-wrapper')[0];
	    this.$gridGallery = this.$portfolio.getElementsByClassName('grid-gallery')[0];
	    this.$gridBlocks = Array.from(this.$gridGallery.getElementsByClassName('grid-block'));

	    this.$header = document.getElementById('header');

	    this.$sideNav = this.$portfolio.getElementsByClassName('side-nav')[0];
	    this.$sideNavOptions = Array.from(this.$sideNav.getElementsByClassName('label'));

	    this.handleCoverChange = this.handleCoverChange.bind(this);
	    this.handleResize = this.handleResize.bind(this);
	    this.handleScroll = this.handleScroll.bind(this);
	    this.requestScroll = this.requestScroll.bind(this);
	    this.handleLayoutChange = this.handleLayoutChange.bind(this);
	    this.handleTouch = this.handleTouch.bind(this);

	    this.isFirstLoad = true;
	    this.layout = this.$portfolio.dataset.view;
	    this.lastPageYOffset = window.pageYOffset;
	    this.currentPageYOffset = window.pageYOffset;
	    this.sectionHeight = IS_MOBILE_OS ? 1000 : 2000;

	    this.initSideNav();
	    this.initPagination();
	    this.initCoverGalleries();
	    this.initGridGallery();
	    this.initTouch();

	    this.setGalleryHeights();

	    this.updateLayout(this.layout);

	    scrollTo(0, 0);
	    this.handleResize();

	    this.addEventListeners();
	  }

	  _createClass(Home, [{
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      var _this = this;

	      window.addEventListener('scroll', this.requestScroll);
	      window.addEventListener('resize', this.handleResize);

	      this.$gridBlocks.forEach(function ($block) {
	        $block.addEventListener('mouseenter', function () {
	          if (_this.isTransitioning) return;
	          _this.hoveredBlock = $block;
	          _this.$gridGallery.classList.add('has-hovered-block');
	          $block.classList.add('is-hovered');
	        });

	        $block.addEventListener('mouseleave', function () {
	          if (_this.isTransitioning) return;
	          if (_this.hoveredBlock !== $block) return;
	          _this.$gridGallery.classList.remove('has-hovered-block');
	          $block.classList.remove('is-hovered');
	          _this.hoveredBlock = null;
	        });
	      });
	    }
	  }, {
	    key: 'setTimer',
	    value: function setTimer() {
	      var _this2 = this;

	      if (this.timer) clearInterval(this.timer);

	      this.lastCoverChange = new Date().getTime();

	      this.timer = setInterval(function () {
	        var now = new Date().getTime();
	        var timeSinceLastChange = now - _this2.lastCoverChange;
	        var translation = timeSinceLastChange / 8000 * 100;
	        _this2.$paginationTimer.style.transform = 'translate3d(' + translation + '%,0,0)';

	        if (timeSinceLastChange >= 8000) _this2.coverGalleryImagery.next();
	      }, 700);
	    }
	  }, {
	    key: 'requestScroll',
	    value: function requestScroll(e) {
	      this.requestTick(e);
	    }
	  }, {
	    key: 'requestTick',
	    value: function requestTick(e) {
	      var _this3 = this;

	      if (this.ticking) return;

	      requestAnimationFrame(function () {
	        _this3.lastPageYOffset = _this3.currentPageYOffset;
	        _this3.currentPageYOffset = window.pageYOffset;
	        _this3.handleScroll(e);
	        _this3.ticking = false;
	      });

	      this.ticking = true;
	    }
	  }, {
	    key: 'handleResize',
	    value: function handleResize() {
	      this.vh = window.innerHeight;
	      this.bodyHeight = document.body.clientHeight;

	      this.setGalleryHeights();
	      this.setGridBlockSizes();
	    }
	  }, {
	    key: 'handleScroll',
	    value: function handleScroll(e) {
	      if (this.layout === 'grid') return;
	      if (IS_MOBILE_OS) return;

	      var section = Math.floor(this.currentPageYOffset / this.sectionHeight);
	      var nextIndex = section % this.$coverImages.length;

	      var endOfPage = this.bodyHeight - this.vh;

	      if (this.currentPageYOffset <= 1) scrollTo(0, endOfPage + 1);else if (this.currentPageYOffset >= endOfPage - 1) scrollTo(0, 2);

	      if (nextIndex === this.coverIndex) return;

	      this.coverGalleryImagery.goToIndex(nextIndex);
	    }

	    /**
	     * Calculate the height from the address bars and such.
	     * This should only ever be called once.
	     */

	  }, {
	    key: 'getGalleryHeight',
	    value: function getGalleryHeight() {
	      var headerHeight = this.$header.clientHeight;
	      var addressBarHeight = window.screen.availHeight - window.innerHeight;
	      var adjustedHeroHeight = window.screen.availHeight - addressBarHeight;

	      return adjustedHeroHeight - headerHeight + 'px';
	    }

	    // Manually set this hero height so it doesn't jump up and down on scroll.

	  }, {
	    key: 'setGalleryHeights',
	    value: function setGalleryHeights() {
	      if (IS_MOBILE_OS) {
	        var galleryHeight = this.getGalleryHeight();
	        this.$coverGalleryWrapper.style.height = galleryHeight;
	        this.$gridGalleryWrapper.style.height = galleryHeight;
	      } else {
	        this.$coverGalleryWrapper.style.removeProperty('height');
	        this.$gridGalleryWrapper.style.removeProperty('height');
	      }
	    }
	  }, {
	    key: 'handleCoverChange',
	    value: function handleCoverChange(index, indexWithClones, $activeChild) {
	      var _this4 = this;

	      if (indexWithClones === this.coverIndex) return;

	      this.lastCoverChange = new Date().getTime();

	      var handleTransitionEnd = function handleTransitionEnd(e) {
	        if (e.propertyName !== 'opacity') return;
	        if (!e.target.classList.contains('imagery')) return;
	        if (e.elapsedTime < 1) return;

	        $activeChild.removeEventListener(transitionEnd, handleTransitionEnd);
	        _this4.isTransitioning = false;
	      };

	      this.isTransitioning = true;
	      $activeChild.addEventListener(transitionEnd, handleTransitionEnd);

	      this.coverIndex = indexWithClones;
	      this.coverGalleryText.goToIndex(this.coverIndex);
	      this.pagination.update(this.coverIndex);

	      this.$coverGalleryImagery.dataset.project = $activeChild.dataset.project;
	    }
	  }, {
	    key: 'initSideNav',
	    value: function initSideNav() {
	      var _this5 = this;

	      this.$sideNavOptions.forEach(function ($option) {
	        $option.addEventListener('click', function (e) {
	          var layout = e.target.dataset.view;
	          if (layout === _this5.layout) return;
	          if (_this5.isTransitioning) return;

	          _this5.layout = layout;
	          _this5.$portfolio.dataset.view = _this5.layout;
	          _this5.$sideNav.dataset.view = _this5.layout;

	          _this5.$gridBlocks = Array.from(_this5.$gridGallery.querySelectorAll('.grid-block'));

	          _this5.updateLayout();
	        });
	      });
	    }
	  }, {
	    key: 'initTouch',
	    value: function initTouch() {
	      var touch = new Hammer(this.$coverGalleryWrapper, {
	        recognizers: [[Hammer.Swipe, {
	          threshold: 5,
	          velocity: 0.35,
	          direction: Hammer.DIRECTION_ALL
	        }]]
	      });

	      touch.on('swipe', this.handleTouch);
	    }
	  }, {
	    key: 'handleTouch',
	    value: function handleTouch(e) {
	      var direction = e.direction;


	      console.log(direction);

	      if (direction === Hammer.DIRECTION_LEFT) this.coverGalleryImagery.next();
	      if (direction === Hammer.DIRECTION_UP) this.coverGalleryImagery.next();

	      if (direction === Hammer.DIRECTION_RIGHT) this.coverGalleryImagery.prev();
	      if (direction === Hammer.DIRECTION_DOWN) this.coverGalleryImagery.prev();
	    }
	  }, {
	    key: 'handleLayoutChange',
	    value: function handleLayoutChange(e) {
	      if (this.layout === 'grid') {
	        if (!e.target.classList.contains('imagery')) return;
	        if (e.target.parentNode.classList.contains('is--active')) return;
	        if (e.propertyName !== 'opacity') return;
	      }

	      if (this.layout === 'cover') {
	        if (e.target !== this.$gridGalleryWrapper) return;
	        if (e.propertyName !== 'opacity') return;
	      }

	      this.isTransitioning = false;
	      this.$gridGalleryWrapper.removeEventListener(transitionEnd, this.handleLayoutChange);

	      this.setGridBlockSizes();

	      if (this.layout === 'cover') {
	        this.$gridBlocks.forEach(function ($block) {
	          var scale = $block.dataset.scale;
	          var $image = $block.querySelector('.imagery');

	          $block.classList.remove('is--active');
	          $block.style.removeProperty('transform');
	          $image.style.transform = 'scale(' + scale + ')';
	        });
	      }
	    }
	  }, {
	    key: 'updateLayout',
	    value: function updateLayout() {
	      var _this6 = this;

	      this.isTransitioning = true;
	      this.$gridGalleryWrapper.removeEventListener(transitionEnd, this.handleLayoutChange);
	      this.$gridGalleryWrapper.addEventListener(transitionEnd, this.handleLayoutChange);

	      if (this.layout === 'grid') {
	        clearInterval(this.timer);

	        this.$gridBlocks.forEach(function ($block) {
	          var scale = $block.dataset.scale;
	          var $image = $block.querySelector('.imagery');

	          var isActiveProject = $block.dataset.project === _this6.$coverGalleryImagery.dataset.project;
	          if (isActiveProject) $block.classList.add('is--active');

	          if (!_this6.isFirstLoad && isActiveProject) {
	            var _$block$dataset = $block.dataset,
	                diffX = _$block$dataset.diffX,
	                diffY = _$block$dataset.diffY;

	            $block.classList.add('no-transitions');
	            $image.classList.add('no-transitions');
	            $image.style.removeProperty('transform');
	            $block.style.transform = 'translate3d(' + diffX + 'px,' + diffY + 'px,0)';
	            $block.clientHeight;
	            $image.clientHeight;
	            $image.classList.remove('no-transitions');
	            $block.classList.remove('no-transitions');
	          }

	          $block.style.removeProperty('transform');
	          $image.style.transform = 'scale(' + scale + ')';
	        });
	      }

	      if (this.layout === 'cover') {
	        this.$gridGallery.classList.remove('has-hovered-block');
	        this.hoveredBlock = null;

	        this.$gridBlocks.forEach(function ($block) {
	          $block.classList.remove('is-hovered');

	          var $image = $block.querySelector('.imagery');
	          var scale = $block.dataset.scale;
	          var isActiveProject = $block.dataset.project === _this6.$coverGalleryImagery.dataset.project;

	          if (!_this6.isFirstLoad && isActiveProject) {
	            var _$block$dataset2 = $block.dataset,
	                diffX = _$block$dataset2.diffX,
	                diffY = _$block$dataset2.diffY;

	            $image.style.removeProperty('transform');
	            $block.style.transform = 'translate3d(' + diffX + 'px,' + diffY + 'px,0)';
	          } else {
	            $image.style.transform = 'scale(' + scale + ')';
	          }
	        });

	        this.setTimer();
	      }

	      this.isFirstLoad = false;
	    }
	  }, {
	    key: 'initPagination',
	    value: function initPagination() {
	      this.lastCoverIndex = this.$coverImages.length - 1;
	      this.pagination = new Pagination(this.$activePageWrapper, this.$coverImages.length);
	    }
	  }, {
	    key: 'initCoverGalleries',
	    value: function initCoverGalleries() {
	      this.coverIndex = 0;
	      this.pagination.update(this.coverIndex);

	      this.coverGalleryImagery = new BaseGallery({
	        galleryNode: this.$coverGalleryImagery,
	        childSelector: '.imagery',
	        shouldAutoplay: false,
	        handleChange: this.handleCoverChange
	      });

	      this.coverGalleryText = new BaseGallery({
	        galleryNode: this.$coverGalleryText,
	        childSelector: '.text',
	        shouldAutoplay: false,
	        handleChange: function handleChange() {}
	      });

	      document.body.style.height = (this.$coverImages.length + 1) * this.sectionHeight + 'px';

	      this.$coverGalleryImagery.dataset.project = this.$coverImages[0].dataset.project;

	      this.setTimer();
	    }
	  }, {
	    key: 'initGridGallery',
	    value: function initGridGallery() {
	      this.gridBlocks = {};
	      this.setGridBlockSizes();
	    }
	  }, {
	    key: 'setGridBlockSizes',
	    value: function setGridBlockSizes() {
	      var _this7 = this;

	      this.$coverImages.forEach(function ($image) {
	        var project = $image.dataset.project;
	        var $gridBlock = _this7.$gridGallery.querySelector('.grid-block[data-project=' + project + ']');
	        var $gridBlockImage = $gridBlock.getElementsByClassName('imagery')[0];
	        var scale = parseFloat($gridBlock.dataset.scale);

	        _this7.gridBlocks[project] = $gridBlock;

	        $gridBlockImage.style.width = $image.clientWidth + 'px';
	        $gridBlockImage.style.height = $image.clientHeight + 'px';

	        $gridBlockImage.classList.add('no-transitions');
	        $gridBlock.classList.add('no-transitions');
	        $gridBlockImage.style.transform = 'scale(' + scale + ')';

	        var hadTransform = !!$gridBlock.style.transform;
	        $gridBlock.style.removeProperty('transform');

	        $gridBlockImage.clientHeight;
	        $gridBlockImage.classList.remove('no-transitions');

	        $gridBlock.style.width = $image.clientWidth * scale + 'px';
	        $gridBlock.style.height = $image.clientHeight * scale + 'px';

	        var imageRect = $image.getBoundingClientRect();
	        var gridBlockRect = $gridBlockImage.getBoundingClientRect();
	        var diffX = imageRect.left - gridBlockRect.left;
	        var diffY = imageRect.top - gridBlockRect.top;

	        $gridBlock.dataset.diffX = diffX;
	        $gridBlock.dataset.diffY = diffY;

	        if (hadTransform) $gridBlock.style.transform = 'translate3d(' + diffX + 'px,' + diffY + 'px,0)';

	        $gridBlock.clientHeight;
	        $gridBlock.classList.remove('no-transitions');
	      });
	    }
	  }]);

	  return Home;
	}();

	new Home();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*! Hammer.JS - v2.0.7 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function (window, document, exportName, undefined) {
	    'use strict';

	    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	    var TEST_ELEMENT = document.createElement('div');

	    var TYPE_FUNCTION = 'function';

	    var round = Math.round;
	    var abs = Math.abs;
	    var now = Date.now;

	    /**
	     * set a timeout with a given scope
	     * @param {Function} fn
	     * @param {Number} timeout
	     * @param {Object} context
	     * @returns {number}
	     */
	    function setTimeoutContext(fn, timeout, context) {
	        return setTimeout(bindFn(fn, context), timeout);
	    }

	    /**
	     * if the argument is an array, we want to execute the fn on each entry
	     * if it aint an array we don't want to do a thing.
	     * this is used by all the methods that accept a single and array argument.
	     * @param {*|Array} arg
	     * @param {String} fn
	     * @param {Object} [context]
	     * @returns {Boolean}
	     */
	    function invokeArrayArg(arg, fn, context) {
	        if (Array.isArray(arg)) {
	            each(arg, context[fn], context);
	            return true;
	        }
	        return false;
	    }

	    /**
	     * walk objects and arrays
	     * @param {Object} obj
	     * @param {Function} iterator
	     * @param {Object} context
	     */
	    function each(obj, iterator, context) {
	        var i;

	        if (!obj) {
	            return;
	        }

	        if (obj.forEach) {
	            obj.forEach(iterator, context);
	        } else if (obj.length !== undefined) {
	            i = 0;
	            while (i < obj.length) {
	                iterator.call(context, obj[i], i, obj);
	                i++;
	            }
	        } else {
	            for (i in obj) {
	                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	            }
	        }
	    }

	    /**
	     * wrap a method with a deprecation warning and stack trace
	     * @param {Function} method
	     * @param {String} name
	     * @param {String} message
	     * @returns {Function} A new function wrapping the supplied method.
	     */
	    function deprecate(method, name, message) {
	        var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	        return function () {
	            var e = new Error('get-stack-trace');
	            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

	            var log = window.console && (window.console.warn || window.console.log);
	            if (log) {
	                log.call(window.console, deprecationMessage, stack);
	            }
	            return method.apply(this, arguments);
	        };
	    }

	    /**
	     * extend object.
	     * means that properties in dest will be overwritten by the ones in src.
	     * @param {Object} target
	     * @param {...Object} objects_to_assign
	     * @returns {Object} target
	     */
	    var assign;
	    if (typeof Object.assign !== 'function') {
	        assign = function assign(target) {
	            if (target === undefined || target === null) {
	                throw new TypeError('Cannot convert undefined or null to object');
	            }

	            var output = Object(target);
	            for (var index = 1; index < arguments.length; index++) {
	                var source = arguments[index];
	                if (source !== undefined && source !== null) {
	                    for (var nextKey in source) {
	                        if (source.hasOwnProperty(nextKey)) {
	                            output[nextKey] = source[nextKey];
	                        }
	                    }
	                }
	            }
	            return output;
	        };
	    } else {
	        assign = Object.assign;
	    }

	    /**
	     * extend object.
	     * means that properties in dest will be overwritten by the ones in src.
	     * @param {Object} dest
	     * @param {Object} src
	     * @param {Boolean} [merge=false]
	     * @returns {Object} dest
	     */
	    var extend = deprecate(function extend(dest, src, merge) {
	        var keys = Object.keys(src);
	        var i = 0;
	        while (i < keys.length) {
	            if (!merge || merge && dest[keys[i]] === undefined) {
	                dest[keys[i]] = src[keys[i]];
	            }
	            i++;
	        }
	        return dest;
	    }, 'extend', 'Use `assign`.');

	    /**
	     * merge the values from src in the dest.
	     * means that properties that exist in dest will not be overwritten by src
	     * @param {Object} dest
	     * @param {Object} src
	     * @returns {Object} dest
	     */
	    var merge = deprecate(function merge(dest, src) {
	        return extend(dest, src, true);
	    }, 'merge', 'Use `assign`.');

	    /**
	     * simple class inheritance
	     * @param {Function} child
	     * @param {Function} base
	     * @param {Object} [properties]
	     */
	    function inherit(child, base, properties) {
	        var baseP = base.prototype,
	            childP;

	        childP = child.prototype = Object.create(baseP);
	        childP.constructor = child;
	        childP._super = baseP;

	        if (properties) {
	            assign(childP, properties);
	        }
	    }

	    /**
	     * simple function bind
	     * @param {Function} fn
	     * @param {Object} context
	     * @returns {Function}
	     */
	    function bindFn(fn, context) {
	        return function boundFn() {
	            return fn.apply(context, arguments);
	        };
	    }

	    /**
	     * let a boolean value also be a function that must return a boolean
	     * this first item in args will be used as the context
	     * @param {Boolean|Function} val
	     * @param {Array} [args]
	     * @returns {Boolean}
	     */
	    function boolOrFn(val, args) {
	        if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) == TYPE_FUNCTION) {
	            return val.apply(args ? args[0] || undefined : undefined, args);
	        }
	        return val;
	    }

	    /**
	     * use the val2 when val1 is undefined
	     * @param {*} val1
	     * @param {*} val2
	     * @returns {*}
	     */
	    function ifUndefined(val1, val2) {
	        return val1 === undefined ? val2 : val1;
	    }

	    /**
	     * addEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function addEventListeners(target, types, handler) {
	        each(splitStr(types), function (type) {
	            target.addEventListener(type, handler, false);
	        });
	    }

	    /**
	     * removeEventListener with multiple events at once
	     * @param {EventTarget} target
	     * @param {String} types
	     * @param {Function} handler
	     */
	    function removeEventListeners(target, types, handler) {
	        each(splitStr(types), function (type) {
	            target.removeEventListener(type, handler, false);
	        });
	    }

	    /**
	     * find if a node is in the given parent
	     * @method hasParent
	     * @param {HTMLElement} node
	     * @param {HTMLElement} parent
	     * @return {Boolean} found
	     */
	    function hasParent(node, parent) {
	        while (node) {
	            if (node == parent) {
	                return true;
	            }
	            node = node.parentNode;
	        }
	        return false;
	    }

	    /**
	     * small indexOf wrapper
	     * @param {String} str
	     * @param {String} find
	     * @returns {Boolean} found
	     */
	    function inStr(str, find) {
	        return str.indexOf(find) > -1;
	    }

	    /**
	     * split string on whitespace
	     * @param {String} str
	     * @returns {Array} words
	     */
	    function splitStr(str) {
	        return str.trim().split(/\s+/g);
	    }

	    /**
	     * find if a array contains the object using indexOf or a simple polyFill
	     * @param {Array} src
	     * @param {String} find
	     * @param {String} [findByKey]
	     * @return {Boolean|Number} false when not found, or the index
	     */
	    function inArray(src, find, findByKey) {
	        if (src.indexOf && !findByKey) {
	            return src.indexOf(find);
	        } else {
	            var i = 0;
	            while (i < src.length) {
	                if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
	                    return i;
	                }
	                i++;
	            }
	            return -1;
	        }
	    }

	    /**
	     * convert array-like objects to real arrays
	     * @param {Object} obj
	     * @returns {Array}
	     */
	    function toArray(obj) {
	        return Array.prototype.slice.call(obj, 0);
	    }

	    /**
	     * unique array with objects based on a key (like 'id') or just by the array's value
	     * @param {Array} src [{id:1},{id:2},{id:1}]
	     * @param {String} [key]
	     * @param {Boolean} [sort=False]
	     * @returns {Array} [{id:1},{id:2}]
	     */
	    function uniqueArray(src, key, sort) {
	        var results = [];
	        var values = [];
	        var i = 0;

	        while (i < src.length) {
	            var val = key ? src[i][key] : src[i];
	            if (inArray(values, val) < 0) {
	                results.push(src[i]);
	            }
	            values[i] = val;
	            i++;
	        }

	        if (sort) {
	            if (!key) {
	                results = results.sort();
	            } else {
	                results = results.sort(function sortUniqueArray(a, b) {
	                    return a[key] > b[key];
	                });
	            }
	        }

	        return results;
	    }

	    /**
	     * get the prefixed property
	     * @param {Object} obj
	     * @param {String} property
	     * @returns {String|Undefined} prefixed
	     */
	    function prefixed(obj, property) {
	        var prefix, prop;
	        var camelProp = property[0].toUpperCase() + property.slice(1);

	        var i = 0;
	        while (i < VENDOR_PREFIXES.length) {
	            prefix = VENDOR_PREFIXES[i];
	            prop = prefix ? prefix + camelProp : property;

	            if (prop in obj) {
	                return prop;
	            }
	            i++;
	        }
	        return undefined;
	    }

	    /**
	     * get a unique id
	     * @returns {number} uniqueId
	     */
	    var _uniqueId = 1;
	    function uniqueId() {
	        return _uniqueId++;
	    }

	    /**
	     * get the window object of an element
	     * @param {HTMLElement} element
	     * @returns {DocumentView|Window}
	     */
	    function getWindowForElement(element) {
	        var doc = element.ownerDocument || element;
	        return doc.defaultView || doc.parentWindow || window;
	    }

	    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	    var SUPPORT_TOUCH = 'ontouchstart' in window;
	    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	    var INPUT_TYPE_TOUCH = 'touch';
	    var INPUT_TYPE_PEN = 'pen';
	    var INPUT_TYPE_MOUSE = 'mouse';
	    var INPUT_TYPE_KINECT = 'kinect';

	    var COMPUTE_INTERVAL = 25;

	    var INPUT_START = 1;
	    var INPUT_MOVE = 2;
	    var INPUT_END = 4;
	    var INPUT_CANCEL = 8;

	    var DIRECTION_NONE = 1;
	    var DIRECTION_LEFT = 2;
	    var DIRECTION_RIGHT = 4;
	    var DIRECTION_UP = 8;
	    var DIRECTION_DOWN = 16;

	    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	    var PROPS_XY = ['x', 'y'];
	    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	    /**
	     * create new input type manager
	     * @param {Manager} manager
	     * @param {Function} callback
	     * @returns {Input}
	     * @constructor
	     */
	    function Input(manager, callback) {
	        var self = this;
	        this.manager = manager;
	        this.callback = callback;
	        this.element = manager.element;
	        this.target = manager.options.inputTarget;

	        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	        // so when disabled the input events are completely bypassed.
	        this.domHandler = function (ev) {
	            if (boolOrFn(manager.options.enable, [manager])) {
	                self.handler(ev);
	            }
	        };

	        this.init();
	    }

	    Input.prototype = {
	        /**
	         * should handle the inputEvent data and trigger the callback
	         * @virtual
	         */
	        handler: function handler() {},

	        /**
	         * bind the events
	         */
	        init: function init() {
	            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        },

	        /**
	         * unbind the events
	         */
	        destroy: function destroy() {
	            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	        }
	    };

	    /**
	     * create new input type manager
	     * called by the Manager constructor
	     * @param {Hammer} manager
	     * @returns {Input}
	     */
	    function createInputInstance(manager) {
	        var Type;
	        var inputClass = manager.options.inputClass;

	        if (inputClass) {
	            Type = inputClass;
	        } else if (SUPPORT_POINTER_EVENTS) {
	            Type = PointerEventInput;
	        } else if (SUPPORT_ONLY_TOUCH) {
	            Type = TouchInput;
	        } else if (!SUPPORT_TOUCH) {
	            Type = MouseInput;
	        } else {
	            Type = TouchMouseInput;
	        }
	        return new Type(manager, inputHandler);
	    }

	    /**
	     * handle input events
	     * @param {Manager} manager
	     * @param {String} eventType
	     * @param {Object} input
	     */
	    function inputHandler(manager, eventType, input) {
	        var pointersLen = input.pointers.length;
	        var changedPointersLen = input.changedPointers.length;
	        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
	        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;

	        input.isFirst = !!isFirst;
	        input.isFinal = !!isFinal;

	        if (isFirst) {
	            manager.session = {};
	        }

	        // source event is the normalized value of the domEvents
	        // like 'touchstart, mouseup, pointerdown'
	        input.eventType = eventType;

	        // compute scale, rotation etc
	        computeInputData(manager, input);

	        // emit secret event
	        manager.emit('hammer.input', input);

	        manager.recognize(input);
	        manager.session.prevInput = input;
	    }

	    /**
	     * extend the data with some usable properties like scale, rotate, velocity etc
	     * @param {Object} manager
	     * @param {Object} input
	     */
	    function computeInputData(manager, input) {
	        var session = manager.session;
	        var pointers = input.pointers;
	        var pointersLength = pointers.length;

	        // store the first input to calculate the distance and direction
	        if (!session.firstInput) {
	            session.firstInput = simpleCloneInputData(input);
	        }

	        // to compute scale and rotation we need to store the multiple touches
	        if (pointersLength > 1 && !session.firstMultiple) {
	            session.firstMultiple = simpleCloneInputData(input);
	        } else if (pointersLength === 1) {
	            session.firstMultiple = false;
	        }

	        var firstInput = session.firstInput;
	        var firstMultiple = session.firstMultiple;
	        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	        var center = input.center = getCenter(pointers);
	        input.timeStamp = now();
	        input.deltaTime = input.timeStamp - firstInput.timeStamp;

	        input.angle = getAngle(offsetCenter, center);
	        input.distance = getDistance(offsetCenter, center);

	        computeDeltaXY(session, input);
	        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	        input.overallVelocityX = overallVelocity.x;
	        input.overallVelocityY = overallVelocity.y;
	        input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;

	        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	        input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;

	        computeIntervalInputData(session, input);

	        // find the correct target
	        var target = manager.element;
	        if (hasParent(input.srcEvent.target, target)) {
	            target = input.srcEvent.target;
	        }
	        input.target = target;
	    }

	    function computeDeltaXY(session, input) {
	        var center = input.center;
	        var offset = session.offsetDelta || {};
	        var prevDelta = session.prevDelta || {};
	        var prevInput = session.prevInput || {};

	        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	            prevDelta = session.prevDelta = {
	                x: prevInput.deltaX || 0,
	                y: prevInput.deltaY || 0
	            };

	            offset = session.offsetDelta = {
	                x: center.x,
	                y: center.y
	            };
	        }

	        input.deltaX = prevDelta.x + (center.x - offset.x);
	        input.deltaY = prevDelta.y + (center.y - offset.y);
	    }

	    /**
	     * velocity is calculated every x ms
	     * @param {Object} session
	     * @param {Object} input
	     */
	    function computeIntervalInputData(session, input) {
	        var last = session.lastInterval || input,
	            deltaTime = input.timeStamp - last.timeStamp,
	            velocity,
	            velocityX,
	            velocityY,
	            direction;

	        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	            var deltaX = input.deltaX - last.deltaX;
	            var deltaY = input.deltaY - last.deltaY;

	            var v = getVelocity(deltaTime, deltaX, deltaY);
	            velocityX = v.x;
	            velocityY = v.y;
	            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
	            direction = getDirection(deltaX, deltaY);

	            session.lastInterval = input;
	        } else {
	            // use latest velocity info if it doesn't overtake a minimum period
	            velocity = last.velocity;
	            velocityX = last.velocityX;
	            velocityY = last.velocityY;
	            direction = last.direction;
	        }

	        input.velocity = velocity;
	        input.velocityX = velocityX;
	        input.velocityY = velocityY;
	        input.direction = direction;
	    }

	    /**
	     * create a simple clone from the input used for storage of firstInput and firstMultiple
	     * @param {Object} input
	     * @returns {Object} clonedInputData
	     */
	    function simpleCloneInputData(input) {
	        // make a simple copy of the pointers because we will get a reference if we don't
	        // we only need clientXY for the calculations
	        var pointers = [];
	        var i = 0;
	        while (i < input.pointers.length) {
	            pointers[i] = {
	                clientX: round(input.pointers[i].clientX),
	                clientY: round(input.pointers[i].clientY)
	            };
	            i++;
	        }

	        return {
	            timeStamp: now(),
	            pointers: pointers,
	            center: getCenter(pointers),
	            deltaX: input.deltaX,
	            deltaY: input.deltaY
	        };
	    }

	    /**
	     * get the center of all the pointers
	     * @param {Array} pointers
	     * @return {Object} center contains `x` and `y` properties
	     */
	    function getCenter(pointers) {
	        var pointersLength = pointers.length;

	        // no need to loop when only one touch
	        if (pointersLength === 1) {
	            return {
	                x: round(pointers[0].clientX),
	                y: round(pointers[0].clientY)
	            };
	        }

	        var x = 0,
	            y = 0,
	            i = 0;
	        while (i < pointersLength) {
	            x += pointers[i].clientX;
	            y += pointers[i].clientY;
	            i++;
	        }

	        return {
	            x: round(x / pointersLength),
	            y: round(y / pointersLength)
	        };
	    }

	    /**
	     * calculate the velocity between two points. unit is in px per ms.
	     * @param {Number} deltaTime
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Object} velocity `x` and `y`
	     */
	    function getVelocity(deltaTime, x, y) {
	        return {
	            x: x / deltaTime || 0,
	            y: y / deltaTime || 0
	        };
	    }

	    /**
	     * get the direction between two points
	     * @param {Number} x
	     * @param {Number} y
	     * @return {Number} direction
	     */
	    function getDirection(x, y) {
	        if (x === y) {
	            return DIRECTION_NONE;
	        }

	        if (abs(x) >= abs(y)) {
	            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	        }
	        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	    }

	    /**
	     * calculate the absolute distance between two points
	     * @param {Object} p1 {x, y}
	     * @param {Object} p2 {x, y}
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} distance
	     */
	    function getDistance(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];

	        return Math.sqrt(x * x + y * y);
	    }

	    /**
	     * calculate the angle between two coordinates
	     * @param {Object} p1
	     * @param {Object} p2
	     * @param {Array} [props] containing x and y keys
	     * @return {Number} angle
	     */
	    function getAngle(p1, p2, props) {
	        if (!props) {
	            props = PROPS_XY;
	        }
	        var x = p2[props[0]] - p1[props[0]],
	            y = p2[props[1]] - p1[props[1]];
	        return Math.atan2(y, x) * 180 / Math.PI;
	    }

	    /**
	     * calculate the rotation degrees between two pointersets
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} rotation
	     */
	    function getRotation(start, end) {
	        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	    }

	    /**
	     * calculate the scale factor between two pointersets
	     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	     * @param {Array} start array of pointers
	     * @param {Array} end array of pointers
	     * @return {Number} scale
	     */
	    function getScale(start, end) {
	        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	    }

	    var MOUSE_INPUT_MAP = {
	        mousedown: INPUT_START,
	        mousemove: INPUT_MOVE,
	        mouseup: INPUT_END
	    };

	    var MOUSE_ELEMENT_EVENTS = 'mousedown';
	    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	    /**
	     * Mouse events input
	     * @constructor
	     * @extends Input
	     */
	    function MouseInput() {
	        this.evEl = MOUSE_ELEMENT_EVENTS;
	        this.evWin = MOUSE_WINDOW_EVENTS;

	        this.pressed = false; // mousedown state

	        Input.apply(this, arguments);
	    }

	    inherit(MouseInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function MEhandler(ev) {
	            var eventType = MOUSE_INPUT_MAP[ev.type];

	            // on start we want to have the left mouse button down
	            if (eventType & INPUT_START && ev.button === 0) {
	                this.pressed = true;
	            }

	            if (eventType & INPUT_MOVE && ev.which !== 1) {
	                eventType = INPUT_END;
	            }

	            // mouse must be down
	            if (!this.pressed) {
	                return;
	            }

	            if (eventType & INPUT_END) {
	                this.pressed = false;
	            }

	            this.callback(this.manager, eventType, {
	                pointers: [ev],
	                changedPointers: [ev],
	                pointerType: INPUT_TYPE_MOUSE,
	                srcEvent: ev
	            });
	        }
	    });

	    var POINTER_INPUT_MAP = {
	        pointerdown: INPUT_START,
	        pointermove: INPUT_MOVE,
	        pointerup: INPUT_END,
	        pointercancel: INPUT_CANCEL,
	        pointerout: INPUT_CANCEL
	    };

	    // in IE10 the pointer types is defined as an enum
	    var IE10_POINTER_TYPE_ENUM = {
	        2: INPUT_TYPE_TOUCH,
	        3: INPUT_TYPE_PEN,
	        4: INPUT_TYPE_MOUSE,
	        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	    };

	    var POINTER_ELEMENT_EVENTS = 'pointerdown';
	    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	    // IE10 has prefixed support, and case-sensitive
	    if (window.MSPointerEvent && !window.PointerEvent) {
	        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	    }

	    /**
	     * Pointer events input
	     * @constructor
	     * @extends Input
	     */
	    function PointerEventInput() {
	        this.evEl = POINTER_ELEMENT_EVENTS;
	        this.evWin = POINTER_WINDOW_EVENTS;

	        Input.apply(this, arguments);

	        this.store = this.manager.session.pointerEvents = [];
	    }

	    inherit(PointerEventInput, Input, {
	        /**
	         * handle mouse events
	         * @param {Object} ev
	         */
	        handler: function PEhandler(ev) {
	            var store = this.store;
	            var removePointer = false;

	            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	            var isTouch = pointerType == INPUT_TYPE_TOUCH;

	            // get index of the event in the store
	            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	            // start and mouse must be down
	            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	                if (storeIndex < 0) {
	                    store.push(ev);
	                    storeIndex = store.length - 1;
	                }
	            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	                removePointer = true;
	            }

	            // it not found, so the pointer hasn't been down (so it's probably a hover)
	            if (storeIndex < 0) {
	                return;
	            }

	            // update the event in the store
	            store[storeIndex] = ev;

	            this.callback(this.manager, eventType, {
	                pointers: store,
	                changedPointers: [ev],
	                pointerType: pointerType,
	                srcEvent: ev
	            });

	            if (removePointer) {
	                // remove from the store
	                store.splice(storeIndex, 1);
	            }
	        }
	    });

	    var SINGLE_TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Touch events input
	     * @constructor
	     * @extends Input
	     */
	    function SingleTouchInput() {
	        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	        this.started = false;

	        Input.apply(this, arguments);
	    }

	    inherit(SingleTouchInput, Input, {
	        handler: function TEhandler(ev) {
	            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	            // should we handle the touch events?
	            if (type === INPUT_START) {
	                this.started = true;
	            }

	            if (!this.started) {
	                return;
	            }

	            var touches = normalizeSingleTouches.call(this, ev, type);

	            // when done, reset the started state
	            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	                this.started = false;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function normalizeSingleTouches(ev, type) {
	        var all = toArray(ev.touches);
	        var changed = toArray(ev.changedTouches);

	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            all = uniqueArray(all.concat(changed), 'identifier', true);
	        }

	        return [all, changed];
	    }

	    var TOUCH_INPUT_MAP = {
	        touchstart: INPUT_START,
	        touchmove: INPUT_MOVE,
	        touchend: INPUT_END,
	        touchcancel: INPUT_CANCEL
	    };

	    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	    /**
	     * Multi-user touch events input
	     * @constructor
	     * @extends Input
	     */
	    function TouchInput() {
	        this.evTarget = TOUCH_TARGET_EVENTS;
	        this.targetIds = {};

	        Input.apply(this, arguments);
	    }

	    inherit(TouchInput, Input, {
	        handler: function MTEhandler(ev) {
	            var type = TOUCH_INPUT_MAP[ev.type];
	            var touches = getTouches.call(this, ev, type);
	            if (!touches) {
	                return;
	            }

	            this.callback(this.manager, type, {
	                pointers: touches[0],
	                changedPointers: touches[1],
	                pointerType: INPUT_TYPE_TOUCH,
	                srcEvent: ev
	            });
	        }
	    });

	    /**
	     * @this {TouchInput}
	     * @param {Object} ev
	     * @param {Number} type flag
	     * @returns {undefined|Array} [all, changed]
	     */
	    function getTouches(ev, type) {
	        var allTouches = toArray(ev.touches);
	        var targetIds = this.targetIds;

	        // when there is only one touch, the process can be simplified
	        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	            targetIds[allTouches[0].identifier] = true;
	            return [allTouches, allTouches];
	        }

	        var i,
	            targetTouches,
	            changedTouches = toArray(ev.changedTouches),
	            changedTargetTouches = [],
	            target = this.target;

	        // get target touches from touches
	        targetTouches = allTouches.filter(function (touch) {
	            return hasParent(touch.target, target);
	        });

	        // collect touches
	        if (type === INPUT_START) {
	            i = 0;
	            while (i < targetTouches.length) {
	                targetIds[targetTouches[i].identifier] = true;
	                i++;
	            }
	        }

	        // filter changed touches to only contain touches that exist in the collected target ids
	        i = 0;
	        while (i < changedTouches.length) {
	            if (targetIds[changedTouches[i].identifier]) {
	                changedTargetTouches.push(changedTouches[i]);
	            }

	            // cleanup removed touches
	            if (type & (INPUT_END | INPUT_CANCEL)) {
	                delete targetIds[changedTouches[i].identifier];
	            }
	            i++;
	        }

	        if (!changedTargetTouches.length) {
	            return;
	        }

	        return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
	    }

	    /**
	     * Combined touch and mouse input
	     *
	     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	     * This because touch devices also emit mouse events while doing a touch.
	     *
	     * @constructor
	     * @extends Input
	     */

	    var DEDUP_TIMEOUT = 2500;
	    var DEDUP_DISTANCE = 25;

	    function TouchMouseInput() {
	        Input.apply(this, arguments);

	        var handler = bindFn(this.handler, this);
	        this.touch = new TouchInput(this.manager, handler);
	        this.mouse = new MouseInput(this.manager, handler);

	        this.primaryTouch = null;
	        this.lastTouches = [];
	    }

	    inherit(TouchMouseInput, Input, {
	        /**
	         * handle mouse and touch events
	         * @param {Hammer} manager
	         * @param {String} inputEvent
	         * @param {Object} inputData
	         */
	        handler: function TMEhandler(manager, inputEvent, inputData) {
	            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
	                isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

	            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	                return;
	            }

	            // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	            if (isTouch) {
	                recordTouches.call(this, inputEvent, inputData);
	            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	                return;
	            }

	            this.callback(manager, inputEvent, inputData);
	        },

	        /**
	         * remove the event listeners
	         */
	        destroy: function destroy() {
	            this.touch.destroy();
	            this.mouse.destroy();
	        }
	    });

	    function recordTouches(eventType, eventData) {
	        if (eventType & INPUT_START) {
	            this.primaryTouch = eventData.changedPointers[0].identifier;
	            setLastTouch.call(this, eventData);
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            setLastTouch.call(this, eventData);
	        }
	    }

	    function setLastTouch(eventData) {
	        var touch = eventData.changedPointers[0];

	        if (touch.identifier === this.primaryTouch) {
	            var lastTouch = { x: touch.clientX, y: touch.clientY };
	            this.lastTouches.push(lastTouch);
	            var lts = this.lastTouches;
	            var removeLastTouch = function removeLastTouch() {
	                var i = lts.indexOf(lastTouch);
	                if (i > -1) {
	                    lts.splice(i, 1);
	                }
	            };
	            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	        }
	    }

	    function isSyntheticEvent(eventData) {
	        var x = eventData.srcEvent.clientX,
	            y = eventData.srcEvent.clientY;
	        for (var i = 0; i < this.lastTouches.length; i++) {
	            var t = this.lastTouches[i];
	            var dx = Math.abs(x - t.x),
	                dy = Math.abs(y - t.y);
	            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	                return true;
	            }
	        }
	        return false;
	    }

	    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	    // magical touchAction value
	    var TOUCH_ACTION_COMPUTE = 'compute';
	    var TOUCH_ACTION_AUTO = 'auto';
	    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	    var TOUCH_ACTION_NONE = 'none';
	    var TOUCH_ACTION_PAN_X = 'pan-x';
	    var TOUCH_ACTION_PAN_Y = 'pan-y';
	    var TOUCH_ACTION_MAP = getTouchActionProps();

	    /**
	     * Touch Action
	     * sets the touchAction property or uses the js alternative
	     * @param {Manager} manager
	     * @param {String} value
	     * @constructor
	     */
	    function TouchAction(manager, value) {
	        this.manager = manager;
	        this.set(value);
	    }

	    TouchAction.prototype = {
	        /**
	         * set the touchAction value on the element or enable the polyfill
	         * @param {String} value
	         */
	        set: function set(value) {
	            // find out the touch-action by the event handlers
	            if (value == TOUCH_ACTION_COMPUTE) {
	                value = this.compute();
	            }

	            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	            }
	            this.actions = value.toLowerCase().trim();
	        },

	        /**
	         * just re-set the touchAction value
	         */
	        update: function update() {
	            this.set(this.manager.options.touchAction);
	        },

	        /**
	         * compute the value for the touchAction property based on the recognizer's settings
	         * @returns {String} value
	         */
	        compute: function compute() {
	            var actions = [];
	            each(this.manager.recognizers, function (recognizer) {
	                if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                    actions = actions.concat(recognizer.getTouchAction());
	                }
	            });
	            return cleanTouchActions(actions.join(' '));
	        },

	        /**
	         * this method is called on each input cycle and provides the preventing of the browser behavior
	         * @param {Object} input
	         */
	        preventDefaults: function preventDefaults(input) {
	            var srcEvent = input.srcEvent;
	            var direction = input.offsetDirection;

	            // if the touch action did prevented once this session
	            if (this.manager.session.prevented) {
	                srcEvent.preventDefault();
	                return;
	            }

	            var actions = this.actions;
	            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

	            if (hasNone) {
	                //do not prevent defaults if this is a tap gesture

	                var isTapPointer = input.pointers.length === 1;
	                var isTapMovement = input.distance < 2;
	                var isTapTouchTime = input.deltaTime < 250;

	                if (isTapPointer && isTapMovement && isTapTouchTime) {
	                    return;
	                }
	            }

	            if (hasPanX && hasPanY) {
	                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	                return;
	            }

	            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
	                return this.preventSrc(srcEvent);
	            }
	        },

	        /**
	         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	         * @param {Object} srcEvent
	         */
	        preventSrc: function preventSrc(srcEvent) {
	            this.manager.session.prevented = true;
	            srcEvent.preventDefault();
	        }
	    };

	    /**
	     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	     * @param {String} actions
	     * @returns {*}
	     */
	    function cleanTouchActions(actions) {
	        // none
	        if (inStr(actions, TOUCH_ACTION_NONE)) {
	            return TOUCH_ACTION_NONE;
	        }

	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	        // if both pan-x and pan-y are set (different recognizers
	        // for different directions, e.g. horizontal pan but vertical swipe?)
	        // we need none (as otherwise with pan-x pan-y combined none of these
	        // recognizers will work, since the browser would handle all panning
	        if (hasPanX && hasPanY) {
	            return TOUCH_ACTION_NONE;
	        }

	        // pan-x OR pan-y
	        if (hasPanX || hasPanY) {
	            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	        }

	        // manipulation
	        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	            return TOUCH_ACTION_MANIPULATION;
	        }

	        return TOUCH_ACTION_AUTO;
	    }

	    function getTouchActionProps() {
	        if (!NATIVE_TOUCH_ACTION) {
	            return false;
	        }
	        var touchMap = {};
	        var cssSupports = window.CSS && window.CSS.supports;
	        ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {

	            // If css.supports is not supported but there is native touch-action assume it supports
	            // all values. This is the case for IE 10 and 11.
	            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	        });
	        return touchMap;
	    }

	    /**
	     * Recognizer flow explained; *
	     * All recognizers have the initial state of POSSIBLE when a input session starts.
	     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	     * Example session for mouse-input: mousedown -> mousemove -> mouseup
	     *
	     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	     * which determines with state it should be.
	     *
	     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	     * POSSIBLE to give it another change on the next cycle.
	     *
	     *               Possible
	     *                  |
	     *            +-----+---------------+
	     *            |                     |
	     *      +-----+-----+               |
	     *      |           |               |
	     *   Failed      Cancelled          |
	     *                          +-------+------+
	     *                          |              |
	     *                      Recognized       Began
	     *                                         |
	     *                                      Changed
	     *                                         |
	     *                                  Ended/Recognized
	     */
	    var STATE_POSSIBLE = 1;
	    var STATE_BEGAN = 2;
	    var STATE_CHANGED = 4;
	    var STATE_ENDED = 8;
	    var STATE_RECOGNIZED = STATE_ENDED;
	    var STATE_CANCELLED = 16;
	    var STATE_FAILED = 32;

	    /**
	     * Recognizer
	     * Every recognizer needs to extend from this class.
	     * @constructor
	     * @param {Object} options
	     */
	    function Recognizer(options) {
	        this.options = assign({}, this.defaults, options || {});

	        this.id = uniqueId();

	        this.manager = null;

	        // default is enable true
	        this.options.enable = ifUndefined(this.options.enable, true);

	        this.state = STATE_POSSIBLE;

	        this.simultaneous = {};
	        this.requireFail = [];
	    }

	    Recognizer.prototype = {
	        /**
	         * @virtual
	         * @type {Object}
	         */
	        defaults: {},

	        /**
	         * set options
	         * @param {Object} options
	         * @return {Recognizer}
	         */
	        set: function set(options) {
	            assign(this.options, options);

	            // also update the touchAction, in case something changed about the directions/enabled state
	            this.manager && this.manager.touchAction.update();
	            return this;
	        },

	        /**
	         * recognize simultaneous with an other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        recognizeWith: function recognizeWith(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	                return this;
	            }

	            var simultaneous = this.simultaneous;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (!simultaneous[otherRecognizer.id]) {
	                simultaneous[otherRecognizer.id] = otherRecognizer;
	                otherRecognizer.recognizeWith(this);
	            }
	            return this;
	        },

	        /**
	         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRecognizeWith: function dropRecognizeWith(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            delete this.simultaneous[otherRecognizer.id];
	            return this;
	        },

	        /**
	         * recognizer can only run when an other is failing
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        requireFailure: function requireFailure(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	                return this;
	            }

	            var requireFail = this.requireFail;
	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            if (inArray(requireFail, otherRecognizer) === -1) {
	                requireFail.push(otherRecognizer);
	                otherRecognizer.requireFailure(this);
	            }
	            return this;
	        },

	        /**
	         * drop the requireFailure link. it does not remove the link on the other recognizer.
	         * @param {Recognizer} otherRecognizer
	         * @returns {Recognizer} this
	         */
	        dropRequireFailure: function dropRequireFailure(otherRecognizer) {
	            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	                return this;
	            }

	            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	            var index = inArray(this.requireFail, otherRecognizer);
	            if (index > -1) {
	                this.requireFail.splice(index, 1);
	            }
	            return this;
	        },

	        /**
	         * has require failures boolean
	         * @returns {boolean}
	         */
	        hasRequireFailures: function hasRequireFailures() {
	            return this.requireFail.length > 0;
	        },

	        /**
	         * if the recognizer can recognize simultaneous with an other recognizer
	         * @param {Recognizer} otherRecognizer
	         * @returns {Boolean}
	         */
	        canRecognizeWith: function canRecognizeWith(otherRecognizer) {
	            return !!this.simultaneous[otherRecognizer.id];
	        },

	        /**
	         * You should use `tryEmit` instead of `emit` directly to check
	         * that all the needed recognizers has failed before emitting.
	         * @param {Object} input
	         */
	        emit: function emit(input) {
	            var self = this;
	            var state = this.state;

	            function emit(event) {
	                self.manager.emit(event, input);
	            }

	            // 'panstart' and 'panmove'
	            if (state < STATE_ENDED) {
	                emit(self.options.event + stateStr(state));
	            }

	            emit(self.options.event); // simple 'eventName' events

	            if (input.additionalEvent) {
	                // additional event(panleft, panright, pinchin, pinchout...)
	                emit(input.additionalEvent);
	            }

	            // panend and pancancel
	            if (state >= STATE_ENDED) {
	                emit(self.options.event + stateStr(state));
	            }
	        },

	        /**
	         * Check that all the require failure recognizers has failed,
	         * if true, it emits a gesture event,
	         * otherwise, setup the state to FAILED.
	         * @param {Object} input
	         */
	        tryEmit: function tryEmit(input) {
	            if (this.canEmit()) {
	                return this.emit(input);
	            }
	            // it's failing anyway
	            this.state = STATE_FAILED;
	        },

	        /**
	         * can we emit?
	         * @returns {boolean}
	         */
	        canEmit: function canEmit() {
	            var i = 0;
	            while (i < this.requireFail.length) {
	                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                    return false;
	                }
	                i++;
	            }
	            return true;
	        },

	        /**
	         * update the recognizer
	         * @param {Object} inputData
	         */
	        recognize: function recognize(inputData) {
	            // make a new copy of the inputData
	            // so we can change the inputData without messing up the other recognizers
	            var inputDataClone = assign({}, inputData);

	            // is is enabled and allow recognizing?
	            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	                this.reset();
	                this.state = STATE_FAILED;
	                return;
	            }

	            // reset when we've reached the end
	            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	                this.state = STATE_POSSIBLE;
	            }

	            this.state = this.process(inputDataClone);

	            // the recognizer has recognized a gesture
	            // so trigger an event
	            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	                this.tryEmit(inputDataClone);
	            }
	        },

	        /**
	         * return the state of the recognizer
	         * the actual recognizing happens in this method
	         * @virtual
	         * @param {Object} inputData
	         * @returns {Const} STATE
	         */
	        process: function process(inputData) {}, // jshint ignore:line

	        /**
	         * return the preferred touch-action
	         * @virtual
	         * @returns {Array}
	         */
	        getTouchAction: function getTouchAction() {},

	        /**
	         * called when the gesture isn't allowed to recognize
	         * like when another is being recognized or it is disabled
	         * @virtual
	         */
	        reset: function reset() {}
	    };

	    /**
	     * get a usable string, used as event postfix
	     * @param {Const} state
	     * @returns {String} state
	     */
	    function stateStr(state) {
	        if (state & STATE_CANCELLED) {
	            return 'cancel';
	        } else if (state & STATE_ENDED) {
	            return 'end';
	        } else if (state & STATE_CHANGED) {
	            return 'move';
	        } else if (state & STATE_BEGAN) {
	            return 'start';
	        }
	        return '';
	    }

	    /**
	     * direction cons to string
	     * @param {Const} direction
	     * @returns {String}
	     */
	    function directionStr(direction) {
	        if (direction == DIRECTION_DOWN) {
	            return 'down';
	        } else if (direction == DIRECTION_UP) {
	            return 'up';
	        } else if (direction == DIRECTION_LEFT) {
	            return 'left';
	        } else if (direction == DIRECTION_RIGHT) {
	            return 'right';
	        }
	        return '';
	    }

	    /**
	     * get a recognizer by name if it is bound to a manager
	     * @param {Recognizer|String} otherRecognizer
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer}
	     */
	    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	        var manager = recognizer.manager;
	        if (manager) {
	            return manager.get(otherRecognizer);
	        }
	        return otherRecognizer;
	    }

	    /**
	     * This recognizer is just used as a base for the simple attribute recognizers.
	     * @constructor
	     * @extends Recognizer
	     */
	    function AttrRecognizer() {
	        Recognizer.apply(this, arguments);
	    }

	    inherit(AttrRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof AttrRecognizer
	         */
	        defaults: {
	            /**
	             * @type {Number}
	             * @default 1
	             */
	            pointers: 1
	        },

	        /**
	         * Used to check if it the recognizer receives valid input, like input.distance > 10.
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {Boolean} recognized
	         */
	        attrTest: function attrTest(input) {
	            var optionPointers = this.options.pointers;
	            return optionPointers === 0 || input.pointers.length === optionPointers;
	        },

	        /**
	         * Process the input and return the state for the recognizer
	         * @memberof AttrRecognizer
	         * @param {Object} input
	         * @returns {*} State
	         */
	        process: function process(input) {
	            var state = this.state;
	            var eventType = input.eventType;

	            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	            var isValid = this.attrTest(input);

	            // on cancel input and we've recognized before, return STATE_CANCELLED
	            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	                return state | STATE_CANCELLED;
	            } else if (isRecognized || isValid) {
	                if (eventType & INPUT_END) {
	                    return state | STATE_ENDED;
	                } else if (!(state & STATE_BEGAN)) {
	                    return STATE_BEGAN;
	                }
	                return state | STATE_CHANGED;
	            }
	            return STATE_FAILED;
	        }
	    });

	    /**
	     * Pan
	     * Recognized when the pointer is down and moved in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PanRecognizer() {
	        AttrRecognizer.apply(this, arguments);

	        this.pX = null;
	        this.pY = null;
	    }

	    inherit(PanRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PanRecognizer
	         */
	        defaults: {
	            event: 'pan',
	            threshold: 10,
	            pointers: 1,
	            direction: DIRECTION_ALL
	        },

	        getTouchAction: function getTouchAction() {
	            var direction = this.options.direction;
	            var actions = [];
	            if (direction & DIRECTION_HORIZONTAL) {
	                actions.push(TOUCH_ACTION_PAN_Y);
	            }
	            if (direction & DIRECTION_VERTICAL) {
	                actions.push(TOUCH_ACTION_PAN_X);
	            }
	            return actions;
	        },

	        directionTest: function directionTest(input) {
	            var options = this.options;
	            var hasMoved = true;
	            var distance = input.distance;
	            var direction = input.direction;
	            var x = input.deltaX;
	            var y = input.deltaY;

	            // lock to axis?
	            if (!(direction & options.direction)) {
	                if (options.direction & DIRECTION_HORIZONTAL) {
	                    direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                    hasMoved = x != this.pX;
	                    distance = Math.abs(input.deltaX);
	                } else {
	                    direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	                    hasMoved = y != this.pY;
	                    distance = Math.abs(input.deltaY);
	                }
	            }
	            input.direction = direction;
	            return hasMoved && distance > options.threshold && direction & options.direction;
	        },

	        attrTest: function attrTest(input) {
	            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
	        },

	        emit: function emit(input) {

	            this.pX = input.deltaX;
	            this.pY = input.deltaY;

	            var direction = directionStr(input.direction);

	            if (direction) {
	                input.additionalEvent = this.options.event + direction;
	            }
	            this._super.emit.call(this, input);
	        }
	    });

	    /**
	     * Pinch
	     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function PinchRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(PinchRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'pinch',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function attrTest(input) {
	            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	        },

	        emit: function emit(input) {
	            if (input.scale !== 1) {
	                var inOut = input.scale < 1 ? 'in' : 'out';
	                input.additionalEvent = this.options.event + inOut;
	            }
	            this._super.emit.call(this, input);
	        }
	    });

	    /**
	     * Press
	     * Recognized when the pointer is down for x ms without any movement.
	     * @constructor
	     * @extends Recognizer
	     */
	    function PressRecognizer() {
	        Recognizer.apply(this, arguments);

	        this._timer = null;
	        this._input = null;
	    }

	    inherit(PressRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PressRecognizer
	         */
	        defaults: {
	            event: 'press',
	            pointers: 1,
	            time: 251, // minimal time of the pointer to be pressed
	            threshold: 9 // a minimal movement is ok, but keep it low
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_AUTO];
	        },

	        process: function process(input) {
	            var options = this.options;
	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTime = input.deltaTime > options.time;

	            this._input = input;

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
	                this.reset();
	            } else if (input.eventType & INPUT_START) {
	                this.reset();
	                this._timer = setTimeoutContext(function () {
	                    this.state = STATE_RECOGNIZED;
	                    this.tryEmit();
	                }, options.time, this);
	            } else if (input.eventType & INPUT_END) {
	                return STATE_RECOGNIZED;
	            }
	            return STATE_FAILED;
	        },

	        reset: function reset() {
	            clearTimeout(this._timer);
	        },

	        emit: function emit(input) {
	            if (this.state !== STATE_RECOGNIZED) {
	                return;
	            }

	            if (input && input.eventType & INPUT_END) {
	                this.manager.emit(this.options.event + 'up', input);
	            } else {
	                this._input.timeStamp = now();
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Rotate
	     * Recognized when two or more pointer are moving in a circular motion.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function RotateRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(RotateRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof RotateRecognizer
	         */
	        defaults: {
	            event: 'rotate',
	            threshold: 0,
	            pointers: 2
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_NONE];
	        },

	        attrTest: function attrTest(input) {
	            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	        }
	    });

	    /**
	     * Swipe
	     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	     * @constructor
	     * @extends AttrRecognizer
	     */
	    function SwipeRecognizer() {
	        AttrRecognizer.apply(this, arguments);
	    }

	    inherit(SwipeRecognizer, AttrRecognizer, {
	        /**
	         * @namespace
	         * @memberof SwipeRecognizer
	         */
	        defaults: {
	            event: 'swipe',
	            threshold: 10,
	            velocity: 0.3,
	            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	            pointers: 1
	        },

	        getTouchAction: function getTouchAction() {
	            return PanRecognizer.prototype.getTouchAction.call(this);
	        },

	        attrTest: function attrTest(input) {
	            var direction = this.options.direction;
	            var velocity;

	            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	                velocity = input.overallVelocity;
	            } else if (direction & DIRECTION_HORIZONTAL) {
	                velocity = input.overallVelocityX;
	            } else if (direction & DIRECTION_VERTICAL) {
	                velocity = input.overallVelocityY;
	            }

	            return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	        },

	        emit: function emit(input) {
	            var direction = directionStr(input.offsetDirection);
	            if (direction) {
	                this.manager.emit(this.options.event + direction, input);
	            }

	            this.manager.emit(this.options.event, input);
	        }
	    });

	    /**
	     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	     * a single tap.
	     *
	     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	     * multi-taps being recognized.
	     * @constructor
	     * @extends Recognizer
	     */
	    function TapRecognizer() {
	        Recognizer.apply(this, arguments);

	        // previous time and center,
	        // used for tap counting
	        this.pTime = false;
	        this.pCenter = false;

	        this._timer = null;
	        this._input = null;
	        this.count = 0;
	    }

	    inherit(TapRecognizer, Recognizer, {
	        /**
	         * @namespace
	         * @memberof PinchRecognizer
	         */
	        defaults: {
	            event: 'tap',
	            pointers: 1,
	            taps: 1,
	            interval: 300, // max time between the multi-tap taps
	            time: 250, // max time of the pointer to be down (like finger on the screen)
	            threshold: 9, // a minimal movement is ok, but keep it low
	            posThreshold: 10 // a multi-tap can be a bit off the initial position
	        },

	        getTouchAction: function getTouchAction() {
	            return [TOUCH_ACTION_MANIPULATION];
	        },

	        process: function process(input) {
	            var options = this.options;

	            var validPointers = input.pointers.length === options.pointers;
	            var validMovement = input.distance < options.threshold;
	            var validTouchTime = input.deltaTime < options.time;

	            this.reset();

	            if (input.eventType & INPUT_START && this.count === 0) {
	                return this.failTimeout();
	            }

	            // we only allow little movement
	            // and we've reached an end event, so a tap is possible
	            if (validMovement && validTouchTime && validPointers) {
	                if (input.eventType != INPUT_END) {
	                    return this.failTimeout();
	                }

	                var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
	                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	                this.pTime = input.timeStamp;
	                this.pCenter = input.center;

	                if (!validMultiTap || !validInterval) {
	                    this.count = 1;
	                } else {
	                    this.count += 1;
	                }

	                this._input = input;

	                // if tap count matches we have recognized it,
	                // else it has began recognizing...
	                var tapCount = this.count % options.taps;
	                if (tapCount === 0) {
	                    // no failing requirements, immediately trigger the tap event
	                    // or wait as long as the multitap interval to trigger
	                    if (!this.hasRequireFailures()) {
	                        return STATE_RECOGNIZED;
	                    } else {
	                        this._timer = setTimeoutContext(function () {
	                            this.state = STATE_RECOGNIZED;
	                            this.tryEmit();
	                        }, options.interval, this);
	                        return STATE_BEGAN;
	                    }
	                }
	            }
	            return STATE_FAILED;
	        },

	        failTimeout: function failTimeout() {
	            this._timer = setTimeoutContext(function () {
	                this.state = STATE_FAILED;
	            }, this.options.interval, this);
	            return STATE_FAILED;
	        },

	        reset: function reset() {
	            clearTimeout(this._timer);
	        },

	        emit: function emit() {
	            if (this.state == STATE_RECOGNIZED) {
	                this._input.tapCount = this.count;
	                this.manager.emit(this.options.event, this._input);
	            }
	        }
	    });

	    /**
	     * Simple way to create a manager with a default set of recognizers.
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Hammer(element, options) {
	        options = options || {};
	        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	        return new Manager(element, options);
	    }

	    /**
	     * @const {string}
	     */
	    Hammer.VERSION = '2.0.7';

	    /**
	     * default settings
	     * @namespace
	     */
	    Hammer.defaults = {
	        /**
	         * set if DOM events are being triggered.
	         * But this is slower and unused by simple implementations, so disabled by default.
	         * @type {Boolean}
	         * @default false
	         */
	        domEvents: false,

	        /**
	         * The value for the touchAction property/fallback.
	         * When set to `compute` it will magically set the correct value based on the added recognizers.
	         * @type {String}
	         * @default compute
	         */
	        touchAction: TOUCH_ACTION_COMPUTE,

	        /**
	         * @type {Boolean}
	         * @default true
	         */
	        enable: true,

	        /**
	         * EXPERIMENTAL FEATURE -- can be removed/changed
	         * Change the parent input target element.
	         * If Null, then it is being set the to main element.
	         * @type {Null|EventTarget}
	         * @default null
	         */
	        inputTarget: null,

	        /**
	         * force an input class
	         * @type {Null|Function}
	         * @default null
	         */
	        inputClass: null,

	        /**
	         * Default recognizer setup when calling `Hammer()`
	         * When creating a new Manager these will be skipped.
	         * @type {Array}
	         */
	        preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, { enable: false }], [PinchRecognizer, { enable: false }, ['rotate']], [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }], [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']], [TapRecognizer], [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']], [PressRecognizer]],

	        /**
	         * Some CSS properties can be used to improve the working of Hammer.
	         * Add them to this method and they will be set when creating a new Manager.
	         * @namespace
	         */
	        cssProps: {
	            /**
	             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userSelect: 'none',

	            /**
	             * Disable the Windows Phone grippers when pressing an element.
	             * @type {String}
	             * @default 'none'
	             */
	            touchSelect: 'none',

	            /**
	             * Disables the default callout shown when you touch and hold a touch target.
	             * On iOS, when you touch and hold a touch target such as a link, Safari displays
	             * a callout containing information about the link. This property allows you to disable that callout.
	             * @type {String}
	             * @default 'none'
	             */
	            touchCallout: 'none',

	            /**
	             * Specifies whether zooming is enabled. Used by IE10>
	             * @type {String}
	             * @default 'none'
	             */
	            contentZooming: 'none',

	            /**
	             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	             * @type {String}
	             * @default 'none'
	             */
	            userDrag: 'none',

	            /**
	             * Overrides the highlight color shown when the user taps a link or a JavaScript
	             * clickable element in iOS. This property obeys the alpha value, if specified.
	             * @type {String}
	             * @default 'rgba(0,0,0,0)'
	             */
	            tapHighlightColor: 'rgba(0,0,0,0)'
	        }
	    };

	    var STOP = 1;
	    var FORCED_STOP = 2;

	    /**
	     * Manager
	     * @param {HTMLElement} element
	     * @param {Object} [options]
	     * @constructor
	     */
	    function Manager(element, options) {
	        this.options = assign({}, Hammer.defaults, options || {});

	        this.options.inputTarget = this.options.inputTarget || element;

	        this.handlers = {};
	        this.session = {};
	        this.recognizers = [];
	        this.oldCssProps = {};

	        this.element = element;
	        this.input = createInputInstance(this);
	        this.touchAction = new TouchAction(this, this.options.touchAction);

	        toggleCssProps(this, true);

	        each(this.options.recognizers, function (item) {
	            var recognizer = this.add(new item[0](item[1]));
	            item[2] && recognizer.recognizeWith(item[2]);
	            item[3] && recognizer.requireFailure(item[3]);
	        }, this);
	    }

	    Manager.prototype = {
	        /**
	         * set options
	         * @param {Object} options
	         * @returns {Manager}
	         */
	        set: function set(options) {
	            assign(this.options, options);

	            // Options that need a little more setup
	            if (options.touchAction) {
	                this.touchAction.update();
	            }
	            if (options.inputTarget) {
	                // Clean up existing event listeners and reinitialize
	                this.input.destroy();
	                this.input.target = options.inputTarget;
	                this.input.init();
	            }
	            return this;
	        },

	        /**
	         * stop recognizing for this session.
	         * This session will be discarded, when a new [input]start event is fired.
	         * When forced, the recognizer cycle is stopped immediately.
	         * @param {Boolean} [force]
	         */
	        stop: function stop(force) {
	            this.session.stopped = force ? FORCED_STOP : STOP;
	        },

	        /**
	         * run the recognizers!
	         * called by the inputHandler function on every movement of the pointers (touches)
	         * it walks through all the recognizers and tries to detect the gesture that is being made
	         * @param {Object} inputData
	         */
	        recognize: function recognize(inputData) {
	            var session = this.session;
	            if (session.stopped) {
	                return;
	            }

	            // run the touch-action polyfill
	            this.touchAction.preventDefaults(inputData);

	            var recognizer;
	            var recognizers = this.recognizers;

	            // this holds the recognizer that is being recognized.
	            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	            // if no recognizer is detecting a thing, it is set to `null`
	            var curRecognizer = session.curRecognizer;

	            // reset when the last recognizer is recognized
	            // or when we're in a new session
	            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
	                curRecognizer = session.curRecognizer = null;
	            }

	            var i = 0;
	            while (i < recognizers.length) {
	                recognizer = recognizers[i];

	                // find out if we are allowed try to recognize the input for this one.
	                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	                //      that is being recognized.
	                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	                //      this can be setup with the `recognizeWith()` method on the recognizer.
	                if (session.stopped !== FORCED_STOP && ( // 1
	                !curRecognizer || recognizer == curRecognizer || // 2
	                recognizer.canRecognizeWith(curRecognizer))) {
	                    // 3
	                    recognizer.recognize(inputData);
	                } else {
	                    recognizer.reset();
	                }

	                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	                // current active recognizer. but only if we don't already have an active recognizer
	                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                    curRecognizer = session.curRecognizer = recognizer;
	                }
	                i++;
	            }
	        },

	        /**
	         * get a recognizer by its event name.
	         * @param {Recognizer|String} recognizer
	         * @returns {Recognizer|Null}
	         */
	        get: function get(recognizer) {
	            if (recognizer instanceof Recognizer) {
	                return recognizer;
	            }

	            var recognizers = this.recognizers;
	            for (var i = 0; i < recognizers.length; i++) {
	                if (recognizers[i].options.event == recognizer) {
	                    return recognizers[i];
	                }
	            }
	            return null;
	        },

	        /**
	         * add a recognizer to the manager
	         * existing recognizers with the same event name will be removed
	         * @param {Recognizer} recognizer
	         * @returns {Recognizer|Manager}
	         */
	        add: function add(recognizer) {
	            if (invokeArrayArg(recognizer, 'add', this)) {
	                return this;
	            }

	            // remove existing
	            var existing = this.get(recognizer.options.event);
	            if (existing) {
	                this.remove(existing);
	            }

	            this.recognizers.push(recognizer);
	            recognizer.manager = this;

	            this.touchAction.update();
	            return recognizer;
	        },

	        /**
	         * remove a recognizer by name or instance
	         * @param {Recognizer|String} recognizer
	         * @returns {Manager}
	         */
	        remove: function remove(recognizer) {
	            if (invokeArrayArg(recognizer, 'remove', this)) {
	                return this;
	            }

	            recognizer = this.get(recognizer);

	            // let's make sure this recognizer exists
	            if (recognizer) {
	                var recognizers = this.recognizers;
	                var index = inArray(recognizers, recognizer);

	                if (index !== -1) {
	                    recognizers.splice(index, 1);
	                    this.touchAction.update();
	                }
	            }

	            return this;
	        },

	        /**
	         * bind event
	         * @param {String} events
	         * @param {Function} handler
	         * @returns {EventEmitter} this
	         */
	        on: function on(events, handler) {
	            if (events === undefined) {
	                return;
	            }
	            if (handler === undefined) {
	                return;
	            }

	            var handlers = this.handlers;
	            each(splitStr(events), function (event) {
	                handlers[event] = handlers[event] || [];
	                handlers[event].push(handler);
	            });
	            return this;
	        },

	        /**
	         * unbind event, leave emit blank to remove all handlers
	         * @param {String} events
	         * @param {Function} [handler]
	         * @returns {EventEmitter} this
	         */
	        off: function off(events, handler) {
	            if (events === undefined) {
	                return;
	            }

	            var handlers = this.handlers;
	            each(splitStr(events), function (event) {
	                if (!handler) {
	                    delete handlers[event];
	                } else {
	                    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	                }
	            });
	            return this;
	        },

	        /**
	         * emit event to the listeners
	         * @param {String} event
	         * @param {Object} data
	         */
	        emit: function emit(event, data) {
	            // we also want to trigger dom events
	            if (this.options.domEvents) {
	                triggerDomEvent(event, data);
	            }

	            // no handlers, so skip it all
	            var handlers = this.handlers[event] && this.handlers[event].slice();
	            if (!handlers || !handlers.length) {
	                return;
	            }

	            data.type = event;
	            data.preventDefault = function () {
	                data.srcEvent.preventDefault();
	            };

	            var i = 0;
	            while (i < handlers.length) {
	                handlers[i](data);
	                i++;
	            }
	        },

	        /**
	         * destroy the manager and unbinds all events
	         * it doesn't unbind dom events, that is the user own responsibility
	         */
	        destroy: function destroy() {
	            this.element && toggleCssProps(this, false);

	            this.handlers = {};
	            this.session = {};
	            this.input.destroy();
	            this.element = null;
	        }
	    };

	    /**
	     * add/remove the css properties as defined in manager.options.cssProps
	     * @param {Manager} manager
	     * @param {Boolean} add
	     */
	    function toggleCssProps(manager, add) {
	        var element = manager.element;
	        if (!element.style) {
	            return;
	        }
	        var prop;
	        each(manager.options.cssProps, function (value, name) {
	            prop = prefixed(element.style, name);
	            if (add) {
	                manager.oldCssProps[prop] = element.style[prop];
	                element.style[prop] = value;
	            } else {
	                element.style[prop] = manager.oldCssProps[prop] || '';
	            }
	        });
	        if (!add) {
	            manager.oldCssProps = {};
	        }
	    }

	    /**
	     * trigger dom event
	     * @param {String} event
	     * @param {Object} data
	     */
	    function triggerDomEvent(event, data) {
	        var gestureEvent = document.createEvent('Event');
	        gestureEvent.initEvent(event, true, true);
	        gestureEvent.gesture = data;
	        data.target.dispatchEvent(gestureEvent);
	    }

	    assign(Hammer, {
	        INPUT_START: INPUT_START,
	        INPUT_MOVE: INPUT_MOVE,
	        INPUT_END: INPUT_END,
	        INPUT_CANCEL: INPUT_CANCEL,

	        STATE_POSSIBLE: STATE_POSSIBLE,
	        STATE_BEGAN: STATE_BEGAN,
	        STATE_CHANGED: STATE_CHANGED,
	        STATE_ENDED: STATE_ENDED,
	        STATE_RECOGNIZED: STATE_RECOGNIZED,
	        STATE_CANCELLED: STATE_CANCELLED,
	        STATE_FAILED: STATE_FAILED,

	        DIRECTION_NONE: DIRECTION_NONE,
	        DIRECTION_LEFT: DIRECTION_LEFT,
	        DIRECTION_RIGHT: DIRECTION_RIGHT,
	        DIRECTION_UP: DIRECTION_UP,
	        DIRECTION_DOWN: DIRECTION_DOWN,
	        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	        DIRECTION_ALL: DIRECTION_ALL,

	        Manager: Manager,
	        Input: Input,
	        TouchAction: TouchAction,

	        TouchInput: TouchInput,
	        MouseInput: MouseInput,
	        PointerEventInput: PointerEventInput,
	        TouchMouseInput: TouchMouseInput,
	        SingleTouchInput: SingleTouchInput,

	        Recognizer: Recognizer,
	        AttrRecognizer: AttrRecognizer,
	        Tap: TapRecognizer,
	        Pan: PanRecognizer,
	        Swipe: SwipeRecognizer,
	        Pinch: PinchRecognizer,
	        Rotate: RotateRecognizer,
	        Press: PressRecognizer,

	        on: addEventListeners,
	        off: removeEventListeners,
	        each: each,
	        merge: merge,
	        extend: extend,
	        assign: assign,
	        inherit: inherit,
	        bindFn: bindFn,
	        prefixed: prefixed
	    });

	    // this prevents errors when Hammer is loaded in the presence of an AMD
	    //  style loader but by script tag, not by the loader.
	    var freeGlobal = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}; // jshint ignore:line
	    freeGlobal.Hammer = Hammer;

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Hammer;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module != 'undefined' && module.exports) {
	        module.exports = Hammer;
	    } else {
	        window[exportName] = Hammer;
	    }
	})(window, document, 'Hammer');

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	// Usage:
	// const transitionEnd = require('./transition-end');
	// element.addEventListener(transitionEnd, handler);

	var map = {
	  'transition': 'transitionend',
	  'WebkitTransition': 'webkitTransitionEnd',
	  'MozTransition': 'transitionend',
	  'OTransition': 'oTransitionEnd',
	  'msTransition': 'MSTransitionEnd'
	};

	var elem = document.createElement('p');

	for (var transition in map) {
	  if (elem.style[transition] != null) {
	    module.exports = map[transition];
	    break;
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var transitionEnd = __webpack_require__(3);

	/* This is a very very simple gallery.

	  @param config: {
	    galleryNode {DOMElement}     | The container element. [REQUIRED]

	    childSelector {String}       | The selector for each element that should be updated. (will override)
	    numOfClones {Number}         | How many clones we should make.
	    slideSpeed {number}          | Number of milliseconds during a single slide
	    shouldAutoplay {Boolean}     | Should it autoplay?
	    handleChange {Function}      | Callback method on update, supplied with the current index (disregards clones), and the index including clones.
	  }
	*/

	var Gallery = function () {
	  function Gallery(config) {
	    _classCallCheck(this, Gallery);

	    this.FIRST_UPDATE = true;

	    this.$gallery = config.galleryNode;
	    this.$children = this.getChildren(config.childSelector);
	    this.slideSpeed = config.slideSpeed;
	    this.handleChange = config.handleChange;
	    this.shouldAutoplay = config.shouldAutoplay;

	    this.originalNumOfChildren = this.$children.length;

	    if (config.numOfClones) this.makeClones(config.numOfClones);

	    this.index = 0;
	    this.nextIndex = this.getNextIndex();
	    this.prevIndex = this.getPrevIndex();
	    this.updateChildren();

	    this.$gallery.classList.add('initialized');

	    this.boundNext = this.next.bind(this);
	    this.boundPrev = this.prev.bind(this);

	    if (config.shouldAutoplay) this.play();
	  }

	  _createClass(Gallery, [{
	    key: 'makeClones',
	    value: function makeClones() {
	      var _this = this;

	      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	      // Max it out at 5. Why would you need more clones than that????
	      if (num > 5) num = 5;

	      var count = 0;

	      var _loop = function _loop() {
	        var clones = [];

	        _this.$children.forEach(function ($child, i) {
	          var $clone = $child.cloneNode(true);
	          $child.parentNode.appendChild($clone);
	          clones.push($clone);
	        });

	        _this.$children = _this.$children.concat(clones);

	        count++;
	      };

	      while (count < num) {
	        _loop();
	      }
	    }
	  }, {
	    key: 'getChildren',
	    value: function getChildren(selector) {
	      var nodeList = this.$gallery.querySelectorAll(selector);
	      return Array.from(nodeList);
	    }

	    // Get the index not including clones.

	  }, {
	    key: 'getRealIndex',
	    value: function getRealIndex() {
	      return this.index % this.originalNumOfChildren;
	    }
	  }, {
	    key: 'getNextIndex',
	    value: function getNextIndex() {
	      var nextIndex = this.index + 1;
	      if (!this.$children[nextIndex]) nextIndex = 0;

	      return nextIndex;
	    }
	  }, {
	    key: 'getPrevIndex',
	    value: function getPrevIndex() {
	      var prevIndex = this.index - 1;
	      if (prevIndex < 0) prevIndex = this.$children.length - 1;
	      return prevIndex;
	    }

	    /* Play! :) */

	  }, {
	    key: 'play',
	    value: function play() {
	      // dont start again if already started
	      if (this.interval) return;
	      this.interval = setInterval(this.boundNext, this.slideSpeed);
	    }
	  }, {
	    key: 'goToIndex',
	    value: function goToIndex(index) {
	      this.index = index;
	      this.nextIndex = this.getNextIndex();
	      this.prevIndex = this.getPrevIndex();

	      this.updateChildren();
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      if (this.shouldAutoplay) this.stop();

	      this.index = this.nextIndex;
	      this.nextIndex = this.getNextIndex();
	      this.prevIndex = this.getPrevIndex();

	      this.updateChildren();

	      if (this.shouldAutoplay) this.play();
	    }
	  }, {
	    key: 'prev',
	    value: function prev() {
	      if (this.shouldAutoplay) this.stop();

	      this.index = this.prevIndex;
	      this.nextIndex = this.getNextIndex();
	      this.prevIndex = this.getPrevIndex();

	      this.updateChildren();

	      if (this.shouldAutoplay) this.play();
	    }
	  }, {
	    key: 'updateChildren',
	    value: function updateChildren() {
	      var _this2 = this;

	      if (this.handleChange) {
	        var $activeChild = this.$children[this.getRealIndex()];
	        this.handleChange(this.getRealIndex(), this.index, $activeChild);
	      }

	      this.$children.forEach(function ($child, i) {
	        var distFromIndex = Math.abs(_this2.index - i);
	        var distFromEnd = _this2.$children.length - distFromIndex;

	        var arrivalIndex = i >= _this2.index ? distFromIndex : distFromEnd;
	        var departureIndex = i <= _this2.index ? distFromIndex : distFromEnd;

	        $child.setAttribute('data-arrival-index', arrivalIndex);
	        $child.setAttribute('data-departure-index', departureIndex);

	        // If it's the first load, force reflow so we don't get a transition mess.
	        if (_this2.FIRST_UPDATE) $child.clientHeight;
	      });

	      if (this.FIRST_UPDATE) this.FIRST_UPDATE = false;
	    }

	    /* Stop! (in the naaaame of love)
	     */

	  }, {
	    key: 'stop',
	    value: function stop() {
	      clearInterval(this.interval);
	      delete this.interval;
	    }
	  }]);

	  return Gallery;
	}();

	module.exports = Gallery;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var transitionEnd = __webpack_require__(3);
	var transform = __webpack_require__(6);

	var Pagination = function () {
	  function Pagination($parent, count) {
	    _classCallCheck(this, Pagination);

	    this.$parent = $parent;
	    this.count = count;

	    this.lastIndex = this.count - 1;

	    this.$activePages = [this.appendPageLabel(this.lastIndex)];

	    for (var i = 0; i < this.count; i++) {
	      this.$activePages.push(this.appendPageLabel(i));
	    }

	    this.$activePages = [this.appendPageLabel(0)];

	    this.activePageHeight = this.$activePages[0].clientHeight;
	  }

	  _createClass(Pagination, [{
	    key: 'appendPageLabel',
	    value: function appendPageLabel(index) {
	      var $pageLabel = document.createElement('div');
	      $pageLabel.classList.add('label');
	      $pageLabel.classList.add('active-page');
	      $pageLabel.textContent = '0' + (index + 1);

	      this.$parent.appendChild($pageLabel);
	      return $pageLabel;
	    }
	  }, {
	    key: 'update',
	    value: function update(i) {
	      var _this = this;

	      var withTransitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	      this.$parent.removeEventListener(transitionEnd, this.handleTransitionEnd);

	      var index = i + 1;
	      var destination = index * this.activePageHeight * -1;

	      var resetTo = null;
	      if (i === 0 && this.activeIndex === this.lastIndex) resetTo = 'next';
	      if (i === this.lastIndex && this.activeIndex === 0) resetTo = 'prev';
	      this.activeIndex = i;

	      if (!resetTo) {
	        if (!withTransitions) {
	          this.$parent.classList.add('no-transitions');
	          this.$parent.clientHeight;
	        }

	        this.$parent.style[transform] = 'translate3d(0,' + destination + 'px, 0)';

	        if (!withTransitions) {
	          this.$parent.clientHeight;
	          this.$parent.classList.remove('no-transitions');
	        }

	        return;
	      }

	      var fakeIndex = resetTo === 'prev' ? 0 : this.lastIndex + 2;
	      var fakeDestination = fakeIndex * this.activePageHeight * -1;

	      this.handleTransitionEnd = function () {
	        return _this.update(i, false);
	      };
	      this.$parent.addEventListener(transitionEnd, this.handleTransitionEnd);

	      this.$parent.style[transform] = 'translate3d(0,' + fakeDestination + 'px, 0)';
	    }
	  }]);

	  return Pagination;
	}();

	module.exports = Pagination;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var map = {
	  'transform': 'transform',
	  'WebkitTransform': 'webkitTransform',
	  'MozTransform': 'Transform',
	  'OTransform': 'oTransform',
	  'msTransform': 'MSTransform'
	};

	var elem = document.createElement('p');

	for (var transform in map) {
	  if (elem.style[transform] != null) {
	    module.exports = map[transform];
	    break;
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var platform = __webpack_require__(8);
	var MOBILE_OS_FAMILIES = ['Android', 'iOS', 'Windows Phone'];
	var IS_MOBILE_OS = platform.os && platform.os.family && MOBILE_OS_FAMILIES.indexOf(platform.os.family) > -1;

	module.exports = IS_MOBILE_OS;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*!
	 * Platform.js <https://mths.be/platform>
	 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
	 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
	 * Available under MIT license <https://mths.be/mit>
	 */
	;(function () {
	  'use strict';

	  /** Used to determine if values are of the language type `Object`. */

	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used as a reference to the global object. */
	  var root = objectTypes[typeof window === 'undefined' ? 'undefined' : _typeof(window)] && window || this;

	  /** Backup possible global object. */
	  var oldRoot = root;

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[ false ? 'undefined' : _typeof(exports)] && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[ false ? 'undefined' : _typeof(module)] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
	  var freeGlobal = freeExports && freeModule && (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /**
	   * Used as the maximum length of an array-like object.
	   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   */
	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  /** Regular expression to detect Opera. */
	  var reOpera = /\bOpera/;

	  /** Possible global object. */
	  var thisBinding = this;

	  /** Used for native method references. */
	  var objectProto = Object.prototype;

	  /** Used to check for own properties of an object. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /** Used to resolve the internal `[[Class]]` of values. */
	  var toString = objectProto.toString;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Capitalizes a string value.
	   *
	   * @private
	   * @param {string} string The string to capitalize.
	   * @returns {string} The capitalized string.
	   */
	  function capitalize(string) {
	    string = String(string);
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	  /**
	   * A utility function to clean up the OS name.
	   *
	   * @private
	   * @param {string} os The OS name to clean up.
	   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
	   * @param {string} [label] A label for the OS.
	   */
	  function cleanupOS(os, pattern, label) {
	    // Platform tokens are defined at:
	    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    var data = {
	      '10.0': '10',
	      '6.4': '10 Technical Preview',
	      '6.3': '8.1',
	      '6.2': '8',
	      '6.1': 'Server 2008 R2 / 7',
	      '6.0': 'Server 2008 / Vista',
	      '5.2': 'Server 2003 / XP 64-bit',
	      '5.1': 'XP',
	      '5.01': '2000 SP1',
	      '5.0': '2000',
	      '4.0': 'NT',
	      '4.90': 'ME'
	    };
	    // Detect Windows version from platform tokens.
	    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
	      os = 'Windows ' + data;
	    }
	    // Correct character case and cleanup string.
	    os = String(os);

	    if (pattern && label) {
	      os = os.replace(RegExp(pattern, 'i'), label);
	    }

	    os = format(os.replace(/ ce$/i, ' CE').replace(/\bhpw/i, 'web').replace(/\bMacintosh\b/, 'Mac OS').replace(/_PowerPC\b/i, ' OS').replace(/\b(OS X) [^ \d]+/i, '$1').replace(/\bMac (OS X)\b/, '$1').replace(/\/(\d)/, ' $1').replace(/_/g, '.').replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '').replace(/\bx86\.64\b/gi, 'x86_64').replace(/\b(Windows Phone) OS\b/, '$1').replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1').split(' on ')[0]);

	    return os;
	  }

	  /**
	   * An iteration utility for arrays and objects.
	   *
	   * @private
	   * @param {Array|Object} object The object to iterate over.
	   * @param {Function} callback The function called per iteration.
	   */
	  function each(object, callback) {
	    var index = -1,
	        length = object ? object.length : 0;

	    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
	      while (++index < length) {
	        callback(object[index], index, object);
	      }
	    } else {
	      forOwn(object, callback);
	    }
	  }

	  /**
	   * Trim and conditionally capitalize string values.
	   *
	   * @private
	   * @param {string} string The string to format.
	   * @returns {string} The formatted string.
	   */
	  function format(string) {
	    string = trim(string);
	    return (/^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string)
	    );
	  }

	  /**
	   * Iterates over an object's own properties, executing the `callback` for each.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} callback The function executed per own property.
	   */
	  function forOwn(object, callback) {
	    for (var key in object) {
	      if (hasOwnProperty.call(object, key)) {
	        callback(object[key], key, object);
	      }
	    }
	  }

	  /**
	   * Gets the internal `[[Class]]` of a value.
	   *
	   * @private
	   * @param {*} value The value.
	   * @returns {string} The `[[Class]]`.
	   */
	  function getClassOf(value) {
	    return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
	  }

	  /**
	   * Host objects can return type values that are different from their actual
	   * data type. The objects we are concerned with usually return non-primitive
	   * types of "object", "function", or "unknown".
	   *
	   * @private
	   * @param {*} object The owner of the property.
	   * @param {string} property The property to check.
	   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
	   */
	  function isHostType(object, property) {
	    var type = object != null ? _typeof(object[property]) : 'number';
	    return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == 'object' ? !!object[property] : true);
	  }

	  /**
	   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
	   *
	   * @private
	   * @param {string} string The string to qualify.
	   * @returns {string} The qualified string.
	   */
	  function qualify(string) {
	    return String(string).replace(/([ -])(?!$)/g, '$1?');
	  }

	  /**
	   * A bare-bones `Array#reduce` like utility function.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} callback The function called per iteration.
	   * @returns {*} The accumulated result.
	   */
	  function reduce(array, callback) {
	    var accumulator = null;
	    each(array, function (value, index) {
	      accumulator = callback(accumulator, value, index, array);
	    });
	    return accumulator;
	  }

	  /**
	   * Removes leading and trailing whitespace from a string.
	   *
	   * @private
	   * @param {string} string The string to trim.
	   * @returns {string} The trimmed string.
	   */
	  function trim(string) {
	    return String(string).replace(/^ +| +$/g, '');
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Creates a new platform object.
	   *
	   * @memberOf platform
	   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
	   *  context object.
	   * @returns {Object} A platform object.
	   */
	  function parse(ua) {

	    /** The environment context object. */
	    var context = root;

	    /** Used to flag when a custom context is provided. */
	    var isCustomContext = ua && (typeof ua === 'undefined' ? 'undefined' : _typeof(ua)) == 'object' && getClassOf(ua) != 'String';

	    // Juggle arguments.
	    if (isCustomContext) {
	      context = ua;
	      ua = null;
	    }

	    /** Browser navigator object. */
	    var nav = context.navigator || {};

	    /** Browser user agent string. */
	    var userAgent = nav.userAgent || '';

	    ua || (ua = userAgent);

	    /** Used to flag when `thisBinding` is the [ModuleScope]. */
	    var isModuleScope = isCustomContext || thisBinding == oldRoot;

	    /** Used to detect if browser is like Chrome. */
	    var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

	    /** Internal `[[Class]]` value shortcuts. */
	    var objectClass = 'Object',
	        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
	        enviroClass = isCustomContext ? objectClass : 'Environment',
	        javaClass = isCustomContext && context.java ? 'JavaPackage' : getClassOf(context.java),
	        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

	    /** Detect Java environments. */
	    var java = /\bJava/.test(javaClass) && context.java;

	    /** Detect Rhino. */
	    var rhino = java && getClassOf(context.environment) == enviroClass;

	    /** A character to represent alpha. */
	    var alpha = java ? 'a' : '\u03B1';

	    /** A character to represent beta. */
	    var beta = java ? 'b' : '\u03B2';

	    /** Browser document object. */
	    var doc = context.document || {};

	    /**
	     * Detect Opera browser (Presto-based).
	     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
	     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
	     */
	    var opera = context.operamini || context.opera;

	    /** Opera `[[Class]]`. */
	    var operaClass = reOpera.test(operaClass = isCustomContext && opera ? opera['[[Class]]'] : getClassOf(opera)) ? operaClass : opera = null;

	    /*------------------------------------------------------------------------*/

	    /** Temporary variable used over the script's lifetime. */
	    var data;

	    /** The CPU architecture. */
	    var arch = ua;

	    /** Platform description array. */
	    var description = [];

	    /** Platform alpha/beta indicator. */
	    var prerelease = null;

	    /** A flag to indicate that environment features should be used to resolve the platform. */
	    var useFeatures = ua == userAgent;

	    /** The browser/environment version. */
	    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

	    /** A flag to indicate if the OS ends with "/ Version" */
	    var isSpecialCasedOS;

	    /* Detectable layout engines (order is important). */
	    var layout = getLayout([{ 'label': 'EdgeHTML', 'pattern': 'Edge' }, 'Trident', { 'label': 'WebKit', 'pattern': 'AppleWebKit' }, 'iCab', 'Presto', 'NetFront', 'Tasman', 'KHTML', 'Gecko']);

	    /* Detectable browser names (order is important). */
	    var name = getName(['Adobe AIR', 'Arora', 'Avant Browser', 'Breach', 'Camino', 'Electron', 'Epiphany', 'Fennec', 'Flock', 'Galeon', 'GreenBrowser', 'iCab', 'Iceweasel', 'K-Meleon', 'Konqueror', 'Lunascape', 'Maxthon', { 'label': 'Microsoft Edge', 'pattern': 'Edge' }, 'Midori', 'Nook Browser', 'PaleMoon', 'PhantomJS', 'Raven', 'Rekonq', 'RockMelt', { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' }, 'SeaMonkey', { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' }, 'Sleipnir', 'SlimBrowser', { 'label': 'SRWare Iron', 'pattern': 'Iron' }, 'Sunrise', 'Swiftfox', 'Waterfox', 'WebPositive', 'Opera Mini', { 'label': 'Opera Mini', 'pattern': 'OPiOS' }, 'Opera', { 'label': 'Opera', 'pattern': 'OPR' }, 'Chrome', { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' }, { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' }, { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' }, { 'label': 'IE', 'pattern': 'IEMobile' }, { 'label': 'IE', 'pattern': 'MSIE' }, 'Safari']);

	    /* Detectable products (order is important). */
	    var product = getProduct([{ 'label': 'BlackBerry', 'pattern': 'BB10' }, 'BlackBerry', { 'label': 'Galaxy S', 'pattern': 'GT-I9000' }, { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' }, { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' }, { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' }, { 'label': 'Galaxy S5', 'pattern': 'SM-G900' }, { 'label': 'Galaxy S6', 'pattern': 'SM-G920' }, { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' }, { 'label': 'Galaxy S7', 'pattern': 'SM-G930' }, { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' }, 'Google TV', 'Lumia', 'iPad', 'iPod', 'iPhone', 'Kindle', { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' }, 'Nexus', 'Nook', 'PlayBook', 'PlayStation Vita', 'PlayStation', 'TouchPad', 'Transformer', { 'label': 'Wii U', 'pattern': 'WiiU' }, 'Wii', 'Xbox One', { 'label': 'Xbox 360', 'pattern': 'Xbox' }, 'Xoom']);

	    /* Detectable manufacturers. */
	    var manufacturer = getManufacturer({
	      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
	      'Archos': {},
	      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
	      'Asus': { 'Transformer': 1 },
	      'Barnes & Noble': { 'Nook': 1 },
	      'BlackBerry': { 'PlayBook': 1 },
	      'Google': { 'Google TV': 1, 'Nexus': 1 },
	      'HP': { 'TouchPad': 1 },
	      'HTC': {},
	      'LG': {},
	      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
	      'Motorola': { 'Xoom': 1 },
	      'Nintendo': { 'Wii U': 1, 'Wii': 1 },
	      'Nokia': { 'Lumia': 1 },
	      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
	      'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 }
	    });

	    /* Detectable operating systems (order is important). */
	    var os = getOS(['Windows Phone', 'Android', 'CentOS', { 'label': 'Chrome OS', 'pattern': 'CrOS' }, 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', 'Mac OS X', 'Macintosh', 'Mac', 'Windows 98;', 'Windows ']);

	    /*------------------------------------------------------------------------*/

	    /**
	     * Picks the layout engine from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected layout engine.
	     */
	    function getLayout(guesses) {
	      return reduce(guesses, function (result, guess) {
	        return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the manufacturer from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An object of guesses.
	     * @returns {null|string} The detected manufacturer.
	     */
	    function getManufacturer(guesses) {
	      return reduce(guesses, function (result, value, key) {
	        // Lookup the manufacturer by product or scan the UA for the manufacturer.
	        return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)) && key;
	      });
	    }

	    /**
	     * Picks the browser name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected browser name.
	     */
	    function getName(guesses) {
	      return reduce(guesses, function (result, guess) {
	        return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the OS name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected OS name.
	     */
	    function getOS(guesses) {
	      return reduce(guesses, function (result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result = RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua))) {
	          result = cleanupOS(result, pattern, guess.label || guess);
	        }
	        return result;
	      });
	    }

	    /**
	     * Picks the product name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected product name.
	     */
	    function getProduct(guesses) {
	      return reduce(guesses, function (result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result = RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) || RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) || RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua))) {
	          // Split by forward slash and append product version if needed.
	          if ((result = String(guess.label && !RegExp(pattern, 'i').test(guess.label) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
	            result[0] += ' ' + result[1];
	          }
	          // Correct character case and cleanup string.
	          guess = guess.label || guess;
	          result = format(result[0].replace(RegExp(pattern, 'i'), guess).replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ').replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
	        }
	        return result;
	      });
	    }

	    /**
	     * Resolves the version using an array of UA patterns.
	     *
	     * @private
	     * @param {Array} patterns An array of UA patterns.
	     * @returns {null|string} The detected version.
	     */
	    function getVersion(patterns) {
	      return reduce(patterns, function (result, pattern) {
	        return result || (RegExp(pattern + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
	      });
	    }

	    /**
	     * Returns `platform.description` when the platform object is coerced to a string.
	     *
	     * @name toString
	     * @memberOf platform
	     * @returns {string} Returns `platform.description` if available, else an empty string.
	     */
	    function toStringPlatform() {
	      return this.description || '';
	    }

	    /*------------------------------------------------------------------------*/

	    // Convert layout to an array so we can add extra details.
	    layout && (layout = [layout]);

	    // Detect product names that contain their manufacturer's name.
	    if (manufacturer && !product) {
	      product = getProduct([manufacturer]);
	    }
	    // Clean up Google TV.
	    if (data = /\bGoogle TV\b/.exec(product)) {
	      product = data[0];
	    }
	    // Detect simulators.
	    if (/\bSimulator\b/i.test(ua)) {
	      product = (product ? product + ' ' : '') + 'Simulator';
	    }
	    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
	    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
	      description.push('running in Turbo/Uncompressed mode');
	    }
	    // Detect IE Mobile 11.
	    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
	      data = parse(ua.replace(/like iPhone OS/, ''));
	      manufacturer = data.manufacturer;
	      product = data.product;
	    }
	    // Detect iOS.
	    else if (/^iP/.test(product)) {
	        name || (name = 'Safari');
	        os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua)) ? ' ' + data[1].replace(/_/g, '.') : '');
	      }
	      // Detect Kubuntu.
	      else if (name == 'Konqueror' && !/buntu/i.test(os)) {
	          os = 'Kubuntu';
	        }
	        // Detect Android browsers.
	        else if (manufacturer && manufacturer != 'Google' && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
	            name = 'Android Browser';
	            os = /\bAndroid\b/.test(os) ? os : 'Android';
	          }
	          // Detect Silk desktop/accelerated modes.
	          else if (name == 'Silk') {
	              if (!/\bMobi/i.test(ua)) {
	                os = 'Android';
	                description.unshift('desktop mode');
	              }
	              if (/Accelerated *= *true/i.test(ua)) {
	                description.unshift('accelerated');
	              }
	            }
	            // Detect PaleMoon identifying as Firefox.
	            else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
	                description.push('identifying as Firefox ' + data[1]);
	              }
	              // Detect Firefox OS and products running Firefox.
	              else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
	                  os || (os = 'Firefox OS');
	                  product || (product = data[1]);
	                }
	                // Detect false positives for Firefox/Safari.
	                else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
	                    // Escape the `/` for Firefox 1.
	                    if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
	                      // Clear name of false positives.
	                      name = null;
	                    }
	                    // Reassign a generic name.
	                    if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
	                      name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
	                    }
	                  }
	                  // Add Chrome version to description for Electron.
	                  else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
	                      description.push('Chromium ' + data);
	                    }
	    // Detect non-Opera (Presto-based) versions (order is important).
	    if (!version) {
	      version = getVersion(['(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))', 'Version', qualify(name), '(?:Firefox|Minefield|NetFront)']);
	    }
	    // Detect stubborn layout engines.
	    if (data = layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' || !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') || layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront') {
	      layout = [data];
	    }
	    // Detect Windows Phone 7 desktop mode.
	    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
	      name += ' Mobile';
	      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
	      description.unshift('desktop mode');
	    }
	    // Detect Windows Phone 8.x desktop mode.
	    else if (/\bWPDesktop\b/i.test(ua)) {
	        name = 'IE Mobile';
	        os = 'Windows Phone 8.x';
	        description.unshift('desktop mode');
	        version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
	      }
	      // Detect IE 11 identifying as other browsers.
	      else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
	          if (name) {
	            description.push('identifying as ' + name + (version ? ' ' + version : ''));
	          }
	          name = 'IE';
	          version = data[1];
	        }
	    // Leverage environment features.
	    if (useFeatures) {
	      // Detect server-side environments.
	      // Rhino has a global function while others have a global object.
	      if (isHostType(context, 'global')) {
	        if (java) {
	          data = java.lang.System;
	          arch = data.getProperty('os.arch');
	          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
	        }
	        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
	          os || (os = data[0].os || null);
	          try {
	            data[1] = context.require('ringo/engine').version;
	            version = data[1].join('.');
	            name = 'RingoJS';
	          } catch (e) {
	            if (data[0].global.system == context.system) {
	              name = 'Narwhal';
	            }
	          }
	        } else if (_typeof(context.process) == 'object' && !context.process.browser && (data = context.process)) {
	          if (_typeof(data.versions) == 'object') {
	            if (typeof data.versions.electron == 'string') {
	              description.push('Node ' + data.versions.node);
	              name = 'Electron';
	              version = data.versions.electron;
	            } else if (typeof data.versions.nw == 'string') {
	              description.push('Chromium ' + version, 'Node ' + data.versions.node);
	              name = 'NW.js';
	              version = data.versions.nw;
	            }
	          } else {
	            name = 'Node.js';
	            arch = data.arch;
	            os = data.platform;
	            version = /[\d.]+/.exec(data.version);
	            version = version ? version[0] : 'unknown';
	          }
	        } else if (rhino) {
	          name = 'Rhino';
	        }
	      }
	      // Detect Adobe AIR.
	      else if (getClassOf(data = context.runtime) == airRuntimeClass) {
	          name = 'Adobe AIR';
	          os = data.flash.system.Capabilities.os;
	        }
	        // Detect PhantomJS.
	        else if (getClassOf(data = context.phantom) == phantomClass) {
	            name = 'PhantomJS';
	            version = (data = data.version || null) && data.major + '.' + data.minor + '.' + data.patch;
	          }
	          // Detect IE compatibility modes.
	          else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
	              // We're in compatibility mode when the Trident version + 4 doesn't
	              // equal the document mode.
	              version = [version, doc.documentMode];
	              if ((data = +data[1] + 4) != version[1]) {
	                description.push('IE ' + version[1] + ' mode');
	                layout && (layout[1] = '');
	                version[1] = data;
	              }
	              version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
	            }
	            // Detect IE 11 masking as other browsers.
	            else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
	                description.push('masking as ' + name + ' ' + version);
	                name = 'IE';
	                version = '11.0';
	                layout = ['Trident'];
	                os = 'Windows';
	              }
	      os = os && format(os);
	    }
	    // Detect prerelease phases.
	    if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && 'a')) {
	      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
	      version = version.replace(RegExp(data + '\\+?$'), '') + (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
	    }
	    // Detect Firefox Mobile.
	    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
	      name = 'Firefox Mobile';
	    }
	    // Obscure Maxthon's unreliable version.
	    else if (name == 'Maxthon' && version) {
	        version = version.replace(/\.[\d.]+/, '.x');
	      }
	      // Detect Xbox 360 and Xbox One.
	      else if (/\bXbox\b/i.test(product)) {
	          if (product == 'Xbox 360') {
	            os = null;
	          }
	          if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
	            description.unshift('mobile mode');
	          }
	        }
	        // Add mobile postfix.
	        else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == 'Windows CE' || /Mobi/i.test(ua))) {
	            name += ' Mobile';
	          }
	          // Detect IE platform preview.
	          else if (name == 'IE' && useFeatures) {
	              try {
	                if (context.external === null) {
	                  description.unshift('platform preview');
	                }
	              } catch (e) {
	                description.unshift('embedded');
	              }
	            }
	            // Detect BlackBerry OS version.
	            // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
	            else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] || version)) {
	                data = [data, /BB10/.test(ua)];
	                os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
	                version = null;
	              }
	              // Detect Opera identifying/masking itself as another browser.
	              // http://www.opera.com/support/kb/view/843/
	              else if (this != forOwn && product != 'Wii' && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os) || name == 'IE' && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !reOpera.test(data = parse.call(forOwn, ua.replace(reOpera, '') + ';')) && data.name) {
	                  // When "identifying", the UA contains both Opera and the other browser's name.
	                  data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
	                  if (reOpera.test(name)) {
	                    if (/\bIE\b/.test(data) && os == 'Mac OS') {
	                      os = null;
	                    }
	                    data = 'identify' + data;
	                  }
	                  // When "masking", the UA contains only the other browser's name.
	                  else {
	                      data = 'mask' + data;
	                      if (operaClass) {
	                        name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
	                      } else {
	                        name = 'Opera';
	                      }
	                      if (/\bIE\b/.test(data)) {
	                        os = null;
	                      }
	                      if (!useFeatures) {
	                        version = null;
	                      }
	                    }
	                  layout = ['Presto'];
	                  description.push(data);
	                }
	    // Detect WebKit Nightly and approximate Chrome/Safari versions.
	    if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
	      // Correct build number for numeric comparison.
	      // (e.g. "532.5" becomes "532.05")
	      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
	      // Nightly builds are postfixed with a "+".
	      if (name == 'Safari' && data[1].slice(-1) == '+') {
	        name = 'WebKit Nightly';
	        prerelease = 'alpha';
	        version = data[1].slice(0, -1);
	      }
	      // Clear incorrect browser versions.
	      else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	          version = null;
	        }
	      // Use the full Chrome version when available.
	      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
	      // Detect Blink layout engine.
	      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
	        layout = ['Blink'];
	      }
	      // Detect JavaScriptCore.
	      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
	      if (!useFeatures || !likeChrome && !data[1]) {
	        layout && (layout[1] = 'like Safari');
	        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
	      } else {
	        layout && (layout[1] = 'like Chrome');
	        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
	      }
	      // Add the postfix of ".x" or "+" for approximate versions.
	      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
	      // Obscure version for some Safari 1-2 releases.
	      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
	        version = data;
	      }
	    }
	    // Detect Opera desktop modes.
	    if (name == 'Opera' && (data = /\bzbov|zvav$/.exec(os))) {
	      name += ' ';
	      description.unshift('desktop mode');
	      if (data == 'zvav') {
	        name += 'Mini';
	        version = null;
	      } else {
	        name += 'Mobile';
	      }
	      os = os.replace(RegExp(' *' + data + '$'), '');
	    }
	    // Detect Chrome desktop mode.
	    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
	        description.unshift('desktop mode');
	        name = 'Chrome Mobile';
	        version = null;

	        if (/\bOS X\b/.test(os)) {
	          manufacturer = 'Apple';
	          os = 'iOS 4.3+';
	        } else {
	          os = null;
	        }
	      }
	    // Strip incorrect OS versions.
	    if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf('/' + data + '-') > -1) {
	      os = trim(os.replace(data, ''));
	    }
	    // Add layout engine.
	    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
	      // Don't add layout details to description if they are falsey.
	      (data = layout[layout.length - 1]) && description.push(data);
	    }
	    // Combine contextual information.
	    if (description.length) {
	      description = ['(' + description.join('; ') + ')'];
	    }
	    // Append manufacturer to description.
	    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
	      description.push('on ' + manufacturer);
	    }
	    // Append product to description.
	    if (product) {
	      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
	    }
	    // Parse the OS into an object.
	    if (os) {
	      data = / ([\d.+]+)$/.exec(os);
	      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
	      os = {
	        'architecture': 32,
	        'family': data && !isSpecialCasedOS ? os.replace(data[0], '') : os,
	        'version': data ? data[1] : null,
	        'toString': function toString() {
	          var version = this.version;
	          return this.family + (version && !isSpecialCasedOS ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
	        }
	      };
	    }
	    // Add browser/OS architecture.
	    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
	      if (os) {
	        os.architecture = 64;
	        os.family = os.family.replace(RegExp(' *' + data), '');
	      }
	      if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
	        description.unshift('32-bit');
	      }
	    }
	    // Chrome 39 and above on OS X is always 64-bit.
	    else if (os && /^OS X/.test(os.family) && name == 'Chrome' && parseFloat(version) >= 39) {
	        os.architecture = 64;
	      }

	    ua || (ua = null);

	    /*------------------------------------------------------------------------*/

	    /**
	     * The platform object.
	     *
	     * @name platform
	     * @type Object
	     */
	    var platform = {};

	    /**
	     * The platform description.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.description = ua;

	    /**
	     * The name of the browser's layout engine.
	     *
	     * The list of common layout engines include:
	     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.layout = layout && layout[0];

	    /**
	     * The name of the product's manufacturer.
	     *
	     * The list of manufacturers include:
	     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
	     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
	     * "Nokia", "Samsung" and "Sony"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.manufacturer = manufacturer;

	    /**
	     * The name of the browser/environment.
	     *
	     * The list of common browser names include:
	     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
	     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
	     * "Opera Mini" and "Opera"
	     *
	     * Mobile versions of some browsers have "Mobile" appended to their name:
	     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.name = name;

	    /**
	     * The alpha/beta release indicator.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.prerelease = prerelease;

	    /**
	     * The name of the product hosting the browser.
	     *
	     * The list of common products include:
	     *
	     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
	     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.product = product;

	    /**
	     * The browser's user agent string.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.ua = ua;

	    /**
	     * The browser/environment version.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.version = name && version;

	    /**
	     * The name of the operating system.
	     *
	     * @memberOf platform
	     * @type Object
	     */
	    platform.os = os || {

	      /**
	       * The CPU architecture the OS is built for.
	       *
	       * @memberOf platform.os
	       * @type number|null
	       */
	      'architecture': null,

	      /**
	       * The family of the OS.
	       *
	       * Common values include:
	       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
	       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
	       * "Android", "iOS" and "Windows Phone"
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'family': null,

	      /**
	       * The version of the OS.
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'version': null,

	      /**
	       * Returns the OS string.
	       *
	       * @memberOf platform.os
	       * @returns {string} The OS string.
	       */
	      'toString': function toString() {
	        return 'null';
	      }
	    };

	    platform.parse = parse;
	    platform.toString = toStringPlatform;

	    if (platform.version) {
	      description.unshift(version);
	    }
	    if (platform.name) {
	      description.unshift(name);
	    }
	    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
	      description.push(product ? '(' + os + ')' : 'on ' + os);
	    }
	    if (description.length) {
	      platform.description = description.join(' ');
	    }
	    return platform;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export platform.
	  var platform = parse();

	  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
	  if ("function" == 'function' && _typeof(__webpack_require__(10)) == 'object' && __webpack_require__(10)) {
	    // Expose platform on the global object to prevent errors when platform is
	    // loaded by a script tag in the presence of an AMD loader.
	    // See http://requirejs.org/docs/errors.html#mismatch for more details.
	    root.platform = platform;

	    // Define as an anonymous module so platform can be aliased through path mapping.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return platform;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	      // Export for CommonJS support.
	      forOwn(platform, function (value, key) {
	        freeExports[key] = value;
	      });
	    } else {
	      // Export to the global object.
	      root.platform = platform;
	    }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module), (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
/******/ ]);