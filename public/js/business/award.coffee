name = new Vue({
  el: "#name",
  data: {
    username1: ""
    nickname1: ""
    username2: ""
    nickname2: ""
  },
  methods: {
    # 
  }
});


awardTable = new Vue({
	el: "#awardTable",
	data:{
		items: []
		page: 0
		pageSize: 10
		total: 0
		Selection: []
	},
	methods:{
		# handleSizeChange: (pageSize)->
		# 	payrollTable.$data.pageSize = pageSize
		# 	init_list()
		# handleCurrentChange: (page)->
		# 	payrollTable.$data.page = page
		# 	init_list()
		# handleSelectionChange: (val)->
		# 	this.Selection = val
	}	
})

init_list = ()->
	page = payrollTable.$data.page
	pageSize = payrollTable.$data.pageSize
	username1 = name.$data.username
	nickname1 = name.$data.nickname
	username2 = name.$data.username
	nickname2 = name.$data.nickname
	# socket.emit "report.xxx",{username1" :{$regex:username1},"code" : code,"nickname1" :{$regex:nickname1},username2" :{$regex:username2},"nickname2" :{$regex:nickname2}},page, pageSize,  (res)->
	# 	return alert( res.err ) if res.err
	# 	Object.assign( payrollTable.$data, res ) 

init_list()