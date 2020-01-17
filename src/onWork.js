(function() {
  var addRule, async, deleteList, deleteRule, download, ejsExcel, fs, list, listRule, mkdirp, moment, node_xlsx, updateRule, upload;

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

  deleteList = function(req) {
    var data, i, j, len;
    data = req.data[0];
    for (j = 0, len = data.length; j < len; j++) {
      i = data[j];
      user_db.OnWork.remove({
        _id: ObjectId(i._id)
      }, function(err, res) {
        if (err) {
          return req.respond({
            err: "操作失败"
          });
        }
        return console.log("删除成功");
      });
    }
    return req.respond({
      "succee": true
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

  list = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1;
    pageSize = req.data[2] || 10;
    return user_db.OnWork.count(query, function(err, total) {
      console.log("total:", total);
      console.log("查询条件：：", query);
      if (err) {
        console.log("OnWork_err", err);
      }
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.OnWork.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
        if (err) {
          console.log("OnWork_query_err:", err);
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

  upload = function(req) {
    var excelObj, fileName, filePath, formData, items, j, len, obj, workSheetsFromBuffer;
    formData = req.data[0];
    fileName = req.data[1];
    console.log("导入在岗名单");
    filePath = `/Users/todyzhu/Documents/excelUpload/${fileName}`;
    fs.writeFileSync(filePath, formData);
    workSheetsFromBuffer = node_xlsx.parse(filePath);
    excelObj = workSheetsFromBuffer[0].data;
    console.log("workSheetsFromBuffer:", JSON.stringify(workSheetsFromBuffer));
    excelObj.shift();
    obj = [];
// console.log "insertData:",insertData
    for (j = 0, len = excelObj.length; j < len; j++) {
      items = excelObj[j];
      console.log("items:", items);
      items[11] = items[11] || "";
      obj.push({
        "ID": items[0] + "",
        "nickname": items[1],
        "sex": items[2],
        "phone": items[3] + "",
        "project": items[4],
        "permission": items[5],
        "level": items[6],
        "OnDate": items[7] + "",
        "OnLineDate": items[8] + "",
        "remark": items[9],
        "status": items[10],
        "closeDate": items[11]
      });
    }
    user_db.OnWork.insertMany(obj, function(err, res) {
      if (err) {
        return req.respond({
          err: "insertMany报错拉"
        });
      }
      console.log("添加成功");
      return fs.unlink(filePath, function(err) {
        if (err) {
          console.log(err);
        }
        return console.log("删除导入Excel成功");
      });
    });
    return req.respond({
      "succee": true
    });
  };

  download = function(req) {
    var data, xmlModel;
    data = req.data[0];
    xmlModel = fs.readFileSync("../public/excel/onTheListModel.xlsx");
    return ejsExcel.renderExcelCb(xmlModel, data, function(err, exlBuf2) {
      var downloadPath, downloadTime, file_name;
      if (err) {
        return req.respond({
          err: "生成Excel错误",
          err
        });
      }
      downloadPath = __dirname.replace(/src.*/, "public/excel/");
      downloadTime = moment().format("YYYYMMDD");
      file_name = `在岗名单导出_${downloadTime}`;
      return mkdirp(downloadPath, function(err) {
        if (err) {
          return req.respond({
            err: "生成路径错误"
          });
        }
        fs.writeFileSync(`${downloadPath}${file_name}.xlsx`, exlBuf2);
        return req.respond(`${downloadPath}${file_name}.xlsx`.replace(/^.*?public\//, ""));
      });
    });
  };

  pt_io.route('onWork', {
    addRule: addRule,
    listRule: listRule,
    updateRule: updateRule,
    deleteRule: deleteRule,
    upload: upload,
    download: download,
    list: list,
    deleteList: deleteList
  });

}).call(this);
