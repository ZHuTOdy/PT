var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();


Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}       

var ruleTable = new Vue({
    el: "#ruleTable",
    data: {
        date: "",
        options: [],
        value: "",
        items: [],
        page: 0,
        pageSize: 10,
        total: 0,
        Selection: [],
        addRule: {},
        editRule: {
            "_id": "",
            "project": "",
            "ruleType": "",
            "ruleContext": "",
            "forWho": "",
            "remark": "",
            "date": "",
            "updateUser": ""
        },
        dialogVisible: false,
        dialogVisible2: false
    },
    methods: {
        handleSizeChange: function (pageSize) {
            ruleTable.$data.pageSize = pageSize;
            return init_list();
        },
        handleCurrentChange: function (page) {
            ruleTable.$data.page = page;
            return init_list();
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
                message: "增加成功",
                type: "success",
                position: "bottom-right"
            });
        },
        handleUpdate: function (index, data) {
            this.editRule._id = data._id;
            this.editRule.project = data.project;
            this.editRule.ruleType = data.ruleType;
            this.editRule.ruleContext = data.ruleContext;
            this.editRule.forWho = data.forWho;
            this.editRule.remark = data.remark;
            this.dialogVisible2 = true;
        },
        handleDelete: function (index, data) {
            console.log("删除数据")
            var _id = data._id;
            socket.emit("onWork.deleteRule", _id, function(res){
                ruleTable.notice1();
                init_list();
            })
        },
        listAgain: function () {
            init_list();
        },
        changeProject: function () {
            init_list();
        },
        handleAdd: function () {
            this.addRule.date = new Date().format("yyyy-MM-dd");
            this.addRule.updateUser = login.$data.formInline.nickname;
            socket.emit("onWork.addRule", this.addRule, function (res) {
                ruleTable.dialogVisible = false;
                ruleTable.notice2();
                init_list();
            })
        },
        handleEdit: function () {
            this.editRule.date = new Date().format("yyyy-MM-dd");
            this.editRule.updateUser = login.$data.formInline.nickname;
            var _id = this.editRule._id;
            socket.emit("onWork.updateRule", _id, {
                "$set": {
                    "project": this.editRule.project,
                    "remarks": this.editRule.remark,
                    "ruleType": this.editRule.ruleType,
                    "ruleContext": this.editRule.ruleContext,
                    "forWho": this.editRule.forWho,
                    "date": this.editRule.date,
                    "updateUser": this.editRule.updateUser
                }
            }, function (res) {
                ruleTable.dialogVisible2 = false;
                init_list();
            });
        }
    }
});


init_list = function () {
    console.log("表格初始化")
    var page, pageSize;
    page = ruleTable.$data.page;
    pageSize = ruleTable.$data.pageSize;
    project = ruleTable.$data.value || "";
    var fromDate = ruleTable.date[0] || "2000-01-01";
    var endDate = ruleTable.date[1] || "2111-12-31";
    return socket.emit("onWork.listRule", {
        "date": {
            $gte: fromDate,
            $lte: endDate
        },
        "project": {
            $regex: project
        }
    }, page, pageSize, function (res) {
        if (res.err) {
            return alert(res.err);
        }
        return Object.assign(ruleTable.$data, res);
    });
}

init_pro = function () {
    for (var i = 0; i < projectArr.length; i++) {
        p = {
            "label": projectArr[i]["shortName"],
            "value": projectArr[i]["project"]
        }
        ruleTable.options.push(p);
    }
}
init_pro();