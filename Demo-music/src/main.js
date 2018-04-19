import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
// router中index.js export route的实例
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';
import VueLazyload from 'vue-lazyload';

// 把fastclick添加到body中,阻止300ms的延迟
fastclick.attach(document.body);

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

// 使用lazyload,应用在img懒加载
Vue.use(VueLazyload, {
    loading: require('./common/images/loading.gif')
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
