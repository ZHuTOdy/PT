fs = require 'fs'
async = require 'async'
moment = require 'moment'
API = require('dingtalk-node')
exec = require('child_process').exec
mkdirp = require('mkdirp')
# path = __dirname.replace(/\\/g, '/') +

api = new API({
    domain: 'https://oapi.dingtalk.com',
    cid: 'ding5d3a0a3bbdd6d098',
    secret: 'Yg8vgAg6splMZOZkz1wJlQz7VGM6e_NFb5sJ7Z5nAbqylM3aPzd9xplObNQtAbph',
    redirect_uri: 'REDIRECT_URI'
})

# mongo_url = "mongodb://192.168.0.99:27017/dingding";
# ding_db = mongo.db(mongo_url, {native_parser:true});
# ding_db.bind('history')


ding_clear_time = 7 #清理数据时间间隔  单位/天
ding_mess_num = 3 #同一错误通知次数  单位/次数
ding_mess_time = 30 #同一错误通知发送间隔   单位/分钟


log_path = '/var/log/PTSystem/nodejs/';

mkdirp.sync(log_path)

process.env.STY = process.env.STY || "mess"

mess_record = log_path + process.env.STY.replace( /^\d+\./, "" ) + ".json"


module.exports = (mess,names,callback) ->
  # time = parseInt( moment().format("HHmm") )
  # return callback null if time < 900 || time > 2200 || !/华夏人寿/.test( mess )
  if typeof names == "function"
    callback = names
    names = "陈少枫,黎志光,闻波,刘文波,甘明锋,朱远榕,黄爱云,焦锋"
  # read_file mess, (err3, items) ->
    # return callback err3 if err3
    api.userSimplelist {department_id: 1}, (err, users)->
      touser = ""
      for user in users?.userlist || []
        if names.indexOf( user.name ) != -1
          touser = touser + "|" +  user.userid
    # 去掉字符串开头的"|"
      touser = touser.replace(/^\|/, "" )
    # console.log("touser:",touser)
      api.messageSend { touser ,agentid:"11952976",msgtype:"text",text:{"content": mess } }, (err2, res)->
        return callback err2 if err2
        # fs.writeFile mess_record, JSON.stringify( items ), callback



global.check_ding_id = (phone, callback)->
  api.departmentList (err, data)->
    departments = data?.department || []
    async.eachSeries departments, ( department , next ) ->
      api.userList {department_id: department.id}, (err2, users)->
        for user in users?.userlist || []
          if user.mobile == phone
            return setTimeout next,0,user.userid
        return setTimeout next,0
    , callback


global.ding_message_send = (mess, touser, callback)->
  console.log "mess:",mess
  console.log "touser:",touser
  # read_file mess, (err3, items) ->
  #   return callback err3 if err3
  api.messageSend { touser ,agentid:"11952976",msgtype:"text",text:{"content": mess } }, (err2, res)->
    # console.log "ding_message_send:#{err2}"
    return callback err2 
      # fs.writeFile mess_record, JSON.stringify( items ), callback

global.ding_mess_names = (mess, names, callback) ->
  if typeof names == "function"
    callback = names
    names = "陈少枫,黎志光,刘文波,甘明锋,朱远榕,黄爱云,肖亚娇,焦锋"
  api.userSimplelist {department_id: 1}, (err, users)->
    touser = ""
    for user in users?.userlist || []
      if names.indexOf( user.name ) != -1
        touser = touser + "|" +  user.userid
    touser = touser.replace(/^\|/, "" )
    # console.log("touser:",touser)
    api.messageSend { touser ,agentid:"11952976",msgtype:"text",text:{"content": mess } }, (err2, res)->
      return callback err2

read_file = (mess, callback)->
  fs.readFile mess_record, (err, items) ->
    if err
      return callback err if err.message && err.message.indexOf("no such file or directory") == -1
      items = {}
    else
      try
        items = JSON.parse(items)
      catch e
        items = {}
    day = moment().format("YYYYMMDD")
    time = moment().format("HHmmss")
    clear_day = moment().subtract(ding_clear_time, 'days').format("YYYYMMDD")
    clear_time = moment().subtract(ding_mess_time, 'minutes').format("HHmmss")
    items[day] = {} if items[day] == undefined
    keys = Object.keys items
    for key in keys
      if key < clear_day
        delete items[key]
        continue
      if items[key][mess] != undefined && key == day
        num = items[key][mess].length
        if num < ding_mess_num && items[key][mess][num - 1] <= clear_time
          items[key][mess].push( time )
          return callback null,items
        else
          return callback "无需发送信息"
    items[day][mess] = [ time ]
    return callback null,items
