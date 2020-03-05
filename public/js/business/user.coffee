userVue = new Vue({
  el: "#userVue",
  data: {
    items: []
    page: 0
    pageSize: 10
    total: 0
    dialogVisible:false
    aUser: {}
  },
  methods:
    handleSizeChange: (pageSize)->
      userVue.$data.pageSize = pageSize
      init_list()
    handleCurrentChange: (page)->
      userVue.$data.page = page
      init_list()
    addUser: ()->
      console.log "AAAAAAAAAAAA"
      socket.emit "user.add_user", userVue.$data.aUser, (res)->
        console.log "resresres：",res
        userVue.$data.dialogVisible = false
        init_list()
    deleteUser: (index, data)->
      console.log "AAAAAAAAAAAA:",index,data
      query = {username: data.username }
      socket.emit "user.delete_user", query, (res)->
        init_list()
})




init_list = ()->
  page = userVue.$data.page
  pageSize = userVue.$data.pageSize
  socket.emit "user.list", {}, page, pageSize, (res)->
    console.log "resresres:",res
    return alert( res.err ) if res.err
    Object.assign( userVue.$data, res ) 
    # userVue.$data.users = res || [] 

init_list()