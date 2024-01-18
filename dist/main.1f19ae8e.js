// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
$(document).ready(function () {
  // Fetch and display categories
  axios.get('https://www.themealdb.com/api/json/v1/1/categories.php').then(function (response) {
    var categories = response.data.categories;
    var categoryGrid = $('#categoryGrid');
    categories.forEach(function (category) {
      var categoryCard = $("\n                <div class=\"category-card\">\n                    <img src=\"".concat(category.strCategoryThumb, "\" alt=\"").concat(category.strCategory, "\">\n                    <p>").concat(category.strCategory, "</p>\n                </div>\n            "));
      categoryCard.click(function () {
        return showCategoryDetail(category.strCategory);
      });
      categoryGrid.append(categoryCard);
    });
  }).catch(function (error) {
    return console.error('Error fetching categories:', error);
  });
  // Function to show category detail
  function showCategoryDetail(categoryName) {
    // Save the selected category in sessionStorage
    sessionStorage.setItem('selectedCategory', categoryName);
    // Redirect to category.html with the selected category
    window.location.href = "category.html?category=".concat(encodeURIComponent(categoryName));
  }

  // Fetch and display meals for a specific category
  function loadMeals(categoryName) {
    axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=".concat(categoryName)).then(function (response) {
      var meals = response.data.meals;
      var mealGrid = $('#mealGrid');
      mealGrid.empty();
      meals.forEach(function (meal) {
        var mealCard = $("\n                        <div class=\"meal-card\">\n                            <img src=\"".concat(meal.strMealThumb, "\" alt=\"").concat(meal.strMeal, "\">\n                            <p>").concat(meal.strMeal, "</p>\n                        </div>\n                    "));
        mealCard.click(function () {
          return showMealDetail(meal.idMeal);
        });
        mealGrid.append(mealCard);
      });
    }).catch(function (error) {
      return console.error('Error fetching meals:', error);
    });
  }

  // Function to show meal detail
  function showMealDetail(mealId) {
    // Save the selected category in sessionStorage
    var urlParams = new URLSearchParams(window.location.search);
    var categoryName = urlParams.get('category');
    sessionStorage.setItem('selectedCategory', categoryName);

    // Redirect to meal.html with the selected meal ID
    window.location.href = "meal.html?mealId=".concat(encodeURIComponent(mealId));
  }

  // Function to go back to the previous category detail
  function goBackToCategory() {
    var selectedCategory = sessionStorage.getItem('selectedCategory');
    if (selectedCategory) {
      window.location.href = "category.html?category=".concat(encodeURIComponent(selectedCategory));
    } else {
      // If no selected category, go back to the index.html
      window.location.href = 'index.html';
    }
  }

  // Attach click event to the Back button
  $('#backButton').click(goBackToCategory);

  // Check if the page is category.html
  if (window.location.pathname.includes('category.html')) {
    var urlParams = new URLSearchParams(window.location.search);
    var categoryName = urlParams.get('category');
    if (categoryName) {
      $('#categoryTitle').text(categoryName);
      loadMeals(categoryName);
    }
  }

  // Check if the page is meal.html
  if (window.location.pathname.includes('meal.html')) {
    var _urlParams = new URLSearchParams(window.location.search);
    var mealId = _urlParams.get('mealId');
    if (mealId) {
      loadMealDetail(mealId);
    }
  }

  // Fetch and display meal details
  function loadMealDetail(mealId) {
    axios.get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=".concat(mealId)).then(function (response) {
      var meal = response.data.meals[0];
      var mealDetail = $('#mealDetail');
      var youtubeLink = meal.strYoutube;
      mealDetail.html("\n                    <h2>".concat(meal.strMeal, "</h2>\n                    <img src=\"").concat(meal.strMealThumb, "\" alt=\"").concat(meal.strMeal, "\">\n                    <h3>Recipe:</h3>\n                    <p>").concat(meal.strInstructions, "</p>\n                    <h3>Youtube Tutorial:</h3>\n                    <div class=\"youtube-embed\">").concat(embedYoutubeLink(youtubeLink), "</div>\n                "));
    }).catch(function (error) {
      return console.error('Error fetching meal detail:', error);
    });
  }

  // Function to embed YouTube link
  function embedYoutubeLink(link) {
    var videoId = link.split('v=')[1];
    return "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/".concat(videoId, "\" frameborder=\"0\" allowfullscreen></iframe>");
  }
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60045" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map