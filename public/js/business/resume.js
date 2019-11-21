(function() {
  var date, formData, init_list, name, phone, resumeTable;

  formData = new FormData();

  name = new Vue({
    el: "#name",
    data: {
      name: ""
    },
    methods: {
      handleChange: function() {
        return init_list();
      }
    }
  });

  phone = new Vue({
    el: "#phone",
    data: {
      phone: ""
    },
    methods: {
      handleChange: function() {
        return init_list();
      }
    }
  });

  date = new Vue({
    el: "#date",
    data: {
      date: "",
      fileName: ""
    },
    methods: {
      download: function() {
        var downloadData;
        console.log(resumeTable.$data.Selection.length);
        console.log(resumeTable.$data.Selection);
        if (resumeTable.$data.Selection.length === 0) {
          downloadData = resumeTable.$data.items;
        } else {
          downloadData = resumeTable.$data.Selection;
        }
        return socket.emit("takeJob.download", downloadData, function(res) {
          if (res.err) {
            return alert(res.err);
          } else {
            document.getElementById("jstoxls").href = res;
            document.getElementById("jstoxls").download = res.replace(/.*\//, "");
            return document.getElementById('jstoxls').click();
          }
        });
      },
      click: function() {
        return this.$refs.uploadFile.click();
      },
      upload: function(event) {
        var file, hzm, objFile;
        objFile = document.getElementById("upload");
        file = objFile.files[0];
        hzm = file.name.substr(file.name.indexOf(".") + 1);
        if (file.name === "") {
          return alert("请选择要上传的文件");
        } else if (hzm !== "xls" && hzm !== "xlsx") {
          return alert("请选择Excel格式的文件");
        } else {
          formData.append("file", file);
          return socket.emit("takeJob.uploadResume", file, file.name, function(res) {
            if (res.err) {
              return alert(res.err);
            } else {
              init_list();
              return resumeTable.notice2();
            }
          });
        }
      },
      deleteAll: function() {
        var deleteData;
        if (resumeTable.$data.Selection.length === 0) {
          return alert("未选择数据");
        } else {
          deleteData = resumeTable.$data.Selection;
          return socket.emit("takeJob.deleteResume", deleteData, function(res) {
            if (res.err) {
              return alert(res.err);
            } else {
              init_list();
              return resumeTable.notice1();
            }
          });
        }
      },
      listAgain: function() {
        return init_list();
      }
    }
  });

  resumeTable = new Vue({
    el: "#resumeTable",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
      Selection: []
    },
    methods: {
      handleSizeChange: function(pageSize) {
        resumeTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        resumeTable.$data.page = page;
        return init_list();
      },
      handleSelectionChange: function(val) {
        return this.Selection = val;
      },
      notice1: function() {
        return this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          position: "bottom-right"
        });
      },
      notice2: function() {
        return this.$notify({
          title: "成功",
          message: "导入成功",
          type: "success",
          position: "bottom-right"
        });
      }
    }
  });

  init_list = function() {
    var fromTime, newName, newPhone, page, pageSize, permission, toTime;
    page = resumeTable.$data.page;
    pageSize = resumeTable.$data.pageSize;
    permission = resumeTable.$data.permission;
    newName = name.$data.name;
    newPhone = phone.$data.phone;
    fromTime = date.$data.date[0] || "2000-01-01";
    toTime = date.$data.date[1] || "2111-12-31";
    return socket.emit("takeJob.listResume", {
      "name": {
        $regex: newName
      },
      "phone": {
        $regex: newPhone
      },
      "date": {
        $gte: fromTime,
        $lte: toTime
      }
    }, page, pageSize, function(res) {
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(resumeTable.$data, res);
    });
  };

  init_list();

}).call(this);
