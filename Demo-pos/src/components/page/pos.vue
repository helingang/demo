<template>
    <div id="pos">
        <el-row>
            <!-- 订单区域(宽度为7列) -->
            <el-col :span='8' id='pos-order'>
                <!-- tab菜单(结账, 挂单, 外卖) -->
                <el-tabs>
                    <el-tab-pane label='点餐'>
                        <el-table :data='orderData' border style='width:100%' max-height='700'>
                            <el-table-column prop='goodsName' label='名称' ></el-table-column>
                            <el-table-column prop='price' label='单价(¥)' width='70'></el-table-column>
                            <el-table-column prop='count' label='数量' width='50'></el-table-column>
                            <el-table-column label='操作' fixed='right' width='140'>
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click='addGoods(scope.row)'>添加</el-button>
                                    <el-button type="text" size="small" @click='redGoods(scope.row)'>减少</el-button>
                                    <el-button type="text" size="small" @click='removeGoods(scope.row)'>删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div id="total" v-show='true'>
                            <span>种类: <span>{{ totalType }} </span>种&nbsp;</span>
                            <span>份数: <span>{{ totalCount }} </span>个&nbsp;</span>
                            <span>价格: <span>{{ totalPrice }} </span>元&nbsp;</span>

                        </div>
                        <!-- 点餐列表中的按钮 -->
                        <div id='order-btn'>
                            <el-button type='warning'>挂单</el-button>
                            <el-button type='danger' @click='removeAll()'>删除</el-button>
                            <el-button type='success' style='width:160px' @click='checkOut()'>结账</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label='挂单'>

                    </el-tab-pane>
                    <el-tab-pane label='外卖'>

                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <!-- 商品列表 -->
            <el-col :span='16'>
                <div id='foodList'>
                    <div class='hotFood-title'>热门商品</div>
                    <div class='hotFood-list'>
                        <ul>
                            <li v-for='value in hotfoodData' @click='addGoods(value)'>
                                <span>{{ value.goodsName }}</span>
                                <span>¥{{ value.price }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="foodType" >
                    <el-tabs>
                        <el-tab-pane label='汉堡' >
                            <ul class='foodTypen'>
                                <li v-for='value in foodType1' @click='addGoods(value)'>
                                    <img :src="value.goodsImg" alt="" width="100%" height="100%">
                                    <div>
                                        <p>{{ value.goodsName }}</p>
                                        <p>¥{{ value.price }}</p>
                                    </div>

                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label='小吃'>
                            <ul class='foodTypen'>
                                <li v-for='value in foodType2' @click='addGoods(value)'>
                                    <img :src="value.goodsImg" alt="" width="100%" height="100%">
                                    <div>
                                        <p>{{ value.goodsName }}</p>
                                        <p>¥{{ value.price }}</p>
                                    </div>

                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label='饮品'>
                            <ul class='foodTypen'>
                                <li v-for='value in foodType3' @click='addGoods(value)'>
                                    <img :src="value.goodsImg" alt="" width="100%" height="100%">
                                    <div>
                                        <p>{{ value.goodsName }}</p>
                                        <p>¥{{ value.price }}</p>
                                    </div>

                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label='套餐'>
                            <ul class='foodTypen'>
                                <li v-for='value in foodType4' @click='addGoods(value)'>
                                    <img :src="value.goodsImg" alt="" width="100%" height="100%">
                                    <div>
                                        <p>{{ value.goodsName }}</p>
                                        <p>¥{{ value.price }}</p>
                                    </div>

                                </li>
                            </ul>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
let hotfoodData,
    foodType1;
export default {
    name: 'pos',
    created(){
        // 获取热门食品
        $.ajax({
          type: 'get',
          dataType: 'json',
          url: 'http://jspang.com/DemoApi/oftenGoods.php',
          success: (res) => {
            this.hotfoodData = res
          },
        })
        // axios.get('http://jspang.com/DemoApi/oftenGoods.php')
        // .then(res => {
        //     console.log(res);
        //     // console.log(this);
        //     this.hotfoodData = res.data
        // })
        // .catch(er => {
        //     // console.log(er);
        //     alert('网络错误了,你该检查下网络了');
        // }),
        // 获取食品类型
        axios.get('http://jspang.com/DemoApi/typeGoods.php')
        .then(res => {
            // console.log(res);
            this.foodType1 = res.data[0],
            this.foodType2 = res.data[1],
            this.foodType3 = res.data[2],
            this.foodType4 = res.data[3]
        })
        .catch(er => {
            // console.log(er);
            alert('网络错误了,你该检查下网络了');
        })
    },
    mounted: function(){
        var orderHeight = document.documentElement.offsetHeight;
        document.getElementById('pos-order').style.height = orderHeight + 'px';
    },
    data(){
        return {
            total: false,
            orderData: [],
            hotfoodData: [],
            foodType1: [],
            foodType2: [],
            foodType3: [],
            foodType4: [],
            totalCount: 0,
            totalPrice: 0,
            totalType: 0,

        }
    },
    computed: {
        sortFoodData(){
            return this.foodData.sort(function(a, b){
                return a.foodPrice - b.foodPrice
            })
        },
        // totalCount(){
        //     let n = 0;
        //     for (let i = 0; i < this.orderData.length; i++) {
        //         n += this.orderData[i].count;
        //     }
        //     n && (this.total = true) || (this.total = false);
        //     return n
        // },
        // totalPrice(){
        //     let p = 0;
        //     for (let i = 0; i < this.orderData.length; i++) {
        //         p += this.orderData[i].count*this.orderData[i].price;
        //     }
        //     p && (this.total = true) || (this.total = false);
        //     return p
        // },
        // totalType(){
        //     let t = 0;
        //     for (let i = 0; i < this.orderData.length; i++) {
        //         if(this.orderData[i].count){
        //             t++
        //         }
        //     }
        //     return t
        // }
    },
    methods: {
        // 点击添加商品
        addGoods(obj){
            // 判断是否存在
            let isHave = false;
            for (let i = 0; i < this.orderData.length; i++) {
                if(obj.goodsId === this.orderData[i].goodsId){
                    isHave = true;
                }
            }

            // 如果存在则构建新数组
            if(isHave){
                // this.orderData.forEach((value, index, arr) => {
                //     if(value.goodsId === obj.goodsId){
                //         value.count++
                //     }
                // })
                this.orderData.filter((value, index, arr) => {
                    return value.goodsId == obj.goodsId
                })[0].count++
            }else{
                let newArr = {
                    goodsId: obj.goodsId,
                    goodsName: obj.goodsName,
                    price: obj.price,
                    count: 1
                };
                this.orderData.push(newArr);
            }
            this.totalAll();

        },

        // 点击减少商品
        redGoods(obj){
            let arr = this.orderData.filter((value, index, arr) => {
                return value.goodsId == obj.goodsId
            })
            arr[0].count && arr[0].count--;
            this.totalAll()

        },

        // 点击移除单个商品
        removeGoods(obj){
            // this.orderData.forEach((value, index, arr) => {
            //     if(value.goodsId === obj.goodsId){
            //         this.orderData.splice(index, 1)
            //     }
            // })

            // 找到orderData中id与点击id不相同的重新赋值
            this.orderData = this.orderData.filter((value) => value.goodsId != obj.goodsId);
            this.totalAll()
        },

        // 移除所有商品
        removeAll(){
            this.orderData = [];
            this.totalAll()
        },

        checkOut(){
            if(this.totalCount != 0){
                this.orderData = [];
                this.totalCount = 0;
                this.totalPrice = 0;
                this.totalType = 0;

                //
                //axios.post()




                this.$message({
                    message: '已成功结账',
                    center: true,
                    type: 'success'
                })
            }else{
                this.$message.error('商品为空,真的不能结账')
            }

        },

        totalAll(){
            this.totalCount = 0;
            this.totalPrice = 0;
            this.totalType = 0;
            if(this.orderData){
                this.orderData.forEach((value, index, arr)=>{
                    this.totalCount += value.count;
                    this.totalPrice += value.count * value.price;
                    if(value.count){
                        this.totalType += 1
                    }
                })
            }
        },


    }


}
</script>

<style>

#pos-order{
    background: #fff;
    border-right: 1px solid #1D8CE0;
    padding: 10px;
}
#total{
    padding: 10px 0;
    border-bottom: 1px solid #EBEEF5;
}
#total > span{
    font-size: 16px;
}
#total > span > span{
    font-size: 24px;
    color: #F56C6C
}
#order-btn{
    margin-top: 30px;
}

