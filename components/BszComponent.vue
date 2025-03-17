<script lang="ts" setup>
import { useScriptTag } from '@vueuse/core'
import { ref,onMounted } from 'vue'
useScriptTag('//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js')
const canvasRef = ref<HTMLCanvasElement | null>(null)
    onMounted(() => {
    // 获取 Canvas 元素和上下文
    const canvas = canvasRef.value;
        const ctx = canvas.getContext('2d');
        let isDrawing = false; // 是否正在绘制
        let lastX = 0; // 上一次鼠标的 X 坐标
        let lastY = 0; // 上一次鼠标的 Y 坐标

        // 设置初始画笔样式
        ctx.strokeStyle = '#000000'; // 默认颜色
        ctx.lineWidth = 5; // 默认线宽
        ctx.lineCap = 'round'; // 线条末端为圆形
        ctx.lineJoin = 'round'; // 线条连接处为圆形

        // 鼠标按下事件：开始绘制
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        // 鼠标移动事件：绘制线条
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return; // 如果不在绘制状态，则退出
            ctx.beginPath(); // 开始新的路径
            ctx.moveTo(lastX, lastY); // 从上一个点开始
            ctx.lineTo(e.offsetX, e.offsetY); // 绘制到当前点
            ctx.stroke(); // 渲染线条
            [lastX, lastY] = [e.offsetX, e.offsetY]; // 更新上一个点的位置
        });

        // 鼠标松开或离开画布：停止绘制
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        // 颜色选择器：更新画笔颜色
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            ctx.strokeStyle = e.target.value;
        });

        // 线宽滑块：更新画笔线宽
        document.getElementById('lineWidth').addEventListener('input', (e) => {
            ctx.lineWidth = e.target.value;
        });

        // 清除按钮：清空画布
        document.getElementById('clearButton').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    })
</script>

<template>
   <canvas id="drawingCanvas" ref="canvasRef" width="500" height="600"></canvas>
    <div class="controls">
        <label for="colorPicker">颜色:</label>
        <input type="color" id="colorPicker" value="#000000">
        <label for="lineWidth">线宽:</label>
        <input type="range" id="lineWidth" min="1" max="20" value="5">
        <button id="clearButton">清除</button>
    </div>
  <div>
    <div>本站总访问量 <span id="busuanzi_value_site_pv" /> 次</div>
    <div>本站访客数 <span id="busuanzi_value_site_uv" /> 人次</div>
  </div>
</template>