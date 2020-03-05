date = new Vue({
	el: "#date",
	data: {
		date : ""
	},
	methods: {
		handleChange: ()->
			init_list()
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
		handleSelectionChange:()->
			init_list() 
		handleSizeChange: (pageSize)->
			dailyReportTable.$data.pageSize = pageSize
			init_list()
		handleCurrentChange: (page)->
			dailyReportTable.$data.page = page
			init_list()
	}	
})

init_list = ()->
	page = timeTable.$data.page
	pageSize = timeTable.$data.pageSize
	romTime = date.$data.date[0] || ""
	toTime = date.$data.date[1] || ""
	username = name.$data.username
	nickname = name.$data.nickname
	# socket.emit "report.xxx", "date":{$gte:fromTime, $lte:toTime },"username" :{$regex:username},"nickname" :{$regex:nickname}},page, pageSize,  (res)->
	# 	return alert( res.err ) if res.err
	# 	Object.assign( timeTable.$data, res ) 

init_list()