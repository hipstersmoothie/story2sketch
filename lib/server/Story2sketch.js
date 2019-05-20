"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _puppeteer = require("puppeteer");

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _progress = require("progress");

var _progress2 = _interopRequireDefault(_progress);

var _getStorybook = require("./getStorybook");

var _getStorybook2 = _interopRequireDefault(_getStorybook);

var _PagePool = require("./PagePool.js");

var _PagePool2 = _interopRequireDefault(_PagePool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console*/

var defaultConcurrency = 4;
var defaultSymbolGutter = 100;

var Story2sketch = function () {
  function Story2sketch(_ref) {
    var _ref$output = _ref.output,
        output = _ref$output === undefined ? process.cwd() + "/dist/stories.asketch.json" : _ref$output,
        _ref$url = _ref.url,
        url = _ref$url === undefined ? "http://localhost:9001/iframe.html" : _ref$url,
        _ref$concurrency = _ref.concurrency,
        concurrency = _ref$concurrency === undefined ? defaultConcurrency : _ref$concurrency,
        _ref$pageTitle = _ref.pageTitle,
        pageTitle = _ref$pageTitle === undefined ? "Stories" : _ref$pageTitle,
        _ref$viewports = _ref.viewports,
        viewports = _ref$viewports === undefined ? {
      narrow: {
        width: 320,
        height: 1200,
        symbolPrefix: "📱 "
      },
      standard: {
        width: 1920,
        height: 1200,
        symbolPrefix: "🖥 "
      }
    } : _ref$viewports,
        _ref$symbolGutter = _ref.symbolGutter,
        symbolGutter = _ref$symbolGutter === undefined ? defaultSymbolGutter : _ref$symbolGutter,
        _ref$querySelector = _ref.querySelector,
        querySelector = _ref$querySelector === undefined ? "#root" : _ref$querySelector,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        _ref$fixPseudo = _ref.fixPseudo,
        fixPseudo = _ref$fixPseudo === undefined ? false : _ref$fixPseudo,
        stories = _ref.stories,
        _ref$puppeteerOptions = _ref.puppeteerOptions,
        puppeteerOptions = _ref$puppeteerOptions === undefined ? {} : _ref$puppeteerOptions,
        _ref$removePreviewMar = _ref.removePreviewMargin,
        removePreviewMargin = _ref$removePreviewMar === undefined ? true : _ref$removePreviewMar,
        _ref$layoutBy = _ref.layoutBy,
        layoutBy = _ref$layoutBy === undefined ? null : _ref$layoutBy,
        _ref$outputBy = _ref.outputBy,
        outputBy = _ref$outputBy === undefined ? null : _ref$outputBy;
    (0, _classCallCheck3.default)(this, Story2sketch);

    this.output = output;
    this.url = url;
    this.concurrency = concurrency;
    this.pageTitle = pageTitle;
    this.symbolGutter = symbolGutter;
    this.viewports = viewports;
    this.querySelector = querySelector;
    this.stories = stories;
    this.verbose = verbose;
    this.fixPseudo = fixPseudo;
    this.layoutBy = layoutBy;
    this.outputBy = outputBy;
    this.removePreviewMargin = removePreviewMargin === true;
    this.puppeteerOptions = puppeteerOptions;

    // Sort viewports by width
    this.sortedViewports = (0, _keys2.default)(viewports).map(function (key) {
      return (0, _extends3.default)({}, viewports[key], {
        id: key
      });
    }).sort(function (a, b) {
      return a.width > b.width;
    });
  }

  (0, _createClass3.default)(Story2sketch, [{
    key: "reset",
    value: function reset() {
      this.symbolsByViewport = {};
      this.symbolsByGrouping = {};
      this.widestByViewport = {};
      this.tallestByStory = {};
      this.processedStories = 0;
      this.storyCount = 0;
      this.sketchPage = {};
    }
  }, {
    key: "init",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _puppeteer2.default.launch(this.puppeteerOptions);

              case 2:
                this.browser = _context.sent;

                if (!(!this.stories || this.stories === "all")) {
                  _context.next = 8;
                  break;
                }

                if (this.verbose) {
                  console.log(_chalk2.default.gray("Detecting stories..."));
                }

                _context.next = 7;
                return (0, _getStorybook2.default)(this.browser, this.url);

              case 7:
                this.stories = _context.sent;

              case 8:

                this.reset();

                _context.next = 11;
                return this.createPagePool();

              case 11:
                this.pagePool = _context.sent;


                this.progressBar = new _progress2.default("[:bar] :percent (:current/:total) :etas remaining", {
                  total: this.storyCount,
                  story: "",
                  complete: "#"
                });

                _context.next = 15;
                return this.getSketchPage();

              case 15:
                this.sketchPage = _context.sent;


                console.log("Processing " + this.storyCount + " stories...");

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref2.apply(this, arguments);
      }

      return init;
    }()

    // NB The only reason this needs to run in chrome is because html-sketchapp
    // uses imports/exports and therefore won't compile for node. html-sketchapp
    // either needs to compile down, or we can webpack the server bundle.

  }, {
    key: "getSketchPage",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var page, params, sketchPage;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.verbose) {
                  console.log(_chalk2.default.gray("Getting sketch page..."));
                }

                _context2.next = 3;
                return this.browser.newPage();

              case 3:
                page = _context2.sent;
                _context2.next = 6;
                return page.goto(this.url, {
                  waitUntil: "networkidle2"
                });

              case 6:
                _context2.next = 8;
                return page.addScriptTag({
                  path: __dirname + "/../browser/page2layers.bundle.js"
                });

              case 8:
                params = (0, _stringify2.default)({
                  title: this.pageTitle,
                  width: 1920,
                  height: 5000
                });
                _context2.next = 11;
                return page.evaluate("\n      page2layers\n      .getPage(" + params + ")\n    ");

              case 11:
                sketchPage = _context2.sent;
                return _context2.abrupt("return", sketchPage);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSketchPage() {
        return _ref3.apply(this, arguments);
      }

      return getSketchPage;
    }()
  }, {
    key: "getGrouping",
    value: function getGrouping(_ref4) {
      var group = _ref4.group,
          kind = _ref4.kind;

      var grouping = "all";

      if (this.outputBy === "kind") {
        grouping = kind;
      } else if (this.outputBy === "group") {
        grouping = group;
      }

      if (this.layoutBy === "kind") {
        grouping = kind;
      } else if (this.layoutBy === "group") {
        grouping = group;
      }

      return grouping;
    }
  }, {
    key: "createPagePool",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var _this = this;

        var pagePool, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref11, id;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                pagePool = new _PagePool2.default(this.browser, this.concurrency);
                _context4.next = 3;
                return pagePool.init();

              case 3:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 6;

                _loop = function _loop() {
                  var _ref6 = _step.value;
                  var group = _ref6.group,
                      kind = _ref6.kind,
                      stories = _ref6.stories;

                  var grouping = _this.getGrouping({ group: group, kind: kind });

                  _this.symbolsByGrouping[grouping] = {};

                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = (0, _getIterator3.default)(_this.sortedViewports), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var _ref9 = _step3.value;
                      var id = _ref9.id;

                      _this.symbolsByGrouping[grouping][id] = Array(stories.length);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }

                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    var _loop2 = function _loop2() {
                      var story = _step4.value;

                      var storyIndex = _this.storyCount;

                      _this.storyCount++;

                      pagePool.queue(function () {
                        var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(page) {
                          var symbolByViewport, tallest, viewportKey, symbol;
                          return _regenerator2.default.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return _this.getSymbolsForStory({
                                    page: page,
                                    kind: kind,
                                    story: story
                                  });

                                case 2:
                                  symbolByViewport = _context3.sent;
                                  tallest = 0;


                                  for (viewportKey in symbolByViewport) {
                                    symbol = symbolByViewport[viewportKey];


                                    tallest = Math.max(tallest, symbol.frame.height);

                                    _this.widestByViewport[viewportKey] = Math.max(_this.widestByViewport[viewportKey] || 0, symbol.frame.width);

                                    // Assign by index to retain the order of the symbols
                                    _this.symbolsByViewport[viewportKey][storyIndex] = symbol;
                                    _this.symbolsByGrouping[grouping][viewportKey][storyIndex] = symbol;
                                  }

                                  _this.tallestByStory[storyIndex] = tallest;

                                case 6:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3, _this);
                        }));

                        return function (_x) {
                          return _ref10.apply(this, arguments);
                        };
                      }());
                    };

                    for (var _iterator4 = (0, _getIterator3.default)(stories), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      _loop2();
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }
                };

                for (_iterator = (0, _getIterator3.default)(this.stories); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _loop();
                }

                // Initialize an array per viewport based on the number of stories
                _context4.next = 15;
                break;

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](6);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 15:
                _context4.prev = 15;
                _context4.prev = 16;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 18:
                _context4.prev = 18;

                if (!_didIteratorError) {
                  _context4.next = 21;
                  break;
                }

                throw _iteratorError;

              case 21:
                return _context4.finish(18);

              case 22:
                return _context4.finish(15);

              case 23:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context4.prev = 26;
                for (_iterator2 = (0, _getIterator3.default)(this.sortedViewports); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _ref11 = _step2.value;
                  id = _ref11.id;

                  this.symbolsByViewport[id] = Array(this.storyCount);
                }

                _context4.next = 34;
                break;

              case 30:
                _context4.prev = 30;
                _context4.t1 = _context4["catch"](26);
                _didIteratorError2 = true;
                _iteratorError2 = _context4.t1;

              case 34:
                _context4.prev = 34;
                _context4.prev = 35;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 37:
                _context4.prev = 37;

                if (!_didIteratorError2) {
                  _context4.next = 40;
                  break;
                }

                throw _iteratorError2;

              case 40:
                return _context4.finish(37);

              case 41:
                return _context4.finish(34);

              case 42:
                return _context4.abrupt("return", pagePool);

              case 43:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[6, 11, 15, 23], [16,, 18, 22], [26, 30, 34, 42], [35,, 37, 41]]);
      }));

      function createPagePool() {
        return _ref5.apply(this, arguments);
      }

      return createPagePool;
    }()
  }, {
    key: "getSymbolsForStory",
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref12) {
        var page = _ref12.page,
            kind = _ref12.kind,
            story = _ref12.story;

        var builtUrl, name, symbolByViewport, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _ref15, _ref15$symbolPrefix, symbolPrefix, id, width, height, params, symbolJson, symbol;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                builtUrl = this.url + "?selectedKind=" + encodeURIComponent(kind) + "&selectedStory=" + encodeURIComponent(story.name);
                _context5.next = 3;
                return page.goto(builtUrl, {
                  waitUntil: "networkidle2"
                });

              case 3:
                _context5.next = 5;
                return page.addScriptTag({
                  path: __dirname + "/../browser/page2layers.bundle.js"
                });

              case 5:
                name = kind + "/" + (story.displayName || story.name);
                symbolByViewport = {};
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context5.prev = 10;
                _iterator5 = (0, _getIterator3.default)(this.sortedViewports);

              case 12:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context5.next = 26;
                  break;
                }

                _ref15 = _step5.value;
                _ref15$symbolPrefix = _ref15.symbolPrefix, symbolPrefix = _ref15$symbolPrefix === undefined ? "" : _ref15$symbolPrefix, id = _ref15.id, width = _ref15.width, height = _ref15.height;
                _context5.next = 17;
                return page.setViewport({ width: width, height: height });

              case 17:

                // Only prefix if symbolPrefix is defined
                params = (0, _stringify2.default)({
                  name: "" + symbolPrefix + name,
                  querySelector: this.querySelector,
                  fixPseudo: this.fixPseudo,
                  removePreviewMargin: this.removePreviewMargin
                });

                // JSON.parse + JSON.stringify hack was originally used until
                // https://github.com/GoogleChrome/puppeteer/issues/1510 was fixed, but
                // it still results in better performance.

                _context5.next = 20;
                return page.evaluate("\n        JSON.stringify(\n          page2layers\n          .getSymbol(" + params + ")\n        );\n        ");

              case 20:
                symbolJson = _context5.sent;
                symbol = JSON.parse(symbolJson);


                if (symbol) {
                  symbol.symbolID = name + ":" + id;

                  symbolByViewport[id] = symbol;
                } else {
                  console.warn(_chalk2.default.yellow(" WARNING: No matching node for \"" + name + "\" using querySelector " + this.querySelector + " on viewport " + id));
                }

              case 23:
                _iteratorNormalCompletion5 = true;
                _context5.next = 12;
                break;

              case 26:
                _context5.next = 32;
                break;

              case 28:
                _context5.prev = 28;
                _context5.t0 = _context5["catch"](10);
                _didIteratorError5 = true;
                _iteratorError5 = _context5.t0;

              case 32:
                _context5.prev = 32;
                _context5.prev = 33;

                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }

              case 35:
                _context5.prev = 35;

                if (!_didIteratorError5) {
                  _context5.next = 38;
                  break;
                }

                throw _iteratorError5;

              case 38:
                return _context5.finish(35);

              case 39:
                return _context5.finish(32);

              case 40:

                this.logProgress(name);

                return _context5.abrupt("return", symbolByViewport);

              case 42:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[10, 28, 32, 40], [33,, 35, 39]]);
      }));

      function getSymbolsForStory(_x2) {
        return _ref13.apply(this, arguments);
      }

      return getSymbolsForStory;
    }()
  }, {
    key: "logProgress",
    value: function logProgress(name) {
      this.processedStories += 1;

      if (this.verbose) {
        console.log(_chalk2.default.green("✓") + " " + _chalk2.default.gray("Exported") + " " + _chalk2.default.bold("" + name));
      } else {
        this.progressBar.tick({
          processed: this.processedStories,
          story: _chalk2.default.bold(name)
        });
      }
    }
  }, {
    key: "positionSymbols",
    value: function positionSymbols(symbolsByViewport) {
      var xOffsetStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var layers = [];
      var xOffset = xOffsetStart;

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(this.sortedViewports), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _ref17 = _step6.value;
          var id = _ref17.id;

          var yOffset = 0;

          var symbols = symbolsByViewport[id];

          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = (0, _getIterator3.default)(symbols.entries()), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _step7$value = (0, _slicedToArray3.default)(_step7.value, 2),
                  index = _step7$value[0],
                  symbol = _step7$value[1];

              // Skip failed symbols
              if (symbol) {
                symbol.frame.x = xOffset;
                symbol.frame.y = yOffset;
                layers.push(symbol);
                yOffset += this.tallestByStory[index] + this.symbolGutter;
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          xOffset += this.widestByViewport[id] + this.symbolGutter;
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return layers;
    }
  }, {
    key: "positionSymbolsByViewport",
    value: function positionSymbolsByViewport() {
      this.sketchPage.layers = [].concat((0, _toConsumableArray3.default)(this.sketchPage.layers), (0, _toConsumableArray3.default)(this.positionSymbols(this.symbolsByViewport)));
    }
  }, {
    key: "positionSymbolsByGrouping",
    value: function positionSymbolsByGrouping() {
      var _this2 = this;

      var width = this.sortedViewports.reduce(function (totalWidth, viewport) {
        return totalWidth + _this2.widestByViewport[viewport.id] + _this2.symbolGutter;
      }, 0);

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = (0, _getIterator3.default)((0, _keys2.default)(this.symbolsByGrouping).entries()), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = (0, _slicedToArray3.default)(_step8.value, 2),
              index = _step8$value[0],
              _grouping = _step8$value[1];

          var symbolsByViewport = this.symbolsByGrouping[_grouping];

          this.sketchPage.layers = [].concat((0, _toConsumableArray3.default)(this.sketchPage.layers), (0, _toConsumableArray3.default)(this.positionSymbols(symbolsByViewport, width * index)));
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }, {
    key: "writeByGrouping",
    value: function writeByGrouping() {
      (0, _mkdirp2.default)(this.output);

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = (0, _getIterator3.default)((0, _keys2.default)(this.symbolsByGrouping)), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _grouping2 = _step9.value;

          var sketchPage = (0, _extends3.default)({}, this.sketchPage, {
            layers: this.positionSymbols(this.symbolsByGrouping[_grouping2])
          });
          var filename = _grouping2.replace(/ /g, "_").replace(/\//g, "+") + ".asketch.json";

          var outputPath = _path2.default.join(this.output, filename);

          _fs2.default.writeFileSync(outputPath, (0, _stringify2.default)(sketchPage));

          console.log(_chalk2.default.green("Wrote stories by " + this.outputBy + " to " + _chalk2.default.white.bold(outputPath)));
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }, {
    key: "execute",
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                process.on("SIGINT", function () {
                  _this3.browser.close();

                  _this3.exited = true;

                  process.exit();
                });

                _context6.next = 3;
                return this.pagePool.execute().catch(function (error) {
                  // Suppress errors if user exited process.
                  if (!_this3.exited) {
                    console.error(error);
                  }
                });

              case 3:

                if (this.outputBy) {
                  this.writeByGrouping();
                } else {
                  if (this.layoutBy) {
                    this.positionSymbolsByGrouping();
                  } else {
                    this.positionSymbolsByViewport();
                  }

                  _fs2.default.writeFileSync(this.output, (0, _stringify2.default)(this.sketchPage));
                }

                console.log(_chalk2.default.green("Success! " + this.processedStories + " stories written to " + _chalk2.default.white.bold(this.output)));

                this.browser.close();
                process.exit();

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function execute() {
        return _ref18.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return Story2sketch;
}();

exports.default = Story2sketch;