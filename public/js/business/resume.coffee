formData = new FormData()
name = new Vue({
    el: "#name",
    data: {
        name: ""
    }
    methods: {
        handleChange: ()->
            init_list();
    }
});

phone = new Vue({
    el: "#phone",
    data: {
        phone: ""
    }
    methods: {
        handleChange: ()->
            init_list();
    }
});

date = new Vue({
    el: "#date",
    data: {
        date: ""
        fileName: ""
    }
    methods: {
        download: ()->
            console.log resumeTable.$data.Selection.length
            console.log resumeTable.$data.Selection
            if resumeTable.$data.Selection.length == 0
                downloadData = resumeTable.$data.items
            else
                downloadData = resumeTable.$data.Selection
            socket.emit "takeJob.download", downloadData, (res)->
                if res.err
                    return alert res.err
                else
                    document.getElementById("jstoxls").href = res
                    document.getElementById("jstoxls").download = res.replace(/.*\//,"")
                    document.getElementById('jstoxls').click()

        click: ()->
            this.$refs.uploadFile.click()
        upload: (event)->
            objFile = document.getElementById("upload")
            file = objFile.files[0]
            hzm = file.name.substr(file.name.indexOf(".") + 1)
            if file.name == ""
                alert "请选择要上传的文件"
            else if hzm != "xls" && hzm != "xlsx"
                alert "请选择Excel格式的文件"
            else
                formData.append "file", file
                socket.emit "takeJob.uploadResume", file, file.name, (res)->
                    if res.err
                        return alert res.err
                    else
                        init_list()
                        resumeTable.notice2();
            
        deleteAll: ()->
            if resumeTable.$data.Selection.length == 0
                return alert "未选择数据"
            else
                deleteData = resumeTable.$data.Selection
                socket.emit "takeJob.deleteResume", deleteData, (res)->
                    if res.err
                        return alert res.err
                    else
                        init_list()
                        resumeTable.notice1();

        listAgain: ()->
            init_list()
    }
});

resumeTable = new Vue({
    el: "#resumeTable",
    data: {
        items: []
        page: 0
        pageSize: 10
        total: 0
        Selection: []
    },
    methods: {
        handleSizeChange: (pageSize)->
            resumeTable.$data.pageSize = pageSize
            init_list()
        handleCurrentChange: (page)->
            resumeTable.$data.page = page
            init_list()
        handleSelectionChange: (val)->
            this.Selection = val
        notice1:()->
            this.$notify({
                title:"成功",
                message: "删除成功",
                type: "success",
                position: "bottom-right"
            })
        notice2:()->
            this.$notify({
                title:"成功",
                message: "导入成功",
                type: "success",
                position: "bottom-right"
            })
    }
});

init_list = ()->
    page = resumeTable.$data.page
    pageSize = resumeTable.$data.pageSize
    permission = resumeTable.$data.permission
    newName = name.$data.name
    newPhone = phone.$data.phone
    fromTime = date.$data.date[0] || "2000-01-01"
    toTime = date.$data.date[1] || "2111-12-31"
    socket.emit "takeJob.listResume", {"name" : {$regex:newName}, "phone": {$regex:newPhone} , "date":{$gte:fromTime, $lte:toTime }}, page, pageSize, (res)->
        return alert( res.err ) if res.err
        Object.assign( resumeTable.$data, res )
 
init_list();