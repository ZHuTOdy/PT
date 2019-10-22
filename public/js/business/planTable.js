(function() {
  var init_list, planTable;

  planTable = new Vue({
    el: "#planTable",
    data: {
      planTable: [],
      page: 0,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      aUser: {}
    },
    methods: {
      handleSizeChange: function(pageSize) {
        planTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        planTable.$data.page = page;
        return init_list();
      }
    }
  });

  // addUser: ()->
  //     console.log "AAAAAAAAAAAA"
  //     socket.emit "user.add_user", userVue.$data.aUser, (res)->
  //         console.log "resresres：",res
  //         userVue.$data.dialogVisible = false
  //         init_list()
  // deleteUser: (index, data)->
  //     console.log "AAAAAAAAAAAA:",index,data
  //     query = {username: data.username }
  //     socket.emit "user.delete_user", query, (res)->
  //         init_list()
  init_list = function() {
    var page, pageSize;
    page = planTable.$data.page;
    pageSize = planTable.$data.pageSize;
    return socket.emit("takeJob.list", {}, page, pageSize, function(res) {
      console.log("res::", res);
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(planTable.$data, res);
    });
  };

  
  // userVue.$data.users = res || [] 
  init_list();

}).call(this);
