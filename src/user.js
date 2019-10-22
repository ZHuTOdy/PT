(function() {
  var add_user, check_data, delete_user, list, login, md5, ncrypto, update_user;

  ncrypto = require('crypto');

  md5 = function(pswd) {
    var hash;
    if (!pswd) {
      pswd = '';
    }
    hash = ncrypto.createHash('md5');
    hash.update(pswd);
    return hash.digest('hex');
  };

  list = function(req) {
    var page, pageSize, query;
    query = req.data[0] || {};
    page = req.data[1] || 1; //客户端发送过来的第二个参数
    pageSize = req.data[2] || 10;
    console.log(`page:${page}`);
    return user_db.users.count(query, function(err, total) {
      console.log(`errerrerr:${err} ${total}`);
      if (err) {
        return req.respond({
          err: "查询失败"
        });
      }
      return toArray(user_db.users.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize)
      // sort: sort
      }), function(err2, items) {
        var result;
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
    });
  };

  
  //查看
  check_data = function() {
    var query;
    query = {
      name: "小米"
    };
    // user_db.users.find( query ).toArray (err, docs) ->  这是源生的语法，但数据多容易内存溢出，用下面游标的可防止
    return toArray(user_db.users.find(query), function(err, docs) {
      return console.log(`docs:${JSON.stringify(docs)}`);
    });
  };

  check_data();

  //修改
  update_user = function(req) {
    var query;
    query = {
      name: "小小"
    };
    return user_db.users.update(query, {
      "$set": {
        "age": 60
      }
    }, function(err, res) {
      if (!err) {
        console.log("修改数据成功");
      }
      return req.respond({
        "succee": true
      });
    });
  };

  //增加
  add_user = function(req) {
    var data;
    data = req.data[0] || {};
    console.log("AAAAAAAAAAAAAA:", data);
    data.password = md5("123456");
    return user_db.users.insert(data, function(err, res) {
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

  //删除
  delete_user = function(req) {
    var query;
    query = req.data[0] || {};
    return user_db.users.deleteMany(query, function(err, res) {
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

  login = function(req) {
    var password, query, result, username;
    console.log("login");
    username = req.data[0] || ""; //客户端发送过来的第一个参数
    password = req.data[1] || "";
    console.log("username:", username);
    // page = req.data[1] #客户端发送过来的第二个参数
    // size = req.data[2]
    result = {};
    query = {
      username: username
    };
    return user_db.users.findOne(query, function(err, user) {
      var data, sid;
      if (err || !user) {
        result.err = '登录失败，用户不存在';
        return req.respond(result);
      } else {
        if (!user.enabled) { //离职状态
          result.err = '对不起,此用户已经离职,已经不能登录';
          return req.respond(result);
        }
        if (user.password === md5(req.data[0].password)) {
          sid = uuid.v1();
          data = {};
          data.sid = sid;
          data.username = user.username;
          data.nickname = user.nickname;
          data.role = user.role;
          data.login_at = +moment();
          data.ip = req.socket.handshake.address.address;
          data.port = req.socket.handshake.address.port;
          result.data = data;
          return req.respond(result);
        } else {
          result.err = '用户密码错误，请重新输入';
          return req.respond(result);
        }
      }
    });
  };

  //socket路由
  pt_io.route('user', {
    login: login,
    list: list,
    add_user: add_user,
    delete_user: delete_user
  });

}).call(this);
