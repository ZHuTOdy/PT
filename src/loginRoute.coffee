express = require("express");
router = express.Router();
dingding = require "./dingding"
global.projects = {}
ncrypto = require('crypto')

md5 = (pswd)->
  if not pswd
    pswd = ''
  hash = ncrypto.createHash('md5')
  hash.update(pswd)
  return hash.digest('hex')

# 检查cookie是否过期
# 不过期则直接登录
router.post("/checkLogin", (req,res)->
    console.log("cookies:",req.signedCookies)
    if req.signedCookies.username
        userName = req.signedCookies.username
        console.log("此用户cookie未过期，直接登录")
        query = {username: userName}
        result = {}
        # console.log "loginQuery:",query
        user_db_sys_user.users.findOne query, (err, user)->
            toArray user_db.conf.find({}, {}),(err, items)->
                toArray user_db_sys_user.users.find({"username":/^P/, "enabled":true},{"username":1,"nickname":1}), (err,pt)-> #找出所有在职的PT
                    console.log "err:",err if err
                    global.glo_projects = items #全部PT所能使用的项目配置
                    data = {}
                    data.username = user.username
                    data.nickname = user.nickname
                    data.role = user.role
                    data.login_at = +moment()
                    result.data = data
                    result.projects = items
                    result.pt = pt
                    result.status = "success"
                    console.log "#{user.username}:#{user.nickname}登录成功"
                    return res.send(result)

)


#新登录 使用Post请求 并加入cookie
# 20200109 ZHu
router.post("/login", (req,res)->
  username = req.body.username
  password = req.body.password
  console.log(JSON.stringify(req.body))
  result = {}
  # 检查密码的正确性
  msg = checkPwd password
  # console.log "msg:",msg
  if msg
    result.err = msg
    return res.send(result)
  query = {username: username}
  # console.log "loginQuery:",query
  user_db_sys_user.users.findOne query, (err, user)->
    # console.log "founduser:",user
    if err || not user || user == undefined
      result.err = '登录失败，用户不存在';
      return res.send(result)
    else
      if !user.enabled #离职状态
        result.err = '对不起,此用户已经离职,已经不能登录';
        return res.send(result)
      if user.password == md5(password)
        toArray user_db.conf.find({}, {}),(err, items)->
          toArray user_db_sys_user.users.find({"username":/^P/, "enabled":true},{"username":1,"nickname":1}), (err,pt)-> #找出所有在职的PT
            console.log "err:",err if err
            global.glo_projects = items #全部PT所能使用的项目配置
            res.cookie("username", username, {maxAge:60*1000*60, signed:true})
            data = {}
            data.username = user.username
            data.nickname = user.nickname
            data.role = user.role
            data.login_at = +moment()
            result.data = data
            result.projects = items
            result.pt = pt
            result.status = "success"
            console.log "#{user.username}:#{user.nickname}登录成功"
            return res.send(result)
      else
        result.err = '密码错误，请重新输入';
        return res.send(result)
)

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

module.exports = router;

