

var mainVue;

mainVue = new Vue({
  el: "#mainVue",
  data: {
    menuList: window.menuList,
    Loginname :"角色",
  },
  methods: {
    selectMenu: function(sMenu) {
      // that = this;
      return $('#main-content').load(sMenu.link);
    },
    homePageLink:function(){
      $('#main-content').load('/html/homePage.html');
    }

  }
});
if(login.formInline.nickname)
  mainVue.Loginname=login.formInline.nickname
$('#main-content').load('/html/homePage.html');

  // mainVue.$parent=login;


