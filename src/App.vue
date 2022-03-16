<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            
        }
    },
    sockets: {
        hasReceive: function(msg) {
            if(msg.code == 0){
                this.$options.methods.showNotify.bind(this)();
            }
        }
    },
    methods: {
        showNotify(){
            this.$notify({
                title: '提示',
                message: '您的订单有新的状态，请到订单中心查看'
            });
        },
    }
}
</script>

<style scope>

</style>
