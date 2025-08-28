<template>
  <div class="themeList" v-if="props.customToolbarTitle === '主题'">
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane v-for="group in groupList" :key="group.name" :label="group.name" :name="group.name"></el-tab-pane>
    </el-tabs> -->
      <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane v-for="(group,index) in groupList" :key="index" :tab="group.name" ></a-tab-pane>

  </a-tabs>

    <div class="themeItem" v-for="item in currentList" :key="item.value" @click="useTheme(item)"
      :class="{ active: item.value === theme }">
      <div class="imgBox">
        <img v-if="themeMap[item.value]" :src="themeMap[item.value]" :alt="item.value" />
        <img v-else src="https://i.postimg.cc/KY7jt3LR/default.png" alt="">
      </div>
      <div class="name">{{ item.name =='脑残粉' ?'粉色' : item.name}}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import themeList from 'simple-mind-map-plugin-themes/themeList'
import customThemeList from './customThemes'

const props = defineProps({
  customToolbarTitle: {
    type: String,
    default: ''
  },
  mindMap: {
    type: Object,
    default: () => ({})
  },
  getImageUrlFromPath: {
    type: Function,
    default: () => ''
  },
  updatePreset: {
    type: Function,
  }
})
const currentList = computed(() => {
  if (groupList.value.length > 0) {
    return groupList.value.find(item => item.name ===   groupList.value[activeKey.value].name).list
  }
})
const activeKey = ref(1)
const themeMap = ref({
  default: 'https://i.postimg.cc/KY7jt3LR/default.png',
  classic: 'https://i.postimg.cc/L4jS5Ft8/classic.jpg',
  minions: 'https://i.postimg.cc/bw9dt21d/minions.jpg',
  pinkGrape: 'https://i.postimg.cc/PJD5rLtX/pink-Grape.jpg',
  mint: 'https://i.postimg.cc/Qd3HCq9R/mint.jpg',
  gold: 'https://i.postimg.cc/mk1GNKq8/gold.jpg',
  vitalityOrange: 'https://i.postimg.cc/KvyZD8GT/vitality-Orange.jpg',
  greenLeaf: 'https://i.postimg.cc/RCW3Dhxb/green-Leaf.jpg',
  dark2: 'https://i.postimg.cc/L6ZHzZF2/dark2.jpg',
  skyGreen: 'https://i.postimg.cc/ZYNbNdSZ/skyGreen.jpg',
  classic2: 'https://i.postimg.cc/zX5rR27S/classic2.jpg',
  classic3: 'https://i.postimg.cc/0yDyqKVc/classic3.jpg',
  classic4: 'https://i.postimg.cc/j5dxNgtF/classic4.jpg',
  classicGreen: 'https://i.postimg.cc/rmn891pF/classic-Green.jpg',
  classicBlue: 'https://i.postimg.cc/9f2FXXSV/classic-Blue.jpg',
  blueSky: 'https://i.postimg.cc/sXhr5tbK/blueSky.jpg',
  brainImpairedPink: 'https://i.postimg.cc/Xq60LsbW/brain-Impaired-Pink.jpg',
  dark: 'https://i.postimg.cc/bY5yD9Mm/dark.jpg',
  earthYellow: 'https://i.postimg.cc/zBcrhqdy/earth-Yellow.jpg',
  freshGreen: 'https://i.postimg.cc/fLLskVv4/fresh-Green.jpg',
  freshRed: 'https://i.postimg.cc/8s8gytgD/freshRed.jpg',
  romanticPurple: 'https://i.postimg.cc/fRCTLQh9/romantic-Purple.jpg',
  simpleBlack: 'https://i.postimg.cc/gj3GbfDr/simple-Black.jpg',
  courseGreen: 'https://i.postimg.cc/rs7MBqWB/course-Green.jpg',
  coffee: 'https://i.postimg.cc/D0S7pSWQ/coffee.jpg',
  redSpirit: 'https://i.postimg.cc/VLyNZFRd/red-Spirit.jpg',
  blackHumour: 'https://i.postimg.cc/W4tj1DnB/black-Humour.jpg',
  lateNightOffice: 'https://i.postimg.cc/KcCKSbZc/late-Night-Office.jpg',
  blackGold: 'https://i.postimg.cc/rpbT08ZK/black-Gold.jpg',
  autumn: 'https://i.postimg.cc/bwmpP0Q0/autumn.jpg',
  avocado: 'https://i.postimg.cc/2Skrg9B8/avocado.jpg',
  orangeJuice: 'https://i.postimg.cc/QtHMw4wW/orange-Juice.jpg',
  oreo: 'https://i.postimg.cc/RFy0B1xp/oreo.jpg',
  shallowSea: 'https://i.postimg.cc/26sCJznP/shallow-Sea.jpg',
  lemonBubbles: 'https://i.postimg.cc/GhY4bf2F/lemon-Bubbles.jpg',
  rose: 'https://i.postimg.cc/0QM8c6KY/rose.jpg',
  seaBlueLine: 'https://i.postimg.cc/R0bS71hC/sea-Blue-Line.jpg',
  neonLamp: 'https://i.postimg.cc/N0NMNqJc/neonLamp.jpg',
  darkNightLceBlade: 'https://i.postimg.cc/CKwSTPBx/dark-Night-Lce-Blade.jpg',
  morandi: 'https://i.postimg.cc/pdVrYXBC/morandi.jpg',
  classic5: 'https://i.postimg.cc/HLtWrDDM/classic5.jpg',
  dark3: 'https://i.postimg.cc/jS0RvdRN/dark3.jpg',
  dark4: 'https://i.postimg.cc/RZ74Y50Y/dark4.jpg',
  cactus: 'https://i.postimg.cc/4yvRSpf9/cactus.jpg'
})

