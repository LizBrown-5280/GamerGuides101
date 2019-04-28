// !!!! BE SURE TO configure server so that it always returns the index.html, even with 404 errors
// ( https://vuejs.org/v2/guide/routing.html  https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations  SEE: Firebase hosting )

// To set Auth per route see **** Olga Filipovo's 'Vue.js 2 and Bootstrap 4 Web Development' pgs. 194-195

import Vue from 'vue'
import Router from 'vue-router'
import {About, GuildWars2, Home} from '@/components/main/pages'
import {GW2Home, GW2AccountStats, GW2Wvw} from '@/components/main/pages/gw2'

// !!!! lazy loading routing ;0)  Can I get this to work please?
// // ----- ONE WAY ----- from **** Olga Filipovo's 'Vue.js 2 and Bootstrap 4 Web Development' pgs. 194-195
// const Home = () => import('@/components/main/pages/Home')
// const About = () => import('@/components/main/pages/About')
// const GuildWars2 = () => import('@/components/main/pages/GuildWars2')
// const GW2Home = () => import('@/components/main/pages/gw2/GW2Home)
// const GW2AccountStats = () => import('@/components/main/pages/gw2/GW2AccountStats)
// const GW2Wvw = () => import('@/components/main/pages/gw2/GW2Wvw')

// ----- ANOTHER WAY -----
// const gw2home = resolve => {
//   require.ensure(['../components/main/pages/gw2/GuildWars2.vue'], () => {
//     resolve(require('../components/main/pages/gw2/GuildWars2.vue'))
//   }, 'GW2')
// }
// const GW2cccountStats = resolve => {
//   require.ensure(['../components/main/pages/GW2Home.vue'], () => {
//     resolve(require('../components/main/pages/GuildWars2.vue'))
//   }, 'GW2')
// }
// const guildWars2 = resolve => {
//   require.ensure(['../components/main/pages/GW2AccountStats.vue'], () => {
//     resolve(require('../components/main/pages/GuildWars2.vue'))
//   }, 'GW2')
// }

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      component: Home,
      path: '/'
    },
    {
      name: 'guildwars2',
      component: GuildWars2,
      path: '/guildwars2',
      redirect: '/guildwars2/gw2accountstats',
      children: [
        {
          // leave path empty if this page is to be the home page for this parent
          // if you add a slash the path will be appended directly after your domain, leave it off and it is appended after its parent path.
          name: 'gw2home',
          component: GW2Home,
          path: 'gw2home'
        },
        {
          name: 'gw2accountstats',
          component: GW2AccountStats,
          path: 'gw2accountstats'
        },
        {
          name: 'gw2wvw',
          component: GW2Wvw,
          path: 'gw2wvw'
        }
      ]
    },
    {
      name: 'about',
      component: About,
      path: '/about'
    },
    {
      redirect: { name: 'home' },
      path: '*'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return {x: 0, y: 0}
  }
})

export default router
