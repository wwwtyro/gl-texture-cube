'use strict'

/* global requestAnimationFrame */

var mat4 = require('gl-mat4')
var Box3D = require('geo-3d-box')
var Geometry = require('gl-geometry')
var glShader = require('gl-shader')
var glslify = require('glslify')

var TextureCube = require('../index.js')

window.onload = function () {
  var canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.left = '0px'
  canvas.style.top = '0px'
  canvas.style.width = canvas.style.height = '100%'
  document.body.appendChild(canvas)

  var gl = canvas.getContext('webgl')
  gl.enable(gl.DEPTH_TEST)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  var box = Box3D({size: 2})
  box = Geometry(gl)
    .attr('aPosition', box.positions)
    .faces(box.cells)

  var textures = genCanvases()
  var cubemap = TextureCube(gl, textures)
  cubemap.generateMipmap()
  cubemap.minFilter = gl.LINEAR_MIPMAP_LINEAR
  cubemap.magFilter = gl.LINEAR

  var program = glShader(gl, glslify('./skybox.vert'), glslify('./skybox.frag'))

  var model = mat4.create()
  var view = mat4.create()
  var projection = mat4.create()

  gl.clearColor(1, 0, 1, 1)

  var tick = 0

  function render () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    tick += 0.01
    mat4.lookAt(view, [0, 0, 0], [Math.cos(tick), Math.cos(tick), Math.sin(tick)], [0, 1, 0])
    mat4.perspective(projection, Math.PI / 2, canvas.width / canvas.height, 0.1, 10.0)

    program.bind()
    box.bind(program)
    program.uniforms.uTexture = cubemap.bind(0)
    program.uniforms.uModel = model
    program.uniforms.uView = view
    program.uniforms.uProjection = projection
    box.draw()

    requestAnimationFrame(render)
  }

  render()
}

function genCanvases () {
  var signs = ['pos', 'neg']
  var axes = ['x', 'y', 'z']
  var canvases = {
    pos: {},
    neg: {}
  }
  var size = 512
  for (var i = 0; i < signs.length; i++) {
    var sign = signs[i]
    for (var j = 0; j < axes.length; j++) {
      var axis = axes[j]
      var canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      var ctx = canvas.getContext('2d')
      if (axis === 'x' || axis === 'z') {
        ctx.translate(size, size)
        ctx.rotate(Math.PI)
      }
      ctx.fillStyle = 'rgb(0,64,128)'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = 'white'
      ctx.fillRect(8, 8, size - 16, size - 16)
      ctx.fillStyle = 'rgb(0,64,128)'
      ctx.font = size / 4 + 'px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(sign + '-' + axis, size / 2, size / 2)
      ctx.strokeStyle = 'rgb(0,64,128)'
      ctx.strokeRect(0, 0, size, size)
      canvases[sign][axis] = canvas
    }
  }
  return canvases
}
