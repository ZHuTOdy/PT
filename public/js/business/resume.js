(function() {
  var date, init_list, name, phone, resumeTable;

  name = new Vue({
    el: "#name",
    data: {
      name: ""
    }
  });

  // methods: {
  //     download: ()->
  //         console.log "下载数据"
  //     update: ()->
  //         console.log "导入数据"
  //     delete: ()->
  //         console.log "删除数据"
  // }
  phone = new Vue({
    el: "#phone",
    data: {
      phone: ""
    }
  });

  // methods: {
  //     download: ()->
  //         console.log "下载数据"
  //     update: ()->
  //         console.log "导入数据"
  //     delete: ()->
  //         console.log "删除数据"
  // }
  date = new Vue({
    el: "#date",
    data: {
      date: ""
    },
    methods: {
      download: function() {
        return console.log("下载数据");
      },
      upload: function() {
        return console.log("导入数据");
      },
      deleteAll: function() {
        return console.log("删除数据");
      }
    }
  });

  resumeTable = new Vue({
    el: "#resumeTable",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    methods: {
      handleSizeChange: function(pageSize) {
        planTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        planTable.$data.page = page;
        return init_list();
      },
      handleSelectionChange: function() {
        return console.log("选中");
      }
    }
  });

  init_list = function() {
    var page, pageSize, permission;
    page = resumeTable.$data.page;
    pageSize = resumeTable.$data.pageSize;
    permission = resumeTable.$data.permission;
    name = name.$data.name;
    phone = phone.$data.phone;
    console.log("name::", name);
    console.log("phone::", phone);
    // socket.emit "takeJob.listResume", {"permission" : permission, "date" : {$regex: date}}, page, pageSize, (res)->
    //     return alert( res.err ) if res.err
    //     Object.assign( planTable.$data, res ) 
    return socket.emit("takeJob.listResume", {}, page, pageSize, function(res) {
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(resumeTable.$data, res);
    });
  };

  init_list();

}).call(this);
