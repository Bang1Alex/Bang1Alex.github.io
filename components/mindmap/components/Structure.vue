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
import { layoutList } from 'simple-mind-map/src/constants/constant'
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