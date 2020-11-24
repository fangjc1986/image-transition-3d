import Vue from 'vue'
import App from './App.vue'
// 自定义
import ImageTransition3d from '../packages';

Vue.use(ImageTransition3d);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
