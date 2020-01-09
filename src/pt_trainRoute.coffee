ncrypto = require('crypto')

md5 = (pswd)->
  if not pswd
    pswd = ''
  hash = ncrypto.createHash('md5')
  hash.update(pswd)
  return hash.digest('hex')
# PT在岗培训查询方法  
getTableDate=(req)->
    query={}
    result={
        err:""
        data:[]
    }
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    # console.log "getTableDate page:#{page}"
    # console.log "getTableDate pageSize:#{pageSize}"
    user_db_PT.pt_users.count query, ( err , total )->
        # console.log "errerrerr:#{err} #{total}"
        if err
            result.err = "查询失败！"
            return req.respond result 
        user_db_PT.collection('pt_users').find(query,{
        skip: (parseInt(page) - 1) * parseInt pageSize
        limit: parseInt pageSize
        # sort: sort
        }).toArray (err2, res)->
            # console.log "err2err2err2:#{err2}"
            console.log " getTableDate res.length:#{res.length}"
            result.data = succeeRes(res, page, pageSize, total)
            if err2
                res.err2 = "查询失败"
                return req.respond(result)
            return req.respond( result )
    
      
# PT用户管理,初始化列表
list = (req)->
  query = req.data[0] || {} #客户端发送过来的第一个参数
  page = req.data[1] || 1 #客户端发送过来的第二个参数
  pageSize = req.data[2] || 10
  result={err:"",data:{}}
#   console.log "list page:#{ page}"
  console.log "query:#{JSON.stringify query}"
  user_db_PT.pt_users.count query, ( err , total )->
    console.log " list total: #{total}" 
    if err
        result.err = "查询失败"
        return req.respond( result )
    toArray user_db_PT.pt_users.find(query, {}, {
      skip: (parseInt(page) - 1) * parseInt pageSize
      limit: parseInt pageSize
      # sort: sort
    }), (err2 , items)->
    #   console.log "err2err2err2:#{err2}"
        console.log "itemsitemsitems:#{items.length}"
        if items.length ==0
            result.err = "查询结果为空"
            return req.respond( result )
        if err2
            result.err = "查询失败" 
            return req.respond( result )
        result.data = succeeRes(items, page, pageSize, total)
        return req.respond( result )


#PT用户管理，增加用户
add_user = (req)->
  data = req.data[0] || {}
  console.log "AAAAAAAAAAAAAA:",data
  data.password =  md5("123456") 
  user_db.users.insert data, (err, res) ->
    return req.respond({ err : "操作失败"}) if err
    return req.respond({"succee": true})

#PT用户管理，删除用户
delete_user = (req)->
  query = req.data[0] || {}
  user_db.users.deleteMany query, (err, res) ->
    return req.respond({ err : "操作失败"}) if err
    # console.info "err:",err
    return req.respond({"success": true})

        

#socket路由
pt_io.route('pt_train', {
  getTableDate: getTableDate
  list:list
  add_user: add_user
  delete_user: delete_user
})