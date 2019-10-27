channelTable = new Vue({
    el: "#channelTable",
    data: {
        items: []
        page: 0
        pageSize: 10
        total: 0
        dialogVisible:false
        dialogVisible_edit:false
        editChannel:{}
        aChannel:{}
    },
    methods: 
        handleSizeChange: (pageSize)->
            channelTable.$data.pageSize = pageSize
            init_list()
        handleCurrentChange: (page)->
            channelTable.$data.page = page
            init_list()
        handleEditCopy: (index, data)=>
            console.log data
            channelTable.$data.editChannel._id = data._id
            channelTable.$data.dialogVisible_edit = true
            channelTable.$data.editChannel.websiteName = data.websiteName
            channelTable.$data.editChannel.URL = data.URL
            channelTable.$data.editChannel.ID = data.ID
            channelTable.$data.editChannel.password = data.password
            channelTable.$data.editChannel.orMoney = data.orMoney
            channelTable.$data.editChannel.effect = data.effect
            channelTable.$data.editChannel.orUse = data.orUse
            channelTable.$data.editChannel.remarks = data.remarks
        handleEdit: ()->
            websiteName = channelTable.$data.editChannel.websiteName
            URL = channelTable.$data.editChannel.URL
            ID = channelTable.$data.editChannel.ID
            password = channelTable.$data.editChannel.password
            orMoney = channelTable.$data.editChannel.orMoney
            effect = channelTable.$data.editChannel.effect
            orUse = channelTable.$data.editChannel.orUse
            remarks = channelTable.$data.editChannel.remarks
            _id = channelTable.$data.editChannel._id
            socket.emit "takeJob.edit_channel", _id, { "$set": { "websiteName":websiteName, "URL":URL, "ID":ID, "password":password, "orMoney":orMoney, "effect":effect, "orUse":orUse, "remarks": remarks } }, (res)->
                console.log "takeJob_edit.res::",res
                channelTable.$data.dialogVisible_edit = false
                init_list()
        handleAdd: ()->
            channelTable.$data.aChannel.updateUser = "朱镕杰"
            socket.emit "takeJob.addChannel", channelTable.$data.aChannel, (res)->
                channelTable.$data.dialogVisible = false
                init_list()
        handleDelete: (index, data)->
            _id = data._id
            socket.emit "takeJob.deleteChannel", _id, (res)->
                init_list()
})

init_list = ()->
    page = channelTable.$data.page
    pageSize = channelTable.$data.pageSize
    socket.emit "takeJob.list_channel", {}, page, pageSize, (res)->
        return alert( res.err ) if res.err
        Object.assign( channelTable.$data, res ) 

init_list()