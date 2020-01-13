date = new Vue({
  el: "#date",
  data: {
    date : ""
  },
  methods: {
    handleChange: (date)->
      dailyReport.$data.date = date
      init_list()
    # handleChange: ()->
    #   init_list()
    
  }
});

name = new Vue({
  el: "#name",
  data: {
    username: ""
    nickname: ""
  },
  methods: {
    handleChange: ()->
      init_list()
  }
});


timeTable = new Vue({
	el: "#timeTable",
	data:{
		items: []
		page: 0
		pageSize: 10
		total: 0
		Selection: []
	},
	methods:{
		handleSizeChange: (pageSize)->
			timeTable.$data.pageSize = pageSize
			init_list()
		handleCurrentChange: (page)->
			timeTable.$data.page = page
			init_list()
		handleSelectionChange: (val)->
			this.Selection = val
	}	
})

init_list = ()->
	page = timeTable.$data.page
	pageSize = timeTable.$data.pageSize
	fromTime = date.$data.date[0] || "2000-01-01"
	toTime = date.$data.date[1] || "2111-12-31"
	username = name.$data.username
	nickname = name.$data.nickname
	# socket.emit "report.list", {"date":{$gte:fromTime, $lte:toTime },"username" :{$regex:username},"nickname" :{$regex:nickname}},page, pageSize,  (res)->
	# 	return alert( res.err ) if res.err
	# 	Object.assign( timeTable.$data, res ) 

init_list()