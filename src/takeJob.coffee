list = (req)->
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    user_db.takeJobPlan.count query, ( err , total )->
        return req.respond( { err : "查询失败" } ) if err
        toArray user_db.takeJobPlan.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            result = succeeRes(items, page, pageSize, total)
            return req.respond({ err : "查询失败"}) if err2
            return req.respond( result )

delete_plan = (req)->
    query = req.data[0] || {}
    user_db.takeJobPlan.remove query, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        console.log "删除成功"
        return req.respond({"succee": true})

add_plan = (req)->
    data = req.data[0] || {}
    user_db.takeJobPlan.insert data, (err, res) ->
        return req.respond({ err : "操作失败"}) if err
        return req.respond({"succee": true})

edit_channel = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    set = req.data[1] || {}
    user_db.takeJobChannel.update query, set, (err, res)->
        console.log "修改数据成功" if not err
        console.log "修改数据失败" if err
        return req.respond( {"succee": true} )

deleteChannel = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    user_db.takeJobChannel.remove query, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        console.log "删除成功"
        return req.respond({"succee": true})

list_channel = (req)->
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    user_db.takeJobChannel.count query, ( err , total )->
        console.log "listChannel_err:", err if err
        return req.respond( { err : "查询失败" } ) if err
        toArray user_db.takeJobChannel.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            console.log "listChannel_query_err:", err if err
            result = succeeRes(items, page, pageSize, total)
            return req.respond({ err : "查询失败"}) if err2
            return req.respond( result )

addChannel = (req)->
    data = req.data[0] || {}
    data.updateDate = moment().format('YYYY-MM-DD')
    user_db.takeJobChannel.insert data, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        return req.respond({"succee": true})



pt_io.route('takeJob', {
  list: list
  delete_plan: delete_plan
  add_plan: add_plan
  edit_channel: edit_channel
  list_channel: list_channel
  deleteChannel: deleteChannel
  addChannel: addChannel
})