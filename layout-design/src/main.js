import Vue from 'vue'
import App from './App.vue'


let app = new Vue({
  el: '#app',
  render: h => h(App)
})


let loadingLayer = document.querySelector('.loading-layer');
loadingLayer.classList.add('hidden');
setTimeout(() => {
  loadingLayer.parentNode.removeChild(loadingLayer);
}, 600);