;(function(global, undefined) {

function Vector() {}

function Vector2D() {
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

  vec._changed = true;

  return vec;
}

/* Vector Obejt Pool */
var _Pool = {
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

    if (n > l) for(i = l; i < n; i++) objs[i] = Vector2D();

    this._len = n;
  }
}, 
  _usingPool = false;

Vector2D.usePool = function(bool) {
  _usingPool = bool;
};

Vector2D.poolSize = function(n) {
  _Pool.setSize(n);
};

/* instance methods */
var proto = Vector.prototype,
  defineProperty = Object.defineProperty;

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
  return Vector2D(this);
};

proto.destroy = function() {
  if (_usingPool) _Pool.free(this);
};

/* static methods */
Vector2D.add = function(a, b) {
  return Vector2D(a._x + b._x, a._y + b._y);
};

Vector2D.sub = function(a, b) {
  return Vector2D(a._x - b._x, a._y - b._y);
};

Vector2D.mult = function(a, n) {
  return Vector2D(a._x * n, a._y * n);
};

Vector2D.div = function(a, n) {
  return Vector2D(a._x / n, a._y / n);
};

Vector2D.random = function() {
  var rand = Math.random;

  return Vector2D(rand(), rand());
};

if (typeof module !== 'undefined') {
  module.exports = Vector2D;
} else {
  global.Vector2D = Vector2D;
}

})(window || global);
