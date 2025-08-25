import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'
// import { addonComponents } from 'valaxy-addon-components'
import { VitePWA } from 'vite-plugin-pwa'
// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: true,
      title: '柱子笔记',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备17038157号',
      },
    },
  },
  vite: {
    // https://vite-pwa-org.netlify.app/
    plugins: [VitePWA()],
  },
    vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag:any) => tag.startsWith('my-')
      }
    }
  },
  unocss: { safelist },
    addons: [
    // addonComponents()
    addonWaline({
      // Waline 配置项，参考 https://waline.js.org/reference/client/props.html
      serverURL: 'https://your-waline-url',
    }),
  ],
})
