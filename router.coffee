util = require('util')
io = require('socket.io')
async = require('async')
moment = require('moment')
require tinycolor if not "".bold
debug = if global.logger then global.logger "router:#{process.pid}" else console.log


route = (command, handlers, options) ->
  t = typeof handlers
  name = @name
  if not /\/$/.test name
    name += '/'
  if t == 'function'
    debug "add #{name}#{command}".bold.green
    add_route this, command, handlers, options
  else if t == 'object'
    debug ('add_route ' + name + command + '[ ' + Object.keys(handlers).join(', ') + ' ]').bold.green
    for action of handlers
      add_route this, command + '.' + action, handlers[action], options
  this


sync = (command) ->
  if !@router[command]
    console.error 'set queue for unknown route: ' + command
  name = @name
  if !/\/$/.test(name)
    name += '/'
  debug ('sync ' + name + command).bold.yellow
  @queue[command] = async.queue(process_req, 1)
  this


add_route = (space, command, callback) ->
  display_cmd = space.name + '#' + command
  if undefined != space.router[command]
    debug ('multi-route on ' + display_cmd).bold.yellow
  if undefined == space.router[command]
    space.router[command] = []
  space.router[command].push callback
  return


on_command = (data...) ->
  req = {
    name: @command
    room: @space.name
    space: @space
    data: data
    socket: @socket
    respond: (args...) ->
      req.result = args
      if req.next
        req.next 'respond'
      return
  }
  if 'function' == typeof req.data[arguments.length - 1]
    req.respond_fn = req.data.pop()
  req.start_at = +moment()
  do_req req
  return


do_req = (req) ->
  q = req.space.queue[req.name]
  if q
    return q.push(req)
  process_req req
  return


process_req = (req, callback) ->
  room = req.room
  if !/\/$/.test(room)
    room += '/'
  # debug getIP(req.socket) + ' => ' + (room + req.name).bold.green + ' ' + JSON.stringify(req.data).substring(0, 255)
  async.eachSeries req.space.router[req.name], ((handler, next) ->
    req.next = next
    handler req
    return
  ), (err) ->
    req.stop_at = +moment()
    if req.respond_fn
      req.respond_fn.apply null, req.result
    # debug getIP(req.socket) + ' <= ' + (room + req.name).bold.green + ' ' + JSON.stringify(req.result).substring(0, 255)
    if callback
      callback()
    return
  return


getIP = (socket) ->
  socket?.handshake?.headers?['x-forwarded-for'] or
    socket?.request?.connection?.remoteAddress or
    socket?.handshake?.address?.address or
    ''

# namespace 的路由
io::of_org = io::of
io::of = (name) ->
  space = @of_org(name)
  if undefined == space.router
    space.router = {}
    space.queue = {}
    space.on 'connection', (socket) ->
      getIP socket
      if socket.hooked
        return
      socket.hooked = true
      if !/\/$/.test(name)
        name += '/'
      socket.join name
      for command of space.router
        socket.on command, on_command.bind {
          socket: socket
          space: space
          command: command
        }
      return
  space


Namespace = require('./node_modules/socket.io/lib/namespace.js')
Namespace::route = route
Namespace::sync = sync
[
  'route'
  'sync'
].forEach (fn) ->
  io.prototype[fn] = ->
    nsp = @sockets[fn]
    nsp.apply @sockets, arguments
  return


module.exports = io
