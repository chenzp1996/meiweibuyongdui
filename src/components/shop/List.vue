<template>
    <div class="container">
        <!-- 搜索 -->
        <van-search
            v-model="searchValue"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            class="search"
            >
            <div slot="action" @click="onSearch">搜索</div>
        </van-search>
        <div class="seach-result" v-if="searchResultShow">
            <div class="back" @click="setOverflow"></div>
            <div class="searchList-wrapper">
                <van-cell @click="setOverflow" v-for="(item, index) in searchList" :key="index" is-link :value="item.name" :to="{path:'/shop/detail',query:{shop_id:item._id}}"/>
            </div>
        </div>
        <van-tabs type="card" class="shaixuan-bar" animated color="RGB(130,191,252)">
            <van-tab v-for="(item, index) in navArr"    :key="index" :title="item.title">
                <CommenShopBlock :type="item.type"></CommenShopBlock>
            </van-tab>
        </van-tabs>
    </div>
</template>
 
<script>
import Vue from 'vue';
import { mapState } from 'vuex'
import CommenShopBlock from "../CommenShopBlock.vue" //餐厅模块

export default {
    name: 'List',
    components:{
        CommenShopBlock
    },
    created() {
        this.getShopData();
    },
    computed: {
         ...mapState({
            shopList: state => state.totalShopList
        }),
        totalShopListType:{
            get (){
                return this.$store.state.totalShopList
            },
            set (val){
                this.$store.state.totalShopList = val
            }
        }  
    },
    data() {
        return {
            active: 0,
            searchValue: '',
            searchList: [],
            searchResultShow: false,
            navArr: [
                {
                    title: "全部商家",
                    type:"all"
                },
                {
                    title: "五星好店",
                    type:"star"
                },
                {
                    title: "人均水平",
                    type:"price"
                }
            ],
            paramsName:this.$route.params.pathMatch
        };
    },

    methods: {
        //筛选数据展示
        getShopData(){
            this.$store.dispatch("setShopList");
        },
        onSearch(){  
            this.searchList = [];
            this.shopList.map((item,index)=>{
                if(item.name.search(this.searchValue) != -1){
                    this.searchResultShow = true;
                    document.body.style.position = 'fixed'
                    this.searchList.push(item);
                    // console.log(this.searchList)
                }
            })
            if(this.searchList.length == 0){
                this.searchResultShow = false;
                document.body.style.position = ''
                this.$toast('搜索不到该商家...');
            }
        },

        setOverflow(){
            this.searchList = [];
            this.searchResultShow = false;
            document.body.style.position = ''
        }

    },
};
</script>
 
<style scoped lang="less">
.shaixuan-bar{
    margin-top: 15px;
}

.seach-result{
    .back{
        position: absolute;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, .3);
        // top: -10px;
        z-index: 998;
    }
    .searchList-wrapper{
        width: 100%;
        position: absolute;
        z-index: 999;
        .van-cell{
            width: 100%;
        }
    }
    position: relative;
    width: 100%;
    z-index: 999;
}

</style>
