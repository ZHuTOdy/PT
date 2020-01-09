var project = new Vue({
    el: "#project",
    data: {
        options: [],
        value: ''
    },
    methods: {
        handleChange: function () {
            console.log("切换项目")
        }
    }
});

var permission = new Vue({
    el: "#permission",
    data: {
        options: [{
            value: 'op1',
            label: 'op1'
        }, {
            value: 'op2',
            label: 'op2'
        }],
        value: '',
    },
    methods: {
        handleChange: function () {
            console.log("切换权限")
        }
    }
})
var content = new Vue({
    el: "#content",
    data: {
        content: "",
        loading: false
    },
    methods: {
        notice: function () {
            return this.$notify({
                title: "成功",
                message: "发送成功",
                type: "success",
                position: "bottom-right"
            });
        },
        submit: function () {
            socket = io.connect()
            this.$data.loading = true;
            console.log("发送消息:", this.$data.content);
            console.log("选择的项目:", project.$data.value);
            console.log("选择的权限：", permission.$data.value);
            if (project.$data.value.length == 0 || permission.$data.value == 0 || this.$data.content == "") {
                content.$data.loading = false;
                return alert("项目、权限和内容三者之一不能为空！");
            }
            socket.emit("notice.send", project.$data.value, permission.$data.value, this.$data.content, nickname, function (res) {
                socket = io.connect("http://192.168.202.3:6200");
                socket.emit("notice.test", this.$data.content, function (res) {
                    content.$data.loading = false;
                    return content.notice();
                })
                if (res.err) {
                    content.$data.loading = false;
                    return alert(res.err);
                } else {
                    content.$data.loading = false;
                    return content.notice();
                }
            })
        }
    }
})
console.log("项目：", projects);
init_pro = function () {
    for (var i = 0; i < projects.length; i++) {
        project.$data.options[i] = {}
        project.$data.options[i]["label"] = projects[i]["shortName"];
        project.$data.options[i]["value"] = projects[i]["project"];
    }
}
init_pro();