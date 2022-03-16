<template>
  <div class="hello">
    <mt-button type="default" @click="getList">default</mt-button>
    <mt-tabbar v-model="selected">
        <mt-tab-item id="外卖">
            <img slot="icon" src="../assets/img/icon.png">
            外卖
        </mt-tab-item>
        <mt-tab-item id="订单">
            <img slot="icon" src="../assets/img/icon.png">
            订单
        </mt-tab-item>
        <mt-tab-item id="发现">
            <img slot="icon" src="../assets/img/icon.png">
            发现
        </mt-tab-item>
        <mt-tab-item id="我的">
            <img slot="icon" src="../assets/img/icon.png">
            我的
        </mt-tab-item>
    </mt-tabbar> 
  </div>
</template>

<script>
    export default {
        data() {
            return {
                toastClose: ''
            }
        },
        created() {
            
        },
        methods: {
            getList() {
                // 在获取数据之前，立即弹出 Toast 提示用户，正在加载数据
                this.show();

                setTimeout(() => {
                    // 当 3 秒过后，数据获取回来了，要把 Toast 移除
                    this.toastClose.close();
                }, 1500)
            },
            show() {
                this.toastClose = this.$toast({
                    message: '加载中...', // 弹窗内容
                    position: 'middle', // 显示位置
                    duration: 1500, // 持续时间（-1 代表一直显示）
                    iconClass: '', // 设置图标的类(可用 bootstrap 中的字体图标)
                    className: 'red' // 自定义 Toast 的样式，需要自己提供一个类名
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
.red{
    color: red;
}
</style>
