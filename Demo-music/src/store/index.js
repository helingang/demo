// 入口文件
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
// 当mutations修改state的时候会在控制台打印logger <<!!!!!!!>>
import createLogger from 'vuex/dist/logger';

// 注册vuex
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'productions';

// export 一个单例store
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // 严格模式的作用是检测state是否是被mutations修改的
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
