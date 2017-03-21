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
/******/ 	__webpack_require__.p = "./scripts/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Header = __webpack_require__(1);

	var Global = {
	  init: function init() {

	    // Polyfill
	    Array.from = function (arr) {
	      return Array.prototype.slice.call(arr);
	    };

	    this.header = new Header();
	  }
	};

	Global.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Header = function () {
	  function Header() {
	    _classCallCheck(this, Header);

	    this.$header = document.getElementById('header');
	    this.$main = document.getElementsByTagName('main')[0];
	    this.$hamburger = this.$header.getElementsByClassName('hamburger')[0];

	    this.$menuOverlay = document.getElementsByClassName('menu-overlay')[0];
	    this.$menuLinks = Array.from(this.$menuOverlay.getElementsByClassName('link'));

	    // state
	    this.menuIsActive = false;
	    this.currentUrl = this.$menuOverlay.dataset.activeLink;
	    this.$activeLink = this.$menuOverlay.querySelector('.link[data-link=' + this.currentUrl + ']');

	    // cache bound methods
	    this.handleClickHamburger = this.handleClickHamburger.bind(this);
	    this.handleEnterLink = this.handleEnterLink.bind(this);
	    this.handleLeaveLink = this.handleLeaveLink.bind(this);

	    // add event listeners
	    this.addEventListeners();
	  }

	  _createClass(Header, [{
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      var _this = this;

	      this.$hamburger.addEventListener('click', this.handleClickHamburger);
	      this.$menuLinks.forEach(function ($link) {
	        $link.addEventListener('mouseenter', _this.handleEnterLink);
	        $link.addEventListener('mouseleave', _this.handleLeaveLink);
	      });
	    }
	  }, {
	    key: 'handleEnterLink',
	    value: function handleEnterLink(e) {
	      this.$activeLink = e.target;
	      this.updateMenuOverlay();
	    }
	  }, {
	    key: 'handleLeaveLink',
	    value: function handleLeaveLink(e) {
	      if (this.$activeLink !== e.target) return;
	      this.$activeLink = null;
	      this.updateMenuOverlay();
	    }
	  }, {
	    key: 'handleClickHamburger',
	    value: function handleClickHamburger(e) {
	      this.menuIsActive = !this.menuIsActive;
	      this.updateMenuOverlay();
	    }
	  }, {
	    key: 'updateMenuOverlay',
	    value: function updateMenuOverlay() {
	      var fn = this.menuIsActive ? 'add' : 'remove';

	      this.$main.classList[fn]('is-transparent');
	      this.$hamburger.classList[fn]('is-active');
	      this.$menuOverlay.classList[fn]('is-active');
	      this.$header.classList[fn]('has-menu-overlay');
	      this.$menuLinks.forEach(function ($link) {
	        return $link.classList.remove('is-active');
	      });

	      if (!this.$activeLink) {
	        this.$activeLink = this.$menuOverlay.querySelector('.link[data-link=' + this.currentUrl + ']');
	      }

	      this.$menuOverlay.dataset.activeLink = this.$activeLink.dataset.link;
	      this.$header.dataset.activeLink = this.$activeLink.dataset.link;
	      this.$activeLink.classList.add('is-active');
	    }
	  }]);

	  return Header;
	}();

	module.exports = Header;

/***/ }
/******/ ]);