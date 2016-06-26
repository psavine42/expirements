
    var MONAD, add, apply, at, coalesce, compose, curry, curryPick, diffDays;
    var diffTime, diffToNow, diffUTC, divide, dot, filter, flatMapFuncs, flipN, fmap;
    var forKeys, forOwn, groupMap, identity, map, mapFuncs, multiFilter, multiply, normalizeBy;
    var putIfNull, spDate, unzipMap, utcDate , equals;
    var slice = [].slice;

    identity = function(x) {
      return x;
    };
    apply = function() {
      var as, f;
      f = arguments[0], as = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return f.apply(null, [].concat.apply([], as));
    };
    curry = function(f) {
      return function() {
        var as;
        as = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (as.length < f.length) {
          return f.bind.apply(f, [null].concat(slice.call(as)));
        } else {
          return f.apply(null, as);
        }
      };
    };
  
    forKeys = curry(function(f, obj) {
      var i, k, v;
      i = 0;
      for (k in obj) {
        if (!hasOwnProperty.call(obj, k)) continue;
        v = obj[k];
        obj = f.apply(null, [k, v, i++]);
      }
      return obj;
    });
    at = function(x) {
      return function(o) {
        return o[x];
      };
    };
    forOwn = curry(function(acc, f, obj) {
      var i, k, v;
      i = 0;
      for (k in obj) {
        if (!hasProp.call(obj, k)) continue;
        v = obj[k];
        acc = f.apply(null, [acc, k, v, i++]);
      }
      return acc;
    });
    curryPick = function(x) {
      return function(obj) {
        return _.get(obj, x);
      };
    };
    unzipMap = function(f, xs) {
      return _.zipWith.apply(_, slice.call(xs).concat([function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return f.apply(null, args);
      }]));
    };
    multiFilter = function(xs) {
      return function() {
        var c;
        c = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return xs.filter(function(x) {
          return c;
        });
      };
    };
    dot = function(prop) {
      return function(obj) {
        return _.at(obj, prop);
      };
    };
    forEach = function(arr) {
      return function(f) {
        return arr.forEach(function(x) {
          return f(x);
        });
      };
    };
    equals = function(a){
      return function(b){
        return a === b;
      };
    };
    reduce = function(arr) {
      return function(f) {
        return arr.reduce(function(a,b) {
          return f(a,b);
        });
      };
    };
    map = function(arr) {
      return function(f) {
        return arr.map(function(x) {
          return f(x);
        });
      };
    };
    filter = function(arr) {
      return function(f) {
        return arr.filter(function(x) {
          return f(x);
        });
      };
    };
    divide = function(x) {
      return function(y) {
        if (y === !0) {
          return x / y;
        }
      };
    };
    add = function(x) {
      return function(y) {
        return x + y;
      };
    };
    subtract = function(x) {
      return function(y) {
        return x - y;
      };
    };
    multiply = function(x) {
      return function(y) {
        return x * y;
      };
    };
    groupMap = function(xs, key, f) {
      return xs.reduce(function(res, a) {
        res[a[key]] = res[a[key]] || [];
        res[a[key]].push(f(a));
        return res;
      }, {});
    };
    putIfNull = function(x, k, p) {
      if (x[k] === void 0) {
        x[k] = p;
      }
      return x;
    };
    mapFuncs = function(xs, ar) {
      return xs.map(function(x) {
        var f, j, len, results;
        results = [];
        for (j = 0, len = ar.length; j < len; j++) {
          f = ar[j];
          results.push(f(x));
        }
        return results;
      });
    };
    flatMapFuncs = function(xs, ar) {
      return _.flatten(mapFuncs(xs, ar));
    };
    normalizeBy = function(y) {
      return function(x) {
        return function(o) {
          if (_.at(o, y) === !0) {
            return _.at(o, x) / _.at(o, y);
          }
        };
      };
    };
    flipN = function(f) {
      return function() {
        var as;
        as = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return f.apply(null, as.reverse());
      };
    };
    compose = function() {
      var fs;
      fs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return fs.reduce(function(f, g) {
        return function() {
          var as;
          as = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return f(g.apply(null, as));
        };
      });
    };
    coalesce = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (args != null) {
        return args;
      }
    };
    MONAD = function() {
      var unit;
      unit = function(value) {
        var monad;
        monad = Object.create(null);
        monad.bind = function(func) {
          return func(value);
        };
        return monad;
      };
      return unit.lift = function(name, func) {
        prototype[name] = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return unit(this.bind(func, args));
        };
        return unit;
      };
    };
    spDate = function(x) {
      return utcDate(new Date(x));
    };
    utcDate = function(x) {
      return Date.UTC(x.getFullYear(), x.getMonth(), x.getDate());
    };
    diffUTC = function(x, y) {
      return Math.abs(y.getTime() - x.getTime());
    };
    diffToNow = function(d) {
      return diffUTC(new Date(), new Date(d));
    };
    diffTime = function(t) {
      return Math.ceil(t / (1000 * 3600 * 24));
    };
    diffDays = function(x, y) {
      return diffTime(diffUTC(x, y));
    };
 


