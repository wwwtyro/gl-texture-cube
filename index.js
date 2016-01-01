'use strict'

module.exports = createTextureCube

function TextureCube (gl, texture, format, type) {
  this.gl = gl
  this.handle = texture
  this.format = format
  this.type = type
  this._minFilter = gl.NEAREST
  this._magFilter = gl.NEAREST
  this._wrapS = gl.CLAMP_TO_EDGE
  this._wrapT = gl.CLAMP_TO_EDGE
}

var proto = TextureCube.prototype

Object.defineProperties(proto, {
  minFilter: {
    get: function () {
      return this._minFilter
    },
    set: function (value) {
      var gl = this.gl
      this.bind()
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, value)
      this._minFilter = value
      return value
    }
  },
  magFilter: {
    get: function () {
      return this._magFilter
    },
    set: function (value) {
      var gl = this.gl
      this.bind()
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, value)
      this._magFilter = value
      return value
    }
  },
  wrapS: {
    get: function () {
      return this._wrapS
    },
    set: function (value) {
      var gl = this.gl
      this.bind()
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, value)
      this._wrapS = value
      return value
    }
  },
  wrapT: {
    get: function () {
      return this._wrapT
    },
    set: function (value) {
      var gl = this.gl
      this.bind()
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, value)
      this._wrapT = value
      return value
    }
  },
  wrap: {
    get: function () {
      return [this.wrapS, this.wrapT]
    },
    set: function (value) {
      if (!Array.isArray(value)) {
        value = [value, value]
      }
      this.wrapS = value[0]
      this.wrapT = value[1]
      return value
    }
  }
})

proto.bind = function (unit) {
  var gl = this.gl
  if (unit !== undefined) {
    gl.activeTexture(gl.TEXTURE0 + (unit | 0))
  }
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.handle)
  if (unit !== undefined) {
    return (unit | 0)
  }
  return gl.getParameter(gl.ACTIVE_TEXTURE) - gl.TEXTURE0
}

proto.dispose = function () {
  this.gl.deleteTexture(this.handle)
}

proto.generateMipmap = function () {
  this.bind()
  this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP)
}

function initTexture (gl) {
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

function createTextureDOM (gl, sources, format, type) {
  var texture = initTexture(gl)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, format, format, type, sources.pos.x)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, format, format, type, sources.pos.y)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, format, format, type, sources.pos.z)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, format, format, type, sources.neg.x)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, format, format, type, sources.neg.y)
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, format, format, type, sources.neg.z)
  return new TextureCube(gl, texture, format, type)
}

function createTextureCube (gl, data, format, type) {
  format = format || gl.RGBA
  type = type || gl.UNSIGNED_BYTE
  return createTextureDOM(gl, data, format, type)
}
