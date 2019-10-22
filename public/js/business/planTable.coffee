planTable = new Vue({
    el: "#planTable",
    data:{
        planTable: []
        page: 0
        pageSize: 10
        total: 0
        dialogVisible:false
        aUser: {}
    },
    methods:
        handleSizeChange: (pageSize)->
            planTable.$data.pageSize = pageSize
            init_list()
        handleCurrentChange: (page)->
            planTable.$data.page = page
            init_list()
        # addUser: ()->
        #     console.log "AAAAAAAAAAAA"
        #     socket.emit "user.add_user", userVue.$data.aUser, (res)->
        #         console.log "resresres：",res
        #         userVue.$data.dialogVisible = false
        #         init_list()
        # deleteUser: (index, data)->
        #     console.log "AAAAAAAAAAAA:",index,data
        #     query = {username: data.username }
        #     socket.emit "user.delete_user", query, (res)->
        #         init_list()
})

init_list = ()->
  page = planTable.$data.page
  pageSize = planTable.$data.pageSize
  socket.emit "takeJob.list", {}, page, pageSize, (res)->
    console.log "res::",res
    return alert( res.err ) if res.err
    Object.assign( planTable.$data, res ) 
    # userVue.$data.users = res || [] 

init_list()