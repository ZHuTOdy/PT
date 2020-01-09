(function() {
  var addChannel, add_plan, async, deleteChannel, deleteResume, delete_plan, download, edit_channel, edit_plan, ejsExcel, fs, list, listResume, list_channel, mkdirp, moment, node_xlsx, uploadResume;

  ejsExcel = require("./node_modules/ejsExcel-master/ejsExcel");

  fs = require('fs');

  async = require('async');

  mkdirp = require('mkdirp');

  moment = require('moment');

  node_xlsx = require('node-xlsx');

  list = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1; //客户端发送过来的第二个参数
    pageSize = req.data[2] || 10;
    console.log("查询条件：", query);
    return user_db.takeJobPlan.count(query, function(err, total) {
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.takeJobPlan.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
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

  delete_plan = function(req) {
    var query;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    return user_db.takeJobPlan.remove(query, function(err, res) {
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

  add_plan = function(req) {
    var data;
    data = req.data[0] || {};
    return user_db.takeJobPlan.insert(data, function(err, res) {
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

  edit_plan = function(req) {
    var query, set;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    set = req.data[1] || {};
    return user_db.takeJobPlan.update(query, set, function(err, res) {
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

  edit_channel = function(req) {
    var query, set;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    set = req.data[1] || {};
    set.$set.updateDate = moment().format('YYYY-MM-DD');
    return user_db.takeJobChannel.update(query, set, function(err, res) {
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

  deleteChannel = function(req) {
    var query;
    query = {
      _id: ObjectId(req.data[0])
    } || {};
    return user_db.takeJobChannel.remove(query, function(err, res) {
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

  list_channel = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1; //客户端发送过来的第二个参数
    pageSize = req.data[2] || 10;
    return user_db.takeJobChannel.count(query, function(err, total) {
      if (err) {
        console.log("listChannel_err:", err);
      }
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.takeJobChannel.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
        if (err) {
          console.log("listChannel_query_err:", err);
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

  addChannel = function(req) {
    var data;
    data = req.data[0] || {};
    data.updateDate = moment().format('YYYY-MM-DD');
    return user_db.takeJobChannel.insert(data, function(err, res) {
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

  listResume = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1;
    pageSize = req.data[2] || 10;
    return user_db.resume.count(query, function(err, total) {
      console.log("查询条件：：", query);
      if (err) {
        console.log("listResume_err", err);
      }
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.resume.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
        if (err) {
          console.log("listResume_query_err:", err);
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

  download = function(req) {
    var data, xmlModel;
    data = req.data[0];
    xmlModel = fs.readFileSync("../public/excel/resumeModel.xlsx");
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
      file_name = `简历库导出_${downloadTime}`;
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

  deleteResume = function(req) {
    var data, i, j, len;
    data = req.data[0];
    for (j = 0, len = data.length; j < len; j++) {
      i = data[j];
      user_db.resume.remove({
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

  uploadResume = function(req) {
    var excelObj, fileName, filePath, formData, i, insertData, items, j, k, len, len1, obj, workSheetsFromBuffer;
    formData = req.data[0];
    fileName = req.data[1];
    console.log("导入简历库表格", fileName);
    filePath = `/home/PT/public/excel/${fileName}`;
    fs.writeFileSync(filePath, formData);
    workSheetsFromBuffer = node_xlsx.parse(fs.readFileSync(filePath));
    excelObj = workSheetsFromBuffer[0].data;
    insertData = [];
    for (j = 0, len = excelObj.length; j < len; j++) {
      i = excelObj[j];
      insertData.push(i);
    }
    // insertData:[ [ '来源', '姓名', '手机号', '邮箱', '日期', '备注' ],
    //   [ '智联招聘',
    //     '朱镕杰',
    //     '18163134887',
    //     '794670014@qq.com',
    //     '2019-11-11',
    //     '测试下载模版' ] ]
    insertData.shift();
    obj = [];
    for (i = k = 0, len1 = insertData.length; k < len1; i = ++k) {
      items = insertData[i];
      obj.push({
        "from": items[0],
        "name": items[1],
        "phone": items[2],
        "email": items[3],
        "date": items[4],
        "remarks": items[5]
      });
    }
    user_db.resume.insertMany(obj, function(err, res) {
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

  pt_io.route('takeJob', {
    list: list,
    delete_plan: delete_plan,
    add_plan: add_plan,
    edit_plan: edit_plan,
    edit_channel: edit_channel,
    list_channel: list_channel,
    deleteChannel: deleteChannel,
    addChannel: addChannel,
    listResume: listResume,
    download: download,
    deleteResume: deleteResume,
    uploadResume: uploadResume
  });

}).call(this);
