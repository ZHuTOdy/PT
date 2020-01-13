var ID = new Vue({
    el: "#ID",
    data: {
        ID: ""
    },
    methods: {
        changeID: function () {

        }
    }
});

var nickName = new Vue({
    el: "#nickname",
    data: {
        nickname: ""
    },
    methods: {
        changeName: function () {

        }
    }
});

var projects = new Vue({
    el: "#project",
    data: {
        options: [],
        value: ""
    },
    methods: {
        changeProject: function () {

        }
    }
});

var permission = new Vue({
    el: "#permission",
    data: {
        options: [{
            "lebel": "op1",
            "value": "op1"
        }, {
            "lebel": "op2",
            "value": "op2"
        }],
        value: "op1"
    },
    methods: {
        changePermission: function () {

        }
    }
});

var level = new Vue({
    el: "#level",
    data: {
        options: [{
            "lebel":"高",
            "value":"高"
        },{
            "lebel":"中",
            "value":"中" 
        },{
            "lebel":"低",
            "value":"低"
        }],
        value: "中"
    },
    methods: {
        changeLevel: function () {

        }
    }
});

var status = new Vue({
    el: "#status",
    data: {
        options: [{
            "lebel":"开通",
            "value":"开通"
        },{
            "lebel":"关闭",
            "value":"关闭"
        }],
        value: "开通"
    },
    methods: {
        changeStatus: function () {

        }
    }
});

var aboutData = new Vue({
    el: "#aboutData",
    data: {
        fileName: ""
    },
    methods: {
        download: function () {
            var downloadData;
            if (ListTable.$data.Selection.length === 0) {
                downloadData = ListTable.$data.items;
            } else {
                downloadData = ListTable.$data.Selection;
            }
            return socket.emit("onWork.download", downloadData, function (res) {
                if (res.err) {
                    return alert(res.err);
                } else {
                    document.getElementById("jstoxls").href = res;
                    document.getElementById("jstoxls").download = res.replace(/.*\//, "");
                    return document.getElementById('jstoxls').click();
                }
            });
        },
        click: function () {
            return this.$refs.uploadFile.click();
        },
        upload: function (event) {
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
                return socket.emit("onWork.upload", file, file.name, function (res) {
                    if (res.err) {
                        return alert(res.err);
                    } else {
                        init_list();
                        return ListTable.notice2();
                    }
                });
            }
        },
        deleteAll: function () {
            var deleteData;
            if (ListTable.$data.Selection.length === 0) {
                return alert("未选择数据");
            } else {
                deleteData = ListTable.$data.Selection;
                return socket.emit("onWork.delete", deleteData, function (res) {
                    if (res.err) {
                        return alert(res.err);
                    } else {
                        init_list();
                        return ListTable.notice1();
                    }
                });
            }
        },
        listAgain: function () {
            return init_list();
        }
    }
});

var ListTable = new Vue({
    el: "#ListTable",
    data: {
        items: [],
        page: 0,
        pageSize: 10,
        total: 0,
        Selection: []
    },
    methods: {
        handleSizeChange: function (pageSize) {
            ListTable.$data.pageSize = pageSize;
            return init_list();
        },
        handleCurrentChange: function (page) {
            ListTable.$data.page = page;
            return init_list();
        },
        handleSelectionChange: function (val) {
            return this.Selection = val;
        },
        notice1: function () {
            return this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                position: "bottom-right"
            });
        },
        notice2: function () {
            return this.$notify({
                title: "成功",
                message: "导入成功",
                type: "success",
                position: "bottom-right"
            });
        }
    }
});

init_list = function () {}

init_pro = function () {
    for (var i = 0; i < projects.length; i++) {
        p = {
            "lebel": projects[i]["shortName"],
            "value": projects[i]["project"]
        }
        projects.options.push(p);
    }
}
init_pro();