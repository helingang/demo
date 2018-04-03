import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/components/page/pos'
import HelloWorld from '@/components/page/HelloWorld'
import Error from '@/components/common/error'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Pos',
            component: Pos
        },{
            path: '/helloworld',
            name: 'helloworld',
            component: HelloWorld
        },{
            path: '*',
            component: Error
        }
    ]
})
