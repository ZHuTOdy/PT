// Generated by CoffeeScript 2.3.0
(function() {
  var get_project, init_list, month, monthlyReportTable, projectVue;

  projectVue = new Vue({
    el: "#project",
    data: {
      options: [
        {
          value: 'all',
          label: '全部',
          children: [
            {
              value: "pro_QY",
              label: '契约',
              children: [
                {
                  value: "百年新契约",
                  label: 'B0001'
                },
                {
                  value: "华夏人寿",
                  label: 'B0002'
                },
                {
                  value: "信泰新契约",
                  label: 'B0003'
                },
                {
                  value: "农银新契约",
                  label: 'B0005'
                },
                {
                  value: "幸福新契约",
                  label: 'B0006'
                },
                {
                  value: "北大方正新契约",
                  label: 'B0009'
                },
                {
                  value: "同方全球新契约",
                  label: 'B0011'
                },
                {
                  value: "上海人寿契约",
                  label: 'B0012'
                },
                {
                  value: "前海人寿契约",
                  label: 'B0014'
                },
                {
                  value: "合众人寿契约",
                  label: 'B0016'
                },
                {
                  value: "横琴新契约",
                  label: 'B0017'
                }
              ]
            },
            {
              value: "pro_BQ",
              label: '保全',
              children: [
                {
                  value: "太平人寿",
                  label: 'B0051'
                },
                {
                  value: "百年保全",
                  label: 'B0053'
                },
                {
                  value: "上海人寿保全",
                  label: 'B0054'
                },
                {
                  value: "中意保全",
                  label: 'B0055'
                },
                {
                  value: "民生人寿保全",
                  label: 'B0056'
                },
                {
                  value: "合众人寿保全",
                  label: 'B0058'
                },
                {
                  value: "新合众人寿保全",
                  label: 'B0059'
                }
              ]
            },
            {
              value: "pro_LP",
              label: '理赔',
              children: [
                {
                  value: "民生理赔",
                  label: 'B0101'
                },
                {
                  value: "广西贵州国寿理赔",
                  label: 'B0103'
                },
                {
                  value: "陕西国寿理赔",
                  label: 'B0106'
                },
                {
                  value: "新疆国寿理赔",
                  label: 'B0110'
                },
                {
                  value: "云南国寿理赔",
                  label: 'B0111'
                },
                {
                  value: "百年理赔",
                  label: 'B0113'
                },
                {
                  value: "华夏理赔",
                  label: 'B0114'
                },
                {
                  value: "华夏人寿团险理赔",
                  label: 'B0116'
                },
                {
                  value: "北大方正理赔",
                  label: 'B0117'
                },
                {
                  value: "中意理赔",
                  label: 'B0118'
                }
              ]
            },
            {
              value: "pro_JH",
              label: '交行',
              children: [
                {
                  value: "交通银行大平台",
                  label: 'B0101'
                }
              ]
            }
          ]
        }
      ],
      value: ''
    },
    methods: {
      handleChange: function() {
        return init_list();
      }
    }
  });

  month = new Vue({
    el: "#month",
    data: {
      month: ""
    },
    methods: {
      handleChange: function() {
        return init_list();
      }
    }
  });

  monthlyReportTable = new Vue({
    el: "#monthlyReportTable",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
      Selection: []
    },
    methods: {
      handleSelectionChange: function() {
        return init_list();
      },
      handleSizeChange: function(pageSize) {
        dailyReportTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        dailyReportTable.$data.page = page;
        return init_list();
      }
    }
  });

  init_list = function() {
    var page, pageSize, project;
    page = monthlyReportTable.$data.page;
    pageSize = monthlyReportTable.$data.pageSize;
    project = get_project();
    return month = monthlyReport.$data.month;
  };

  // socket.emit "report.xxx", {"project" : project, "month":{$regex:month} }, page, pageSize,  (res)->
  // 	return alert( res.err ) if res.err
  // 	Object.assign( monthlyReportTable.$data, res ) 
  get_project = function() {
    var each, i, len, pro, pro_arr;
    pro_arr = [];
    pro = projectVue.$data.value;
    for (i = 0, len = pro.length; i < len; i++) {
      each = pro[i];
      pro_arr.push(each[each.length - 1]);
    }
    return pro_arr;
  };

  init_list();

}).call(this);
