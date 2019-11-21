ejsExcel = require("./node_modules/ejsExcel-master/ejsExcel")
fs = require 'fs'
async = require 'async'
mkdirp = require 'mkdirp'
moment = require 'moment'
node_xlsx = require 'node-xlsx'

list = (req)->
    query = req.data[0] || {} #客户端发送过来的第一个参数
    page = req.data[1] || 1 #客户端发送过来的第二个参数
    pageSize = req.data[2] || 10
    console.log "查询条件：",query
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
    query = {_id:ObjectId(req.data[0])} || {}
    user_db.takeJobPlan.remove query, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        console.log "删除成功"
        return req.respond({"succee": true})

add_plan = (req)->
    data = req.data[0] || {}
    user_db.takeJobPlan.insert data, (err, res) ->
        return req.respond({ err : "操作失败"}) if err
        return req.respond({"succee": true})

edit_plan = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    set = req.data[1] || {}
    user_db.takeJobPlan.update query, set, (err, res)->
        console.log "修改数据成功" if not err
        console.log "修改数据失败" if err
        return req.respond( {"succee": true} )

edit_channel = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    set = req.data[1] || {}
    set.$set.updateDate = moment().format('YYYY-MM-DD')
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

listResume = (req)->
    query = req.data[0] || {}
    page = req.data[1] || 1
    pageSize = req.data[2] || 10
    user_db.resume.count query, (err, total)->
        console.log "查询条件：：",query
        console.log "listResume_err", err if err
        return req.respond({err: "查询失败"}) if err
        toArray user_db.resume.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            console.log "listResume_query_err:", err if err
            result = succeeRes(items, page, pageSize, total)
            return req.respond({err : "查询失败"}) if err2
            return req.respond(result)

download = (req)->
    data = req.data[0]
    xmlModel = fs.readFileSync("../public/excel/resumeModel.xlsx")
    ejsExcel.renderExcelCb xmlModel, data, (err, exlBuf2) ->
        return req.respond {err:"生成Excel错误", err} if err
        downloadPath = __dirname.replace(/src.*/,"public/excel/")
        downloadTime = moment().format("YYYYMMDD")
        file_name = "简历库导出_#{downloadTime}"
        mkdirp downloadPath, (err) ->
            return req.respond {err:"生成路径错误"} if err
            fs.writeFileSync "#{downloadPath}#{file_name}.xlsx", exlBuf2
            req.respond "#{downloadPath}#{file_name}.xlsx".replace(/^.*?public\//,"")

deleteResume = (req)->
    data = req.data[0]
    for i in data
        user_db.resume.remove {_id:ObjectId(i._id)},(err, res)->
            return req.respond({ err : "操作失败"}) if err
            console.log "删除成功"
    return req.respond({"succee": true})

uploadResume = (req)->
    formData = req.data[0]
    fileName = req.data[1]
    console.log "导入简历库表格",fileName
    filePath = "/home/PT/public/excel/#{fileName}"
    fs.writeFileSync filePath, formData
    workSheetsFromBuffer = node_xlsx.parse(fs.readFileSync(filePath))
    excelObj = workSheetsFromBuffer[0].data
    insertData = []
    for i in excelObj
        insertData.push(i)
    # insertData:[ [ '来源', '姓名', '手机号', '邮箱', '日期', '备注' ],
#   [ '智联招聘',
#     '朱镕杰',
#     '18163134887',
#     '794670014@qq.com',
#     '2019-11-11',
#     '测试下载模版' ] ]
    insertData.shift()
    obj = []
    for items, i in insertData
        obj.push({"from":items[0],"name":items[1],"phone":items[2],"email":items[3],"date":items[4],"remarks":items[5]})
    user_db.resume.insertMany obj,(err,res)->
        return req.respond({ err : "insertMany报错拉"}) if err
        console.log "添加成功"
        fs.unlink filePath, (err)->
            console.log err if err
            console.log "删除导入Excel成功"
    return req.respond({"succee": true})


pt_io.route('takeJob', {
  list: list
  delete_plan: delete_plan
  add_plan: add_plan
  edit_plan: edit_plan
  edit_channel: edit_channel
  list_channel: list_channel
  deleteChannel: deleteChannel
  addChannel: addChannel
  listResume: listResume
  download: download
  deleteResume: deleteResume
  uploadResume: uploadResume
})