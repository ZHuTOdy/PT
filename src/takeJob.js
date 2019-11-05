(function() {
  var addChannel, add_plan, deleteChannel, delete_plan, edit_channel, edit_plan, list, listResume, list_channel;

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

  pt_io.route('takeJob', {
    list: list,
    delete_plan: delete_plan,
    add_plan: add_plan,
    edit_plan: edit_plan,
    edit_channel: edit_channel,
    list_channel: list_channel,
    deleteChannel: deleteChannel,
    addChannel: addChannel,
    listResume: listResume
  });

}).call(this);
