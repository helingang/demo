import Vue from 'vue'
import App from './app.vue'
import './assets/css/global.styl'


const root = document.createElement('div');
root.id = 'wrap';
document.body.appendChild(root);

new Vue({
    // 可以直接给挂载节点渲染一个vue组件
    // 一个组件的数据改变时,重新执行render方法,产生新的html,以这种方式改变html(template中的内容最终转化成js中的render方法)
    render: h => h(App),
    // render: function (createElement) {
    //     return createElement(
    //       'h' + this.level,   // tag name 标签名称
    //       this.$slots.default // 子组件中的阵列
    //     )
    // }   
}).$mount(root)