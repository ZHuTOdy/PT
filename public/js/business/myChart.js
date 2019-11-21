
var myChart = echarts.init(document.getElementById("numChart"));

var option = {
    title: {
        text: '人数统计'
    },
    tooltip: {
        
    },
    legend: {
        data:['上线人数','离线人数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      
    },
    toolbox: {
     
    },
    xAxis: {
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'上线人数',
            type:'line',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'离线人数',
            type:'line',
            data:[30, 60, 50, 60, 45, 100, 110]
        },
        
    ]
};

myChart.setOption(option);
