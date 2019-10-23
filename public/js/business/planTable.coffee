plan = new Vue({
    el: "#plan",
    data: {
        options_1: [{
            value: 'op1',
            label: '一码'
        }, {
            value: 'op2',
            label: '二码'
        }],
        value: ''
    },
    methods: {
        handleChange: (permission)->
            planTable.$data.permission = permission
            init_list()
    }
});

year = new Vue({
    el: "#year",
    data: {
        options: [{
            value: '2019',
            label: '2019'
        }, {
            value: '2020',
            label: '2020'
        }, {
            value: '2021',
            label: '2021'
        }, {
            value: '2022',
            label: '2022'
        }, {
            value: '2023',
            label: '2023'
        }, {
            value: '2024',
            label: '2024'
        }, {
            value: '2025',
            label: '2025'
        }, {
            value: '2026',
            label: '2026'
        }, {
            value: '2027',
            label: '2027'
        }, {
            value: '2028',
            label: '2028'
        }, {
            value: '2029',
            label: '2029'
        }, {
            value: '2030',
            label: '2030'
        }],
        value: ''
    },
    methods: {
        handleChange: (year)->
            planTable.$data.year = year
            init_list()
    }
});

month = new Vue({
    el: "#month",
    data: {
        options: [{
            value: '01',
            label: '一月'
        }, {
            value: '02',
            label: '二月'
        }, {
            value: '03',
            label: '三月'
        }, {
            value: '04',
            label: '四月'
        }, {
            value: '05',
            label: '五月'
        }, {
            value: '06',
            label: '六月'
        }, {
            value: '07',
            label: '七月'
        }, {
            value: '08',
            label: '八月'
        }, {
            value: '09',
            label: '九月'
        }, {
            value: '10',
            label: '十月'
        }, {
            value: '11',
            label: '十一月'
        }, {
            value: '12',
            label: '十二月'
        }],
        value: ''
    },
    methods: {
        handleChange: (month)->
            planTable.$data.month = month
            init_list()
    }
});

planTable = new Vue({
    el: "#planTable",
    data:{
        items: []
        page: 0
        pageSize: 10
        total: 0
        dialogVisible:false
        dialogVisible_2:false
        aPlan: {}
        uPlan: {}
        permission: plan.$data.value
        year: year.$data.value
        month: month.$data.value
    },
    methods:
        handleSizeChange: (pageSize)->
            planTable.$data.pageSize = pageSize
            init_list()
        handleCurrentChange: (page)->
            planTable.$data.page = page
            init_list()
        delete_plan: (index, data)=>
            console.log "delete_plan::", data
            query = {permission: data.permission, date: data.date, projectID: data.projectID }
            socket.emit "takeJob.delete_plan", query, (res)->
                init_list()
        add_plan: ()->
            socket.emit "takeJob.add_plan", planTable.$data.aPlan, (res)->
                console.log "add_user.res::",res
                planTable.$data.dialogVisible = false
                init_list()
        update_plan: (allNumber, remarks)->
            console.log "allNumber::", allNumber
            console.log "remarks::", remarks
})

init_list = ()->
    page = planTable.$data.page
    pageSize = planTable.$data.pageSize
    permission = planTable.$data.permission
    year = planTable.$data.year
    month = planTable.$data.month
    date = year + month
    socket.emit "takeJob.list", {"permission" : permission, "date" : date}, page, pageSize, (res)->
        return alert( res.err ) if res.err
        Object.assign( planTable.$data, res ) 

init_list()