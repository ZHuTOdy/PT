(function() {
  var get_query, init_list, userVue;

  userVue = new Vue({
    el: "#userVue",
    data: {
      dialogVisible: false,
      InformationDialogVisible: false,
      InformationDialogData: {
        data: [],
        index: null
      },
      enabled_select: "在职",
      searchByNum: "",
      searchByNickname: "",
      searchByEnabled: "",
      searchByTeam: "",
      isexistOptions: [
        {
          value: "在职",
          label: "在职"
        },
        {
          value: "离职",
          label: "离职"
        }
      ],
      aUser: {},
      ptUserTable: {
        items: [],
        page: 0,
        pageSize: 10,
        total: 0
      }
    },
    methods: {
      handleSizeChange: function(pageSize) {
        this.InformationDialogData.index = null;
        this.ptUserTable.pageSize = pageSize;
        return this.searchTable();
      },
      handleCurrentChange: function(page) {
        this.ptUserTable.page = page;
        this.InformationDialogData.index = null;
        // console.log "this.ptUserTable.page",this.ptUserTable.page
        return this.searchTable();
      },
      addUser: function() {
        var that;
        console.log("addUser.");
        that = this;
        return socket.emit("pt_train.add_user", that.$data.aUser, function(res) {
          console.log("resresres：", res);
          that.$data.dialogVisible = false;
          return init_list();
        });
      },
      deleteUser: function(index, data) {
        var query, that;
        that = this;
        query = {
          _id: data._id
        };
        console.log("Deletequery:", query);
        return that.$confirm("此操作将永久删除该用户,是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return socket.emit("pt_train.delete_user", query, function(res) {
            if (res.err) {
              that.$message.error("删除失败!");
            } else if (res.success) {
              that.$message.success("删除成功!");
            }
            return init_list();
          });
        }).catch(function() {
          return that.$message.info("已取消删除");
        });
      },
      // socket.emit "pt_train.delete_user", query, (res)->
      //   init_list()
      information: function(index, data) {
        var key, ref, value;
        // console.log "index:",index;
        // console.log "data:",data
        if (this.InformationDialogData.index !== index) {
          this.InformationDialogData.data = [];
          this.InformationDialogData.index = index;
          ref = data.role;
          for (key in ref) {
            value = ref[key];
            this.InformationDialogData.data.push({
              "proj": key,
              "roles": value
            });
          }
        }
        return this.InformationDialogVisible = true;
      },
      searchTable: function() {
        var page, pageSize, query, that;
        that = this;
        $('#searchButton').attr('disabled', true);
        query = {};
        page = userVue.$data.ptUserTable.page;
        pageSize = userVue.$data.ptUserTable.pageSize;
        query = get_query(query);
        console.log("searchQuery:", query);
        return socket.emit("pt_train.list", query, page, pageSize, function(res) {
          var i, len, people, ref, results;
          $('#searchButton').removeAttr('disabled');
          if (res.err) {
            return that.$message.warning(res.err);
          }
          Object.assign(userVue.ptUserTable, res.data);
          ref = userVue.ptUserTable.items;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            people = ref[i];
            results.push(people.enabled = people.enabled === true ? "在职" : "离职");
          }
          return results;
        });
      }
    }
  });

  init_list = function() {
    var page, pageSize;
    page = userVue.$data.ptUserTable.page;
    pageSize = userVue.$data.ptUserTable.pageSize;
    // console.log "page:#{page},pageSize:#{pageSize}"
    // console.info "init_list"
    return socket.emit("pt_train.list", {}, page, pageSize, function(res) {
      var i, len, people, ref, results;
      if (res.err) {
        // console.log "resresres:",res
        return alert(res.err);
      }
      Object.assign(userVue.ptUserTable, res.data);
      ref = userVue.ptUserTable.items;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        people = ref[i];
        results.push(people.enabled = people.enabled === true ? "在职" : "离职");
      }
      return results;
    });
  };

  get_query = function(query) {
    // query.project = userVue.Project_select if userVue.Project_select !=""
    // query.isLine_select = userVue.isLine_select if userVue.isLine_select !=""
    // query.fromDate= userVue.dateFrom[0].toLocaleDateString() if userVue.dateFrom[0] && userVue.dateFrom[0] !=""
    // query.toDate = userVue.dateFrom[1].toLocaleDateString() if userVue.dateFrom[1] && userVue.dateFrom[1] !=""
    if (userVue.enabled_select !== "") {
      query.enabled = userVue.enabled_select === "在职" ? true : false;
    }
    if (userVue.searchByNum !== "") {
      query.username = {
        $regex: userVue.searchByNum
      };
    }
    if (userVue.searchByNickname !== "") {
      query.nickname = {
        $regex: userVue.searchByNickname
      };
    }
    if (userVue.searchByTeam !== "") {
      query.team = {
        $regex: userVue.searchByTeam
      };
    }
    return query;
  };

  init_list();

}).call(this);


//# sourceMappingURL=PTuser.js.map
//# sourceURL=coffeescript