month = new Vue({
  el: "#month",
  data: {
    month : ""
  },
  methods: {
    #
  }
});

code = new Vue({
  el: "#code",
  data: {
    props: { multiple: true },
    options: [{
      value: 'all',
      label: '全部',
      children: [{
        value: "pro_QY",
        label: '契约',
        children: [
          { value: "B0001", label: 'B0001' },
          { value: "B0002", label: 'B0002' },
          { value: "B0003", label: 'B0003' },
          { value: "B0005", label: 'B0005' },
          { value: "B0006", label: 'B0006' },
          { value: "B0007", label: 'B0007' },
          { value: "B0009", label: 'B0009' },
          { value: "B0011", label: 'B0011' },
          { value: "B0012", label: 'B0012' },
          { value: "B0014", label: 'B0014' }
        ]
      }, {
        value: "pro_BQ",
        label: '保全',
        children: [
          { value: "B0051", label: 'B0051' },
          { value: "B0053", label: 'B0053' },
          { value: "B0054", label: 'B0054' },
          { value: "B0055", label: 'B0055' },
          { value: "B0056", label: 'B0056' },
          { value: "B0057", label: 'B0057' }
        ]
      }, {
        value: "pro_LP",
        label: '理赔',
        children: [
          { value: "B0101", label: 'B0101' },
          { value: "B0103", label: 'B0103' },
          { value: "B0106", label: 'B0106' },
          { value: "B0110", label: 'B0110' },
          { value: "B0111", label: 'B0111' },
          { value: "B0113", label: 'B0113' },
          { value: "B0114", label: 'B0114' }
        ]
      }, {
        value: "pro_JH",
        label: '交行',
        children: [
          { value: "B0101", label: 'B0101' }          
        ]
      }]
    }]
  },  
  methods: {
    handleChange: (code)->
      dailyReport.$data.code = code
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
    # 
  }
});


complaintTable = new Vue({
	el: "#complaintTable",
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
	month = monthlyReport.$data.month
	username = name.$data.username
	nickname = name.$data.nickname
	# socket.emit "report.list", {"month":{$regex:month},"username" :{$regex:username},"nickname" :{$regex:nickname}},page, pageSize,  (res)->
	# 	return alert( res.err ) if res.err
	# 	Object.assign( payrollTable.$data, res ) 

init_list()