const useTheme = item => {
  if (theme.value === item.value) return
  theme.value = item.value
  const customThemeConfig = props.mindMap.getCustomThemeConfig()
  const hasCustomThemeConfig = Object.keys(customThemeConfig).length > 0
  if (hasCustomThemeConfig) {
    ElMessageBox.confirm('你当前自定义过基础样式，是否覆盖？', '提示', {
      confirmButtonText: '覆盖',
      cancelButtonText: '保留',
      type: 'warning'
    })
      .then(() => {
        props.mindMap.setThemeConfig({}, true)
        changeTheme(theme, {})
      })
      .catch(() => {
        changeTheme(theme, customThemeConfig)
      })
  } else {
    changeTheme(theme, customThemeConfig)
  }

}
const changeTheme = (theme, config) => {
  props.mindMap.setTheme(theme.value)
}
const groupList = ref([]);
const activeName = ref('')
const theme = ref('')
const themeAllList = ref([...themeList, ...customThemeList].reverse())
onMounted(async () => {
  await initGroup()
})
const initGroup = () => {
  let baiduThemes = [
    'default',
    'skyGreen',
    'classic2',
    'classic3',
    'classicGreen',
    'classicBlue',
    'blueSky',
    'brainImpairedPink',
    'earthYellow',
    'freshGreen',
    'freshRed',
    'romanticPurple',
    'pinkGrape',
    'mint'
  ]
  let baiduList = []
  let classicsList = []
  themeAllList.value.forEach(item => {
    if (baiduThemes.includes(item.value)) {
      baiduList.push(item)
    } else if (!item.dark) {
      classicsList.push(item)
    }
  })
  groupList.value = [
    {
      name: '经典',
      list: classicsList
    },
    {
      name: '深色',
      list: themeAllList.value.filter(item => {
        return item.dark
      })
    },
    {
      name: '朴素',
      list: baiduList
    }
  ]
  activeName.value = groupList.value[0].name
}
</script>
<style lang="less" scoped>
.themeList {
  padding: 20px;
  padding-top: 0;

  &.isDark {
    .name {
      color: #fff;
    }
  }

  .themeItem {
    width: 100%;
    cursor: pointer;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;
    padding-bottom: 20px;
    transition: all 0.2s;
    border: 1px solid transparent;

    &:last-of-type {
      border: none;
    }

    &:hover {
      box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }

    &.active {
      border: 1px solid #67c23a;
    }

    .imgBox {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .name {
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>