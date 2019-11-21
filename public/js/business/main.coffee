mainVue = new Vue({
  el: "#mainVue",
  data: {
    menuList: window.menuList
  },
  methods:
    selectMenu: (sMenu)->
      $('#main-content').load( sMenu.link );
})