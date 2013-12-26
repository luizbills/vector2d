##Vector2D class

####USAGE
```js
Vector2D.usePool(boolean) // optional - default: false
Vector2D.poolSize(integer) // optional - default: 0

var vec = Vector2D() // new vector (0,0)
var vec = Vector2D(x, y) // new vector (x,y)
var vec = Vector2D(otherVector) // new vector (otherVector.x, otherVector.y)

// note: ever destroy an vector if you are using Pooling
vec.destroy();
```
===
####LICENSE
Public Domain
