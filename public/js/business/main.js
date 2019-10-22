(function() {
  var mainVue;

  mainVue = new Vue({
    el: "#mainVue",
    data: {
      menuList: window.menuList
    },
    methods: {
      selectMenu: function(sMenu) {
        // that = this;
        console.log("sMenusMenusMenu:", sMenu);
        return $('#main-content').load(sMenu.link);
      }
    }
  });

}).call(this);


//# sourceMappingURL=main.js.map
//# sourceURL=coffeescript