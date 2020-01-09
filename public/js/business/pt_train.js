(function() {
  var PT_Train, init_query;

  PT_Train = new Vue({
    el: "#PT_Train",
    data: {
      Project_select: "",
      isexist_select: "在职",
      isLine_select: "",
      Project_options: [
        {
          value: "B0019",
          label: "B0019"
        },
        {
          value: "B0052",
          label: "B0052"
        },
        {
          value: "B0053",
          label: "B0053"
        }
      ],
      isLineOptions: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
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
      searchByNum: "",
      searchByNickname: "",
      dateFrom: "",
      tabel: {
        page: 0,
        pageSize: 0,
        total: 0,
        items: []
      }
    },
    methods: {
      getTableDate: function() {
        var query, that;
        that = this;
        query = {};
        query = init_query(query);
        console.log("query:", query);
        return socket.emit("pt_train.getTableDate", query, that.tabel.page, that.tabel.pageSize, function(res) {
          var i, len, people, ref;
          if (res.err) {
            return that.$message.error(res.err);
          } else if (res.data) {
            console.log("获取到查询数据");
            Object.assign(that.tabel, res.data);
            ref = that.tabel.items;
            for (i = 0, len = ref.length; i < len; i++) {
              people = ref[i];
              people.enabled = people.enabled === true ? "在职" : "离职";
            }
            return console.log("that.tabel", that.tabel);
          }
        });
      },
      handleSizeChange: function(pageSize) {
        this.tabel.pageSize = pageSize;
        return PT_Train.getTableDate();
      },
      handleCurrentChange: function(page) {
        this.tabel.page = page;
        return PT_Train.getTableDate();
      }
    }
  });

  init_query = function(query) {
    if (PT_Train.Project_select !== "") {
      query.project = PT_Train.Project_select;
    }
    if (PT_Train.isLine_select !== "") {
      query.isLine_select = PT_Train.isLine_select;
    }
    if (PT_Train.isexist_select !== "") {
      query.enabled = PT_Train.isexist_select === "在职" ? true : false;
    }
    if (PT_Train.dateFrom[0] && PT_Train.dateFrom[0] !== "") {
      query.fromDate = PT_Train.dateFrom[0].toLocaleDateString();
    }
    if (PT_Train.dateFrom[1] && PT_Train.dateFrom[1] !== "") {
      query.toDate = PT_Train.dateFrom[1].toLocaleDateString();
    }
    if (PT_Train.searchByNum !== "") {
      query.username = {
        $regex: PT_Train.searchByNum
      };
    }
    if (PT_Train.searchByNickname !== "") {
      query.nickname = {
        $regex: PT_Train.searchByNickname
      };
    }
    return query;
  };

}).call(this);


//# sourceMappingURL=pt_train.js.map
//# sourceURL=coffeescript