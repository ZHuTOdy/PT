
dingding = require "./dingding"

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
  queryuser = req.data[0] || "" #客户端发送过来的第一个参数
  password = queryuser.password
  username = queryuser.username
  # page = req.data[1] #客户端发送过来的第二个参数
  # size = req.data[2]
  result = {}
  # 检查密码的正确性
  msg = checkPwd password
  # console.log "msg:",msg
  if msg
    result.err = msg
    return req.respond(result)
  query = {username: username}
  # console.log "loginQuery:",query
  user_db_sys_user.users.findOne query, (err, user)->
    # console.log "founduser:",user
    if err || not user
      result.err = '登录失败，用户不存在';
      return req.respond result
    else  
      if !user.enabled #离职状态
        result.err = '对不起,此用户已经离职,已经不能登录';
        return req.respond(result)
      if user.password == md5(password) 
        # sid = uuid.v1()||"";
        data = {}
        # data.sid = sid
        data.username = user.username
        data.nickname = user.nickname
        data.role = user.role
        data.login_at = +moment()
        data.ip = req.socket.handshake.address.address
        data.port = req.socket.handshake.address.port
        result.data = data
        console.log "#{user.username}:#{user.nickname}登录成功"
        return req.respond(result)
      else
        result.err = '密码错误，请重新输入';
        return req.respond(result)


resetpwd = (req) ->
  result = success:false
  PIN = req.data[0].savepassCode || ''
  username = req.data[0].username || ''
  passCode = req.data[0].passCode ||''

  condition = {"username" : username}
  resetpasswd = md5("12345")
  if not PIN
    result.error = '验证码不能为空'
    return req.respond(result)
  if PIN != passCode
    result.error = '验证码错误'
    return req.respond(result)
  console.log "condition:",condition
  user_db_sys_user.users.update condition, {$set:{password:resetpasswd}}, (err)->
    if err
      result.error = '密码重置失败！'
      return req.respond(result)
    console.log "重置密码为：",resetpasswd
    result = success:true
    return req.respond(result)

get_code = (req)->
  console.log "发送验证码..."
  result =
    error :"",
    PIN : ""
  username = req.data[0] || ""
  PIN = parseInt(Math.random()*10000) + ""
  while PIN.length < 4
    PIN = "0" + PIN
  console.log "pin:",PIN
  user_db_sys_user.users.findOne { username, "enabled": true}, (err , user )->
    if not user 
      result.error = "账号不存在"
      return req.respond result
    if err 
      result.error = err
      return req.respond result
    # console.log "uuuuu #{user}"
    # console.log "phone #{user.phone}"
    # console.log "nickname:",user.nickname, PIN
    # console.log  "user.dingId:",user.dingId
    if user.dingId
      return ding_message_send "验证码:#{PIN},1分钟内有效,仅用于汇流登录", user.dingId ,(err)->
        console.log "err:",err
        if err
          result.error = "验证码发送失败"
          return req.respond result
        result.PIN =PIN
        return req.respond result
    else
      result.error = "没有钉钉账号"
      return req.respond result
    



# 修改密码
pwdUpdate = (req) ->
  # console.log "aaaa"
  result =
    error : ""
    success: false
  if !req.data
    result.error = '没有可更新的数据!'
    return req.respond result
  username = req.data[0].username
  oldPassWd = req.data[0].oldPassWd
  newPassWd = req.data[0].newPassWd
  confirmPasswd = req.data[0].confirmPasswd
  queryParam =
    username: username
  if newPassWd != confirmPasswd
    result.error = '两次输入的密码不一致'
    return req.respond(result)
  Pwd = md5(oldPassWd)
  # console.log "queryParam:",queryParam
  user_db_sys_user.users.findOne queryParam, (err , user )->
    if not user
      result.error = '未找到该用户，请确认'
      return req.respond(result)
    if user.password isnt Pwd
        result.error = '原密码错误，请确认'
        return req.respond(result)
    # 检查密码的正确性
    msg = checkPwd newPassWd
    # console.log "msg:",msg
    if msg
      result.error = msg
      return req.respond(result)
    newPwd = md5(newPassWd)
    user_db_sys_user.users.update queryParam, {$set:{password:newPwd}}, (err)->
       if err
        result.error  = err
        return req.respond(result)
       result.success = true
       return req.respond(result)



