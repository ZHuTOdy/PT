PT_Train = new Vue({
        el: "#PT_Train",
        data: {
            Project_select: "",
            isexist_select: "在职",
            isLine_select: "",
            Project_options: [{ value: "B0019", label: "B0019", }, { value: "B0052", label: "B0052", }, { value: "B0053", label: "B0053", },
            ],
            isLineOptions: [{ value: "是", label: "是", }, { value: "否", label: "否", },
            ],
            isexistOptions: [{ value: "在职", label: "在职", }, { value: "离职", label: "离职", },
            ],
            searchByNum: "",
            searchByNickname: "",
            dateFrom: "",
            tabel:{
                page: 0,
                pageSize: 0,
                total: 0,
                items: [],
            }
            
        },
        methods: {
            getTableDate : ()->
                that =this;
                query={}
                query = init_query(query)
                console.log "query:",query
                socket.emit "pt_train.getTableDate", query,that.tabel.page,that.tabel.pageSize,(res)-> 
                    if res.err
                        that.$message.error(res.err)
                    else if res.data
                        console.log "获取到查询数据"
                        Object.assign(that.tabel, res.data);
                        for people in that.tabel.items
                            people.enabled = if people.enabled == true then "在职" else "离职"
                        console.log "that.tabel",that.tabel
                
            handleSizeChange:(pageSize)->
                this.tabel.pageSize = pageSize
                PT_Train.getTableDate()
            handleCurrentChange:(page)->
                this.tabel.page = page
                PT_Train.getTableDate()
            
        }
    });
init_query  =(query)->
    query.project = PT_Train.Project_select if PT_Train.Project_select !=""
    query.isLine_select = PT_Train.isLine_select if PT_Train.isLine_select !=""
     
    if PT_Train.isexist_select !=""
        query.enabled = if PT_Train.isexist_select =="在职" then true else false
    query.fromDate= PT_Train.dateFrom[0].toLocaleDateString() if PT_Train.dateFrom[0] && PT_Train.dateFrom[0] !=""
    query.toDate = PT_Train.dateFrom[1].toLocaleDateString() if PT_Train.dateFrom[1] && PT_Train.dateFrom[1] !=""
    query.username ={$regex:PT_Train.searchByNum} if PT_Train.searchByNum !=""
    query.nickname ={$regex:PT_Train.searchByNickname}  if PT_Train.searchByNickname !=""
    return query
    