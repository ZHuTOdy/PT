code = new Vue({
  el: "#code",
  data: {
    options: [{
      value: 'all',
      label: '全部'
    }, {
      value: 'B0001',
      label: 'B0001'
    }, {
      value: 'B0002',
      label: 'B0002'
    }, {
      value: 'B0003',
      label: 'B0003'
    }, {
      value: 'B0005',
      label: 'B0005'
    }, {
      value: 'B0006',
      label: 'B0006'
    }, {
      value: 'B0007',
      label: 'B0007'
    }, {
      value: 'B0009',
      label: 'B0009'
    }, {
      value: 'B0011',
      label: 'B0011'
    }, {
      value: 'B0012',
      label: 'B0012'
    }, {
      value: 'B0014',
      label: 'B0014'
    }, {
      value: 'B0051',
      label: 'B0051'
    }, {
      value: 'B0053',
      label: 'B0053'
    }, {
      value: 'B0054',
      label: 'B0054'
    }, {
      value: 'B0055',
      label: 'B0055'
    }, {
      value: 'B0056',
      label: 'B0056'
    }, {
      value: 'B0057',
      label: 'B0057'
    }, {
      value: 'B0101',
      label: 'B0101'
    }, {
      value: 'B0103',
      label: 'B0103'
    }, {
      value: 'B0106',
      label: 'B0106'
    }, {
      value: 'B0110',
      label: 'B0110'
    }, {
      value: 'B0111',
      label: 'B0111'
    }, {
      value: 'B0113',
      label: 'B0113'
    }, {
      value: 'B0114',
      label: 'B0114'
    }, {
      value: 'B0152',
      label: 'B0153'
    }],
    value: ''
  },
  methods: {
    handleChange: (project)->
      dailyReportTable.$data.project = project
      init_list()
  }
});

dateRange = new Vue({
  el: "#dateRange",
  data: {
    date : ""
  },
  methods: {
    handleChange: (dateRange)->
      dailyReportTable.$data.dateRange = dateRange
      init_list()
  }
});



dailyReportTable = new Vue({
	el: "#dailyReportTable",
	data:{
		items: []
		page: 0
		pageSize: 10
		total: 0
		Selection: []
	},
	methods:
		handleSizeChange: (pageSize)->
			dailyReportTable.$data.pageSize = pageSize
			init_list()
		handleCurrentChange: (page)->
			dailyReportTable.$data.page = page
			init_list()
		handleSelectionChange: (val)->
			this.Selection = val
})

init_list = ()->
	page = dailyReportTable.$data.page
	pageSize = dailyReportTable.$data.pageSize
	project = dailyReportTable.$data.project
	fromTime = date.$data.date[0] || "2000-01-01"
	toTime = date.$data.date[1] || "2111-12-31"
	socket.emit "takeJob.list", {"project" : project, "dateRange" : "date":{$gte:fromTime, $lte:toTime }}, page, pageSize,  (res)->
		return alert( res.err ) if res.err
		Object.assign( dailyReportTable.$data, res ) 

init_list()