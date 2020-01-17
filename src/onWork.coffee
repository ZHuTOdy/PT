ejsExcel = require("./node_modules/ejsExcel-master/ejsExcel")
fs = require 'fs'
async = require 'async'
mkdirp = require 'mkdirp'
moment = require 'moment'
node_xlsx = require 'node-xlsx'


addRule = (req)->
    data = req.data[0] || {}
    user_db.rule.insert data, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        return req.respond({"succee": true})

updateRule = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    set = req.data[1] || {}
    console.log query
    console.log set
    user_db.rule.update query, set, (err, res)->
        console.log "修改数据成功" if not err
        console.log "修改数据失败" if err
        return req.respond( {"succee": true} )

deleteRule = (req)->
    query = {_id:ObjectId(req.data[0])} || {}
    user_db.rule.remove query, (err, res)->
        return req.respond({ err : "操作失败"}) if err
        console.log "删除成功"
        return req.respond({"succee": true})

deleteList = (req)->
    data = req.data[0]
    for i in data
        user_db.OnWork.remove {_id:ObjectId(i._id)},(err, res)->
            return req.respond({ err : "操作失败"}) if err
            console.log "删除成功"
    return req.respond({"succee": true})

listRule = (req)->
    query = req.data[0] || {}
    page = req.data[1] || 1
    pageSize = req.data[2] || 10
    user_db.rule.count query, (err, total)->
        return req.respond({err: "查询失败"}) if err
        toArray user_db.rule.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            console.log "listRule:", err if err
            result = succeeRes(items, page, pageSize, total)
            return req.respond({err : "查询失败"}) if err2
            return req.respond(result)

list = (req)->
    query = req.data[0] || {}
    page = req.data[1] || 1
    pageSize = req.data[2] || 10
    user_db.OnWork.count query, (err, total)->
        console.log "total:",total
        console.log "查询条件：：",query
        console.log "OnWork_err", err if err
        return req.respond({err: "查询失败"}) if err
        toArray user_db.OnWork.find(query, {}, {
            skip: (parseInt(page) - 1) * parseInt pageSize
            limit: parseInt pageSize
            # sort: sort
        }), (err2 , items)->
            console.log "OnWork_query_err:", err if err
            result = succeeRes(items, page, pageSize, total)
            return req.respond({err : "查询失败"}) if err2
            return req.respond(result)

upload = (req)->
    formData = req.data[0]
    fileName = req.data[1]
    console.log "导入在岗名单"
    filePath = "/Users/todyzhu/Documents/excelUpload/#{fileName}"
    fs.writeFileSync filePath, formData
    workSheetsFromBuffer = node_xlsx.parse(filePath)
    excelObj = workSheetsFromBuffer[0].data
    console.log "workSheetsFromBuffer:",JSON.stringify workSheetsFromBuffer
    excelObj.shift()
    obj = []
    # console.log "insertData:",insertData
    for items in excelObj
        console.log "items:",items
        items[11] = items[11] || ""
        obj.push({"ID":items[0]+"","nickname":items[1],"sex":items[2],"phone":items[3]+"","project":items[4],"permission":items[5],"level":items[6],"OnDate":items[7]+"","OnLineDate":items[8]+"","remark":items[9],"status":items[10],"closeDate":items[11]})
    user_db.OnWork.insertMany obj,(err,res)->
        return req.respond({ err : "insertMany报错拉"}) if err
        console.log "添加成功"
        fs.unlink filePath, (err)->
            console.log err if err
            console.log "删除导入Excel成功"
    return req.respond({"succee": true})

download = (req)->
    data = req.data[0]
    xmlModel = fs.readFileSync("../public/excel/onTheListModel.xlsx")
    ejsExcel.renderExcelCb xmlModel, data, (err, exlBuf2) ->
        return req.respond {err:"生成Excel错误", err} if err
        downloadPath = __dirname.replace(/src.*/,"public/excel/")
        downloadTime = moment().format("YYYYMMDD")
        file_name = "在岗名单导出_#{downloadTime}"
        mkdirp downloadPath, (err) ->
            return req.respond {err:"生成路径错误"} if err
            fs.writeFileSync "#{downloadPath}#{file_name}.xlsx", exlBuf2
            req.respond "#{downloadPath}#{file_name}.xlsx".replace(/^.*?public\//,"")

pt_io.route('onWork', {
    addRule: addRule
    listRule: listRule
    updateRule: updateRule
    deleteRule: deleteRule
    upload: upload
    download: download
    list: list
    deleteList: deleteList
})