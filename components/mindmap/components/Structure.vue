<template>

    <div class="layoutList" v-if="props.customToolbarTitle === '结构'">
        <div class="layoutItem" v-for="item in layoutList" :key="item.value" @click="useLayout(item)"
            :class="{ active: item.value === layout }">
            <div class="imgBox">
                <img  v-if="layoutImgMap[item.value]" :src="layoutImgMap[item.value]" :alt="item.name" />
                <img v-else src="https://i.postimg.cc/KY7jt3LR/default.png" alt="">
            </div>
            <div class="name">{{ item.name }}</div>
        </div>
    </div>
</template>
<script setup>
// import { layoutList } from 'simple-mind-map/src/constants/constant.js'
import { ref, toRaw } from 'vue';
const layout = ref('')
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
 const CONSTANTS = {
  CHANGE_THEME: 'changeTheme',
  CHANGE_LAYOUT: 'changeLayout',
  MODE: {
    READONLY: 'readonly',
    EDIT: 'edit'
  },
  LAYOUT: {
    LOGICAL_STRUCTURE: 'logicalStructure',
    LOGICAL_STRUCTURE_LEFT: 'logicalStructureLeft',
    MIND_MAP: 'mindMap',
    ORGANIZATION_STRUCTURE: 'organizationStructure',
    CATALOG_ORGANIZATION: 'catalogOrganization',
    TIMELINE: 'timeline',
    TIMELINE2: 'timeline2',
    FISHBONE: 'fishbone',
    FISHBONE2: 'fishbone2',
    RIGHT_FISHBONE: 'rightFishbone',
    RIGHT_FISHBONE2: 'rightFishbone2',
    VERTICAL_TIMELINE: 'verticalTimeline',
    VERTICAL_TIMELINE2: 'verticalTimeline2',
    VERTICAL_TIMELINE3: 'verticalTimeline3'
  },
  DIR: {
    UP: 'up',
    LEFT: 'left',
    DOWN: 'down',
    RIGHT: 'right'
  },
  KEY_DIR: {
    LEFT: 'Left',
    UP: 'Up',
    RIGHT: 'Right',
    DOWN: 'Down'
  },
  SHAPE: {
    RECTANGLE: 'rectangle',
    DIAMOND: 'diamond',
    PARALLELOGRAM: 'parallelogram',
    ROUNDED_RECTANGLE: 'roundedRectangle',
    OCTAGONAL_RECTANGLE: 'octagonalRectangle',
    OUTER_TRIANGULAR_RECTANGLE: 'outerTriangularRectangle',
    INNER_TRIANGULAR_RECTANGLE: 'innerTriangularRectangle',
    ELLIPSE: 'ellipse',
    CIRCLE: 'circle'
  },
  MOUSE_WHEEL_ACTION: {
    ZOOM: 'zoom',
    MOVE: 'move'
  },
  INIT_ROOT_NODE_POSITION: {
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    CENTER: 'center'
  },
  LAYOUT_GROW_DIR: {
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom'
  },
  PASTE_TYPE: {
    CLIP_BOARD: 'clipBoard',
    CANVAS: 'canvas'
  },
  SCROLL_BAR_DIR: {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  },
  CREATE_NEW_NODE_BEHAVIOR: {
    DEFAULT: 'default',
    NOT_ACTIVE: 'notActive',
    ACTIVE_ONLY: 'activeOnly'
  },
  TAG_PLACEMENT: {
    RIGHT: 'right',
    BOTTOM: 'bottom'
  },
  IMG_PLACEMENT: {
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom'
  }
}

 const initRootNodePositionMap = {
  [CONSTANTS.INIT_ROOT_NODE_POSITION.LEFT]: 0,
  [CONSTANTS.INIT_ROOT_NODE_POSITION.TOP]: 0,
  [CONSTANTS.INIT_ROOT_NODE_POSITION.RIGHT]: 1,
  [CONSTANTS.INIT_ROOT_NODE_POSITION.BOTTOM]: 1,
  [CONSTANTS.INIT_ROOT_NODE_POSITION.CENTER]: 0.5
}

//  布局结构列表
 const layoutList = [
  {
    name: '逻辑结构图',
    value: CONSTANTS.LAYOUT.LOGICAL_STRUCTURE
  },
  {
    name: '向左逻辑结构图',
    value: CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT
  },
  {
    name: '思维导图',
    value: CONSTANTS.LAYOUT.MIND_MAP
  },
  {
    name: '组织结构图',
    value: CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE
  },
  {
    name: '目录组织图',
    value: CONSTANTS.LAYOUT.CATALOG_ORGANIZATION
  },
  {
    name: '时间轴',
    value: CONSTANTS.LAYOUT.TIMELINE
  },
  {
    name: '时间轴2',
    value: CONSTANTS.LAYOUT.TIMELINE2
  },
  {
    name: '竖向时间轴',
    value: CONSTANTS.LAYOUT.VERTICAL_TIMELINE
  },
  {
    name: '竖向时间轴2',
    value: CONSTANTS.LAYOUT.VERTICAL_TIMELINE2
  },
  {
    name: '竖向时间轴3',
    value: CONSTANTS.LAYOUT.VERTICAL_TIMELINE3
  },
  {
    name: '鱼骨图',
    value: CONSTANTS.LAYOUT.FISHBONE
  },
  {
    name: '鱼骨图2',
    value: CONSTANTS.LAYOUT.FISHBONE2
  },
  {
    name: '向右鱼骨图',
    value: CONSTANTS.LAYOUT.RIGHT_FISHBONE
  },
  {
    name: '向右鱼骨图2',
    value: CONSTANTS.LAYOUT.RIGHT_FISHBONE2
  }
]
const useLayout = layout => {
    layout.value = layout.value
    toRaw(props.mindMap).setLayout(layout.value)
}
const layoutImgMap = ref({
    logicalStructure: 'https://i.postimg.cc/fT7PnwxY/logical-Structure.png',
    mindMap: 'https://i.postimg.cc/pXBscsHZ/mindMap.png',
    organizationStructure: 'https://i.postimg.cc/NfQ4XRHr/organization-Structure.png',
    catalogOrganization: 'https://i.postimg.cc/8c6qrMJY/catalog-Organization.png',
    timeline: 'https://i.postimg.cc/mkj7j6H1/timeline.png',
    timeline2: 'https://i.postimg.cc/ZKY8nZG8/timeline2.png',
    fishbone: 'https://i.postimg.cc/Y2WVRN0n/fishbone.png',
    verticalTimeline: 'https://i.postimg.cc/y8tcLRkj/vertical-Timeline.png'
})
</script>
<style lang="less" scoped>
.layoutList {
    padding: 20px;

    &.isDark {
        .name {
            color: #fff;
        }
    }

    .layoutItem {
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