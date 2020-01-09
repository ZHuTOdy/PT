(function() {
  var app, express, express_static, io_options, moment, mongo, mongo_url, mongo_url_sys_user, path, public_dir, server;

  require('./log');

  mongo = require("mongoskin");

  path = require("path");

  global.ObjectId = require('mongodb').ObjectId;

  global.ejs = require("ejs");

  // fs = require 'fs' 
  // async = require 'async'
  global.moment = moment = require('moment');

  
  // try

  //   init_db = require "./mongo_connect/mongo_cmd"
  // catch error
  //   debug or console.log "uncaughtException #{error.stack or error}"

  // init_mastet = ()->
  //   init_db (err, db_cmd) ->
  //     return setTimeout init_mastet,3000 if err 
  //     global.db_cmd = db_cmd   
  // init_mastet();

  //socket.io選項
  io_options = {
    'flash policy port': -1,
    'origins': '*:*'
  };

  // transports: [ 'polling' ]
  public_dir = path.resolve(`${__dirname}/../public`);

  //express 和 创建socket.io
  express = require("express");

  // express_directory = require "serve-index"
  // express_favicon = require "serve-favicon"
  express_static = require("serve-static");

  app = express();

  //端口
  server = require('http').Server(app, io_options).listen(2222, function() {
    return console.log("listening on *:2222");
  });

  global.pt_io = require("./router")(server);

  app.use("/", express_static(public_dir)); //浏览器静态页面路径

  
  //创建数据库的连接
  mongo_url = "mongodb://test:test@192.168.202.2:27017/test_user?authSource=admin";

  mongo_url_sys_user = "mongodb://test:test@192.168.202.2:27017/sys_user?authSource=admin";

  global.user_db = mongo.db(mongo_url, {
    native_parser: true
  });

  global.user_db_sys_user = mongo.db(mongo_url_sys_user, {
    native_parser: true
  });

  global.user_db.bind("users"); //使用collections   users

  global.user_db_sys_user.bind("users"); //使用collections   users

  global.user_db.bind("takeJobPlan"); //使用collections   takeJobPlan

  global.user_db.bind("takeJobChannel");

  global.user_db.bind("resume");

  // global.user_db.bind "test" #使用collections  test

  //数据库游标，防止内存溢出
  global.toArray = exports.toArray = function(cursor, callback) {
    var docs, on_doc;
    docs = [];
    on_doc = function(err, doc) {
      // console.log "toArray error: #{err.stack}" if err
      if (doc === null) {
        cursor.close();
        return callback(err, docs);
      }
      docs.push(doc);
      return process.nextTick(function() {
        return cursor.nextObject(on_doc);
      });
    };
    return cursor.nextObject(on_doc);
  };

  global.succeeRes = function(items, page, pageSize, total) {
    var result;
    result = {};
    if (items !== null && items !== void 0) {
      result.items = items;
    }
    if (page !== null && page !== void 0) {
      result.page = page;
    }
    if (pageSize !== null && pageSize !== void 0) {
      result.pageSize = pageSize;
    }
    if (total !== null && total !== void 0) {
      result.total = total;
    }
    return result;
  };

  require("./user");

  require("./takeJob");

}).call(this);
