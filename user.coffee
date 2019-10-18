ncrypto = require('crypto')
md5 = (pswd)->
  if not pswd
    pswd = ''
  hash = ncrypto.createHash('md5')
  hash.update(pswd)
  return hash.digest('hex')


list = (req)->
  query = req.data[0] || {} #客户端发送过来的第一个参数
  page = req.data[1] || 1 #客户端发送过来的第二个参数
  pageSize = req.data[2] || 10
  console.log "page:#{page}"
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
  


#查看
check_data = ()->
  query = {name: "小米"}
  # user_db.users.find( query ).toArray (err, docs) ->  这是源生的语法，但数据多容易内存溢出，用下面游标的可防止
  toArray user_db.users.find( query ), (err, docs) ->
    console.log "docs:#{JSON.stringify(docs)}"


check_data()


#修改
update_user = (req)->
  query = {name: "小小"}
  user_db.users.update query, { "$set": { "age": 60 } }, (err, res) ->
    console.log "修改数据成功" if not err
    return req.respond( {"succee": true} )


#增加
add_user = (req)->
  data = req.data[0] || {}
  console.log "AAAAAAAAAAAAAA:",data
  data.password =  md5("123456") 
  user_db.users.insert data, (err, res) ->
    return req.respond({ err : "操作失败"}) if err
    return req.respond({"succee": true})



#删除
delete_user = (req)->
  query = req.data[0] || {}
  user_db.users.deleteMany query, (err, res) ->
    return req.respond({ err : "操作失败"}) if err
    return req.respond({"succee": true})



login = (req)->
  console.log "loginloginloginloginlogin"
  username = req.data[0] || "" #客户端发送过来的第一个参数
  password = req.data[1] || "" 
  console.log "usernameusernameusernameusername:",username
  # page = req.data[1] #客户端发送过来的第二个参数
  # size = req.data[2]
  result = {}
  query = {username: username}
  user_db.users.findOne query, (err, user)->
    if err || not user
      result.err = '登录失败，用户不存在';
      return req.respond result
    else
      if !user.enabled #离职状态
        result.err = '对不起,此用户已经离职,已经不能登录';
        return req.respond(result)
      if user.password == md5(req.data[0].password) 
        sid = uuid.v1();
        data = {}
        data.sid = sid
        data.username = user.username
        data.nickname = user.nickname
        data.role = user.role
        data.login_at = +moment()
        data.ip = req.socket.handshake.address.address
        data.port = req.socket.handshake.address.port
        result.data = data
        return req.respond(result)
      else
        result.err = '用户密码错误，请重新输入';
        return req.respond(result)





#socket路由
pt_io.route('user', {
  login: login
  list: list
  add_user: add_user
  delete_user: delete_user
})