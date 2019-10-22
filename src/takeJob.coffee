list = (req)->
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    console.log "takeJob_page:#{page}"
    user_db.users.count query, ( err , total )->
        console.log "errerrerr:#{err} #{total}"
        return req.respond( { err : "查询失败" } ) if err
        toArray user_db.users.find(query, {}, {
        skip: (parseInt(page) - 1) * parseInt pageSize
        limit: parseInt pageSize
        # sort: sort
        }), (err2 , items)->
        console.log "err2err2err2:#{err2}"
        console.log "itemsitemsitems:#{items.length}"
        result = succeeRes(items, page, pageSize, total)
        return req.respond({ err : "查询失败"}) if err2
        return req.respond( result )
  