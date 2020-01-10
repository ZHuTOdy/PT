var yearVue = new Vue({
  el: "#year",
  data: {
    options: [],
    value: ''
  },
  methods: {
    handleChange: function (year) {
      rateTable.$data.year = year;
      init_list();
    }
  }
});

var monthVue = new Vue({
  el: "#month",
  data: {
    options: [],
    value: ""
  },
  methods: {
    handleChange: function (month) {
      rateTable.$data.month = month;
      init_list();
    }
  }
});

rateTable = new Vue({
  el: "#rateTable",
  data: {
    items: [],
    page: 0,
    pageSize: 10,
    total: 0,
    dialogVisible: false,
    aProject: {},
    year: yearVue.$data.value,
    month: monthVue.$data.value
  },
  methods: {
    handleSizeChange: function (pageSize) {
      rateTable.$data.pageSize = pageSize;
      init_list();
    },
    handleCurrentChange: function (page) {
      rateTable.$data.page = page;
      init_list();
    },
    deleteProject: (index, data) => {
      var _id;
      _id = data._id;
      return socket.emit("takeJob.delete_plan", _id, function (res) {
        init_list();
      });
    },
    addProject: function () {}
  }
});

initYearAndMonth = function () {
  for (var i = 0;i < yearRange.length;i++) {
    var newYear = {"label":yearRange[i], "value": yearRange[i]};
    yearVue.options.push(newYear)
    // Vue的动态更新视图
  }
  for (var i = 0;i < monthRange.length;i++) {
    var newMonth = {"label":monthRange[i], "value": monthRange[i]};
    monthVue.options.push(newMonth);
  }
}

init_list = function () {}

initYearAndMonth();
