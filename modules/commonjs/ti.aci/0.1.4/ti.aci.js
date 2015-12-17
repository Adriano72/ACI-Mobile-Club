(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ti || (g.ti = {})).aci = f()}})(function(){var define,module,exports;return (function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a=typeof require=="function"&&require;if(!u&&a)return a.length===2?a(i,!0):a(i);if(s&&s.length===2)return s(i,!0);if(s)return s(i);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}var i=Array.prototype.slice;Function.prototype.bind||Object.defineProperty(Function.prototype,"bind",{enumerable:!1,configurable:!0,writable:!0,value:function(e){function r(){return t.apply(this instanceof r&&e?this:e,n.concat(i.call(arguments)))}if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=this,n=i.call(arguments,1);return r.prototype=Object.create(t.prototype),r.prototype.contructor=r,r}});var s=typeof require=="function"&&require;for(var u=0;u<r.length;u++)o(r[u]);return o})({1:[function(require,module,exports){
(function (clearTimeout,setTimeout){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

}).call(this,require("--timers--").clearTimeout,require("--timers--").setTimeout)
},{"--timers--":14}],2:[function(require,module,exports){
(function (console){
/**
 * # Configurator
 * *[ti-ACI](index.js.html) ›*
 * 
 * Modulo che offre ad altri moduli delle funzionalità per la gestione delle configurazioni
 */

var utils = require('./utils');
var _ = require('underscore');


/**
 * ## ConfigScope
 * Definisce lo scope di un gestore di configurazione
 */
function ConfigScope() {

    var data = {};


    /**
     * ### getConfig
     * Funzione getter per le chiavi di configurazione.
     * Ha due modalità di funzionamento:
     *  1) get() ritorna il set completo di configurazioni
     *  2) get(key) ritorna il valore della chiave selezionata
     *     key può essere scritta in notazione puntata, quindi
     *  	get('la.mia.chiave') equivale a data['la']['mia']['chiave']
     * @param  {string|undefined} key chiave da leggere
     * @param  {object} def valor di default
     * @return {object}     valore della chiave
     */
    this.getConfig = function(key, def) {

        if (utils.is('undefined', key)) {
            return data;
        } else {

            // courtesy of http://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
            var schema = data;
            var pList = key.split('.');
            var len = pList.length;
            for (var i = 0; i < len - 1; i++) {
                var elem = pList[i];
                if (!schema[elem]) schema[elem] = {};
                schema = schema[elem];
            }

            var res = schema[pList[len - 1]]
            return utils.is('undefined', res) ? def : res;
        }
    }

    /**
     * ### setConfig
     * Funzione setter per le chiavi di configurazione
     * Ha due modalità di funzionamento:
     * 	1) set(key, value) dove key è una stringa e value qualsiasi valore
     * 	   key è definita in notazione puntata, quindi possiamo scrivere
     * 	     set('la.mia.chiave', 5) ed ottenere data['la']['mia']['chaive'] = 5
     * 	2) set(obj) dove obj è un {} contenente l'intero set di configurazioni. Esegue l'extend dell'oggetto.
     */
    this.setConfig = function() {
        if (utils.is('string', arguments[0])) {
            //caso 1: scrivo il valore per la chiave corrente
            var path = arguments[0],
                value = arguments[1];

            // courtesy of http://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
            var schema = data;
            var pList = path.split('.');
            var len = pList.length;
            for (var i = 0; i < len - 1; i++) {
                var elem = pList[i];
                if (!schema[elem]) schema[elem] = {};
                schema = schema[elem];
            }

            schema[pList[len - 1]] = value;


        } else if (utils.is('object', arguments[0])) {
            //caso 2: sovrascrivo il set di configurazione
            console.warn('configurator set - sovrascrivo tutte le configurazioni');
            data = _.extend({}, data, arguments[0]);
        } else {
            //caso non gestito
            //   throw 'configurator set - tipo parametri non valido';
            console.error('configurator set - tipo parametri non valido');
        }
    }

    /**
     * ### removeConfig
     * Rimuove una configurazione
     * è un wrapper di setConfig
     * @param  {string|undefined} key chiave da rimuovere
     */
    this.removeConfig = function(key) {
        this.setConfig(key, undefined);
    }

    /**
     * ### removeConfig
     * Rimuove TUTTE le chiavi di configurazione
     * è un wrapper di setConfig
     * @param  {string|undefined} key chiave da rimuovere
     */
    this.clearConfig = function(key) {
        data = {};
    }

}








//
// ## PUBLIC API
// 


/**
 * ### createConfigurator
 * Factory method per un nuovo configurator
 * @return {EventManagerScope} oggetto event manager
 */
exports.createConfigurator = function() {

    return new ConfigScope();

};

/**
 * ### extendObjectWithConfigurator
 * Dato un oggetto, lo estende con le funzionalità della gestione configurazione
 * @param  {object} o oggetto da estendere
 * @return {object} l'oggetto configurator
 */
exports.extendObjectWithConfigurator = function(o) {
    var em = new ConfigScope();

    o.setConfig = em.setConfig;
    o.getConfig = em.getConfig;
    o.removeConfig = em.removeConfig;

    return em;
};
}).call(this,require("--console--"))
},{"--console--":20,"./utils":11,"underscore":1}],3:[function(require,module,exports){
/**
 * # EventManager
 * *[ti-ACI](index.js.html) ›*
 * 
 * Modulo che astrae la gestione degli eventi. 
 * Si usa per implementare il meccanismo ad eventi in altri moduli
 */

//dipendenze
var _ = require('underscore');


/**
 * ## EventManagerScope
 * Definisce lo scope di un gestore di eventi
 */
function EventManagerScope() {

    //scaffold degli eventi
    // strutturato come un hash nella forma
    // "nome evento" : [array degli handler]
    var handlers = {};

    /**
     * Getter per gli handler
     * @param {string} type nome dell'evento
     * @return {array} array degli handler associati all'evento
     */
    this.getHandlers = function(type) {
        return handlers[type] || [];
    };

    /**
     * Setter per gli handler
     * @param {string} type nome dell'evento
     * @return {array} h array degli handler associati all'evento
     */
    this.setHandlers = function(type, h) {
        handlers[type] = h;
    };

}

/**
 * ### addEventListener
 * Aggiunge un handler ad un evento
 * @param {string} type nome dell'evento
 * @param {Function} cb handler
 */
EventManagerScope.prototype.addEventListener = function(type, cb) {
    //aggiungo la callback al dizionario degli handler
    var handlers = this.getHandlers(type);

    if (handlers) {
        handlers.push(cb);
        this.setHandlers(type, handlers);
    }

};

/**
 * ### removeEventListener
 * Rimuove un handler da un evento
 * @param {string} type nome dell'evento
 * @param {Function} cb handler
 */
EventManagerScope.prototype.removeEventListener = function(type, cb) {
    //rimuovo la callback dal dizionario degli handler
    var handlers = this.getHandlers(type);
    if (handlers) {
        var index = _(handlers[type]).indexOf(cb);
        if (index > 0) {
            handlers[type].splice(index, 1);
            this.setHandlers(type, handlers);
        }
    }
};

/**
 * ### removeAllEventListeners
 * Rimuove TUTTI gli handler di un evento
 * @param {string} type nome dell'evento
 */
EventManagerScope.prototype.removeAllEventListeners = function(type) {
    //rimuovo TUTTE le callback dal dizionario degli handler
    this.setHandlers(type, []);
};

/**
 * ### fireEvent
 * Scatena un evento
 * @param {string} type nome dell'evento
 * @param {object} args argomenti da passare agli handler
 */
EventManagerScope.prototype.fireEvent = function(type, args) {
    var handlers = this.getHandlers(type);

    handlers.forEach(function(cb) {
        cb && cb(args);
    });
};





//
// ## PUBLIC API
// 


/**
 * ### createEventManager
 * Factory method per un nuovo event manager
 * @return {EventManagerScope} oggetto event manager
 */
exports.createEventManager = function() {

    return new EventManagerScope();

};

/**
 * ### extendObjectWithEventManager
 * Dato un oggetto, lo estende con le funzionalità della gestione eventi
 * @param {object} o oggetto da estendere
 * @param {EventManagerScope} em (opzionale) event manager da cui estendere i metodi. Se non definito, viene creato un nuovo event manager implicito
 * @return {object} lo stesso oggetto, esteso
 */
exports.extendObjectWithEventManager = function(o, em) {
    em = em || new EventManagerScope();


    _(['addEventListener', 'removeEventListener', 'removeAllEventListeners', 'fireEvent']).each(function(e) {
        o[e] = _(em[e]).bind(em);
    });
    /*    o.addEventListener = em.addEventListener;
    o.removeEventListener = em.removeEventListener;
    o.removeAllEventListeners = em.removeAllEventListeners;
    o.fireEvent = em.fireEvent; */

    return o;
};
},{"underscore":1}],4:[function(require,module,exports){
/**
 * # ti-ACI
 * *© ACI Informatica 2015*
 *
 * ti-ACI è una libreria che raccoglie utility e componenti UI utilizzabili da tutte le applicazioni Titanium.
 * index.js è il file principale della libreria, nel quale vengono esposti i sotto-moduli
 */


//
// ## Moduli
//

// ### PushNotification
// Gestione delle notifiche push cross-platform *[leggi documentazione](pushnotification.js.html)*.
exports.PushNotification = require('./pushnotification');

// ### EventManager
// Modulo per l'implementazione di pattern ad eventi *[leggi documentazione](eventmanager.js.html)*.
exports.EventManager = require('./eventmanager');

// ### REST
// Client per chiamate HTTP *[leggi documentazione](rest.js.html)*.
exports.REST = require('./rest');

// ### Services
// Raccoglie le API ai webservices offerti da ACI Informatica *[leggi documentazione](services/index.js.html)*.
exports.Services = require('./services');

// ### Utils
// Funzioni di utilità *[leggi documentazione](utils.js.html)*.
exports.Utils = require('./utils');
},{"./eventmanager":3,"./pushnotification":5,"./rest":6,"./services":8,"./utils":11}],5:[function(require,module,exports){
(function (console){
/**
 * # PushNotification
 * *[ti-ACI](index.js.html) ›*
 * 
 * Modulo per la gestione delle push notification
 * generalizza il comportamento tra le piattaforme e tiene traccia dei token
 */

var deviceToken;

var OS_IOS = Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad';
var OS_ANDROID = Ti.Platform.osname === 'android';

var r = function(p) {
    return require(p);
}

var Cloud = r("ti.cloud");

/**
 * Callback da chiamare quando ri riceve una push notification
 * @param  {[type]} e [description]
 */
function onNotification(e) {
    console.log('retrieveDeviceToken, onNotification', e);

    var data = OS_IOS ? e.data : JSON.parse(e.payload);

    console.log('retrieveDeviceToken, data', data);


    //richiamo gli handler dell'app associati alla notifica
    // gli handler sono nella forma 
    notify(data.type, {
        content: data.content,
        source: data
    });

    /*
    if (OS_IOS) {
        var badge = Math.max(0, Titanium.UI.iPhone.getAppBadge() - 1);
        Titanium.UI.iPhone.setAppBadge(badge);

        Cloud.PushNotifications.setBadge({
            device_token: deviceToken,
            badge_number: badge
        }, function(r, p) {
            console.log('setBadge', r, p);
        });
    }
    */
}




/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 * @return {[type]} [description]
 */
function retrieveDeviceToken(cb) {

    var types = OS_IOS ? [
        Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
    ] : undefined;


    function onSuccess(e) {
        console.log('retrieveDeviceToken, success', e);
        deviceToken = e.deviceToken;
        cb && cb(null, e);
    }

    function onError(e) {
        console.log('retrieveDeviceToken, error', e);
        cb && cb(e);

    }

    function requestToken() {
        console.log('requestToken');
        if (OS_IOS) {

            Ti.Network.registerForPushNotifications({
                success: onSuccess,
                error: onError,
                types: types,
                callback: onNotification
            });

        } else if (OS_ANDROID) {

            var cp = r('ti.cloudpush');

            cp.retrieveDeviceToken({
                success: onSuccess,
                error: onError
            });

            cp.addEventListener('callback', onNotification);

        } else {
            //non supportiamo altre piattaforme al momento
            onError('piattaforma non supportata');
        }
    }


    if (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
        // Wait for user settings to be registered before registering for push notifications
        Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
            console.log('requestToken usernotificationsettings');

            // Remove event listener once registered for push notifications
            Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

            requestToken();
        });

        console.log('requestToken registerUserNotificationSettings');

        // Register notification types to use
        Ti.App.iOS.registerUserNotificationSettings({
            types: types
        });
    } else {
        requestToken();
    }


}




function subscribeToChannel(channel, cb) {
    // Subscribes the device to the 'news_alerts' channel
    // Specify the push type as either 'android' for Android or 'ios' for iOS
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: channel,
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function(e) {
        if (e.success) {
            cb && cb();
        } else {
            //alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
            console.error('subscribeToChannel', e);
        }
    });
}

function unsubscribeToChannel(channel, cb) {
    // Unsubscribes the device from the 'test' channel
    Cloud.PushNotifications.unsubscribeToken({
        device_token: deviceToken,
        channel: channel,
    }, function(e) {
        if (e.success) {
            cb && cb();
        } else {
            // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
            console.error('unsubscribeToChannel', e);
        }
    });
}



/**
 * Gestione degli eventi
 * Le notifiche possono essere gestite dall'app trasmite un meccanismo di eventi globali
 * Le seguenti funzioni simulano il meccanismo nativo di gestione degli eventi
 */


var NotificationEventManager = require("./eventmanager").createEventManager();


function addNotificationListener(type, cb) {
    NotificationEventManager.addEventListener(type, cb);
};

function removeNotificationListener(type, cb) {
    NotificationEventManager.removeEventListener(type, cb);
}

function notify(type, args) {
    NotificationEventManager.fireEvent(type, args);
}






/**
 * Public API
 */

/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 */
exports.retrieveDeviceToken = retrieveDeviceToken;
exports.subscribeToChannel = subscribeToChannel;
exports.unsubscribeToChannel = unsubscribeToChannel;
exports.addNotificationListener = addNotificationListener;
exports.removeNotificationListener = removeNotificationListener;
Object.defineProperty(exports, "deviceToken", {
    get: function() {
        return deviceToken;
    }
});
}).call(this,require("--console--"))
},{"--console--":20,"./eventmanager":3}],6:[function(require,module,exports){
(function (console){
/**
 * # REST
 * *[ti-ACI](index.js.html) ›*
 *
 * Modulo che offre servizi comuni per le chiamate rest alle api remote
 * @author Emanuele De Cupis
 */

//
// ## Private members
//

var _ = require('underscore');

/**
 * ### call
 * Funzione generica per eseguire una chiamata rest
 * @param {string} url  url a cui indirizzare la chiamata
 * @param {string} method  metodo http della chiama
 * @param {object} parameters [parametri da allegare alla chiamata. Se non ci sono parametri, specificare `null`
 * @param {Function} callback callback di risposta nel formato function(err, result)
 * @param {object} headers (opzionale) eventuali intestazioni della richiesta http
 * @param {string|Function} parser (opzionale) metodo usato per elaborare le risposte alle chiamate. Può essere una stringa, in tal caso sarà il nome di un parser di defalt.
 *                                 Altrimenti può essere una funzione del tipo `fn(xhr)` dove `xhr` è il client http. Default: `json`.
 */
function call(url, method, parameters, callback, headers, parser) {


    console.log("ti.aci rest call ", url, method, parameters);



    var xhr = Titanium.Network.createHTTPClient();



    /**
     * #### onerror
     * Definisco il gestore dell'errore
     * @param {[type]} e [description]
     * @return {[type]} [description]
     */
    xhr.onerror = function(e) {
        console.error("ti.aci rest xhr onError ", JSON.stringify(e), this.message);

        if (callback) {
            e.message = this.message;
            callback(e);
        }
    };


    /**
     * #### onload
     * Definisco il gestore per il caricamento della risposta
     * @param {[type]} e [description]
     * @return {[type]} [description]
     */
    xhr.onload = function(e) {

        console.log("ti.aci rest xhr onSuccess");


        try {

            var parserLambda = getParser(parser);
            var currentObject = parserLambda(this);

            if (callback) {

                if (callback) {
                    callback(null, currentObject);
                }

            }
        } catch (ex) {
            console.log("ti.aci rest xhr onSuccess error", ex);
            if (callback) {
                callback(e);
            }
        }



    };




    //formatta url e parametri a seconda del tipo di richiesta
    if (method.toUpperCase() == "GET") {
        var qs = toQueryString(parameters);
        if (qs) {
            var sep = url.indexOf('?') >= 0 ? '&' : '?';
            url = url + sep + qs;
        }
        parameters = undefined;
    } else {
        // parameters = JSON.stringify(parameters);
    }                                                            

    console.log('rest ', method, url, headers);
    xhr.open(method, url);


    //aggiungo gli eventuali header
    //bisogna farlo tra open() e send()!
    // https://twitter.com/balanza/status/560108493945192449
    for (var k in headers) {
        if (headers.hasOwnProperty(k)) {
            var h = headers[k];
            xhr.setRequestHeader(k, h);
        }
    }



    xhr.send(parameters);

};


/**
 * ### parserLibrary
 * Set di funzioni parser utilizzabili per la post-elaborazione dei dati di una chiamata
 */
var parserLibrary = {
    json: function(xhr) {
        return JSON.parse(xhr.responseText);
    },
    raw: function(xhr) {
        return xhr.responseText;
    }
};

/**
 * ### getParser
 * @param {string|Function} parser
 * @return {Function} Funzione parser del tipo `fn(xhr)`, dove `xhr` è il client http.
 */
function getParser(parser) {
    //parser json è il default
    parser = parser || 'json';
    //se parser è una funzione, è il parser stesso
    if (_.isFunction(parser)) return parser;
    //altrimenti `parser` è la stringa che identifica il parser della libreria
    else return parserLibrary[parser] || _.noop();
}


//
// ## Public API
//

/**
 * ### defineParser
 * Aggiunge (o modifica) una funzione di parsing alla `parserLibrary`
 * @param {string} name nome identificativo del parser
 * @param {Function} lambda funzione del parser
 */
exports.defineParser = function(name, lambda) {
    if (_.isString(name) && _.isFunction(lambda)) {
        parserLibrary[name] = lambda;
    } else {
        throw 'ti.aci rest defineParser: parametri non validi';
    }
};


/**
 * Utility che formatta una coppia username/password in un token valido per l'autenticazione http basic
 * http://it.wikipedia.org/wiki/Basic_access_authentication#Lato_Client
 * @param {string} username
 * @param {string} password
 * @return {string}   token formattato secondo le specifiche
 */
exports.formatBasicAuthentication = function(username, password) {
    return 'Basic ' + Ti.Utils.base64encode(username + ':' + password);
}

/**
 * Utility per il parsing della url
 * playground: http://jsbin.com/rijiha/1/edit?html,js,console
 * @param {string} url url da esaminare
 * @return {object}  hash con le parti della url
 */
exports.parseUrl = function(url) {
    var r = /^((http[s]?|ftp):\/)?\/?(([\w\-\.]+):([\w\-\.\$]+)@)?([^:\/\s]+)((\/\w+)*?(:([0-9]+))\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    var tmp = r.exec(url);

    return {
        original: tmp[0],
        protocol: tmp[2],
        username: tmp[4],
        password: tmp[5],
        host: tmp[6],
        port: tmp[10],
        path: tmp[11],
        query: tmp[12]
    };
};

function toQueryString(obj) {

    var params = _.map(obj, function(value, key) {
        var v = _.isObject(value) ? JSON.stringify(value) : encodeURIComponent(value);
        return key + '=' + v;
    });

    return params.join('&');
}


/**
 * Shorthand di call() per eseguire chiamate GET
 * @param {string} url  url a cui indirizzare la chiamata
 * @param {object} parameters [parametri da allegare alla chiamata]
 * @param {Function} callback callback di risposta nel formato function(err, result)
 * @param {object} headers eventuali intestazioni della richiesta http
 * @param {string|Function} parser (opzionale) metodo usato per elaborare le risposte alle chiamate. Può essere una stringa, in tal caso sarà il nome di un parser di defalt.
 *                                 Altrimenti può essere una funzione del tipo `fn(xhr)` dove `xhr` è il client http. Default: `json`.
 */
exports.get = function(url, parameters, callback, headers, parser) {
    call(url, 'GET', parameters, callback, headers, parser);
};

/**
 * Shorthand di call() per eseguire chiamate POST
 * @param {string} url  url a cui indirizzare la chiamata
 * @param {object} parameters [parametri da allegare alla chiamata]
 * @param {Function} callback callback di risposta nel formato function(err, result)
 * @param {object} headers eventuali intestazioni della richiesta http
 * @param {string|Function} parser (opzionale) metodo usato per elaborare le risposte alle chiamate. Può essere una stringa, in tal caso sarà il nome di un parser di defalt.
 *                                 Altrimenti può essere una funzione del tipo `fn(xhr)` dove `xhr` è il client http. Default: `json`.
 */
exports.post = function(url, parameters, callback, headers, parser) {
    call(url, 'POST', parameters, callback, headers, parser);
};

/**
 * Shorthand di call() per eseguire chiamate PUT
 * @param {string} url  url a cui indirizzare la chiamata
 * @param {object} parameters [parametri da allegare alla chiamata]
 * @param {Function} callback callback di risposta nel formato function(err, result)
 * @param {object} headers eventuali intestazioni della richiesta http
 * @param {string|Function} parser (opzionale) metodo usato per elaborare le risposte alle chiamate. Può essere una stringa, in tal caso sarà il nome di un parser di defalt.
 *                                 Altrimenti può essere una funzione del tipo `fn(xhr)` dove `xhr` è il client http. Default: `json`.
 */
exports.put = function(url, parameters, callback, headers, parser) {
    call(url, 'PUT', parameters, callback, headers, parser);
};
}).call(this,require("--console--"))
},{"--console--":20,"underscore":1}],7:[function(require,module,exports){
(function (console){
/**
 * # Acigeo
 * *[ti-ACI](../index.js.html) › [Services](index.js.html) ›* 
 * 
 * Modulo che implementa le chiamate ai servizi Acigeo
 */


//
// ## Private members
//

var rest = require('../rest');
var utils = require('../utils');
var configurator = require('../configurator');
var _ = require('underscore');


//estendo il modulo acigeo con la gestione delle configurazioni
var config = configurator.extendObjectWithConfigurator(exports);

//imposto le configurazioni di default
config.setConfig({
    'base_url': 'http://www.aci.it/geo/v2'
});




/**
 * ### endpoint
 * Formatta la url dell'endpoint per la richiesta
 * Unisce al path fornito il base url delle configurazioni
 * @param  {} path [description]
 * @return {[type]}      [description]
 */
function endpoint(path) {
    return config.getConfig('base_url') + path;
}





/**
 * ### buildHeaders
 * Prepara gli headers http da inviare ad ogni richiesta
 * @return {[type]} [description]
 */
function buildHeaders() {
    var headers = config.getConfig('headers');
    var res = {};
    for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
            var value = headers[key];
            if (utils.is('function', value)) {
                res[key] = value();
            } else if (!utils.is('undefined', value)) {
                res[key] = value;
            }
        }
    }

    return res;
}


//
// ## Public API
//

/**
 * ### syc
 * ottiene la lista dei punti syc
 * Parametri:
 *
 *     - `type_code`: il tipo dei syc da cercare. Cerca su tutti i tipi se non specificato
 *
 *     - `publishDateRange`: range di date riferite alla pubblicazione, estremi inclusi. Il campo ha la forma [from,to], se uno dei due valori è nullo non considera quel filtro
 *                         es: [from,null] ritorna i syc con publishAt>=to
 *
 *     - `province`: obbligatorio se non si specifica near, è l'id della provincia di riferimento
 *
 *     - `near`: obbligatorio se non si specifica province, è il punto su cui ordinare i punti. Array nel formato [lat, lon, range]
 *
 *     - `limit`: default 0, è il numero massimo di risultati da ritornare
 *
 *     - `skip`: default 0, è il numero di risultati da saltare
 * @param {object} params parametri della risposta
 * @param {Function} cb callback nel formato cb(err, res)
 */
exports.syc = function(params, cb) {

    //
    // Validazione parametri:
    //

    // - province o near obbligatori e ben formati
    if (!params.province && !params.near) {
        cb('acigeo syc - parametri non validi - specificare almeno uno tra "province" e "near"');
        return;
    } else if (params.near && (!utils.is('array', params.near) || !params.near.length)) {
        cb('acigeo syc - parametri non validi - "near" deve essere un array nella forma [lat, lon, range]');
        return;
    }

    // - range data di pubblicazione bene formato
    if (params.publishDateRange && (!utils.is('array', params.publishDateRange) || !params.publishDateRange.length)) {
        cb('acigeo syc - parametri non validi - "publishDateRange" deve essere un array nella forma [from,to]');
        return;
    }

    //
    // Composizione query
    //
    var queryDefaults = {
        query: {
            "status": "ok",
            "agreement_id.status": "ok"
        },
        limit: params.limit || 0,
        skip: params.skip || 0
    };
    var queryParams = utils.mapHash(params, {
        type_code: function(v, q) {
            if (!q.query) q.query = {};
            q.query['agreement_id.categories.short_name'] = v;
        },
        province: function(v, q) {
            if (!q.query) q.query = {};
            q.query['address.province._id'] = v;
        },
        near: function(v, q) {
            q.near = {
                point: [v[0], v[1]],
                max: v[2]
            };
            q.populate = 1;
        },
        publishDateRange: function(v, q) {
            var from = v[0];
            var to = v[1];
            if (from) {
                utils.setHashValue(q, 'query.publishAt.$gte', from);
            }
            if (to) {
                utils.setHashValue(q, 'query.publishAt.$lte', to);
            }

        }
    });
    var query = _.extend({}, queryDefaults, queryParams);

    //
    //headers
    //
    var headers = buildHeaders();

    //eseguo la chiamata
    rest.get(endpoint('/aci/pos'), query, cb, headers);

}

/**
 * ### puntiAci
 * ottiene la lista dei punti aci.
 * Parametri:
 *
 *     - `type_code`: il tipo di punto aci da cercare. Può essere una stringa con un singolo _type_code_, oppure un array con una lista di _type_code_. Obbligatorio se non si specifica `service` o `customServices`.
 *
 *     - `services`: denominazione del servizio GIC, per effettuare la ricerca per servizio. Obbligatorio se non si specifica `type_code` o `customServices`.
 *
 *     - `customServices`: denominazione del servizio non-GIC, per effettuare la ricerca per servizio. Obbligatorio se non si specifica `type_code` o `services`.
 *
 *     - `province`: obbligatorio se non si specifica near, è l'id della provincia di riferimento
 *
 *     - `near`: obbligatorio se non si specifica province, è il punto su cui ordinare i punti. Array nel formato [lat, lon, range]
 *
 *     - `limit`: default 0, è il numero massimo di risultati da ritornare
 *
 *     - `skip`: default 0, è il numero di risultati da saltare
 * @param {object} params parametri della risposta
 * @param {Function} cb callback nel formato cb(err, res)
 */
exports.puntiAci = function(params, cb) {

    //
    // Validazione parametri:
    //

    // - `type_code` o `service` o `customService` obbligatori
    if (!params.type_code && !params.services && !params.customServices) {
        cb('acigeo getPuntiAci - parametri non validi - specificare almeno uno tra "type_code" e "gic"');
        return;
    }

    // - `province` o `near` obbligatori e ben formati
    if (!params.province && !params.near) {
        cb('acigeo syc - parametri non validi - specificare almeno uno tra "province" e "near"');
        return;
    } else if (params.near && (!utils.is('array', params.near) || !params.near.length)) {
        cb('acigeo syc - parametri non validi - "near" deve essere un array nella forma [lat, lon, range]');
        return;
    }


    //Se non ho specificato `type_code` ma ho specificato uno tra `service` e `customService`, eseguo la ricerca su dei tipi di punti aci predefiniti
    if (!params.type_code && (params.services || params.customServices)) {
        params.type_code = ['del', 'aacc', 'r2g', 'pra', 'urp', 'tasse'];
    }


    //
    // Formattazione parametri
    //


    var queryDefaults = {
        query: {
            status: "ok"
        },
        limit: params.limit || 0,
        skip: params.skip || 0
    };
    var queryParams = utils.mapHash(params, {
        type_code: function(v, q) {
            if (!q.query) q.query = {};

            if (_.isArray(v)) {
                q.query["$or"] = _(v).map(function(e) {
                    return {
                        _type: e
                    };
                });

            } else {
                q.query['_type'] = v;
            }

        },
        services: function(v, q) {
            if (!q.query) q.query = {};
            q.query.services = v;
        },
        customServices: function(v, q) {
            if (!q.query) q.query = {};
            q.query.customServices = v;
        },
        province: function(v, q) {
            if (!q.query) q.query = {};
            q.query['address.province._id'] = v;
        },
        near: function(v, q) {
            q.near = {
                point: [v[0], v[1]],
                max: v[2]
            };
            q.populate = 1;
        }
    });
    var query = utils.deepExtend({}, queryDefaults, queryParams);
    console.log('query', query, queryDefaults, queryParams);
    //
    // Headers:
    //
    var headers = buildHeaders();

    //eseguo la chiamata
    rest.get(endpoint('/aci/pos'), query, cb, headers);
}


/**
 * ### demolitori
 * Ritorna l'elenco dei demolitori
 * @param  {[type]}   params [description]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
exports.demolitori = function(params, cb) {
    utils.methodNotImplemented('acigeo.demolitori');
}

/**
 * ### banner
 * @param  {[type]}   params [description]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
exports.banner = function(params, cb) {
    utils.methodNotImplemented('acigeo.banner');
}

/**
 * ### province
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
exports.province = function(cb) {
    utils.methodNotImplemented('acigeo.province');
}

/**
 * ### registerApp
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
exports.registerApp = function(cb) {
    utils.methodNotImplemented('acigeo.registerApp');
}

/**
 * ### registerAppForPushNotification
 * @param  {[type]}   token    [description]
 * @param  {[type]}   userInfo [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
exports.registerAppForPushNotification = function(token, userInfo, cb) {
    utils.methodNotImplemented('acigeo.registerAppForPushNotification');
}
}).call(this,require("--console--"))
},{"--console--":20,"../configurator":2,"../rest":6,"../utils":11,"underscore":1}],8:[function(require,module,exports){
exports.acigeo = require('./acigeo');
exports.praTasse = require('./pratasse');
exports.praTasse = require('./pratasse');
exports.SSO = require('./sso');
},{"./acigeo":7,"./pratasse":9,"./sso":10}],9:[function(require,module,exports){
/**
 * # PraTasse
 * *[ti-ACI](../index.js.html) › [Services](index.js.html) ›*
 *
 * Modulo che esegue le chiamate rest al servizio PraTasse
 */

var rest = require('../rest');
var configurator = require('../configurator');
var _ = require('underscore');



//estendo il modulo acigeo con la gestione delle configurazioni
var config = configurator.extendObjectWithConfigurator(exports);

//imposto le configurazioni di default
config.setConfig({
    'base_url': 'http://10.64.2.234:80/servizipratasse/rest'
});


/**
 * ### endpoint
 * Formatta la url dell'endpoint per la richiesta
 * Unisce al path fornito il base url delle configurazioni
 * @param {string} path [description]
 * @return {string} [description]
 */
function endpoint(path) {
    return config.getConfig('base_url') + path;
}


/**
 * ### normalizeCallback
 * Normalizza l'utilizzo delle callback, permettendo di utilizzare sia la notazione "nodejs" `cb=function(err, result){}` oppure la notazione "jquery" `cb={success:function(){}, error:function(){}}`.
 * Funziona come wrapper di una callback.
 *
 * @param {Function} cb callback da wrappare
 * @return {Function} callback che effettivamente viene passata al servizio SSO.
 */
function normalizeCallback(cb) {
    //Se `cb` è un oggetto che contiene due callback (`error` e `success`), ritorno un wrapper
    if (_.isObject(cb) && cb.error && cb.success) {
        return function(err, res) {
            if (err) {
                cb.error(err);
            } else {
                cb.success(res);
            }
        }
    }
    //Altrimenti ritorno `cb` stesso
    else {
        return cb;
    }
}


//
// ## Public API
//

exports.tipoVeicolo = {
	"AUTOVEICOLO": 1,
	"MOTOVEICOLO": 4,
	"AUTOCARRO": 2
};


/**
 * ### situazioneFiscale
 * @param {string} targa [description]
 * @param {[type]} serieTarga [description]
 * @param {string} token token sso
 * @param {Function} cb
 */
exports.situazioneFiscale = function(targa, serieTarga, token, cb) {

    var params = {
        serieTarga: serieTarga,
        targa: targa,
        pagina: 1,
        elementiPerPagina: 20
    };
    var headers = {
        'srvpt-session-id': token
    };
    rest.get(endpoint('/aci/secured/vistaTributarioPerTarga'), params, normalizeCallback(cb), headers);

};


/**
 * ### listVehicle
 * @param  {[type]}   token [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
exports.listVehicle = function(token, cb) {

    var headers = {
        'srvpt-session-id': token
    };

    rest.get(endpoint('/pra/secured/veicolo'), null, normalizeCallback(cb), headers);

};

/**
 * ### detailsVehicle
 * @param  {[type]}   targa      [description]
 * @param  {[type]}   serieTarga [description]
 * @param  {[type]}   token      [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
exports.detailsVehicle = function(targa, serieTarga, token, cb) {

    var params = {
        serieTarga: serieTarga,
        targa: targa
    };
    var headers = {
        'srvpt-session-id': token
    };
    rest.get(endpoint('/pra/secured/visuraTarga'), params, normalizeCallback(cb), headers);


};
},{"../configurator":2,"../rest":6,"underscore":1}],10:[function(require,module,exports){
(function (console){
/**
 * # SSO
 * *[ti-ACI](../index.js.html) › [Services](index.js.html) ›*
 *
 * Modulo che esegue le chiamate rest al servizio SSO
 *
 * ## Utilizzo e configurazione
 * ```
 * var tiACI = require('ti.aci');
 * tiACI.Services.SSO.setConfig({
 *     // parametri di configurazione
 * });
 * ```
 *
 * I parametri di configurazione disponibili sono:
 *
 * - `base_url`: host base a cui puntare tutte le chiamate. Si usa per individuare l'ambiente di utilizzo. ***Default: http://login.aci.it***
 * - `auto_login`: flag true/false per eseguire il login automatico in caso di token scaduto. Implica memorizzazione delle credenziali in variabili locali al modulo. ***Default: true***
 * - `application_key`: nome del profilo al quale fanno riferimento i servizi SSO.  ***Default: mobile***
 * - `keypass`: auteticazione del profilo per l'application key.  ***Default: 0my6o9t6***
 *
 */


//
// ## Private Members
//

var rest = require('../rest');
var configurator = require('../configurator');
var _ = require('underscore');



// ### authToken
// variabile che mantiene il sessionToken durante l'esecuzione dell'app
var authToken;

// ### credentials
// variabile che mantiene le credenziali di accesso. Utile per rinnovare automaticamente l'authToken
var credentials;

// ### user
// variabile che mantiene i dati dell'utente loggato
var user;

//Estendo il modulo acigeo con la gestione delle configurazioni
var config = configurator.extendObjectWithConfigurator(exports);

//Imposto le configurazioni di default:
config.setConfig({
    // - `base_url`: host base a cui puntare tutte le chiamate
    'base_url': 'http://login.aci.it',
    // - `auto_login`: flag true/false per eseguire il login automatico in caso di token scaduto. Implica memorizzazione delle credenziali in variabili locali al modulo.
    'auto_login': true,
    // - `application_key`: nome del servizio al quale fanno riferimento i servizi SSO
    'application_key': 'mobile',
    // - `keypass`: auteticazione del profilo per l'application key
    'keypass': '0my6o9t6'
});


/**
 * ### path
 * Formatta il path dell'azione da richiamare sui servizi SSO, includendo `application_key` e `keypass` corretti. La base è sempre `/index.php`.
 * @param {string} action corrisponde al parametro `do` della url SSO (do è una keyword in javascript). Identifica l'azione richiesta su SSO.
 * @return {string} url relativa formattata con i valori corretti
 */
function path(action, id) {

    var params = {
        'do': action,
        'id': id,
        'application_key': config.getConfig('application_key'),
        'keypass': config.getConfig('keypass')
    };

    return '/index.php?' + _(params).chain()
        .pairs()
        .filter(function(e) {
            return !!e[1];
        })
        .map(function(e) {
            return e[0] + '=' + e[1];
        })
        .reduce(function(memo, e) {
            if (memo) return memo + '&' + e;
            return e;
        }, '')
        .value();

}

/**
 * ### endpoint
 * Formatta la url dell'endpoint per la richiesta.
 * Unisce al `path` fornito il `base_url` delle configurazioni
 * @param {string} path percorso relativo dell'endpoint
 * @return {string} url assoluta dell'endpoint
 */
function endpoint(path) {
    return config.getConfig('base_url') + path;
}


/**
 * ### normalizeResponse
 * Normalizza la risposta di un servizio. ù
 * Funziona come wrapper di una callback.
 * Siccome SSO non sempre usa gli errori HTTP per segnalare problemi, ma li segnala attraverso un campo `resultCode` della risposta, allora mi serve questa normalizzazione per ottenere una callback nella forma (err, result).
 * 
 * @param {Function} cb callback da wrappare
 * @return {Function} callback che effettivamente viene passata al servizio SSO.
 */
function normalizeResponse(cb) {
    return function(err, res) {
        if (res && res.resultCode != 200) {
            cb && cb(res);
        } else {
            cb && cb(err, res);
        }
    }
}


/**
 * ### getSSOID
 * @param {string} username
 * @param {string} password
 * @param {Function} cb callback nella forma (err, res, done). `done` è una funzione che il chiamante deve eseguire per certificare che l'operazione si può concludere con successo.
 */
function getSSOID(username, password, cb) {
    //endpoint della chiamata
    //var url = endpoint('/index.php?do=loginRest&application_key=' + config.getConfig('application_key') + '&id=login');
    var url = endpoint(path('loginRest', 'login'));

    //le credenziali vengono passare come parametri get in base autentication
    var params = {
        username: username,
        password: password
    };

    //esecuzione della chiamata
    rest.get(url, params, function(err, res) {

        // #### done
        // Operazioni da eseguire una volta che l'operazione richiesta si è conclusa con successo.
        // Passo la funzione `done` alla callback, in modo che sia il chiamante della funzione `getSSOID` a decidere se l'operazione si è conclusa con successo o meno.
        var done = _(function(sso_id, username, passowrd) {
            //Salvo il token di autenticazione
            authToken = sso_id;

            //Salvo le credenziali di accesso, per poter eseguire il login automatico.
            //Le credenziali le salvo solo se ho abilitato l'opzione `auto_login` nelle configurazioni 
            if (config.getConfig('auto_login')) {
                credentials = {
                    username: username,
                    password: password
                };
            };
        }).partial(res.data['sso-id'], username, password);

        //Se è definita una callback, delego a tale funzione di decidere se l'operazione richiesta si è conclusa con successo.
        //Lo faccio passando la funzione `done` alla callback
        if (cb) {
            cb(err, res, done);
        }
        //altrimenti, lo decido qui
        else {
            if (!err) done();
        }

    });
}



/**
 * ### getUserData
 * @param {string} sso_id token sso
 * @param {Function} cb callback nella forma (err, userData)
 */
function getUserData(sso_id, cb) {
    //endpoint della chiamata
    //var url = endpoint('/index.php?do=getCustomUserInfo&application_key=' + config.getConfig('application_key') + '&keypass=0my6o9t6');
    var url = endpoint(path('getCustomUserInfo'));

    var params = {
        "sso-id": sso_id
    };

    rest.get(url, params, cb);

}


//
// ## Public API
//


/**
 * ### isLogged
 * Propery readonly che ci dice se l'utente è loggato o meno
 * @return {Boolean}
 */
Object.defineProperty(exports, 'isLogged', {
    get: function() {
        //mi basta vedere se il token è valorizzato
        return !!authToken;
    }
});

/**
 * ### authToken
 * Propery readonly che espone il token di autorizzazione
 * @return {string} auth token, se presente
 */
Object.defineProperty(exports, 'authToken', {
    get: function() {
        return authToken;
    }
});


/**
 * ### authorizedService
 * Factory method per aggiungere funzionalità di autenticazione ad un servizio.
 * Dato un servizio `fn`, ritorna un suo wrapper che controlla se l'utente è loggato o meno.
 * Se non è loggato, ma è attivata l'opzione `auto_login` e sono state salvate le credenziali, allora prova a fare una login coatta. Altrimenti ritorna un errore `403`.
 *
 * Per ritornare l'errore, vengono fatte alcune considerazioni:
 *
 * 1. Vengono passati degli argomenti al servizio, e l'ultimo di questi è una callback nella forma (err, res).
 * 2. Il servizio `fn` torna un errore con `resultCode=403` in caso tenti di eseguirlo con un token scaduto
 * 3. Se la callback non è presente, viene generato un errore.
 *
 * In particolare, se è presente la callback viene costruito un wrapper che si occupa di intercettare un eventuale errore di _token scaduto_ all'interno della chiamata `fn`. Anche in questo caso, se possibile, si effettua il login automatico e, successivamente, si ri-esegue il servizio `fn`.
 *
 * ATTENZIONE: per utilizzare questa feature assieme alla funzionalità di `auto_login` in un modulo terzo che usa la login di SSO (es: pratasse), occorre che il servizio `fn` rispetti alcune convenzioni predefinite (vedi).
 * @param {Function} fn servizio da wrappare
 * @return {Function} funzione wrapper di `fn`
 */
exports.authorizedService = function(fn) {

    /**
     * #### isExpiredToken
     * Esamina la risposta di un servizio autenticato, e determina se si tratta di un token scaduto.
     * Purtroppo l'errore di token scaduto è mascherato da una risposta con `HTTP CODE 200`, ergo devo analizzare il contenuto della response
     * @param {object} err errore eventualmente ritornato
     * @param {object} res risultati eventualmente ritornati
     * @return {Boolean} se si tratta di un token scaduto o meno
     */
    function isExpiredToken(err, res) {
        var o = err || res || {};
        var v = o.resultCode == 403 && o.result == 'unauthorized';
        console.log('sso authorizedService isExpiredToken', v, err, res);
        return v;
    }

    /**
     * #### canAutoLogin
     * Verifica che vi siano le condizioni per effettuare il login automatico
     * @return {Boolean} se posso effettuare il login automatico o meno
     */
    function canAutoLogin() {
        var v = config.getConfig('auto_login') && !_.isEmpty(credentials);
        console.log('sso authorizedService canAutoLogin', v, config.getConfig('auto_login'), !_.isEmpty(credentials));
        return v;
    }

    /**
     * #### executeAuthorizedService
     * Wrapper del servizio `fn`. É la funzione che viene tornata, quindi a tutti gli effetti la funzione che verrà chiamata da chi vuole eseguire il servizio.
     */
    return function executeAuthorizedService() {
        //Argomenti passati al servizio
        var args = Array.prototype.slice.call(arguments);

        //Estraggo l'eventuale callback dai paramentri.
        //Se presente, la wrappo con il controllo del token scaduto
        var callback = (function(a) {
            // 1. estraggo la callback come ultimo parametro degli argomenti
            var cb = a.length && a[a.length - 1];
            // 2. se la callback è definita, creo un wrapper che gestisce il caso di token scaduto
            if (cb && _.isFunction(cb)) {
                return function(err, res) {
                    if (isExpiredToken(err, res) && canAutoLogin()) {
                        doAutoLogin();
                    } else {
                        cb && cb(err, res);
                    }
                };
            } else {
                return undefined;
            }

        })(args);


        //Esegue il servizio `fn`
        var executeService = function() {
            var new_args = args;
            //Prima di eseguire il servizio, devo sostituire agli argomenti la callback wrappata
            if (callback) {
                new_args[new_args.length - 1] = callback;
            }
            fn && fn.apply(this, new_args);
        }



        //Gestisce l'errore di autenticazione.
        //Se è presente la callback la esegue,
        //altrimenti genera un errore
        var onError = function(e) {
            if (callback) {
                callback(e);
            } else {
                throw e;
            }
        }

        //Esegue il login automatico per ottenere un token sso
        var doAutoLogin = function() {
            getSSOID(credentials.username, credentials.password, function(err, res, done) {
                //  - c'è stato un errore nella login: errore
                if (err) {
                    onError(err);
                }
                //  - sono loggato con successo, finalizzo la login e eseguo il servizio
                else {
                    done();
                    executeService();
                }
            });
        }


        //Gestisco i differenti casi:

        // - utente loggato: eseguo il servizio direttamente
        if (exports.isLogged) {
            executeService();
        }
        // - utente non loggato, ma `auto_login=true` e ci sono le credenziali: posso loggarlo coattamente 
        else if (canAutoLogin()) {
            doAutoLogin();
        }
        // - utente non loggato e non posso loggarlo: errore:
        else {
            onError({
                resultCode: 403,
                result: 'unauthorized'
            });
        }
    }
}

/**
 * ### login
 * Effettua la login.
 * L'operazione di login incapsula due differenti operazioni: recupero del token (funzione `getSSOID`) e recupero delle info anagrafiche (funzione `getUserData`).
 * @param {string} username
 * @param {string} password
 * @param {Function} cb callback nella forma (err, userData)
 */
exports.login = function(username, password, cb) {
    console.log('sso login', username, password);

    // prima prendo l'ssoid
    getSSOID(username, password, function(err, res, done) {
        console.log('login getSSOID', err, res, done);
        //errore nella chiamata
        if (err) {
            cb && cb(err);
        }
        //errore dati: utente esistente ma registrazione non completa
        else if (res.resultCode == 403) {
            cb && cb(res);
        }
        //errore dati: login fallita (username e passowrd errati)
        else if (res.resultCode == 500) {
            cb && cb(res);
        }
        //successo: richiedo i dati utente. se non riesco ad ottenerli, considero fallita la login
        else {
            var sso_id = res.data['sso-id'];
            getUserData(sso_id, function(err2, res2) {
                //che tipo di errore posso ottenere?
                if (err2) {
                    cb && cb(err2);
                }
                //successo
                else {

                    //salvo i dati dell'utente
                    user = res2.data;

                    //completo le operazioni ssoid
                    done();

                    //posso chiamare la callback di successo
                    cb && cb(null, user);
                }
            });
        }


    });
};

/**
 * ### logout
 * Effettua la
 * @param {Function} cb callback nella forma (err, result)
 */
exports.logout = function(cb) {
    user = null;
    authToken = null;
    credentials = null;
    cb && cb();
};

/**
 * ### signup
 * Procedura di registrazione. Corrisponde alla "registrazione lite" sul sito web. I dati da passare sono:
 *
 * - `aciCard`: {eventuale numero tessera aci, non obbligatoria}
 * - `name`: {nome, obbligatorio}
 * - `surname`: {cognome, obbligatorio}
 * - `email`: {indirzzo email utente, obbligatorio}
 * - `username`: {username scelta, obbligatorio}
 * - `password`: {password scelta, obbligatorio}
 * - `newsletterAci`: {true o false, non obbligatorio}
 * - `newsletter3rdParty`: {true o false, non obbligatorio}
 * @param {object} data dati di registrazione
 * @param {Function} cb callback nella forma (err, response)
 */
exports.signup = function(data, cb) {
    console.log('sso signup', data);

    //endpoint della chiamata
    //  var url = endpoint('/index.php?do=registrationRest&application_key=' + config.getConfig('application_key') + '&id=register');
    var url = endpoint(path('registrationRest', 'register'));

    //
    var params = _.extend({
        newsletterAci: '',
        newsletter3rdParty: '',
        step: 1
    }, data);

    //
    var headers = {
        'enctype': 'multipart/form-data',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    //
    function callback(err, response) {
        //errore della chiamata
        if (err) {
            cb && cb(err);
        }
        //errore nei dati
        else if (response.result == 'failure') {
            cb && cb(response);
        }
        //successo
        else {
            cb && cb(null, response);
        }
    }

    //esecuzione della chiamata
    rest.post(url, params, callback, headers);
};


/**
 * ### getCurrentUser
 * Ritorna i dati dall'utente attuale, se presenti.
 * @return {object} utente attualmente loggato
 */
exports.getCurrentUser = function() {
    return user;
};


/**
 * ### checkCodiceFiscale
 * Controlla la correttezza di un codice fiscale. Si aspetta in input i seguenti dati:
 *
 * - `name`: nome della persona
 * - `surname`: cognome della persona
 * - `gender`: sesso (M|F)
 * - `birthDate`: data di nascita
 * - `country`: nazione di nascita
 * - `district`: sigla della provincia di nascita. Opzionale se nato all'estero
 * - `city`: comune di nascita. Opzionale se nato all'estero
 * @param {string} cf codice fiscale da controllare
 * @param {object} data dati della persona
 * @param {Function} cb callback nel formato (err, res)
 */
exports.checkCodiceFiscale = function(cf, data, cb) {
    //endpoint della chiamata
    var url = endpoint(path('cfUtility', 'check'));

    //parametri da passare al servizio
    var params = _.extend({}, data, {
        fiscalCode: cf
    });

    rest.get(url, params, cb);
};


/**
 * ### reverseCodiceFiscale
 * Estrae le informazioni anagrafiche a partire dal codice fiscale. Necessita di nome e cognome per poter effettuare una verifica formale del codice (checkdigit, omocodia)
 * @param {string} cf codice fiscale da controllare
 * @param {string} nome nome della parsona
 * @param {string} cognome cognome della persona
 * @param {Function} cb callback nel formato (err, res)
 */
exports.reverseCodiceFiscale = function(cf, nome, cognome, cb) {
    //endpoint della chiamata
    var url = endpoint(path('cfUtility', 'getInfo'));

    //parametri da passare al servizio
    var params = {
        fiscalCode: cf,
        name: nome,
        surname: cognome
    };

    rest.get(url, params, cb);
};

/**
 * ### lookupCodiceISTAT
 * Dato un Codice ISTAT, ritorna le informazioni relative al luogo (nazione, provincia, comune).
 * @param {string} code codice ISTAT
 * @param {Function} cb callback nel formato (err, res)
 */
exports.lookupCodiceISTAT = function(code, cb) {
    //endpoint della chiamata
    var url = endpoint(path('cfUtility', 'getInfoFromCode'));

    //parametri da passare al servizio
    var params = {
        code: code
    };

    rest.get(url, params, cb);
};

/**
 * ### changeMobile
 * Esegue un update sul campo cellulare. Il cellulare non è validato automaticamente, quindi in caso di successo viene inviato un sms al  numero inserito.
 * ATTENZIONE: il metodo richede autenticazione, vengono implementate le funzionalità di login automatico se possibile
 * @param {string} num nuovo numero di telefono
 * @param {Function} cb callback nella forma (err, res).
 */
exports.changeMobile = exports.authorizedService(function(num, cb) {
    //endpoint della chiamata
    var url = endpoint(path('changeMobileRest'));

    //parametri da passare al servizio
    var params = {
        mobileTemp: num,
        'sso-id': authToken
    };

    rest.get(url, params, normalizeResponse(cb));
});


/**
 * ### changeCodiceFiscale
 * Esegue un update sul campo codice fiscale. Il nuovo codice fiscale viene passato assieme alle informazioni che ne permettono la validazione:
 *
 * - `gender`: M o F
 * - `birthDate`: data di nascita nella forma _gg/mm/aaaa_
 * - `country`: nazione di nascita
 * - `district`: sigla della provincia di nascita. Opzionale se nato all'estero
 * - `city`: comune di nascita. Opzionale se nato all'estero
 *
 * ATTENZIONE: il metodo richede autenticazione, vengono implementate le funzionalità di login automatico se possibile
 *
 * @param {string} cf codice fiscale da controllare
 * @param {object} data dati della persona
 * @param {Function} cb callback nel formato (err, res)
 */
exports.changeCodiceFiscale = exports.authorizedService(function(cf, data, cb) {
    //endpoint della chiamata
    var url = endpoint(path('changeCFRest'));

    //parametri da passare al servizio
    var params = _.extend({
        'sso-id': authToken
    }, {
        fiscalCode: cf
    }, data);

    rest.get(url, params, normalizeResponse(cb));
});


/**
 * ### consolidateMobile
 * Conferma l'autenticità del cellulare tramite il codice di verifica (quello che arriva per SMS).
 * @param {string} code codice di verifica
 * @param {Function} cb callback nella forma (err, res)
 */
exports.consolidateMobile = exports.authorizedService(function(code, cb) {
    //endpoint della chiamata
    var url = endpoint(path('consolidateMobileRest'));

    //parametri da passare al servizio
    var params = {
        'sso-id': authToken,
        'randomCode': code,
        'username': user['userInfo.username']
    };

    rest.get(url, params, normalizeResponse(cb));
});
}).call(this,require("--console--"))
},{"--console--":20,"../configurator":2,"../rest":6,"underscore":1}],11:[function(require,module,exports){
/**
 * # Utils
 * Modulo contente funzioni di utilità utilizzate nella libreria ti.aci e nelle applicazioni
 */

var _ = require('underscore');

//
// ## PUBLIC API
//

/**
 * ### is
 * Piccolo stub che controlla se una variabile appartiene o meno ad un tipo
 * @param {string} type tipo da controllare
 * @param {object} obj  valore da controllare
 * @return {Boolean}      true se obj è di tipo type, false altrimenti
 */
exports.is = function(type, obj) {
    return Object.prototype.toString.apply(obj).replace('[object ', '').replace(']', '').toLowerCase() == type.toLowerCase();
}


/**
 * ### setHashValue
 * assegna il valore in input ad un hash. Se la chiave descrive un perscorso sconosciuto, vengono creati gli hash di livello intermedio
 * @param {object} hash  hashset al quale assegnare la chiave
 * @param {string} key   chiave del valore da inserire, ammette notazione puntata gerarchica (es: "la.mia.chiave" corrisponde a hash.la.mia.chiave)
 * @param {object} value valore da inserire
 * @param {string} escape (opzionale) stringa di escape. se key comincia con questa stringa, non viene considerata la notazione puntata. default: "\\"
 */
exports.setHashValue = function(hash, key, value, escape) {
    var o = hash;
    escape = escape || '\\';
    if (key) {
        if (key.indexOf(escape) == 0) {
            hash[key.substring(escape.length)] = value;
        } else {
            var s = key.split('.');
            for (var i = 0; i < s.length; i++) {
                var k = s[i];
                if (!o[k]) o[k] = {};
                if (i == s.length - 1) o[k] = value;
                else o = o[k];
            }
        }
    }

};


/**
 * ### getHashValue
 * recupera il valore da un hash. Se la chiave descrive un perscorso sconosciuto, ritorna `undefined`
 * @param {object} hash  hashset dal quale leggere la chiave
 * @param {string} key   chiave del valore da leggere, ammette notazione puntata gerarchica (es: "la.mia.chiave" corrisponde a hash.la.mia.chiave)
 * @param {string} escape (opzionale) stringa di escape. se key comincia con questa stringa, non viene considerata la notazione puntata. default: "\\"
 * @return {object}      valore da leggere
 */
exports.getHashValue = function(hash, key, escape) {
    var o = hash;
    escape = escape || '\\';

    if (key) {
        if (key.indexOf(escape) == 0) {
            return hash[key.substring(escape.length)];
        } else {
            var s = key.split('.');
            for (var i = 0; i < s.length; i++) {
                var k = s[i];
                if (!o[k]) return undefined;
                if (i == s.length - 1) return o[k];
                else o = o[k];
            }
        }
    } else {
        return undefined;
    }

};


/**
 * ### mapHash
 * Dato un hash di parametri, ottiene un nuovo hash. La trasformazione è basata su un hash di regole. Se per una chiave dello hash sorgente non esiste una regola, la chiave viene replicata
 * @param {object} sourceHash       hash sorgente
 * @param {object} trasformationMap    hash che contiene le regole di trasformazione. É formato da coppie (chiave,lambda)
 *                                        - chiave: identifica la chiave in sourceMap sulla quale eseguire la trasformazione
 *                                        - lambda: definisce la trasformazione da applicare. Può essere di due tipi:
 *                                                  - function: una funzione con firma (mappedHash, value) dove mappedHash è lo hash che sarà derivato da sourceHash e value è il valore di sourceHash[chiave]. La funzione non ritorna nulla, ma modifica il contenuto di mappedHash
 *                                                  - string: la chiave di mappedHash in cui va inserito il valore contenuto in sourceHash[chiave]. Se in notazione puntata, inserisce il valore nel corretto hash annidato
 *
 * @return {object}              hash mappato
 */
exports.mapHash = function(sourceHash, trasformationMap) {

    var mappedHash = {};

    //operazioni di trasformazione concatenate
    _(sourceHash).chain()
    //ottengo un array di coppie [key,val]
    .pairs()
    //elimino le coppie in cui val è vuoto
    .filter(function(e) {
        return e && !!e[1];
    })
    //itero lungo le coppie, e per ognuna eseguo l'azione specificata
    .each(function(e) {
        var key = e[0];
        var val = e[1];
        var lambda = trasformationMap[key];

        if (lambda) {
            if (_.isFunction(lambda)) lambda(val, mappedHash);
            else if (_.isString(lambda)) exports.setHashValue(mappedHash, lambda, val);

        } else {
            mappedHash[key] = val;
        }
    })
        .value();

    return mappedHash;

}


/**
 * ### proxyProperties
 * Dato un elenco di properietà definisce delle property get/set sull'oggeto proxyObj in modo tale che esse leggano/scrivano di fatto sull'oggetto targetObj.
 * Utile quando un oggetto vuole esporre delle proprietà di un oggetto contenuto al suo interno
 * @param {array} properties   elenco di proprietà da mappare. Ogni elemento può essere:
 *                                - string: nome della proprietà, vengono definiti dei metodi get/set impliciti
 *                                - hash: un dizionario contenente tre chiavi:
 *                                    - name: nome della proprietà
 *                                    - get (opzionale): metodo get da associare. Se non specificato, la proprietà è writeonly
 *                                    - set (opzionale): metodo set da associare. Se non specificato, la proprietà è readonly
 * @param {object} proxyObj   oggetto sulle quali sono definite le proprietà
 * @param {object} targetObj  oggetto del quale si vogliono esporre le funzionalità
 */
exports.proxyProperties = function(properties, proxyObj, targetObj) {

    _(properties).each(function(prop) {

        //se la property non è definita, non faccio nulla
        if (prop) {

            //nome della proprietà
            var name;
            //definizione di attributi e metodi della proprietà
            var def;

            //caso string: uso get/set impliciti
            if (_.isString(prop)) {
                name = prop;
                def = {
                    get: function() {
                        return targetObj[prop];
                    },
                    set: function(v) {
                        targetObj[prop] = v;
                    }
                };
            }
            //caso hash: uso get/set custom
            else if (prop.name) {
                name = prop.name;
                def = {
                    get: prop.get,
                    set: prop.set
                };
            }

            //bind della property all'oggetto `proxyObj`
            Object.defineProperty(proxyObj, name, def);
        }
    });



};


/**
 * ### deepExtend
 * Copiato da https://gist.github.com/kurtmilam/1868955,
 * attenzione: nel gist questa funzione è un mixin di `underscore`, in questo caso è stand alone.
 * Si usa con un numero arbitrario di parametri, si effettua il merge con priorità crescente da sinistra verso destra (destra sovrascrive sinistra)
 * @param {object} obj oggetto base del merge
 * @return {object} nuovo oggetto dopo il merge
 */
exports.deepExtend = function deepExtend(obj) {
    var parentRE = /#{\s*?_\s*?}/,
        slice = Array.prototype.slice;

    _.each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
            if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
                obj[prop] = source[prop];
            } else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
                if (_.isString(obj[prop])) {
                    obj[prop] = source[prop].replace(parentRE, obj[prop]);
                }
            } else if (_.isArray(obj[prop]) || _.isArray(source[prop])) {
                if (!_.isArray(obj[prop]) || !_.isArray(source[prop])) {
                    throw new Error('Trying to combine an array with a non-array (' + prop + ')');
                } else {
                    obj[prop] = _.reject(deepExtend(_.clone(obj[prop]), source[prop]), function(item) {
                        return _.isNull(item);
                    });
                }
            } else if (_.isObject(obj[prop]) || _.isObject(source[prop])) {
                if (!_.isObject(obj[prop]) || !_.isObject(source[prop])) {
                    throw new Error('Trying to combine an object with a non-object (' + prop + ')');
                } else {
                    obj[prop] = deepExtend(_.clone(obj[prop]), source[prop]);
                }
            } else {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

exports.methodNotImplemented = function(methodName) {
    throw ['method', methodName, 'not implemented'].join(' ');
};
},{"underscore":1}],12:[function(require,module,exports){

module.exports = (function () { return this; })();

module.exports.location = {};

},{}],13:[function(require,module,exports){
(function (setTimeout){
/* global Ti:true, Titanium:true */

var process = module.exports = {};

process.nextTick = function nextTick(fn) {
  setTimeout(fn, 0);
};

process.title = 'titanium';
process.titanium = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.stdout = {};
process.stderr = {};

process.stdout.write = function (msg) {
  Ti.API.info(msg);
};

process.stderr.write = function (msg) {
  Ti.API.error(msg);
};

'addEventListener removeEventListener removeListener hasEventListener fireEvent emit on off'.split(' ').forEach(function (name) {
  process[ name ] = noop;
});

function noop() {}

}).call(this,require("--timers--").setTimeout)
},{"--timers--":14}],14:[function(require,module,exports){
(function (global){

module.exports.clearInterval = clearInterval;
module.exports.clearTimeout = clearTimeout;
module.exports.setInterval = setInterval;
module.exports.setTimeout = setTimeout;

// See https://html.spec.whatwg.org/multipage/webappapis.html#dom-windowtimers-cleartimeout

function clearInterval(intervalId) {
  try {
    return global.clearInterval(intervalId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function clearTimeout(timeoutId) {
  try {
    return global.clearTimeout(timeoutId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function setInterval(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setInterval(function () {
    func.apply(this, args);
  }, +delay);
}

function setTimeout(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setTimeout(function () {
    func.apply(this, args);
  }, +delay);
}

}).call(this,require("--global--"))
},{"--global--":12}],15:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":18}],16:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],17:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],18:[function(require,module,exports){
(function (process,global,console){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("--process--"),require("--global--"),require("--console--"))
},{"--console--":20,"--global--":12,"--process--":13,"./support/isBuffer":17,"inherits":16}],19:[function(require,module,exports){
module.exports = now

function now() {
    return new Date().getTime()
}

},{}],20:[function(require,module,exports){
var util = require("util");
var now = require("date-now");

var _console = {};
var times = {};

var functions = [
	['log','info'],
	['info','info'],
	['warn','warn'],
	['error','error']
];

functions.forEach(function(tuple) {
	_console[tuple[0]] = function() {
		Ti.API[tuple[1]](util.format.apply(util, arguments));
	};
});

_console.time = function(label) {
	times[label] = now();
};

_console.timeEnd = function(label) {
	var time = times[label];
	if (!time) {
		throw new Error("No such label: " + label);
	}

	var duration = now() - time;
	_console.log(label + ": " + duration + "ms");
};

_console.trace = function() {
	var err = new Error();
	err.name = "Trace";
	err.message = util.format.apply(null, arguments);
	_console.error(err.stack);
};

_console.dir = function(object) {
	_console.log(util.inspect(object) + "\n");
};

_console.assert = function(expression) {
	if (!expression) {
		var arr = Array.prototype.slice.call(arguments, 1);
		require("assert").ok(false, util.format.apply(null, arr));
	}
};

module.exports = _console;

},{"assert":15,"date-now":19,"util":18}]},{},[4])(4)
});