checkPwd = (str) ->
  flag_1 = /[0-9]/.test(str)
  flag_2 = /[A-Z]/.test(str)
  flag_3 = /[a-z]/.test(str)
  flag_4 = /[^0-9a-zA-Z０-９ａ-ｚＡ-Ｚ\u4e00-\u9fa5]/.test(str)
  sum = 0
  sum += 1 if flag_1
  sum += 1 if flag_2
  sum += 1 if flag_3
  sum += 1 if flag_4
  if str.length < 9 or sum < 3
    return "密码必须为9位以上并且包含数字、大写字母、小写字母、符号中的3项";
  ''
# 目前未使用
userLogin = (req)->
  result =
    success: false
  if undefined is req.data or undefined is req.data[0].username
    result.error = '参数错误'
    return req.respond(result)
  username = req.data[0].username
  PIN = req.data[0].PIN
  queryParam =
    username: req.data[0].username
  # console.log "AAAAAAAA:#{JSON.stringify(req.socket.handshake)}"
  if !/192\.168\./.test( req.socket.handshake.headers.host )
    queryParam = 
      phone: req.data[0].username
      enabled: true
  user_db_sys_user.users.getUser queryParam, (err , user )->
    username = user.username
    if undefined is user or null is user
      result.error = if err then err else '登录失败，用户不存在'
      return req.respond result
    else
      # console.log 'user.role', user.role
      if !user.enabled
        #离职状态
        result.error = '对不起,此用户已经离职,已经不能登录'
        return req.respond(result)

      if checkPwd req.data[0].password
        result.error  = checkPwd req.data[0].password
        set_user_illegal(username)
        return req.respond(result)

      # if user.illegal
      #   result.error = "账号已被禁止"
      #   return req.respond(result)

      if !/192\.168\./.test( req.socket.handshake.headers.host )
        if not PIN
          result.error = '验证码不能为空，请点击获取验证码后，登录钉钉查看验证码'
          return req.respond(result)
        if PIN != user_PIN?[username]?.PIN
          result.error = '验证码错误'
          set_user_illegal(username)
          return req.respond(result)

      if user.password is md5(req.data[0].password)
        allocate_worker username, (erra, port)->
          if erra
            result.error = erra
            return req.respond(result)
          result.data = {}
          result.success = true
          sid = uuid.v1()
          result.data.sid = sid
          session = {}
          session.port = port
          session.username = user.username
          session.nickname = user.nickname
          if user.role["华夏新契约"]
            user.role["华夏人寿"] = user.role["华夏新契约"]
            delete user.role["华夏新契约"]
          session.role = user.role
          session.login_at = +moment()
          session.sid = sid
          # console.log 'req.socket.handshake', JSON.stringify(req.socket.handshake)
          session.ip = req.socket.handshake.address
          session.url = req.socket.handshake.headers.host
          # session.project = argv.project
          # if argv.project == "华夏人寿"
          #   session.proj_role = user.role["华夏新契约"] || []
          # else
          session.proj_role = user.role[ argv.project ] || []
          result.data.session = session
          req.socket.user_login = session
          set_session session,()->
            # console.log 'req.socket.user_login', req.socket.user_login
            return req.respond result
      else
        #密码错误
        set_user_illegal(username)
        result.error = '用户密码错误，请重新输入'
        return req.respond result
#socket路由
pt_io.route('user', {
  login: login
  resetpwd: resetpwd
  get_code: get_code
  pwdUpdate: pwdUpdate
  list: list
  add_user: add_user
  delete_user: delete_user
})