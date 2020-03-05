month = new Vue({
	el: "#month",
	data: {
		month : ""
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


payrollTable = new Vue({
	el: "#payrollTable",
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
	page = payrollTable.$data.page
	pageSize = payrollTable.$data.pageSize
	month = monthlyReport.$data.month
	username = name.$data.username
	nickname = name.$data.nickname
	# socket.emit "report.xxx", {"month":{$regex:month},"username" :{$regex:username},"nickname" :{$regex:nickname}},page, pageSize,  (res)->
	# 	return alert( res.err ) if res.err
	# 	Object.assign( payrollTable.$data, res ) 

init_list()