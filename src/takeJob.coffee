list = (req)->
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    console.log "takeJob_page:#{page}"
    console.log "takeJob_query:#{query}"
    user_db.takeJobPlan.count query, ( err , total )->
        console.log "takeJob_err:#{err} takeJob_total:#{total}"
        return req.respond( { err : "查询失败" } ) if err
        toArray user_db.takeJobPlan.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            console.log "takeJob_err2:#{err2}"
            console.log "takeJob_items:#{items.length}"
            result = succeeRes(items, page, pageSize, total)
            return req.respond({ err : "查询失败"}) if err2
            return req.respond( result )

delete_plan = (req)->
    query = req.data[0] || {}
    console.log "takeJob::", query
    user_db.takeJobPlan.deleteMany query, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        console.log "删除成功"
        return req.respond({"succee": true})

add_plan = (req)->
    data = req.data[0] || {}
    console.log "add_plan::",data
    user_db.takeJobPlan.insert data, (err, res) ->
        return req.respond({ err : "操作失败"}) if err
        return req.respond({"succee": true})

pt_io.route('takeJob', {
  list: list
  delete_plan: delete_plan
  add_plan: add_plan
})