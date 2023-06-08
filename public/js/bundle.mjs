function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/*eslint-disable */ // const camelCase = require('./../../node_modules/lodash/camelCase');
/*eslint-disable */ //import '@babel/polyfill'; //we do not store it in a variable because we want this whole file to be included in our bundle/index.js file
var $4829bbf1aa53fe26$exports = {};
/* axios v0.18.0 | (c) 2018 by Matt Zabriskie */ (function webpackUniversalModuleDefinition(root, factory) {
    $4829bbf1aa53fe26$exports = factory();
})($4829bbf1aa53fe26$exports, function() {
    return /******/ function(modules) {
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/ /******/ // The require function
        /******/ function __webpack_require__(moduleId) {
            /******/ /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) /******/ return installedModules[moduleId].exports;
            /******/ /******/ // Create a new module (and put it into the cache)
            /******/ var module1 = installedModules[moduleId] = {
                /******/ exports: {},
                /******/ id: moduleId,
                /******/ loaded: false
            };
            /******/ /******/ // Execute the module function
            /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__);
            /******/ /******/ // Flag the module as loaded
            /******/ module1.loaded = true;
            /******/ /******/ // Return the exports of the module
            /******/ return module1.exports;
        /******/ }
        /******/ /******/ /******/ // expose the modules object (__webpack_modules__)
        /******/ __webpack_require__.m = modules;
        /******/ /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules;
        /******/ /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = "";
        /******/ /******/ // Load entry module and return exports
        /******/ return __webpack_require__(0);
    /******/ }([
        /* 0 */ /***/ function(module1, exports, __webpack_require__) {
            module1.exports = __webpack_require__(1);
        /***/ },
        /* 1 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            var bind = __webpack_require__(3);
            var Axios = __webpack_require__(5);
            var defaults = __webpack_require__(6);
            /**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */ function createInstance(defaultConfig) {
                var context = new Axios(defaultConfig);
                var instance = bind(Axios.prototype.request, context);
                // Copy axios.prototype to instance
                utils.extend(instance, Axios.prototype, context);
                // Copy context to instance
                utils.extend(instance, context);
                return instance;
            }
            // Create the default instance to be exported
            var axios = createInstance(defaults);
            // Expose Axios class to allow class inheritance
            axios.Axios = Axios;
            // Factory for creating new instances
            axios.create = function create(instanceConfig) {
                return createInstance(utils.merge(defaults, instanceConfig));
            };
            // Expose Cancel & CancelToken
            axios.Cancel = __webpack_require__(23);
            axios.CancelToken = __webpack_require__(24);
            axios.isCancel = __webpack_require__(20);
            // Expose all/spread
            axios.all = function all(promises) {
                return Promise.all(promises);
            };
            axios.spread = __webpack_require__(25);
            module1.exports = axios;
            // Allow use of default import syntax in TypeScript
            module1.exports.default = axios;
        /***/ },
        /* 2 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var bind = __webpack_require__(3);
            var isBuffer = __webpack_require__(4);
            /*global toString:true*/ // utils is a library of generic helper functions non-specific to axios
            var toString = Object.prototype.toString;
            /**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */ function isArray(val) {
                return toString.call(val) === "[object Array]";
            }
            /**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */ function isArrayBuffer(val) {
                return toString.call(val) === "[object ArrayBuffer]";
            }
            /**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */ function isFormData(val) {
                return typeof FormData !== "undefined" && val instanceof FormData;
            }
            /**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */ function isArrayBufferView(val) {
                var result;
                if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
                else result = val && val.buffer && val.buffer instanceof ArrayBuffer;
                return result;
            }
            /**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */ function isString(val) {
                return typeof val === "string";
            }
            /**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */ function isNumber(val) {
                return typeof val === "number";
            }
            /**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */ function isUndefined(val) {
                return typeof val === "undefined";
            }
            /**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */ function isObject(val) {
                return val !== null && typeof val === "object";
            }
            /**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */ function isDate(val) {
                return toString.call(val) === "[object Date]";
            }
            /**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */ function isFile(val) {
                return toString.call(val) === "[object File]";
            }
            /**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */ function isBlob(val) {
                return toString.call(val) === "[object Blob]";
            }
            /**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */ function isFunction(val) {
                return toString.call(val) === "[object Function]";
            }
            /**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */ function isStream(val) {
                return isObject(val) && isFunction(val.pipe);
            }
            /**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */ function isURLSearchParams(val) {
                return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
            }
            /**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */ function trim(str) {
                return str.replace(/^\s*/, "").replace(/\s*$/, "");
            }
            /**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */ function isStandardBrowserEnv() {
                if (typeof navigator !== "undefined" && navigator.product === "ReactNative") return false;
                return typeof window !== "undefined" && typeof document !== "undefined";
            }
            /**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */ function forEach(obj, fn) {
                // Don't bother if no value provided
                if (obj === null || typeof obj === "undefined") return;
                // Force an array if not already something iterable
                if (typeof obj !== "object") /*eslint no-param-reassign:0*/ obj = [
                    obj
                ];
                if (isArray(obj)) // Iterate over array values
                for(var i = 0, l = obj.length; i < l; i++)fn.call(null, obj[i], i, obj);
                else {
                    // Iterate over object keys
                    for(var key in obj)if (Object.prototype.hasOwnProperty.call(obj, key)) fn.call(null, obj[key], key, obj);
                }
            }
            /**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */ function merge() {
                var result = {};
                function assignValue(val, key) {
                    if (typeof result[key] === "object" && typeof val === "object") result[key] = merge(result[key], val);
                    else result[key] = val;
                }
                for(var i = 0, l = arguments.length; i < l; i++)forEach(arguments[i], assignValue);
                return result;
            }
            /**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */ function extend(a, b, thisArg) {
                forEach(b, function assignValue(val, key) {
                    if (thisArg && typeof val === "function") a[key] = bind(val, thisArg);
                    else a[key] = val;
                });
                return a;
            }
            module1.exports = {
                isArray: isArray,
                isArrayBuffer: isArrayBuffer,
                isBuffer: isBuffer,
                isFormData: isFormData,
                isArrayBufferView: isArrayBufferView,
                isString: isString,
                isNumber: isNumber,
                isObject: isObject,
                isUndefined: isUndefined,
                isDate: isDate,
                isFile: isFile,
                isBlob: isBlob,
                isFunction: isFunction,
                isStream: isStream,
                isURLSearchParams: isURLSearchParams,
                isStandardBrowserEnv: isStandardBrowserEnv,
                forEach: forEach,
                merge: merge,
                extend: extend,
                trim: trim
            };
        /***/ },
        /* 3 */ /***/ function(module1, exports) {
            "use strict";
            module1.exports = function bind(fn, thisArg) {
                return function wrap() {
                    var args = new Array(arguments.length);
                    for(var i = 0; i < args.length; i++)args[i] = arguments[i];
                    return fn.apply(thisArg, args);
                };
            };
        /***/ },
        /* 4 */ /***/ function(module1, exports) {
            /*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */ // The _isBuffer check is for Safari 5-7 support, because it's missing
            // Object.prototype.constructor. Remove this eventually
            module1.exports = function(obj) {
                return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
            };
            function isBuffer(obj) {
                return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
            }
            // For Node v0.10 support. Remove this eventually.
            function isSlowBuffer(obj) {
                return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
            }
        /***/ },
        /* 5 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var defaults = __webpack_require__(6);
            var utils = __webpack_require__(2);
            var InterceptorManager = __webpack_require__(17);
            var dispatchRequest = __webpack_require__(18);
            /**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */ function Axios(instanceConfig) {
                this.defaults = instanceConfig;
                this.interceptors = {
                    request: new InterceptorManager(),
                    response: new InterceptorManager()
                };
            }
            /**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */ Axios.prototype.request = function request(config) {
                /*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
                if (typeof config === "string") config = utils.merge({
                    url: arguments[0]
                }, arguments[1]);
                config = utils.merge(defaults, {
                    method: "get"
                }, this.defaults, config);
                config.method = config.method.toLowerCase();
                // Hook up interceptors middleware
                var chain = [
                    dispatchRequest,
                    undefined
                ];
                var promise = Promise.resolve(config);
                this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                    chain.unshift(interceptor.fulfilled, interceptor.rejected);
                });
                this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                    chain.push(interceptor.fulfilled, interceptor.rejected);
                });
                while(chain.length)promise = promise.then(chain.shift(), chain.shift());
                return promise;
            };
            // Provide aliases for supported request methods
            utils.forEach([
                "delete",
                "get",
                "head",
                "options"
            ], function forEachMethodNoData(method) {
                /*eslint func-names:0*/ Axios.prototype[method] = function(url, config) {
                    return this.request(utils.merge(config || {}, {
                        method: method,
                        url: url
                    }));
                };
            });
            utils.forEach([
                "post",
                "put",
                "patch"
            ], function forEachMethodWithData(method) {
                /*eslint func-names:0*/ Axios.prototype[method] = function(url, data, config) {
                    return this.request(utils.merge(config || {}, {
                        method: method,
                        url: url,
                        data: data
                    }));
                };
            });
            module1.exports = Axios;
        /***/ },
        /* 6 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            var normalizeHeaderName = __webpack_require__(7);
            var DEFAULT_CONTENT_TYPE = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            function setContentTypeIfUnset(headers, value) {
                if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) headers["Content-Type"] = value;
            }
            function getDefaultAdapter() {
                var adapter;
                if (typeof XMLHttpRequest !== "undefined") // For browsers use XHR adapter
                adapter = __webpack_require__(8);
                else if (typeof process !== "undefined") // For node use HTTP adapter
                adapter = __webpack_require__(8);
                return adapter;
            }
            var defaults = {
                adapter: getDefaultAdapter(),
                transformRequest: [
                    function transformRequest(data, headers) {
                        normalizeHeaderName(headers, "Content-Type");
                        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) return data;
                        if (utils.isArrayBufferView(data)) return data.buffer;
                        if (utils.isURLSearchParams(data)) {
                            setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
                            return data.toString();
                        }
                        if (utils.isObject(data)) {
                            setContentTypeIfUnset(headers, "application/json;charset=utf-8");
                            return JSON.stringify(data);
                        }
                        return data;
                    }
                ],
                transformResponse: [
                    function transformResponse(data) {
                        /*eslint no-param-reassign:0*/ if (typeof data === "string") try {
                            data = JSON.parse(data);
                        } catch (e) {}
                        return data;
                    }
                ],
                /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */ timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                validateStatus: function validateStatus(status) {
                    return status >= 200 && status < 300;
                }
            };
            defaults.headers = {
                common: {
                    "Accept": "application/json, text/plain, */*"
                }
            };
            utils.forEach([
                "delete",
                "get",
                "head"
            ], function forEachMethodNoData(method) {
                defaults.headers[method] = {};
            });
            utils.forEach([
                "post",
                "put",
                "patch"
            ], function forEachMethodWithData(method) {
                defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
            });
            module1.exports = defaults;
        /***/ },
        /* 7 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            module1.exports = function normalizeHeaderName(headers, normalizedName) {
                utils.forEach(headers, function processHeader(value, name) {
                    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                        headers[normalizedName] = value;
                        delete headers[name];
                    }
                });
            };
        /***/ },
        /* 8 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            var settle = __webpack_require__(9);
            var buildURL = __webpack_require__(12);
            var parseHeaders = __webpack_require__(13);
            var isURLSameOrigin = __webpack_require__(14);
            var createError = __webpack_require__(10);
            var btoa = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || __webpack_require__(15);
            module1.exports = function xhrAdapter(config) {
                return new Promise(function dispatchXhrRequest(resolve, reject) {
                    var requestData = config.data;
                    var requestHeaders = config.headers;
                    if (utils.isFormData(requestData)) delete requestHeaders["Content-Type"]; // Let the browser set it
                    var request = new XMLHttpRequest();
                    var loadEvent = "onreadystatechange";
                    var xDomain = false;
                    // For IE 8/9 CORS support
                    // Only supports POST and GET calls and doesn't returns the response headers.
                    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
                    if (typeof window !== "undefined" && window.XDomainRequest && !("withCredentials" in request) && !isURLSameOrigin(config.url)) {
                        request = new window.XDomainRequest();
                        loadEvent = "onload";
                        xDomain = true;
                        request.onprogress = function handleProgress() {};
                        request.ontimeout = function handleTimeout() {};
                    }
                    // HTTP basic authentication
                    if (config.auth) {
                        var username = config.auth.username || "";
                        var password = config.auth.password || "";
                        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
                    }
                    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
                    // Set the request timeout in MS
                    request.timeout = config.timeout;
                    // Listen for ready state
                    request[loadEvent] = function handleLoad() {
                        if (!request || request.readyState !== 4 && !xDomain) return;
                        // The request errored out and we didn't get a response, this will be
                        // handled by onerror instead
                        // With one exception: request that using file: protocol, most browsers
                        // will return status as 0 even though it's a successful request
                        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) return;
                        // Prepare the response
                        var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                        var responseData = !config.responseType || config.responseType === "text" ? request.responseText : request.response;
                        var response = {
                            data: responseData,
                            // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
                            status: request.status === 1223 ? 204 : request.status,
                            statusText: request.status === 1223 ? "No Content" : request.statusText,
                            headers: responseHeaders,
                            config: config,
                            request: request
                        };
                        settle(resolve, reject, response);
                        // Clean up request
                        request = null;
                    };
                    // Handle low level network errors
                    request.onerror = function handleError() {
                        // Real errors are hidden from us by the browser
                        // onerror should only fire if it's a network error
                        reject(createError("Network Error", config, null, request));
                        // Clean up request
                        request = null;
                    };
                    // Handle timeout
                    request.ontimeout = function handleTimeout() {
                        reject(createError("timeout of " + config.timeout + "ms exceeded", config, "ECONNABORTED", request));
                        // Clean up request
                        request = null;
                    };
                    // Add xsrf header
                    // This is only done if running in a standard browser environment.
                    // Specifically not if we're in a web worker, or react-native.
                    if (utils.isStandardBrowserEnv()) {
                        var cookies = __webpack_require__(16);
                        // Add xsrf header
                        var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;
                        if (xsrfValue) requestHeaders[config.xsrfHeaderName] = xsrfValue;
                    }
                    // Add headers to the request
                    if ("setRequestHeader" in request) utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                        else // Otherwise add header to the request
                        request.setRequestHeader(key, val);
                    });
                    // Add withCredentials to request if needed
                    if (config.withCredentials) request.withCredentials = true;
                    // Add responseType to request if needed
                    if (config.responseType) try {
                        request.responseType = config.responseType;
                    } catch (e) {
                        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                        if (config.responseType !== "json") throw e;
                    }
                    // Handle progress if needed
                    if (typeof config.onDownloadProgress === "function") request.addEventListener("progress", config.onDownloadProgress);
                    // Not all browsers support upload events
                    if (typeof config.onUploadProgress === "function" && request.upload) request.upload.addEventListener("progress", config.onUploadProgress);
                    if (config.cancelToken) // Handle cancellation
                    config.cancelToken.promise.then(function onCanceled(cancel) {
                        if (!request) return;
                        request.abort();
                        reject(cancel);
                        // Clean up request
                        request = null;
                    });
                    if (requestData === undefined) requestData = null;
                    // Send the request
                    request.send(requestData);
                });
            };
        /***/ },
        /* 9 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var createError = __webpack_require__(10);
            /**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */ module1.exports = function settle(resolve, reject, response) {
                var validateStatus = response.config.validateStatus;
                // Note: status is not exposed by XDomainRequest
                if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
                else reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
            };
        /***/ },
        /* 10 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var enhanceError = __webpack_require__(11);
            /**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */ module1.exports = function createError(message, config, code, request, response) {
                var error = new Error(message);
                return enhanceError(error, config, code, request, response);
            };
        /***/ },
        /* 11 */ /***/ function(module1, exports) {
            "use strict";
            /**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */ module1.exports = function enhanceError(error, config, code, request, response) {
                error.config = config;
                if (code) error.code = code;
                error.request = request;
                error.response = response;
                return error;
            };
        /***/ },
        /* 12 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            function encode(val) {
                return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
            }
            /**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */ module1.exports = function buildURL(url, params, paramsSerializer) {
                /*eslint no-param-reassign:0*/ if (!params) return url;
                var serializedParams;
                if (paramsSerializer) serializedParams = paramsSerializer(params);
                else if (utils.isURLSearchParams(params)) serializedParams = params.toString();
                else {
                    var parts = [];
                    utils.forEach(params, function serialize(val, key) {
                        if (val === null || typeof val === "undefined") return;
                        if (utils.isArray(val)) key = key + "[]";
                        else val = [
                            val
                        ];
                        utils.forEach(val, function parseValue(v) {
                            if (utils.isDate(v)) v = v.toISOString();
                            else if (utils.isObject(v)) v = JSON.stringify(v);
                            parts.push(encode(key) + "=" + encode(v));
                        });
                    });
                    serializedParams = parts.join("&");
                }
                if (serializedParams) url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
                return url;
            };
        /***/ },
        /* 13 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            // Headers whose duplicates are ignored by node
            // c.f. https://nodejs.org/api/http.html#http_message_headers
            var ignoreDuplicateOf = [
                "age",
                "authorization",
                "content-length",
                "content-type",
                "etag",
                "expires",
                "from",
                "host",
                "if-modified-since",
                "if-unmodified-since",
                "last-modified",
                "location",
                "max-forwards",
                "proxy-authorization",
                "referer",
                "retry-after",
                "user-agent"
            ];
            /**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */ module1.exports = function parseHeaders(headers) {
                var parsed = {};
                var key;
                var val;
                var i;
                if (!headers) return parsed;
                utils.forEach(headers.split("\n"), function parser(line) {
                    i = line.indexOf(":");
                    key = utils.trim(line.substr(0, i)).toLowerCase();
                    val = utils.trim(line.substr(i + 1));
                    if (key) {
                        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) return;
                        if (key === "set-cookie") parsed[key] = (parsed[key] ? parsed[key] : []).concat([
                            val
                        ]);
                        else parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
                    }
                });
                return parsed;
            };
        /***/ },
        /* 14 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            module1.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
            // whether the request URL is of the same origin as current location.
            function standardBrowserEnv() {
                var msie = /(msie|trident)/i.test(navigator.userAgent);
                var urlParsingNode = document.createElement("a");
                var originURL;
                /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */ function resolveURL(url) {
                    var href = url;
                    if (msie) {
                        // IE needs attribute set twice to normalize properties
                        urlParsingNode.setAttribute("href", href);
                        href = urlParsingNode.href;
                    }
                    urlParsingNode.setAttribute("href", href);
                    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                    return {
                        href: urlParsingNode.href,
                        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
                        host: urlParsingNode.host,
                        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
                        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
                        hostname: urlParsingNode.hostname,
                        port: urlParsingNode.port,
                        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
                    };
                }
                originURL = resolveURL(window.location.href);
                /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */ return function isURLSameOrigin(requestURL) {
                    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
                    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
                };
            }() : // Non standard browser envs (web workers, react-native) lack needed support.
            function nonStandardBrowserEnv() {
                return function isURLSameOrigin() {
                    return true;
                };
            }();
        /***/ },
        /* 15 */ /***/ function(module1, exports) {
            "use strict";
            // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            function E() {
                this.message = "String contains an invalid character";
            }
            E.prototype = new Error;
            E.prototype.code = 5;
            E.prototype.name = "InvalidCharacterError";
            function btoa(input) {
                var str = String(input);
                var output = "";
                for(// initialize result and counter
                var block, charCode, idx = 0, map = chars; // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
                str.charAt(idx | 0) || (map = "=", idx % 1); // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                output += map.charAt(63 & block >> 8 - idx % 1 * 8)){
                    charCode = str.charCodeAt(idx += 3 / 4);
                    if (charCode > 0xFF) throw new E();
                    block = block << 8 | charCode;
                }
                return output;
            }
            module1.exports = btoa;
        /***/ },
        /* 16 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            module1.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
            function standardBrowserEnv() {
                return {
                    write: function write(name, value, expires, path, domain, secure) {
                        var cookie = [];
                        cookie.push(name + "=" + encodeURIComponent(value));
                        if (utils.isNumber(expires)) cookie.push("expires=" + new Date(expires).toGMTString());
                        if (utils.isString(path)) cookie.push("path=" + path);
                        if (utils.isString(domain)) cookie.push("domain=" + domain);
                        if (secure === true) cookie.push("secure");
                        document.cookie = cookie.join("; ");
                    },
                    read: function read(name) {
                        var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
                        return match ? decodeURIComponent(match[3]) : null;
                    },
                    remove: function remove(name) {
                        this.write(name, "", Date.now() - 86400000);
                    }
                };
            }() : // Non standard browser env (web workers, react-native) lack needed support.
            function nonStandardBrowserEnv() {
                return {
                    write: function write() {},
                    read: function read() {
                        return null;
                    },
                    remove: function remove() {}
                };
            }();
        /***/ },
        /* 17 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            function InterceptorManager() {
                this.handlers = [];
            }
            /**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */ InterceptorManager.prototype.use = function use(fulfilled, rejected) {
                this.handlers.push({
                    fulfilled: fulfilled,
                    rejected: rejected
                });
                return this.handlers.length - 1;
            };
            /**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */ InterceptorManager.prototype.eject = function eject(id) {
                if (this.handlers[id]) this.handlers[id] = null;
            };
            /**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */ InterceptorManager.prototype.forEach = function forEach(fn) {
                utils.forEach(this.handlers, function forEachHandler(h) {
                    if (h !== null) fn(h);
                });
            };
            module1.exports = InterceptorManager;
        /***/ },
        /* 18 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            var transformData = __webpack_require__(19);
            var isCancel = __webpack_require__(20);
            var defaults = __webpack_require__(6);
            var isAbsoluteURL = __webpack_require__(21);
            var combineURLs = __webpack_require__(22);
            /**
	 * Throws a `Cancel` if cancellation has been requested.
	 */ function throwIfCancellationRequested(config) {
                if (config.cancelToken) config.cancelToken.throwIfRequested();
            }
            /**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */ module1.exports = function dispatchRequest(config) {
                throwIfCancellationRequested(config);
                // Support baseURL config
                if (config.baseURL && !isAbsoluteURL(config.url)) config.url = combineURLs(config.baseURL, config.url);
                // Ensure headers exist
                config.headers = config.headers || {};
                // Transform request data
                config.data = transformData(config.data, config.headers, config.transformRequest);
                // Flatten headers
                config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
                utils.forEach([
                    "delete",
                    "get",
                    "head",
                    "post",
                    "put",
                    "patch",
                    "common"
                ], function cleanHeaderConfig(method) {
                    delete config.headers[method];
                });
                var adapter = config.adapter || defaults.adapter;
                return adapter(config).then(function onAdapterResolution(response) {
                    throwIfCancellationRequested(config);
                    // Transform response data
                    response.data = transformData(response.data, response.headers, config.transformResponse);
                    return response;
                }, function onAdapterRejection(reason) {
                    if (!isCancel(reason)) {
                        throwIfCancellationRequested(config);
                        // Transform response data
                        if (reason && reason.response) reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
                    }
                    return Promise.reject(reason);
                });
            };
        /***/ },
        /* 19 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var utils = __webpack_require__(2);
            /**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */ module1.exports = function transformData(data, headers, fns) {
                /*eslint no-param-reassign:0*/ utils.forEach(fns, function transform(fn) {
                    data = fn(data, headers);
                });
                return data;
            };
        /***/ },
        /* 20 */ /***/ function(module1, exports) {
            "use strict";
            module1.exports = function isCancel(value) {
                return !!(value && value.__CANCEL__);
            };
        /***/ },
        /* 21 */ /***/ function(module1, exports) {
            "use strict";
            /**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */ module1.exports = function isAbsoluteURL(url) {
                // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
                // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
                // by any combination of letters, digits, plus, period, or hyphen.
                return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
            };
        /***/ },
        /* 22 */ /***/ function(module1, exports) {
            "use strict";
            /**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */ module1.exports = function combineURLs(baseURL, relativeURL) {
                return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
            };
        /***/ },
        /* 23 */ /***/ function(module1, exports) {
            "use strict";
            /**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */ function Cancel(message) {
                this.message = message;
            }
            Cancel.prototype.toString = function toString() {
                return "Cancel" + (this.message ? ": " + this.message : "");
            };
            Cancel.prototype.__CANCEL__ = true;
            module1.exports = Cancel;
        /***/ },
        /* 24 */ /***/ function(module1, exports, __webpack_require__) {
            "use strict";
            var Cancel = __webpack_require__(23);
            /**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */ function CancelToken(executor) {
                if (typeof executor !== "function") throw new TypeError("executor must be a function.");
                var resolvePromise;
                this.promise = new Promise(function promiseExecutor(resolve) {
                    resolvePromise = resolve;
                });
                var token = this;
                executor(function cancel(message) {
                    if (token.reason) // Cancellation has already been requested
                    return;
                    token.reason = new Cancel(message);
                    resolvePromise(token.reason);
                });
            }
            /**
	 * Throws a `Cancel` if cancellation has been requested.
	 */ CancelToken.prototype.throwIfRequested = function throwIfRequested() {
                if (this.reason) throw this.reason;
            };
            /**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */ CancelToken.source = function source() {
                var cancel;
                var token = new CancelToken(function executor(c) {
                    cancel = c;
                });
                return {
                    token: token,
                    cancel: cancel
                };
            };
            module1.exports = CancelToken;
        /***/ },
        /* 25 */ /***/ function(module1, exports) {
            "use strict";
            /**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */ module1.exports = function spread(callback) {
                return function wrap(arr) {
                    return callback.apply(null, arr);
                };
            };
        /***/ }
    ]);
});


