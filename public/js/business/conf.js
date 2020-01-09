var clone;

window.menuList = [{
    title: "招聘管理",
    type: "1",
    subMenu: [{
        title: "招聘计划",
        type: "1-1",
        link: "/html/recruitment_plan.html"
      },
      {
        title: "招聘渠道",
        type: "1-2",
        link: "/html/recruitment_channels.html"
      },
      {
        title: "简历库",
        type: "1-3",
        link: "/html/resume.html"
      }
    ]
  },
  {
    title: "培训管理",
    type: "2",
    subMenu: [{
        title: "在培名单",
        type: "2-1",
        link: "/html/pt_train.html"
      },
      {
        title: "培训上岗率",
        type: "2-2",
        link: "/html/AAA.html"
      }
    ]
  },
  {
    title: "在岗管理",
    type: "3",
    subMenu: [{
        title: "在岗名单",
        type: "3-1",
        link: "/html/AAA.html"
      },
      {
        title: "规则宣导记录",
        type: "3-2",
        link: "/html/AAA.html"
      }
    ]
  },
  {
    title: "数据统计",
    type: "4",
    subMenu: [{
        title: "日常报表",
        type: "4-1",
        link: "/html/dailyReport.html"
      },
      {
        title: "月报表",
        type: "4-2",
        link: "/html/AAA.html"
      },
      {
        title: "上线情况分析",
        type: "4-3",
        link: "/html/AAA.html"
      },
      {
        title: "在线时间分布",
        type: "4-4",
        link: "/html/AAA.html"
      }
    ]
  },
  {
    title: "薪资管理",
    type: "5",
    subMenu: [{
        title: "工资表",
        type: "5-1",
        link: "/html/AAA.html"
      },
      {
        title: "推荐奖",
        type: "5-2",
        link: "/html/AAA.html"
      },
      {
        title: "客户投诉数据",
        type: "5-3",
        link: "/html/AAA.html"
      }
    ]
  },
  {
    title: "用户管理",
    type: "6",
    subMenu: [{
      title: "列表",
      type: "6-1",
      link: "/html/PTuser.html"
    }]
  },
  {
    title: "通知提醒",
    type: "7",
    subMenu: [{
        title: "录入通知",
        type: "7-1",
        link: "/html/AppNotice.html"
      },
      {
        title: "PT通知",
        type: "7-2",
        link: "/html/PTNotice.html"
      }
    ]
  }
];

clone = function (value) {
  return JSON.parse(JSON.stringify(value));
};