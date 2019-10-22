mainVue = new Vue({
  el: "#mainVue",
  data: {
    menuList: window.menuList
  },
  methods:
    selectMenu: (sMenu)->
      # that = this;
      console.log("sMenusMenusMenu:",sMenu)
      $('#main-content').load( sMenu.link );
      # socket.emit "user.login",this.formInline, (res) ->
      #   console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:",res);
      #   $('#mainframe').load('html/main.html');
})