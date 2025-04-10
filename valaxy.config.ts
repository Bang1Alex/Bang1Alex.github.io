import { defineValaxyConfig } from 'valaxy'
import type { ThemeUserConfig } from 'valaxy-theme-sakura'

export default defineValaxyConfig<ThemeUserConfig>({
  theme: 'yun',

  themeConfig: {
    ui: {
      primary: '#ff4e6a',
    },

    hero: {
      title: 'Hello, Alex',
      motto: '我用双手成就你的梦想',
      urls: [
        'https://haowallpaper.com/link/common/file/getCroppingImg/15789130517090624',
        'https://haowallpaper.com/link/common/file/getCroppingImg/15942630369381760',
        'https://haowallpaper.com/link/common/file/getCroppingImg/16445126326406528',
        'https://haowallpaper.com/link/common/file/getCroppingImg/16573715995151744',
      ],
      style: 'filter-dot',
    },
  },
})