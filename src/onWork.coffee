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



pt_io.route('onWork', {
    addRule: addRule
    listRule: listRule
    updateRule: updateRule
    deleteRule: deleteRule
})