const $896fce0a0eaf741b$export$596d806903d1f59e = async (email, password)=>{
    //exporting the login function
    try {
        const res = await (0, (/*@__PURE__*/$parcel$interopDefault($4829bbf1aa53fe26$exports)))({
            method: "POST",
            //url: 'http://127.0.0.1:3000/api/v1/users/login', //this is our login endpoint
            url: `${process.env.BASE_URL}/api/v1/users/login`,
            //now sending data along with the request in the body
            data: {
                email: email,
                password: password
            }
        });
        //**After successful login we are going to jump to the main tour page from login page */
        if (res.data.status === "success") {
            //we are checking that this login function actual succed or not by getting the status message that we actually setup in our api
            alert("Logged in successfully");
            window.setTimeout(()=>{
                //if user data is correct then we will direct the user to overview page
                location.assign("/"); //after succefull login we will change the login page to '/' overview page after 1.5seconds
            }, 1500);
        }
    } catch (err) {
        console.log(err.response.data.message);
    // alert(err.response.data.message);
    }
}; //**Commenting it out here and adding this piece of code in index.js file becuase this file is used for creating parcel */
 // const loginForm = document.querySelector('.form');
 // loginForm.addEventListener('submit', e => {
 //   e.preventDefault(); //it prevents from loading any other page
 //   const email = document.getElementById('email').value;
 //   const password = document.getElementById('password').value;
 //   login(email, password);
 // });


