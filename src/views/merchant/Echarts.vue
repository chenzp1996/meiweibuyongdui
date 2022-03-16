<template>
    <div class="echarts-wrapper">
        <div class="echarts">
            <IEcharts
            :option="bar"
            :loading="loading"
            @ready="onReady"
            @click="onClick"
            />
        </div>
        <div class="echarts">
            <IEcharts
            :option="pie"
            :loading="loading"
            @ready="onReady"
            @click="onClick"
            />
        </div>
    </div>
  
  
</template>
 
<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.js';
  
  export default {
    name: 'view',
    components: {
      IEcharts
    },
    props: ['orderData'],
    computed: {
        pie: function(){
            return{
                title: {
                text: '订单统计情况'
                },
                tooltip: {},
                legend:{
                type: 'plain',
                orient: 'vertical',
                right: 10,
                top: 20,
                },
                series: [{
                    type: 'pie',
                    data: [
                        {name: '待接单', value: this.noReceiveOrderNum},
                        {name: '已接单', value: this.ReceiveOrderNum},
                        {name: '已完成', value: this.finishOrderNum}
                    ] 
                }]
            }
            
        },

        bar: function(){
            return{
            title: {
                text: '排队取号大小桌统计情况'
                },
                tooltip: {},
                xAxis: {
                    data: ['小桌', '中卓', '大桌']
                },
                yAxis: {},
                series: [{
                    name: '桌数：',
                    type: 'bar',
                    data: [this.queueNum.sNum, this.queueNum.mNum, this.queueNum.lNum]
                }]
            }
        },
        
    },
    mounted() {
        this.countOrderNum();
        this.countTableNum();
        console.log(this.noReceiveOrderNum,this.ReceiveOrderNum,this.finishOrderNum)
    },
    data: () => ({
        //订单类型数量
        noReceiveOrderNum:0,
        ReceiveOrderNum:0,
        finishOrderNum:0,

        //大中小桌统计数量
        queueNum:{  //当前排队桌数情况，小桌QueueNum[0]，中桌QueueNum[1]，大桌QueueNum[2]
            sNum:0,
            mNum:0,
            lNum:0,
        }, 
        loading: false,

        

        


    }),
    methods: {
        countOrderNum(){
            if(this.orderData){
                this.orderData.map((item,index)=>{
                    if(item.status == 0){
                        this.noReceiveOrderNum++;
                    }else if(item.status == 1){
                        this.ReceiveOrderNum++;
                    }else{
                        this.finishOrderNum++;
                    }
                })
            }
        },
        countTableNum(){
            if(this.orderData){
                this.orderData.map((item,index)=>{
                    if(item.type == 0){ //0为排队类
                        if(item.peopleNum <= 2){
                            this.queueNum.sNum++;
                        }else if(item.peopleNum > 2 && item.peopleNum <= 4){
                            this.queueNum.mNum++;
                        }else{
                            this.queueNum.lNum++;
                        }
                    }else if(item.type == 1){  //1为订座类
                        this.orderNum++;
                    }
                })
            }
        },
        doRandom() {
            const that = this;
            let data = [];
            for (let i = 0, min = 5, max = 99; i < 6; i++) {
            data.push(Math.floor(Math.random() * (max + 1 - min) + min));
            }
            that.bar.series[0].data = data;
        },
        onReady(instance, ECharts) {
            console.log(instance, ECharts);
        },
        onClick(event, instance, ECharts) {
            console.log(arguments);
        },

    }
  };
</script>
 
<style lang="less" scoped>
    .echarts-wrapper{
        display: flex;

        .echarts {
            flex: 1;
            width: 400px;
            height: 400px;
        }
    }
    
</style>