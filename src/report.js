// Generated by CoffeeScript 2.3.0
(function() {
  var async, ejsExcel, fs, list, mkdirp, moment, mongo, node_xlsx;

  ejsExcel = require("./node_modules/ejsExcel-master/ejsExcel");

  fs = require('fs');

  async = require('async');

  mkdirp = require('mkdirp');

  moment = require('moment');

  node_xlsx = require('node-xlsx');

  mongo = require("mongoskin");

  list = function(req) {
    var condition, i, page, pageSize, pro_each, ref, results;
    condition = req.data[0] || {};
    page = req.data[1] || 1; // 页数
    pageSize = req.data[2] || 10; // 页尺寸
    // 如未选择项目，则默认全选
    if (condition["project"].length === 0) {
      condition["project"] = ["百年新契约", "华夏人寿", "信泰新契约", "农银新契约", "幸福新契约", "北大方正新契约", "同方全球新契约", "上海人寿契约", "前海人寿契约", "合众人寿契约", "横琴新契约", "太平人寿", "百年保全", "上海人寿保全", "中意保全", "民生人寿保全", "合众人寿保全", "新合众人寿保全", "民生理赔", "广西贵州国寿理赔", "陕西国寿理赔", "新疆国寿理赔", "云南国寿理赔", "百年理赔", "华夏理赔", "华夏人寿团险理赔", "北大方正理赔", "中意理赔", "交通银行大平台"];
    }
    // 如未选择时间，则默认选择前一天 
    if (condition["date"]["$gte"] === "" && condition["date"]["$lte"] === "") {
      condition["date"]["$gte"] = moment().day(0).format('YYYYMMDD') + "000000";
      condition["date"]["$lte"] = moment().day(0).format('YYYYMMDD') + "235959";
    } else {
      condition["date"]["$gte"] += "000000";
      condition["date"]["$lte"] += "235959";
    }
    ref = condition.project;
    // 找到对应项目的对应数据库的url
    results = [];
    for (i in ref) {
      pro_each = ref[i];
      console.log("pro_each", pro_each);
      results.push(user_db_projects.deploy.find({
        "name": pro_each
      }, function(err, cursor) {
        if (err) {
          return req.respond({
            err: "查询失败"
          });
        }
        return cursor.toArray(function(err2, data) {
          var pro_url, user_db_pro_url;
          if (err2) {
            return req.respond({
              err: "查询失败"
            });
          }
          pro_url = data[0]["db"];
          console.log(pro_url);
          user_db_pro_url = mongo.db(pro_url, {
            native_parser: true
          });
          // 绑定collections
          user_db_pro_url.bind("history");
          user_db_pro_url.bind("sum");
          return user_db_pro_url.bind("wrong");
        });
      }));
    }
    return results;
  };

  
  // TODO: 已通过project数据库的deploy集合找到各项目数据库对应的url，接下来需要拿对应报表中需要的数据显示到表格中
  pt_io.route('report', {
    list: list
  });

}).call(this);
