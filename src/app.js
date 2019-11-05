(function() {
  var app, express, express_static, io_options, mongo, mongo_url, path, public_dir, server;

  require('./log');

  mongo = require("mongoskin");

  path = require("path");

  global.ObjectId = require('mongodb').ObjectId;

  global.ejs = require("ejs");

  // fs = require 'fs' 
  // async = require 'async'
  global.moment = require('moment');

  
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

  server = require('http').Server(app, io_options).listen(8088); //端口

  global.pt_io = require("./router")(server);

  app.use("/", express_static(public_dir)); //浏览器静态页面路径

  
  //创建数据库的连接
  mongo_url = "mongodb://test:test@127.0.0.1:27017/test_user?authSource=admin";

  global.user_db = mongo.db(mongo_url, {
    useNewUrlParser: true
  });

  global.user_db.bind("users"); //使用collections   users

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
        return cursor.next(on_doc);
      });
    };
    return cursor.next(on_doc);
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
