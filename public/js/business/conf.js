(function() {
  var clone;

  window.menuList = [
    {
      title: "练习/考核",
      type: "1",
      subMenu: [
        {
          title: "练习",
          type: "1-1",
          link: "/html/AAA.html"
        },
        {
          title: "考核",
          type: "1-2",
          link: "/html/AAA.html"
        }
      ]
    },
    {
      // {title: "", type: "1-3", link: "/html/customerBSM.html"},
      title: "正式录入",
      type: "2",
      subMenu: [
        {
          title: "流程介绍",
          type: "2-1",
          link: "/html/AAA.html"
        },
        {
          title: "正式录入",
          type: "2-2",
          link: "/html/AAA.html"
        },
        {
          title: "产量查询",
          type: "2-3",
          link: "/html/AAA.html"
        },
        {
          title: "错误查询",
          type: "2-4",
          link: "/html/AAA.html"
        },
        {
          title: "客户投诉查询",
          type: "2-5",
          link: "/html/AAA.html"
        }
      ]
    },
    {
      title: "月度考核",
      type: "3",
      subMenu: [
        {
          title: "考核要求",
          type: "3-1",
          link: "/html/AAA.html"
        },
        {
          title: "开始考核",
          type: "3-2",
          link: "/html/AAA.html"
        }
      ]
    },
    {
      title: "用户管理",
      type: "4",
      subMenu: [
        {
          title: "列表",
          type: "4-1",
          link: "/html/user.html"
        }
      ]
    },
    {
      // {title: "开始考核", type: "4-2", link: "/html/AAA.html"},
      title: "招聘管理",
      type: "5",
      subMenu: [
        {
          title: "招聘计划",
          type: "5-1",
          link: "/html/recruitment_plan.html"
        },
        {
          title: "招聘渠道",
          type: "5-1",
          link: "/html/recruitment_channels.html"
        },
        {
          title: "简历库",
          type: "5-1",
          link: "/html/resume.html"
        }
      ]
    }
  ];

  clone = function(value) {
    return JSON.parse(JSON.stringify(value));
  };

}).call(this);
