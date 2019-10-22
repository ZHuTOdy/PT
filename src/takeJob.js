(function() {
  var list;

  list = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1; //客户端发送过来的第二个参数
    pageSize = req.data[2] || 10;
    console.log(`takeJob_page:${page}`);
    return user_db.users.count(query, function(err, total) {
      var result;
      console.log(`errerrerr:${err} ${total}`);
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      toArray(user_db.users.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {});
      console.log(`err2err2err2:${err2}`);
      console.log(`itemsitemsitems:${items.length}`);
      result = succeeRes(items, page, pageSize, total);
      if (err2) {
        return req.respond({
          err: "查询失败"
        });
      }
      return req.respond(result);
    });
  };

}).call(this);