/*eslint-disable */ 
const $4659294995b47e1b$export$7200a869094fec36 = async (email, name, password, confirmPassword)=>{
    //exporting the login function
    try {
        const res = await (0, (/*@__PURE__*/$parcel$interopDefault($4829bbf1aa53fe26$exports)))({
            method: "POST",
            //url: 'http://127.0.0.1:8000/api/v1/users/signup', //this is our login endpoint
            url: `${process.env.BASE_URL}/api/v1/users/signup`,
            //now sending data along with the request in the body
            data: {
                email: email,
                name: name,
                password: password,
                confirmPassword: confirmPassword
            }
        });
        //**After successful login we are going to jump to the main tour page from login page */
        if (res.data.status === "success") {
            //we are checking that this login function actual succed or not by getting the status message that we actually setup in our api
            alert("Logged in successfully");
            window.setTimeout(()=>{
                //if user data is correct then we will direct the user to overview page
                location.assign("/"); //after succefull login we will change the login page to '/' overview page after 1.5seconds
            }, 1500);
        }
    } catch (err) {
        // console.log(err.response.data.message);
        alert(err.response.data.message);
    }
};


/* eslint-disable */ // const locations = JSON.parse(document.getElementById('map').dataset.locations);
const $ec62aceef3f8b9ee$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoiYW1iaWthcHJhc2FkIiwiYSI6ImNsZzd1bGowNzByNGMzZG83dHRvZGNkOG8ifQ.voAu4NXgxcQFAxrULbM1Ww";
    const map = new mapboxgl.Map({
        container: "map",
        // style: 'mapbox://styles/mapbox/streets-v12', // style URL. This was the default style and now we can costomize it
        style: "mapbox://styles/ambikaprasad/clg7ve7ez000i01ok8fzjrhag",
        scrollZoom: false
    });
    const nav = new mapboxgl.NavigationControl(); //this will add a navigation control
    map.addControl(nav, "top-right");
    //we are able to use mapboxgl becuase in tour.pug we have used script that allow us to use mapbox library
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        //create marker
        const el = document.createElement("div");
        el.className = "marker";
        //add the marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        //Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        //Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    }); //fitBounds moves and zooms right to the bounds to actually fit them
};


