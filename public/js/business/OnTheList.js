(function () {
    let formData = new FormData();

    var IDVue = new Vue({
        el: "#ID",
        data: {
            ID: ""
        },
        methods: {
            changeID: function () {
                init_list();
            }
        }
    });

    var nickNameVue = new Vue({
        el: "#nickname",
        data: {
            nickname: ""
        },
        methods: {
            changeName: function () {
                init_list();
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
                init_list();
            }
        }
    });

    var permissionVue = new Vue({
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
                init_list();
            }
        }
    });

    var levelVue = new Vue({
        el: "#level",
        data: {
            options: [{
                "lebel": "高",
                "value": "高"
            }, {
                "lebel": "中",
                "value": "中"
            }, {
                "lebel": "低",
                "value": "低"
            }],
            value: "中"
        },
        methods: {
            changeLevel: function () {
                init_list();
            }
        }
    });

    var statusVue = new Vue({
        el: "#status",
        data: {
            options: [{
                "lebel": "开通",
                "value": "开通"
            }, {
                "lebel": "关闭",
                "value": "关闭"
            }],
            value: "开通"
        },
        methods: {
            changeStatus: function () {
                init_list();
            }
        }
    });

    var aboutData = new Vue({
        el: "#aboutData",
        data: {
            fileName: "",
            loadingDownload: false,
            loadingUpload: false,
            loadingDelete: false
        },
        methods: {
            download: function () {
                aboutData.$data.loadingDownload = true;
                var downloadData;
                if (ListTable.$data.Selection.length === 0) {
                    downloadData = ListTable.$data.items;
                } else {
                    downloadData = ListTable.$data.Selection;
                }
                return socket.emit("onWork.download", downloadData, function (res) {
                    if (res.err) {
                        aboutData.$data.loadingDownload = false;
                        return alert(res.err);
                    } else {
                        document.getElementById("jstoxls").href = res;
                        document.getElementById("jstoxls").download = res.replace(/.*\//, "");
                        aboutData.$data.loadingDownload = false;
                        return document.getElementById('jstoxls').click();
                    }
                });
            },
            click: function () {
                return this.$refs.uploadFile.click();
            },
            upload: function (event) {
                var file, hzm, objFile;
                aboutData.$data.loadingUpload = true;
                objFile = document.getElementById("upload");
                file = objFile.files[0];
                hzm = file.name.substr(file.name.indexOf(".") + 1);
                if (file.name === "") {
                    thiaboutDatas.$data.loadingUpload = false;
                    return alert("请选择要上传的文件");
                } else if (hzm !== "xls" && hzm !== "xlsx") {
                    aboutData.$data.loadingUpload = false;
                    return alert("请选择Excel格式的文件");
                } else {
                    formData.append("file", file);
                    console.log("开始上传");
                    return socket.emit("onWork.upload", file, file.name, function (res) {
                        if (res.err) {
                            aboutData.$data.loadingUpload = false;
                            return alert(res.err);
                        } else {
                            init_list();
                            aboutData.$data.loadingUpload = false;
                            return ListTable.notice2();
                        }
                    });
                }
            },
            deleteAll: function () {
                aboutData.$data.loadingDelete = true;
                var deleteData;
                if (ListTable.$data.Selection.length === 0) {
                    aboutData.$data.loadingDelete = false;
                    return alert("未选择数据");
                } else {
                    deleteData = ListTable.$data.Selection;
                    return socket.emit("onWork.deleteList", deleteData, function (res) {
                        if (res.err) {
                            aboutData.$data.loadingDelete = false;
                            return alert(res.err);
                        } else {
                            init_list();
                            aboutData.$data.loadingDelete = false;
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
            },
            handleUpdate: function (index, data) {}
        }
    });

    init_list = function () {
        let page = ListTable.page;
        let pageSize = ListTable.pageSize;
        let id = IDVue.ID;
        let name = nickNameVue.nickname;
        let project = projects.value;
        let permission = permissionVue.value;
        let level = levelVue.value;
        let status = statusVue.value;
        socket.emit("onWork.list", {
                "ID": {
                    $regex: id
                },
                "nickname": {
                    $regex: name
                },
                "project": {
                    $regex: project
                },
                "permission": {
                    $regex: permission
                },
                "level": {
                    $regex: level
                },
                "status": {
                    $regex: status
                }
            },
            page,
            pageSize,
            function (res) {
                if (res.err) {
                    return alert(res.err);
                }
                console.log(res)
                return Object.assign(ListTable.$data, res);
            });
    };

    init_pro = function () {
        for (var i = 0; i < projectArr.length; i++) {
            p = {
                "label": projectArr[i]["shortName"],
                "value": projectArr[i]["project"]
            }
            projects.options.push(p);
        }
    }
    init_pro();
    init_list();

}).call(this);