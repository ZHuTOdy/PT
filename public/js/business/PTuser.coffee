
userVue = new Vue({
  el: "#userVue",
  data: {
    dialogVisible:false
    InformationDialogVisible:false
    InformationDialogData:{
      data:[]
      index:null
    }
    enabled_select:"在职"
    searchByNum: ""
    searchByNickname: ""
    searchByEnabled:""
    searchByTeam:""
    isexistOptions: [{ value: "在职", label: "在职", }, { value: "离职", label: "离职", }]
    aUser: {}
    ptUserTable:{
      items: []
      page: 0
      pageSize: 10
      total: 0
    }
  },
  methods:{
    handleSizeChange: (pageSize)->
      this.InformationDialogData.index =null
      this.ptUserTable.pageSize = pageSize
      this.searchTable()
    handleCurrentChange: (page)->
      this.ptUserTable.page = page
      this.InformationDialogData.index =null
      # console.log "this.ptUserTable.page",this.ptUserTable.page
      this.searchTable()
    addUser: ()->
      console.log "addUser."
      that = this
      socket.emit "pt_train.add_user", that.$data.aUser, (res)->
        console.log "resresres：",res
        that.$data.dialogVisible = false
        init_list()
    deleteUser: (index, data)->
      that = this;
      # console.log "deleUser.:",index,data

      query = {_id: data._id }
      console.log "Deletequery:",query
      that.$confirm("此操作将永久删除该用户,是否继续?","提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then( ()->
        socket.emit "pt_train.delete_user", query, (res)->
          if res.err
            that.$message.error("删除失败!")
          else if res.success
            that.$message.success("删除成功!")
          init_list()
      ).catch( ()->
        that.$message.info("已取消删除")
      )
      # socket.emit "pt_train.delete_user", query, (res)->
      #   init_list()
    information: (index,data)->
      # console.log "index:",index;
      # console.log "data:",data
      if this.InformationDialogData.index !=index
        this.InformationDialogData.data = []
        this.InformationDialogData.index =index
        for key,value of data.role
          this.InformationDialogData.data.push({"proj":key,"roles":value}) 
      this.InformationDialogVisible = true
    searchTable: ()->
      that = this
      $('#searchButton').attr('disabled',true)
      query={}
      page = userVue.$data.ptUserTable.page
      pageSize = userVue.$data.ptUserTable.pageSize
      query= get_query query
      console.log "searchQuery:",query
      socket.emit "pt_train.list", query, page, pageSize, (res)->
        $('#searchButton').removeAttr('disabled');
        return that.$message.warning(res.err)if res.err
        Object.assign( userVue.ptUserTable, res.data ) 
        for people in userVue.ptUserTable.items
          people.enabled = if people.enabled == true then "在职" else "离职"

  }
})




init_list = ()->
  page = userVue.$data.ptUserTable.page
  pageSize = userVue.$data.ptUserTable.pageSize
  # console.log "page:#{page},pageSize:#{pageSize}"
  # console.info "init_list"
  socket.emit "pt_train.list", {}, page, pageSize, (res)->
    # console.log "resresres:",res
    return alert( res.err ) if res.err
    Object.assign( userVue.ptUserTable, res.data ) 
    for people in userVue.ptUserTable.items
      people.enabled = if people.enabled == true then "在职" else "离职"

get_query  =(query)->
    # query.project = userVue.Project_select if userVue.Project_select !=""
    # query.isLine_select = userVue.isLine_select if userVue.isLine_select !=""
    # query.fromDate= userVue.dateFrom[0].toLocaleDateString() if userVue.dateFrom[0] && userVue.dateFrom[0] !=""
    # query.toDate = userVue.dateFrom[1].toLocaleDateString() if userVue.dateFrom[1] && userVue.dateFrom[1] !=""
    if userVue.enabled_select !=""
        query.enabled = if userVue.enabled_select =="在职" then true else false
    query.username ={$regex :userVue.searchByNum} if userVue.searchByNum !=""
    query.nickname ={$regex :userVue.searchByNickname} if userVue.searchByNickname !=""
    query.team ={$regex : userVue.searchByTeam} if userVue.searchByTeam !=""
    return query
init_list()
