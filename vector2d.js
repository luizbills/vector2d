;(function(global, undefined) {

// locals
var _Pool,
  _usingPool = false,
  proto = Vector.prototype,
  defineProperty = Object.defineProperty,
  vec2d;

// vector class
function Vector() {}

// vector constructor
vec2d = function Vector2D() {
  var args = arguments,
    vec = _Pool.allocate();

  if (args[0] instanceof Vector) {
    vec._x = args[0]._x;
    vec._y = args[0]._y;
  } else if (args.length === 2) {
    vec._x = args[0];
    vec._y = args[1];
  } else {
    vec._x = vec._y = 0;
  }

  return vec;
}

/* instance methods */
defineProperty(proto, 'x', {
  get: function() {
    return this._x;
  },

  set: function(n) {
    this._x = n;
    this._changed = true;
  }
});

defineProperty(proto, 'y', {
  get: function() {
    return this._y;
  },

  set: function(n) {
    this._y = n;
    this._changed = true;
  }
});

defineProperty(proto, 'magnitude', {
  get: function() {
    if (this._changed) {
      var sqrt = Math.sqrt,
        x = this._x,
        y = this._y;

      this._mag = sqrt(x*x + y*y);
      this._changed = false;
    }

    return this._mag;
  }
});

proto._changed = true;

proto.add = function(v) {
  this._x += v._x;
  this._y += v._y;
  this._changed = true;
};

proto.sub = function(v) {
  this._x -= v._x;
  this._y -= v._y;
  this._changed = true;
};

proto.mult = function(n) {
  this._x *= n;
  this._y *= n;
  this._changed = true;
};

proto.div = function(n) {
  this._x /= n;
  this._y /= n;
  this._changed = true;
};

proto.normalize = function() {
  var mag = this.magnitude;

  if (mag !== 0) this.div(mag);
};

proto.clone = function() {
  return vec2d(this);
};

proto.copy = function(v) {
  this._x = v._x;
  this._y = v._y;
  this._changed = true;
};

proto.toString = function(v) {
  return "Vector2D(" + this._x + "," + this._y + ")";
};

proto.destroy = function() {
  if (_usingPool) _Pool.free(this);
};

/* static methods */
vec2d.add = function(a, b) {
  return vec2d(a._x + b._x, a._y + b._y);
};

vec2d.sub = function(a, b) {
  return vec2d(a._x - b._x, a._y - b._y);
};

vec2d.mult = function(a, n) {
  return vec2d(a._x * n, a._y * n);
};

vec2d.div = function(a, n) {
  return vec2d(a._x / n, a._y / n);
};

vec2d.random = function() {
  var rand = Math.random;
  return vec2d(rand(), rand());
};

/* Vector Object Pool */
vec2d.usePool = function(bool) {
  _usingPool = bool;
};

vec2d.poolSize = function(n) {
  _Pool.setSize(n);
};

_Pool = {
  _objects: [],
  _len: 0,

  allocate: function() {
    if (_usingPool && this._len > 0) {
      this._len--;
      return this._objects.pop();
    }
    return new Vector();
  },

  free: function(obj) {
    this._objects.push(obj);
    this._len++;
  },

  setSize: function(n) {
    if (n < 0) return false;

    var l = this._len,
      objs = this._objects;

    objs.length = n;

    if (n > l) for(i = l; i < n; i++) objs[i] = vec2d();

    this._len = n;
  }
};

// export
if (typeof module !== 'undefined') {
  module.exports = vec2d;
} else {
  global.Vector2D = vec2d;
}

})(typeof window === 'object' ? window : global);
