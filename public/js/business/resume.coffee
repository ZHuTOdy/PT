name = new Vue({
    el: "#name",
    data: {
        name: ""
    }
    # methods: {
    #     download: ()->
    #         console.log "下载数据"
    #     update: ()->
    #         console.log "导入数据"
    #     delete: ()->
    #         console.log "删除数据"
    # }
});

phone = new Vue({
    el: "#phone",
    data: {
        phone: ""
    }
    # methods: {
    #     download: ()->
    #         console.log "下载数据"
    #     update: ()->
    #         console.log "导入数据"
    #     delete: ()->
    #         console.log "删除数据"
    # }
});

date = new Vue({
    el: "#date",
    data: {
        date: ""
    }
    methods: {
        download: ()->
            console.log "下载数据"
        upload: ()->
            console.log "导入数据"
        deleteAll: ()->
            console.log "删除数据"
    }
});

resumeTable = new Vue({
    el: "#resumeTable",
    data: {
        items: []
        page: 0
        pageSize: 10
        total: 0
    },
    methods: {
        handleSizeChange: (pageSize)->
            planTable.$data.pageSize = pageSize
            init_list()
        handleCurrentChange: (page)->
            planTable.$data.page = page
            init_list()
        handleSelectionChange: ()->
            console.log("选中")
    }
});

init_list = ()->
    page = resumeTable.$data.page
    pageSize = resumeTable.$data.pageSize
    permission = resumeTable.$data.permission
    name = name.$data.name
    phone = phone.$data.phone
    console.log "name::",name
    console.log "phone::",phone
    # socket.emit "takeJob.listResume", {"permission" : permission, "date" : {$regex: date}}, page, pageSize, (res)->
    #     return alert( res.err ) if res.err
    #     Object.assign( planTable.$data, res ) 
    socket.emit "takeJob.listResume", {}, page, pageSize, (res)->
        return alert(res.err) if res.err
        Object.assign(resumeTable.$data, res)
init_list();