import Vue from 'vue';
import Router from 'vue-router';
import Goods from '@/components/goods/goods';
import Ratings from '@/components/ratings/ratings';
import Seller from '@/components/seller/seller';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Goods,
            redirect: '/goods'
        },
        {
            path: '/goods',
            name: 'goods',
            component: Goods
        },
        {
            path: '/ratings',
            name: 'ratings',
            component: Ratings
        },
        {
            path: '/seller',
            name: 'seller',
            component: Seller
        }
    ],
    // 修改激活tab时的类名, 默认是router-link-active
    linkActiveClass: 'active'
});
