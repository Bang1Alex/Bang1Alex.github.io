import { defineValaxyConfig } from 'valaxy'
import type { ThemeUserConfig } from 'valaxy-theme-sakura'

export default defineValaxyConfig<ThemeUserConfig>({
  theme: 'sakura',

  themeConfig: {
    ui: {
      primary: '#ff4e6a',
    },

    hero: {
      title: 'Hello, sakura',
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