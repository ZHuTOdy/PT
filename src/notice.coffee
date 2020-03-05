# io = require("socket.io-client")
# socket = require("socket.io-client")("http://192.168.202.3:6200")
circularJSON = require("circular-json")

send = (req) ->
    data = {}
    data.project = req.data[0] || []
    data.permission = req.data[1] || []
    data.content = req.data[2] || ""
    data.nickname = req.data[3] || ""
    data.time = moment().format("YYYYMMDDHHmmss")
    console.log "#{data.nickname} 发送通知：#{data.content}"
    user_db.appNotice.insert data, (err, res) ->
        checkPT data.project, data.permission,(list) ->
            console.log "PT名单：",list
            list.push("6412")
            sendObj = {"msg" : data.content, "pt" : list}
            for project in glo_projects
                console.log("project.url::",project.url)
                socket = require("socket.io-client")(project.url)
            # socket = io.connect("http://192.168.202.3:6200") //无法连接成功
            # socket = io.connect("http://192.168.202.3:8888")
            # console.log("打印连接的socket：",circularJSON.stringify(socket))
                socket.emit("PTNotice.getPTs", sendObj)
            # socket.emit("login", sendObj)
            #获取到有项目权限的PT名单
            return req.respond({ err : "操作失败"}) if err
            return req.respond({"succee": true})

checkPT = (projects, per,callback) ->
    arr = []
    sum = 0
    console.log "projects",projects
    console.log "per",per
    projects.forEach((project) -> #闭包保存每次for循环的值
        per.forEach((p) ->
            sum++
            toArray user_db_sys_user.users.find({"role.#{project}":{$exists: true}, "username":/^P/, "enabled":true},{}), (err,results)->
                console.log "#{project} #{p} length:",results.length
                sum--
                for person in results
                    if person["role"][project].indexOf(p) != -1
                        if arr.indexOf(person.username) == -1
                            arr.push(person.username)
                            console.log "通知的PT:#{person.username}"
                if sum == 0
                    return callback(arr)
            )
        )


pt_io.route('notice', {
    send: send
})