/*eslint-disable */ // import axios from 'axios';

const $e123b3528abadfc1$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await (0, (/*@__PURE__*/$parcel$interopDefault($4829bbf1aa53fe26$exports)))({
            method: "GET",
            // url: 'http://127.0.0.1:8000/api/v1/users/logout'
            url: `${process.env.BASE_URL}/api/v1/users/logout`
        });
        if (res.data.status === "success") location.reload(true); //this will reload data from server and not from browser cache
    } catch (err) {
        alert("not able to logout");
    }
}; // const logoutbtn = document.querySelector('.nav__el--logout');
 // if (logoutbtn) {
 //   logoutbtn.addEventListener('click', logout);
 // }


/*eslint-disable */ //update data

const $25dbe5dc881011d2$export$8ddaddf355aae59c = async (data, type)=>{
    try {
        const url = type === "password" ? `${process.env.BASE_URL}/api/v1/users/updateMyPassword` : `${process.env.BASE_URL}/api/v1/users/updateMe`;
        const res = await (0, (/*@__PURE__*/$parcel$interopDefault($4829bbf1aa53fe26$exports)))({
            method: "PATCH",
            // now depending on the type string we are going to decide the url
            // url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
            url: url,
            data: // data: {
            //   name: name,
            //   email: email
            // }
            data
        });
        if (res.data.status === "success") // console.log(user);
        alert(`${type.toUpperCase()} updated successfully`);
    } catch (err) {
        console.log(err.response.data.message);
    }
};


