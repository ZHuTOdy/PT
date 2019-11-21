var project = new Vue({
    el: "#project",
    data: {
        options: [{
            value: '百年人寿契约',
            label: 'B0001'
        }, {
            value: '华夏人寿契约',
            label: 'B0002'
        }, {
            value: '信泰人寿契约',
            label: 'B0003'
        }, {
            value: '农银人寿契约',
            label: 'B0005'
        }],
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
        submit: function () {
            console.log("发送消息")
        },
        handleChange: function () {
            console.log("切换权限")
        }
    }
})
var content = new Vue({
    el: "#content",
    data: {
        content: ""
    },
    methods: {
        submit: function () {
            console.log("发送消息")
        }
    }
})
// init_pro = function(id, data) {
//     var j, len, pro, results;
//     $("#" + id).empty();
//     if( data == pro_names_conf ){
//       $("#" + id).change(function() {
//         $("#" + id).attr("disabled",true)
//         socket.emit( "conf.set_socket_pro", $("#" + id).val(), work_user.sid, work_user.username, function( err ){
//           $("#" + id).attr("disabled",false)
//           var func = $("#pro_name").attr("func");
//           if( func )
//             eval( func )
//         })
//       });
//     }

//     results = {};
//     // results.push($("#" + id).append("<option value=''></option>"));
//     for (j = 0, len = data.length; j < len; j++) {
//       pro = data[j];
//       var www = data[j];
//       if( pro_all_conf[ www ] != undefined ){
//         www = pro_all_conf[ www ].short_name
//       }
//     //   results.push($("#" + id).append("<option value=" + pro + ">" + www + "</option>"));
//       results = {"value": pro, "label": www}
//       project.$data.options.push(results)
//     }
//     return results;
//   };