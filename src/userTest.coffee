fs = require 'fs'
async = require 'async'
mkdirp = require 'mkdirp'
moment = require 'moment'
ncrypto = require 'crypto'
sprintf = require('sprintf-js').sprintf
uuid = require 'node-uuid'
dingding = require "./dingding"
exec = require('child_process').exec

console.log "用户加载完成"
user_PIN = {}
CACHE_TIME = 60000


userIndex = (req) ->
  result =
    success: false
  db_cmd.getAllUser ( err , users )->
    if err
      console.log "getAllUser error", err
      return req.respond result
    result.data = []
    users.forEach (user) ->
      item = clone(user)
      delete item.password
      item.create_at = moment(Date.parse(item.create_at)).format('YYYY-MM-DD HH:mm:ss')
      item.update_at = moment(Date.parse(item.update_at)).format('YYYY-MM-DD HH:mm:ss')
      result.data.push item

    result.success = true
    # console.log "result", result
    return req.respond result

userGet = (req) ->
    result =
      success: false
    if undefined is req.data or undefined is req.data[0]
      result.error = '参数错误'
      return req.respond(result)
    queryParam =
      username: req.data[0]
    db_cmd.getUser queryParam, (err , user )->
      if err
        console.log "err",err
        return req.respond result
      if user
        result.success = true
        result.data = clone(user)
        delete result.data._id
        delete result.data.__v
        delete result.data.md5
        return req.respond(result)


worker_code_in = {}

allocate_worker = (code, callback)->
  # console.error "allocate_worker: #{code}  #{global.mark_master}"
  if argv.project == "common" || not global.mark_master || conf.app?[ argv.project ]?.workers == 1
    return callback null, undefined
  console.log "worker_code_in: #{JSON.stringify(worker_code_in)}"
  lock.enter "IPC", 5000, (err)->
    if err
      return lock.leave "IPC", ->
        return callback("连接超时,请重登")
    if worker_code_in[ code ] != undefined
      return lock.leave "IPC", ->
        return callback( null, parseInt( conf.app[ argv.project ].master ) + worker_code_in[ code ] )
    for w_index in [1 .. conf.app[ argv.project ].workers]
      num = 0 
      for key,value of worker_code_in
        if value == w_index 
          num++
      # console.log "num: #{code} #{num} #{w_index}"
      if num < 38
        worker_code_in[ code ] = w_index
        console.error "w_index: #{code} #{w_index}"
        return lock.leave "IPC", ->
          return callback( null, parseInt( conf.app[ argv.project ].master ) + worker_code_in[ code ] )
    return lock.leave "IPC", ->
      return callback("服务器人数爆满，请联系管理员")

worker_ding = (code, PIN)->
  return false if argv.project == "common" || not global.mark_master || conf.app?[ argv.project ]?.workers == 1
  broadcast "ding_PIN", {code, PIN}, 0

if argv.project != "common" && not global.mark_master && conf.app?[ argv.project ]?.workers > 1
  IPC_IO.on 'ding_PIN', ( data )->
    user_PIN_cache data.code, data.PIN

clear_code = (req) ->
  code = req.data[0]
  delete worker_code_in[ code ]

getSession = (req) ->
  result =
    success : false
  sid = req.data[0] or ''
  result.success = true
  result.project = argv.project
  result.short_name = entry?.conf?.priority?.short_name || argv?.project
  result.catalog = entry?.conf?.catalog
  result.crop_expand = if entry?.conf?.crop_expand != undefined then parseInt( entry?.conf?.crop_expand ) else 10
  return req.respond result


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
  db_cmd.getUser queryParam, (err , user )->
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



set_session = (session, callback)->
  session.time = +moment()
  global.dbs.sys_user.session.update {'username':session.username}, { "$set":session }, {upsert:true}, callback


user_PIN_cache = (code, PIN) ->
  # debug "online_code_cache:#{code} ,  pid:#{global.IPC_INDEX}"
  clearTimeout user_PIN[code].clear if user_PIN?[code]?.clear
  user_PIN[code] =
    "PIN" : PIN
    clear : setTimeout ->
      delete user_PIN[code]
    , CACHE_TIME
  null


get_user_PIN = (req)->
  phone = req.data[0] || ""
  PIN = parseInt(Math.random()*10000) + ""
  while PIN.length < 4
    PIN = "0" + PIN
  # query = {username:user_code}
  # if !/192\.168\./.test( req.socket.handshake.headers.host )
  # query = { phone: phone }
  db_cmd.getUser { phone, "enabled": true}, (err , user )->
    return req.respond "账号不存在" if not user.username
    user_PIN_cache user.username, PIN
    worker_ding user.username, PIN
    console.log "nickname:",user.nickname, PIN
    ismobile = check_ismobile(req)
    return req.respond("没有手机权限") if ismobile && not user.isMobile
    if ismobile && /^(130|131|132|145|155|156|185|186)/.test phone
      return check_message_num (err2)->
        return req.respond "无法发送短信" if err2
        return exec "java -jar /usr/local/java/send.jar #{phone} 验证码:#{PIN},1分钟内有效,仅用于i-confluence登录", (err, stdout, stderr) ->
          return req.respond err
    if user.dingId
      return ding_message_send "验证码:#{PIN},1分钟内有效,仅用于汇流登录", user.dingId ,(err)->
        console.error "dingIderr:#{err}" if err
        return req.respond err
    check_ding_id phone, (dingId)->
      return req.respond("没有钉钉账号") if not dingId
      global.dbs.sys_user.users.update {'username':user.username}, { "$set": { dingId } }, {upsert:false}, ()->
        return ding_message_send "验证码:#{PIN},1分钟内有效,仅用于汇流登录", dingId ,(err)->
          console.error "dingIderr:#{err}" if err
          return req.respond err



