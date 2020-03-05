(function() {
  var Namespace, add_route, async, debug, do_req, getIP, io, moment, on_command, process_req, route, sync, util;

  util = require('util');

  io = require('socket.io');

  async = require('async');

  moment = require('moment');

  if (!"".bold) {
    require(tinycolor);
  }

  debug = global.logger ? global.logger(`router:${process.pid}`) : console.log;

  route = function(command, handlers, options) {
    var action, name, t;
    t = typeof handlers;
    name = this.name;
    if (!/\/$/.test(name)) {
      name += '/';
    }
    if (t === 'function') {
      debug(`add ${name}${command}`.bold.green);
      add_route(this, command, handlers, options);
    } else if (t === 'object') {
      debug(('add_route ' + name + command + '[ ' + Object.keys(handlers).join(', ') + ' ]').bold.green);
      for (action in handlers) {
        add_route(this, command + '.' + action, handlers[action], options);
      }
    }
    return this;
  };

  sync = function(command) {
    var name;
    if (!this.router[command]) {
      console.error('set queue for unknown route: ' + command);
    }
    name = this.name;
    if (!/\/$/.test(name)) {
      name += '/';
    }
    debug(('sync ' + name + command).bold.yellow);
    this.queue[command] = async.queue(process_req, 1);
    return this;
  };

  add_route = function(space, command, callback) {
    var display_cmd;
    display_cmd = space.name + '#' + command;
    if (void 0 !== space.router[command]) {
      debug(('multi-route on ' + display_cmd).bold.yellow);
    }
    if (void 0 === space.router[command]) {
      space.router[command] = [];
    }
    space.router[command].push(callback);
  };

  on_command = function(...data) {
    var req;
    req = {
      name: this.command,
      room: this.space.name,
      space: this.space,
      data: data,
      socket: this.socket,
      respond: function(...args) {
        req.result = args;
        if (req.next) {
          req.next('respond');
        }
      }
    };
    if ('function' === typeof req.data[arguments.length - 1]) {
      req.respond_fn = req.data.pop();
    }
    req.start_at = +moment();
    do_req(req);
  };

  do_req = function(req) {
    var q;
    q = req.space.queue[req.name];
    if (q) {
      return q.push(req);
    }
    process_req(req);
  };

  process_req = function(req, callback) {
    var room;
    room = req.room;
    if (!/\/$/.test(room)) {
      room += '/';
    }
    // debug getIP(req.socket) + ' => ' + (room + req.name).bold.green + ' ' + JSON.stringify(req.data).substring(0, 255)
    async.eachSeries(req.space.router[req.name], (function(handler, next) {
      req.next = next;
      handler(req);
    }), function(err) {
      req.stop_at = +moment();
      if (req.respond_fn) {
        req.respond_fn.apply(null, req.result);
      }
      // debug getIP(req.socket) + ' <= ' + (room + req.name).bold.green + ' ' + JSON.stringify(req.result).substring(0, 255)
      if (callback) {
        callback();
      }
    });
  };

  getIP = function(socket) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    return (socket != null ? (ref = socket.handshake) != null ? (ref1 = ref.headers) != null ? ref1['x-forwarded-for'] : void 0 : void 0 : void 0) || (socket != null ? (ref2 = socket.request) != null ? (ref3 = ref2.connection) != null ? ref3.remoteAddress : void 0 : void 0 : void 0) || (socket != null ? (ref4 = socket.handshake) != null ? (ref5 = ref4.address) != null ? ref5.address : void 0 : void 0 : void 0) || '';
  };

  // namespace 的路由
  io.prototype.of_org = io.prototype.of;

  io.prototype.of = function(name) {
    var space;
    space = this.of_org(name);
    if (void 0 === space.router) {
      space.router = {};
      space.queue = {};
      space.on('connection', function(socket) {
        var command;
        getIP(socket);
        if (socket.hooked) {
          return;
        }
        socket.hooked = true;
        if (!/\/$/.test(name)) {
          name += '/';
        }
        socket.join(name);
        for (command in space.router) {
          socket.on(command, on_command.bind({
            socket: socket,
            space: space,
            command: command
          }));
        }
      });
    }
    return space;
  };

  Namespace = require('./node_modules/socket.io/lib/namespace.js');

  Namespace.prototype.route = route;

  Namespace.prototype.sync = sync;

  ['route', 'sync'].forEach(function(fn) {
    io.prototype[fn] = function() {
      var nsp;
      nsp = this.sockets[fn];
      return nsp.apply(this.sockets, arguments);
    };
  });

  module.exports = io;

}).call(this);
