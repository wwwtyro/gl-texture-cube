# gl-texture-cube

Wraps WebGL's cube texture object.

*Note: This API is experimental and will probably change to reach parity with
[gl-texture2d](https://github.com/stackgl/gl-texture2d).*

## Install

```sh
npm install gl-texture-cube
```

## Example

### Javascript

```js
var Box3D = require('geo-3d-box')
var TextureCube = require('../index.js')

var boxData = Box3D({size: 2})

var box = Geometry(gl)
  .attr('aPosition', boxData.positions)
  .faces(boxData.cells)

var textures = generateCubemapTextures()

var cubemap = TextureCube(gl, textures)

program.uniforms.uTexture = cubemap.bind(0)
program.uniforms.uModel = model
program.uniforms.uView = view
program.uniforms.uProjection = projection

box.draw()
```

### Vertex Shader

```glsl
attribute vec3 aPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying vec3 vNorm;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    vNorm = aPosition;
}
```

### Fragment Shader

```glsl
uniform samplerCube uTexture;

varying vec3 vNorm;

void main() {
    gl_FragColor = textureCube(uTexture, vNorm);
}
```


## API

```js
var createTextureCube = require('gl-texture-cube')
```

### Constructor

#### `var cubemap = createTextureCube(gl, domElements[, format=gl.RGBA, type=gl.UNSIGNED_BYTE])`

Creates a texture from `domElements`, structured as:

```js
{
  pos: {
    x: domElement,
    y: domElement,
    z: domElement,
  },
  neg: {
    x: domElement,
    y: domElement,
    z: domElement
  }
}
```

...where each `domElement` can be one of:

* An ImageData object
* An HTMLCanvas object
* An HTMLImage object
* An HTMLVideo object

Takes a WebGL context `gl`. Optionally takes a WebGL data format `format`
and storage type `type`.

### Methods

#### `cubemap.bind([textureUnit])`

Binds the texture. If the optional `textureUnit` is not defined then
the active texture is not changed.

#### `cubemap.dispose()`

Destroys the texture and releases its resources.

#### `cubemap.generateMipmap()`

Generates mipmaps for the texture.

### Properties

#### `cubemap.wrap`

Gets/sets the wrap behavior for the texture in both dimensions.
Defaults to `[gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE]`. Example:

```js
cubemap.wrap = [gl.REPEAT, gl.REPEAT]
```
#### `cubemap.magFilter` & `cubemap.minFilter`

Gets/sets the magnification and minification filter. Defaults
to `gl.NEAREST`.

## Credits
Based on [gl-texture2d](https://github.com/stackgl/gl-texture2d).
