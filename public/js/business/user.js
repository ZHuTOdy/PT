(function() {
  var init_list, userVue;

  userVue = new Vue({
    el: "#userVue",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      aUser: {}
    },
    methods: {
      handleSizeChange: function(pageSize) {
        userVue.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        userVue.$data.page = page;
        return init_list();
      },
      addUser: function() {
        console.log("AAAAAAAAAAAA");
        return socket.emit("user.add_user", userVue.$data.aUser, function(res) {
          console.log("resresres：", res);
          userVue.$data.dialogVisible = false;
          return init_list();
        });
      },
      deleteUser: function(index, data) {
        var query;
        console.log("AAAAAAAAAAAA:", index, data);
        query = {
          username: data.username
        };
        return socket.emit("user.delete_user", query, function(res) {
          return init_list();
        });
      }
    }
  });

  init_list = function() {
    var page, pageSize;
    page = userVue.$data.page;
    pageSize = userVue.$data.pageSize;
    return socket.emit("user.list", {}, page, pageSize, function(res) {
      console.log("user.res:", res);
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(userVue.$data, res);
    });
  };

  
  // userVue.$data.users = res || [] 
  init_list();

}).call(this);
