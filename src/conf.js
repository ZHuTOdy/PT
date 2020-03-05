(function() {
  var pro_names;

  pro_names = function(req) {
    return dbs.projects.deploy.find().toArray(function(err, docs) {
      var i, len, pro, pro_name, proj_role, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, result;
      if (err || !req.socket.user_login) {
        return req.respond([]);
      }
      result = {};
      for (i = 0, len = docs.length; i < len; i++) {
        pro = docs[i];
        pro_name = pro.name;
        if (!/理赔/.test(pro_name)) {
          continue;
        }
        if (pro_name === "华夏人寿") {
          pro_name = "华夏新契约";
        }
        proj_role = (ref = req.result.data) != null ? (ref1 = ref.role) != null ? ref1[pro_name] : void 0 : void 0;
        if (!proj_role) {
          continue;
        }
        if (proj_role.indexOf("op1") === -1 && proj_role.indexOf("op2") === -1 && proj_role.indexOf("opQ") === -1 && proj_role.indexOf("opD") === -1 && proj_role.indexOf("ydm") === -1 && proj_role.indexOf("admin") === -1 && proj_role.indexOf("pm") === -1) {
          continue;
        }
        result[pro.name] = {
          "short_name": ((ref2 = entry.common) != null ? (ref3 = ref2[pro.name]) != null ? (ref4 = ref3.priority) != null ? ref4.short_name : void 0 : void 0 : void 0) || pro.name,
          "encoding": ((ref5 = entry.common) != null ? (ref6 = ref5[pro.name]) != null ? ref6.encoding : void 0 : void 0) || "utf-8",
          "url": (typeof conf !== "undefined" && conf !== null ? (ref7 = conf.app) != null ? (ref8 = ref7[pro.name]) != null ? ref8.url : void 0 : void 0 : void 0) || ""
        };
      }
      return req.respond(result);
    });
  };

}).call(this);