.hotFood-title{
    padding: 10px 0;
    border-bottom: 1px solid #E4E7ED;
    background-color: #F9FAFC;
    text-align: left;
    text-indent: 10px;
    font-size: 18px;
}
.hotFood-list ul{
    overflow: hidden;
}
.hotFood-list ul li{
    float: left;
    list-style: none;
    padding: 10px;
    margin: 6px;
    border: 1px solid #58B7FF;
    border-radius: 8px;
    background-color: #fff;
    font-size: 16px;
    cursor: pointer;
}
.hotFood-list ul li span:nth-of-type(2){
    color: #58B7FF;
}
#foodType{
    padding: 0 20px
}
#foodType .foodTypen{
    margin: 0;
    padding: 0;
    overflow: hidden;
}
#foodType .foodTypen li{
    border: 1px solid #58B7FF;
    padding: 8px;
    margin: 10px;
    float: left;
    list-style: none;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
}
#foodType .foodTypen li p{
    margin: 0;
}
#foodType .foodTypen li p:nth-of-type(1){
    font-size: 18px;
}
#foodType .foodTypen li p:nth-of-type(2){
    color: rgba(204, 15, 15, 0.87);
}
#foodType .foodTypen li > img{
    width: 80px;
    height: 50px;
    margin-right: 10px;
}
#foodType .foodTypen li > div,img{
    float: left;
}

</style>


