import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import cesium from '@/components/cesium'
import cesiumManyou from '@/components/cesiumManyou'
import cesiumPoint from '@/components/cesiumPoint'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/cesium',
      name: 'cesium',
      component: cesium
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/cesiumManyou',
      name: 'cesiumManyou',
      component: cesiumManyou
    },
    {
      path: '/cesiumPoint',
      name: 'cesiumPoint',
      component: cesiumPoint
    }
  ]
})
