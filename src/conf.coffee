pro_names = ( req )->
  dbs.projects.deploy.find().toArray (err, docs) ->
    if err || !req.socket.user_login
      return req.respond([])
    result = {}
    for pro in docs 
      pro_name = pro.name
      continue if !/理赔/.test( pro_name )
      pro_name = "华夏新契约" if pro_name == "华夏人寿"
      proj_role = req.result.data?.role?[ pro_name ]
      continue if not proj_role
      continue if proj_role.indexOf( "op1" ) == -1 && proj_role.indexOf("op2") == -1 && proj_role.indexOf("opQ") == -1 && proj_role.indexOf("opD") == -1 && proj_role.indexOf( "ydm" ) == -1 && proj_role.indexOf("admin") == -1 && proj_role.indexOf("pm") == -1
      result[ pro.name ] = {
        "short_name" : entry.common?[ pro.name ]?.priority?.short_name || pro.name,
        "encoding" : entry.common?[ pro.name ]?.encoding || "utf-8",
        "url" : conf?.app?[ pro.name ]?.url || ""
      }
    return req.respond( result )