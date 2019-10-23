(function() {
  var add_plan, delete_plan, list;

  list = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1; //客户端发送过来的第二个参数
    pageSize = req.data[2] || 10;
    console.log(`takeJob_page:${page}`);
    console.log(`takeJob_query:${query}`);
    return user_db.takeJobPlan.count(query, function(err, total) {
      console.log(`takeJob_err:${err} takeJob_total:${total}`);
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
        console.log(`takeJob_err2:${err2}`);
        console.log(`takeJob_items:${items.length}`);
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
    query = req.data[0] || {};
    console.log("takeJob::", query);
    return user_db.takeJobPlan.deleteMany(query, function(err, res) {
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
    console.log("add_plan::", data);
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

  pt_io.route('takeJob', {
    list: list,
    delete_plan: delete_plan,
    add_plan: add_plan
  });

}).call(this);
