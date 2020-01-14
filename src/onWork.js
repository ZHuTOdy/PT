(function() {
  var addRule, async, deleteRule, ejsExcel, fs, listRule, mkdirp, moment, node_xlsx, updateRule;

  ejsExcel = require("./node_modules/ejsExcel-master/ejsExcel");

  fs = require('fs');

  async = require('async');

  mkdirp = require('mkdirp');

  moment = require('moment');

  node_xlsx = require('node-xlsx');

  addRule = function(req) {
    var data;
    data = req.data[0] || {};
    return user_db.rule.insert(data, function(err, res) {
      if (err) {
        return req.respond({
          err: "操作失败"
        });
      }
      return req.respond({
        "succee": true
      });
    });
  };

  updateRule = function(req) {
    var query, set;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    set = req.data[1] || {};
    console.log(query);
    console.log(set);
    return user_db.rule.update(query, set, function(err, res) {
      if (!err) {
        console.log("修改数据成功");
      }
      if (err) {
        console.log("修改数据失败");
      }
      return req.respond({
        "succee": true
      });
    });
  };

  deleteRule = function(req) {
    var query;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    return user_db.rule.remove(query, function(err, res) {
      if (err) {
        return req.respond({
          err: "操作失败"
        });
      }
      console.log("删除成功");
      return req.respond({
        "succee": true
      });
    });
  };

  listRule = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1;
    pageSize = req.data[2] || 10;
    return user_db.rule.count(query, function(err, total) {
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.rule.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
        if (err) {
          console.log("listRule:", err);
        }
        result = succeeRes(items, page, pageSize, total);
        if (err2) {
          return req.respond({
            err: "查询失败"
          });
        }
        return req.respond(result);
      });
    });
  };

  pt_io.route('onWork', {
    addRule: addRule,
    listRule: listRule,
    updateRule: updateRule,
    deleteRule: deleteRule
  });

}).call(this);