userPwdSet = (req) ->
  result =
     success: false
  if !req.data
    result.error = '没有可更新的数据!'
    return req.respond result
  username = req.data[0].username
  queryParam =
    username: req.data[0].username

  if req.data[0].password
    oldPwd = md5(req.data[0].password)

  db_cmd.getUser queryParam, (err , user )->
    if user.password isnt oldPwd
        result.error = '原密码错误'
        return req.respond(result)
    msg = checkPwd req.data[0].newPwd
    if msg
      result.error = msg
      return req.respond(result)
    newPwd =  md5(req.data[0].newPwd)
    db_cmd.setUserPwd queryParam, newPwd, (err)->
       if err
         result.error  = err
         return req.respond(result)
       result.success = true
      # db_cmd.update_40_user username, (err5)->
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


clone = (obj) ->
  return JSON.parse(JSON.stringify(obj))

sha512 = (pswd) ->
  if !pswd
    pswd = ''
  hash = ncrypto.createHash('sha512')
  hash.update pswd
  hash.digest 'hex'

md5 = (pswd) ->
  if !pswd
    pswd = ''
  hash = ncrypto.createHash('md5')
  hash.update pswd
  hash.digest 'hex'


re_connect = (req)->
  # console.log "EEEEEEE:"
  return req.respond null if req.socket.user_login
  # project = argv.project
  sid = req.data[0]
  username = req.data[1]
  return req.respond "错误" if not sid || not username
  global.dbs.sys_user.session.findOne {username, sid}, (err, session) ->
    err = "错误"
    if session?.login_at 
      time = +moment() - session.login_at 
      return req.respond err if moment.duration( time ).asHours() > 4
    if session?.username
      if argv.project != "common"
        session.proj_role = session.role[ argv.project ]
      req.socket.user_login = session
      err = null
    crop_expand = parseInt( entry?.conf?.crop_expand ) || 10
    return req.respond err, crop_expand


check_message_num = (callback)->
  global.dbs.sys_user.session.findOne {username: "phone"}, (err, mess) ->
    return callback err if err 
    if not mess?.username
      mess = {
        username: "phone"
        num: 0
        time : moment().format("YYYYMM")
      }
    if moment().format("YYYYMM") > mess.time
      mess.time = moment().format("YYYYMM") 
      mess.num = 0
    if mess.num > 12000
      return ding_mess_names "本月发送短信已超过12000", ()->
        return callback "本月发送短信已超过12000"
    mess.num += 1
    return global.dbs.sys_user.session.update {username: "phone"}, mess, {upsert:true}, callback


get_code = (req)->
  username = req.data[0] || ""
  PIN = parseInt(Math.random()*10000) + ""
  while PIN.length < 4
    PIN = "0" + PIN
  # query = {username:user_code}
  # if !/192\.168\./.test( req.socket.handshake.headers.host )
  # query = { phone: phone }
  db_cmd.getUser { username, "enabled": true}, (err , user )->
    console.log "uuuuu #{user}"
    return req.respond "账号不存在" if not user
    console.log "ooooo #{user.phone}"
    phone = user.phone
    user_PIN_cache user.username, PIN
    worker_ding user.username, PIN
    console.log "nickname:",user.nickname, PIN
    ismobile = check_ismobile(req)
    return req.respond("没有手机权限") if ismobile && not user.isMobile
    if ismobile && /^(130|131|132|145|155|156|185|186)/.test phone
      return check_message_num (err2)->
        return req.respond "无法发送短信" if err2
        return exec "java -jar /usr/local/java/send.jar #{phone} 验证码:#{PIN},1分钟内有效,仅用于i-confluence登录", (err, stdout, stderr) ->
          return req.respond err
    if user.dingId
      return ding_message_send "验证码:#{PIN},1分钟内有效,仅用于汇流登录", user.dingId ,(err)->
        console.error "dingIderr:#{err}" if err
        return req.respond err
    check_ding_id phone, (dingId)->
      return req.respond("没有钉钉账号") if not dingId
      global.dbs.sys_user.users.update {'username':user.username}, { "$set": { dingId } }, {upsert:false}, ()->
        return ding_message_send "验证码:#{PIN},1分钟内有效,仅用于汇流登录", dingId ,(err)->
          console.error "dingIderr:#{err}" if err
          return req.respond err

resetpwd = (req) ->
  result = success:false
  PIN = req.data[0].code || ''
  condition = {"username" : req.data[0].username}
  console.log "#condition"
  username = req.data[0].username || ''
  password = md5("12345")
  if not PIN
    result.error = '验证码不能为空，请点击获取验证码后，登录钉钉查看验证码'
    return req.respond(result)
  if PIN != user_PIN?[username]?.PIN
    result.error = '验证码错误'
    return req.respond(result)
  db_cmd.resetPTpwd condition , password, (err8)->
    console.log "err8",err8
    return req.respond(result) if err8
    console.log "aaaaaaaaaxxx"
    # db_cmd.update_40_user condition.username, (err5)->
    result = success:true
    return req.respond(result)

sio.route('users', {
  resetpwd: resetpwd
  get_code: get_code
  login: userLogin,
  index: crl_role userIndex,"all"
  session: getSession
  get: userGet,
  pwdUpdate: userPwdSet,
  get_PIN:get_user_PIN
  clear_code: clear_code
  re_connect: re_connect
});
