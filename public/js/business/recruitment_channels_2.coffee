app = new Vue({
    el: "#app",
    data: {
        master_user: {
            sel: null,#选中行   
            columns: [
                { field: "websiteName", title: "网站名称", width: 120 },
                { field: "URL", title: "网址", width: 150 },
                { field: "ID", title: "账号", width: 120 },
                { field: "password", title: "密码", width: 150 },
                { field: "orMoney", title: "是否收费", width:120},
                { field: "effect", title: "招聘效果", width:120},
                { field: "orUse", title: "是否使用中", width:120},
                { field: "remarks", title: "其他说明", width:120},
                { field: "updateDate", title: "招聘信息更新时间", width:150},
                { field: "updateUser", title: "更新人", width:120},
            ],
            data: [],
        },
    },
    methods: {
        #读取表格数据
        readMasterUser() {
            # 根据实际情况，自己改下啊 
            app.master_user.data.map(i => {
                i.id = generateId.get();#模拟后台插入成功后有了id
                i.isSet=false;#给后台返回数据添加`isSet`标识
                return i;
            });
        },
        #添加账号
        addMasterUser() {
            for (i of app.master_user.data) {
                if (i.isSet) return app.$message.warning("请先保存当前编辑项");
            }
            j = { id: 0, "type": "", "addport": "", "user": "", "pwd": "", "info": "", "isSet": true, "_temporary": true };
            app.master_user.data.push(j);
            app.master_user.sel = JSON.parse(JSON.stringify(j));
        },
        #修改
        pwdChange(row, index, cg) {
            # 点击修改 判断是否已经保存所有操作
            for i in app.master_user.data {
                if (i.isSet && i.id != row.id) {
                    app.$message.warning("请先保存当前编辑项");
                    return false;
                }
            }
            #是否是取消操作 
            if (!cg) {
                if (!app.master_user.sel.id) app.master_user.data.splice(index, 1);
                return row.isSet = !row.isSet;
            }
            #提交数据
            if (row.isSet) {
                #项目是模拟请求操作  自己修改下
                (function () {
                    data = JSON.parse(JSON.stringify(app.master_user.sel));
                    for (k in data) row[k] = data[k];
                    app.$message({
                        type: 'success',
                        message: "保存成功!"
                    });
                    #然后这边重新读取表格数据
                    app.readMasterUser();
                    row.isSet = false;
                })();
            } else {
                app.master_user.sel = JSON.parse(JSON.stringify(row));
                row.isSet = true;
            }
        }
    }
});