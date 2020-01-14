(function() {
  var channelTable, init_list;

  channelTable = new Vue({
    el: "#channelTable",
    data: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisible_edit: false,
      editChannel: {
        "websiteName": "",
        "URL": "",
        "ID": "",
        "password": "",
        "orMoney": "",
        "effect": "",
        "orUse": "",
        "remarks": "",
        "_id": ""
      },
      aChannel: {}
    },
    methods: {
      handleSizeChange: function(pageSize) {
        channelTable.$data.pageSize = pageSize;
        return init_list();
      },
      handleCurrentChange: function(page) {
        channelTable.$data.page = page;
        return init_list();
      },
      handleEditCopy: (index, data) => {
        console.log(data);
        channelTable.$data.editChannel._id = data._id;
        channelTable.$data.dialogVisible_edit = true;
        channelTable.$data.editChannel.websiteName = data.websiteName;
        channelTable.$data.editChannel.URL = data.URL;
        channelTable.$data.editChannel.ID = data.ID;
        channelTable.$data.editChannel.password = data.password;
        channelTable.$data.editChannel.orMoney = data.orMoney;
        channelTable.$data.editChannel.effect = data.effect;
        channelTable.$data.editChannel.orUse = data.orUse;
        return channelTable.$data.editChannel.remarks = data.remarks;
      },
      handleEdit: function() {
        var ID, URL, _id, effect, orMoney, orUse, password, remarks, websiteName;
        websiteName = channelTable.$data.editChannel.websiteName;
        URL = channelTable.$data.editChannel.URL;
        ID = channelTable.$data.editChannel.ID;
        password = channelTable.$data.editChannel.password;
        orMoney = channelTable.$data.editChannel.orMoney;
        effect = channelTable.$data.editChannel.effect;
        orUse = channelTable.$data.editChannel.orUse;
        remarks = channelTable.$data.editChannel.remarks;
        _id = channelTable.$data.editChannel._id;
        return socket.emit("takeJob.edit_channel", _id, {
          "$set": {
            "websiteName": websiteName,
            "URL": URL,
            "ID": ID,
            "password": password,
            "orMoney": orMoney,
            "effect": effect,
            "orUse": orUse,
            "remarks": remarks
          }
        }, function(res) {
          console.log("takeJob_edit.res::", res);
          channelTable.$data.dialogVisible_edit = false;
          return init_list();
        });
      },
      handleAdd: function() {
        console.log("login.$data.formInline.nickname:", login.$data.formInline.nickname);
        channelTable.$data.aChannel.updateUser = login.$data.formInline.nickname;
        return socket.emit("takeJob.addChannel", channelTable.$data.aChannel, function(res) {
          channelTable.$data.dialogVisible = false;
          return init_list();
        });
      },
      handleDelete: function(index, data) {
        var _id;
        _id = data._id;
        return socket.emit("takeJob.deleteChannel", _id, function(res) {
          return init_list();
        });
      }
    }
  });

  init_list = function() {
    var page, pageSize;
    page = channelTable.$data.page;
    pageSize = channelTable.$data.pageSize;
    return socket.emit("takeJob.list_channel", {}, page, pageSize, function(res) {
      if (res.err) {
        return alert(res.err);
      }
      return Object.assign(channelTable.$data, res);
    });
  };

  init_list();

}).call(this);
