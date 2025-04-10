<template>
    <div class="container" ref="containerRef">
      <div class="laps" v-if="lapsVisible">
        <div class="small-gear">后齿轮圈数：{{ Math.floor(smallGear.turns) }}</div>
        <div class="big-gear">前齿轮圈数：{{ Math.floor(bigGear.turns) }}</div>
      </div>
      <canvas ref="canvasRef" 
        :width="width" 
        :height="height" 
        @mousedown.prevent="startDrag($event)"
        @mousemove.prevent="duringDrag($event)" 
        @mouseup="endDrag()" 
        @mouseleave="endDrag()"
        @touchstart="startDrag($event)" 
        @touchmove.prevent="duringDrag($event)"
        @touchend="endDrag()" 
        @touchcancel="endDrag()">
      </canvas>
      <div class="teeth">
        <div class="small-teeth">
          <span>后齿轮齿数：</span>
          <div class="input" @click="showKeypad('small')">{{ smallTeeth }}</div>
        </div>
        <div class="big-teeth">
          <span>前齿轮齿数：</span>
          <div class="input" @click="showKeypad('big')">{{ bigTeeth }}</div>
        </div>
      </div>
      <div class="keypad" v-if="keypadVisible" :style="keypadPosition">
        <div class="keypad-row" v-for="(row, index) in keypadLayout" :key="index">
          <button v-for="key in row" :key="key" @click="handleKey(key)">
            {{ key }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script  setup>
  import { reactive, computed, ref, onMounted, inject } from "vue";
  const bigTeeth =ref(48);
  const smallTeeth = ref(24);
  const lapsVisible = ref(true);
  const width =ref(700);
  const height = ref(500);
  const canvasRef = ref(null );
  let canvas;
  let ctx;
  
  const bigGear = reactive({
    x: 500,
    y: 240,
    radius: 80,
    teeth: bigTeeth.value,
    angle: 0,
    turns: 0,
  });
  
  const smallGear = reactive({
    x: 200,
    y: 240,
    radius: 30,
    teeth: smallTeeth.value,
    angle: 0,
    turns: 0,
  });
  
  const wheel = reactive({
    x: smallGear.x,
    y: smallGear.y,
    radius: 150,
  });
  
  let chainOffset = 0;
  let dashArr = [5, 5];
  let isDragging = false;
  let previousMouseAngle = 0;
  
  // Keypad related
  const keypadVisible = ref(false);
  const keypadPosition = ref({ left: '0px', top: '0px' });
  const currentInput = ref<'big' | 'small' | null>(null);
  const inputValue = ref('');
  const keypadLayout = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '×', '完成']
  ];
  
  onMounted(() => {
    render();
  });
  
  function render() {
    canvas = canvasRef.value;
    ctx = canvas.getContext("2d");
    draw();
  }
  
  function normalizeAngleDiff(diff) {
    while (diff > Math.PI) {
      diff -= 2 * Math.PI;
    }
    while (diff < -Math.PI) {
      diff += 2 * Math.PI;
    }
    return diff;
  }
  
  function drawGear(gear) {
    ctx.save();
    ctx.translate(gear.x, gear.y);
    ctx.rotate(gear.angle);
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < gear.teeth * 2; i++) {
      const angle = (i * Math.PI) / gear.teeth;
      const r = i % 2 === 0 ? gear.radius : gear.radius - 10;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "#999";
    ctx.fill();
    ctx.strokeStyle = "#3c4857";
    ctx.stroke();
  
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#c8e7f2";
    ctx.fill();
    ctx.stroke();
  
    ctx.beginPath();
    const spokes = 5;
    for (let i = 0; i < 1; i++) {
      const angle = (i * Math.PI * 2) / spokes;
      ctx.moveTo(0, 0);
      ctx.lineTo(
        (gear.radius - 15) * Math.cos(angle),
        (gear.radius - 15) * Math.sin(angle)
      );
    }
    ctx.strokeStyle = "deeppink";
    ctx.lineWidth = 3;
    ctx.stroke();
  
    ctx.restore();
  }
  
  function drawWheel() {
    ctx.save();
    ctx.translate(wheel.x, wheel.y);
    ctx.rotate(smallGear.angle);
    ctx.beginPath();
    ctx.arc(0, 0, wheel.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      ctx.moveTo(0, 0);
      ctx.lineTo(wheel.radius * Math.cos(angle), wheel.radius * Math.sin(angle));
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  
  function drawChain() {
    const offset = 5;
    const bigRadius = bigGear.radius + offset;
    const smallRadius = smallGear.radius + offset;
    const angleBetween = Math.atan2(
      smallGear.y - bigGear.y,
      smallGear.x - bigGear.x
    );
    const perpendicular = Math.PI / 2;
    const angleOffset = perpendicular;
    const bigAngle1 = angleBetween + angleOffset;
    const bigAngle2 = angleBetween - angleOffset;
    const bigP1 = {
      x: bigGear.x + bigRadius * Math.cos(bigAngle1),
      y: bigGear.y + bigRadius * Math.sin(bigAngle1),
    };
    const bigP2 = {
      x: bigGear.x + bigRadius * Math.cos(bigAngle2),
      y: bigGear.y + bigRadius * Math.sin(bigAngle2),
    };
    const smallAngle1 = angleBetween + angleOffset;
    const smallAngle2 = angleBetween - angleOffset;
    const smallP1 = {
      x: smallGear.x + smallRadius * Math.cos(smallAngle1),
      y: smallGear.y + smallRadius * Math.sin(smallAngle1),
    };
    const smallP2 = {
      x: smallGear.x + smallRadius * Math.cos(smallAngle2),
      y: smallGear.y + smallRadius * Math.sin(smallAngle2),
    };
    ctx.beginPath();
    ctx.moveTo(bigP1.x, bigP1.y);
    ctx.lineTo(smallP1.x, smallP1.y);
    ctx.arc(
      smallGear.x,
      smallGear.y,
      smallRadius,
      smallAngle1,
      smallAngle2,
      true
    );
    ctx.lineTo(bigP2.x, bigP2.y);
    ctx.arc(bigGear.x, bigGear.y, bigRadius, bigAngle2, bigAngle1, true);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.setLineDash(dashArr);
    ctx.lineDashOffset = chainOffset;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel();
    drawGear(bigGear);
    drawGear(smallGear);
    drawChain();
  }
  
  function startDrag(evt) {
    const { clientX, clientY } = evt instanceof TouchEvent ? evt.touches[0] : evt;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const dx = mouseX - bigGear.x;
    const dy = mouseY - bigGear.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bigGear.radius + 10) {
      isDragging = true;
      previousMouseAngle = Math.atan2(dy, dx);
    }
  }
  
  function duringDrag(evt) {
    const { clientX, clientY } = evt instanceof TouchEvent ? evt.touches[0] : evt;
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const dx = mouseX - bigGear.x;
    const dy = mouseY - bigGear.y;
    const currentMouseAngle = Math.atan2(dy, dx);
    let angleDiff = currentMouseAngle - previousMouseAngle;
    angleDiff = normalizeAngleDiff(angleDiff);
  
    bigGear.angle += angleDiff;
    bigGear.turns += Math.abs(angleDiff) / (2 * Math.PI);
  
    const gearRatio = bigGear.teeth / smallGear.teeth;
    smallGear.angle = bigGear.angle * gearRatio;
    smallGear.turns += Math.abs(angleDiff * gearRatio) / (2 * Math.PI);
  
    chainOffset += angleDiff * 80;
  
    previousMouseAngle = currentMouseAngle;
    draw();
  }
  
  function endDrag() {
    isDragging = false;
  }
  
  // Keypad functions
  function showKeypad(type) {
    currentInput.value = type;
    inputValue.value = type === 'big' ? String(bigTeeth.value) : String(smallTeeth.value);
    
    const inputElement = event?.target ;
    const rect = inputElement.getBoundingClientRect();
    const containerRect = (canvasRef.value ).getBoundingClientRect();
    
    keypadPosition.value = {
      left: `${rect.left - containerRect.left + rect.width / 2 - 75}px`, // Center below input
      top: `${rect.bottom - containerRect.top -300 }px`
    };
    keypadVisible.value = true;
  }
  
  function handleKey(key) {
    console.log(key);
    
    if (key === '完成') {
      const value = parseInt(inputValue.value) || 0;
      if(value >120 || value < 10) {
        // message.error('齿数范围在10-120之间');
        return;
      }
      if (currentInput.value === 'big') {
        // store.setBigTeeth(value);
        bigTeeth.value = value;
        bigGear.teeth = value;
      } else if (currentInput.value === 'small') {
        // store.setSmallTeeth(value);
        smallTeeth.value = value;
        smallGear.teeth = value;
      }
      smallGear.turns = 0;
      bigGear.turns = 0;
      smallGear.angle = 0;
      bigGear.angle = 0;
      keypadVisible.value = false;
      draw();
    } else if (key === '×') {
      inputValue.value = inputValue.value.slice(0, -1);
      if (currentInput.value === 'big') { 
          // store.setBigTeeth(Number(inputValue.value));
          bigGear.teeth = Number(inputValue.value);
      }else if (currentInput.value === 'small') {
          // store.setSmallTeeth(Number(inputValue.value));
          smallGear.teeth = Number(inputValue.value);
      }
    } else {
      inputValue.value += key;
      if (currentInput.value === 'big') { 
          // store.setBigTeeth(Number(inputValue.value));
          bigGear.teeth = Number(inputValue.value);
      }else if (currentInput.value === 'small') {
          // store.setSmallTeeth(Number(inputValue.value));
          smallGear.teeth = Number(inputValue.value);
      }
  
  
    }
  }
  </script>
  
  <style scoped lang="less">
  .common-style {
    position: absolute;
    left: 10px;
    z-index: 1;
    font-size: 30px;
    width: 100%;
    color: #756a6a;
    font-weight: 700;
  }
  
  [data-control="checkers"] .container {
    box-sizing: border-box;
    user-select: none;
    width: 100%;
    height: 100%;
    border: 1px solid #e0e0e0;
    background: #f8f9fa;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  
    .laps {
      .common-style;
      top: 15px;
      display: flex;
      justify-content: space-around;
      padding: 10px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
      .small-gear {
        color: #2c5282;
      }
  
      .big-gear {
        color: #742a2a;
      }
    }
  
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  
    .teeth {
      .common-style;
      bottom: 20px;
      display: flex;
      justify-content: space-around;
      padding: 15px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
      .big-teeth,
      .small-teeth {
        display: flex;
        align-items: center;
        gap: 10px;
  
        span {
          color: #555;
        }
  
        .input {
          width: 120px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          text-align: center;
          background: #fff;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
          font-size: 18px;
          color: #333;
          cursor: pointer;
          transition: background 0.2s;
  
          &:hover {
            background: #f0f0f0;
          }
        }
      }
    }
  
    .keypad {
      position: absolute;
      width: 150px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10;
  
      .keypad-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
  
        &:last-child {
          margin-bottom: 0;
        }
  
        button {
          width: 50px;
          height: 50px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f8f8f8;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
  
          &:hover {
            background: #e0e0e0;
          }
  
          &:active {
            background: #d0d0d0;
          }
        }
      }
    }
  }
  </style>