// const span = document.querySelector('span'); //this is how we can get the use data here in javascript
// console.log(span.dataset.value);
//DOM ELEMENTS
const $8976785d36b1dc90$var$mapBox = document.getElementById("map");
const $8976785d36b1dc90$var$loginForm = document.querySelector(".form--login");
const $8976785d36b1dc90$var$signupForm = document.querySelector(".form--signup");
const $8976785d36b1dc90$var$logoutbtn = document.querySelector(".nav__el--logout");
const $8976785d36b1dc90$var$userDataForm = document.querySelector(".form-user-data");
const $8976785d36b1dc90$var$userPasswordForm = document.querySelector(".form-user-password");
//DELAGATION
if ($8976785d36b1dc90$var$mapBox) {
    const locations = JSON.parse($8976785d36b1dc90$var$mapBox.dataset.locations);
    (0, $ec62aceef3f8b9ee$export$4c5dd147b21b9176)(locations);
}
if ($8976785d36b1dc90$var$loginForm) $8976785d36b1dc90$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault(); //it prevents from loading any other page
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $896fce0a0eaf741b$export$596d806903d1f59e)(email, password);
});
//signup
if ($8976785d36b1dc90$var$signupForm) $8976785d36b1dc90$var$signupForm.addEventListener("submit", (e)=>{
    e.preventDefault(); //it prevents from loading any other page
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    (0, $4659294995b47e1b$export$7200a869094fec36)(email, name, password, confirmPassword);
});
if ($8976785d36b1dc90$var$logoutbtn) $8976785d36b1dc90$var$logoutbtn.addEventListener("click", (0, $e123b3528abadfc1$export$a0973bcfe11b05c9));
if ($8976785d36b1dc90$var$userDataForm) $8976785d36b1dc90$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    //for uploading image we need to create a new form and axios will consider this form as an object
    const form = new FormData(); //this is called multipart form data
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]); //for photo it is present in files and files is an array which contains only one photo so [0]
    // updateMe({ name, email }, 'data');
    (0, $25dbe5dc881011d2$export$8ddaddf355aae59c)(form, "data");
});
if ($8976785d36b1dc90$var$userPasswordForm) $8976785d36b1dc90$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password-confirm").value;
    await (0, $25dbe5dc881011d2$export$8ddaddf355aae59c)({
        passwordCurrent: passwordCurrent,
        password: password,
        confirmPassword: confirmPassword
    }, "password"); //after we have successfully changed the password we need to clear the filds
    document.querySelector(".btn--save-password").textContent = "Save passowrd";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});


//# sourceMappingURL=bundle.mjs.map
