(function() {
  var init_list, month, plan, planTable, year;

  plan = new Vue({
    el: "#plan",
    data: {
      options_1: [
        {
          value: 'op1',
          label: '一码'
        },
        {
          value: 'op2',
          label: '二码'
        }
      ],
      value: ''
    },
    methods: {
      handleChange: function(permission) {
        planTable.$data.permission = permission;
        return init_list();
      }
    }
  });

  year = new Vue({
    el: "#year",
    data: {
      options: [
        {
          value: '2019',
          label: '2019'
        },
        {
          value: '2020',
          label: '2020'
        },
        {
          value: '2021',
          label: '2021'
        },
        {
          value: '2022',
          label: '2022'
        },
        {
          value: '2023',
          label: '2023'
        },
        {
          value: '2024',
          label: '2024'
        },
        {
          value: '2025',
          label: '2025'
        },
        {
          value: '2026',
          label: '2026'
        },
        {
          value: '2027',
          label: '2027'
        },
        {
          value: '2028',
          label: '2028'
        },
        {
          value: '2029',
          label: '2029'
        },
        {
          value: '2030',
          label: '2030'
        }
      ],
      value: ''
    },
    methods: {
      handleChange: function(year) {
        planTable.$data.year = year;
        return init_list();
      }
    }
  });

  month = new Vue({
    el: "#month",
    data: {
      options: [
        {
          value: '01',
          label: '一月'
        },
        {
          value: '02',
          label: '二月'
        },
        {
          value: '03',
          label: '三月'
        },
        {
          value: '04',
          label: '四月'
        },
        {
          value: '05',
          label: '五月'
        },
        {
          value: '06',
          label: '六月'
        },
        {
          value: '07',
          label: '七月'
        },
        {
          value: '08',
          label: '八月'
        },
        {
          value: '09',
          label: '九月'
        },
        {
          value: '10',
          label: '十月'
        },
        {
          value: '11',
          label: '十一月'
        },
        {
          value: '12',
          label: '十二月'
        }
      ],
      value: ''
    },
    methods: {
      handleChange: function(month) {
        planTable.$data.month = month;
        return init_list();
      }
    }
  });

  planTable = new Vue({
    el: "#planTable",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisible_2: false,
      aPlan: {},
      uPlan: {},
      permission: plan.$data.value,
      year: year.$data.value,
      month: month.$data.value
    },
    methods: {
      handleSizeChange: function(pageSize) {
        planTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        planTable.$data.page = page;
        return init_list();
      },
      delete_plan: (index, data) => {
        var _id;
        _id = data._id;
        return socket.emit("takeJob.delete_plan", _id, function(res) {
          return init_list();
        });
      },
      add_plan: function() {
        console.log("计划时间：", planTable.$data.aPlan.date);
        return socket.emit("takeJob.add_plan", planTable.$data.aPlan, function(res) {
          planTable.$data.dialogVisible = false;
          return init_list();
        });
      },
      update_plan: function() {
        var AllNumber, _id, remarks;
        _id = planTable.$data.uPlan._id;
        AllNumber = planTable.$data.uPlan.AllNumber;
        remarks = planTable.$data.uPlan.remarks;
        return socket.emit("takeJob.edit_plan", _id, {
          "$set": {
            "AllNumber": AllNumber,
            "remarks": remarks
          }
        }, function(res) {
          planTable.$data.dialogVisible_2 = false;
          return init_list();
        });
      },
      handleEditCopy: function(index, data) {
        planTable.$data.uPlan._id = data._id;
        planTable.$data.uPlan.AllNumber = data.AllNumber;
        planTable.$data.uPlan.remarks = data.remarks;
        return planTable.$data.dialogVisible_2 = true;
      }
    }
  });

  init_list = function() {
    var date, page, pageSize, permission;
    page = planTable.$data.page;
    pageSize = planTable.$data.pageSize;
    permission = planTable.$data.permission;
    year = planTable.$data.year;
    month = planTable.$data.month;
    date = year + "-" + month;
    return socket.emit("takeJob.list", {
      "permission": permission,
      "date": {
        $regex: date
      }
    }, page, pageSize, function(res) {
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(planTable.$data, res);
    });
  };

  init_list();

}).call(this);
