<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TouchControls from '../utils/3DGallery/TouchControls.js';
import data from '../utils/3DGallery/position.json';
let renderer, camera, scene, controls
let sceneObject
let meshImage = [], meshText = []
let width
let height
let aspect
let viewAngle = 75
let near = 1
let far = 1000
const loadFinish = ref(false)
const canvasContainerRef = ref("")

onMounted(() => {
    init()
})
function init() {
  if (!canvasContainerRef.value) return
  startScene(canvasContainerRef.value)
}
function startScene(container) {
  if (loadFinish.value) return
  width = 600
  height = 400
  aspect = width / height
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe9f4fc);
  const url = `/utils/3DGallery/gallery.glb`
  const loader = new GLTFLoader()
  loader.load(url, (model) => {
    sceneObject = model.scene
    scene.add(sceneObject)
    let ground;
    scene.traverse((child) => {
      if (child.name === 'wall') {
        ground = child;
        const colors = ['0x333333', '0x999999', '0xcccccc', '0xcccccc', '0xc2d1bf']
        if (ground) {
          ground.children.forEach((child, index) => {
            if (child.isMesh) {
              child.map = null;
              child.material.emissive.set(colors[index]);
            }
          });
        } else {
          console.error('加载失败');
        }
      }
      if (child.name === 'ground') {
        ground = child;
        const colors = [0x333333, 0x999999, 0xcccccc, 0xcccccc, 0xc2d1bf]
        if (ground) {
          ground.children.forEach((child, index) => {
            if (child.isMesh) {
              child.map = null;
              child.material.emissive.set(colors[index]);
            }
          });
        } else {
          console.error('加载失败');
        }
      }

    });
    loadImageAndName()
    addLights()
    addControls()
    render()

  })

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  container.append(renderer.domElement)
  window.addEventListener('resize', onWindowResize)
  loadFinish.value = true
}

function addLights() {
  let ambient = new THREE.AmbientLight(0x404040)
  scene.add(ambient)
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);
}

function addControls() {
  camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far)
  let options = {
    delta: 0.75,           // coefficient of movement
    moveSpeed: 1,          // speed of movement
    rotationSpeed: 0.002,  // coefficient of rotation
    maxPitch: 55,          // max camera pitch angle
    hitTest: true,         // stop on hitting objects
    hitTestDistance: 40    // distance to test for hit
  }
  controls = new TouchControls(canvasContainerRef.value.parentNode, camera, options)
  controls.setPosition(-280, 100, 300)
  controls.addToScene(scene)
}

function render() {
  requestAnimationFrame(render)
  controls.update()
  let vector = new THREE.Vector3(controls.mouse.x, controls.mouse.y, 1)
  vector.unproject(camera)
  renderer.render(scene, camera)
}

function onWindowResize() {
  width = 600
  height = 400
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function createImage({ x, y, z, rotation, url, width = 80, height = 100 },) {
  if (!x || !y || !z) return
  const textureLoader = new THREE.TextureLoader();

  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        // 获取图片的原始宽高
        const imgWidth = texture.image.width;
        const imgHeight = texture.image.height;

        // 目标框的尺寸
        const targetWidth = width;  // 80
        const targetHeight = height; // 100

        // 计算图片的宽高比和目标框的宽高比
        const imgAspect = imgWidth / imgHeight;
        const targetAspect = targetWidth / targetHeight;

        let finalWidth, finalHeight;

        // 根据宽高比调整尺寸，保持图片比例
        if (imgAspect > targetAspect) {
          // 图片更宽，按宽度适配
          finalWidth = targetWidth;
          finalHeight = targetWidth / imgAspect;
        } else {
          // 图片更高，按高度适配
          finalHeight = targetHeight;
          finalWidth = targetHeight * imgAspect;
        }
        const geometry = new THREE.PlaneGeometry(finalWidth, finalHeight);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        texture.repeat.set(1, 1);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        mesh.position.set(x, y, z);
        // eslint-disable-next-line no-undef
        mesh.rotation.y = rotation * Math.PI;
        scene.add(mesh);
        resolve(mesh);
      },
      undefined,
      (error) => {
        console.error('图片加载失败:', error);
        reject(error);
      }
    );
  });
}

// 使用示例
function loadImageAndName() {

//   const data = require(`../utils/3DGallery/position.json`);
  const promises = data.map((item, i) => {
    // const url = item.data.widgetScreenShot
    const { x, y, z, rotation } = data[i];
    return createImage({ x, y, z, rotation, url:"http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280" });
  });

  Promise.all(promises)
    .then(meshes => {
      removeImages()
      console.log('所有图片加载完成:', meshes);
      meshImage = meshes
      meshes.forEach(mesh => {
        scene.add(mesh);
      });
      renderer.render(scene, camera);
    })
    .catch(error => {
      console.error('加载图片时出错:', error);
    });
  const promises1 = data.map((item, i) => {
    // const name = item.user.name
    const { x, y, z, rotation } = data[i];
    return createText(x, y, z, rotation, '小美')

  });

  Promise.all(promises1)
    .then(meshes => {
      removeTexts()
      console.log('所有文字加载完成:', meshes);
      meshText = meshes
      meshes.forEach(mesh => {
        scene.add(mesh);
      });
      renderer.render(scene, camera);
    })
    .catch(error => {
      console.error('加载文字时出错:', error);
    });

}
function createText(x, y, z, rotation, name) {
  if (!x || !y || !z) return
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      'http://localhost:4859/@fs/Users/sxbz01/Desktop/mydemo/blog-valaxy/utils/STFangsong_Regular.json', // 字体文件路径
      function (font) {
        // 创建文字几何体
        const geometry = new TextGeometry(name, {
          font: font,
          size: 10,           // 文字大小
          height: 0.2,       // 厚度
          width: 80,
          curveSegments: 12, // 曲线细分
        });
        console.log(name);

        // 创建材质
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(geometry, material);
        let l = 20
        let newX = x
        let newZ = z
        if (rotation == 0.5) {
          newZ = newZ + l
        } else if (rotation == -0.5) {
          newZ = newZ - l
        } else if (rotation == 0) {
          newX = newX - 30
        } else if (rotation == -1) {
          newX = newX + 30
        }
        // 设置位置
        textMesh.position.set(newX, 160, newZ);
        textMesh.rotation.y = rotation * Math.PI;
        resolve(textMesh)
      },
      undefined,
      (error) => {
        console.error('文字加载失败:', error);
        reject(error);
      }
    );
  }
  )

}
function removeImages() {
  if (meshImage.length <= 0) return
  meshImage.forEach(mesh => {
    scene.remove(mesh);
    mesh.geometry.dispose(); // 释放几何体资源
    mesh.material.dispose(); // 释放材质资源
  })
  meshImage = []

}
function removeTexts() {
  if (meshText.length == 0) return
  meshText.forEach(mesh => {
    scene.remove(mesh);
    mesh.geometry.dispose(); // 释放几何体资源
    mesh.material.dispose(); // 释放材质资源
  })
  meshText = []
}
</script>
<template>
    <!-- <img src="../public/favicon.svg" alt="Vue logo" /> -->
    <div class="statistics-container">
      <div class="canvas-container" ref="canvasContainerRef"></div>
    </div>
</template>
<style>
body {
  /* background-color: #000000; */
}

.rotation-pad {
  width: 150px;
  height: 150px;
  position: absolute;
}

.rotation-pad .region {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(rgba(218, 225, 230, 0.25) 5%, rgba(218, 225, 230, 0.50) 95%),
    url("../utils/3DGallery/images/cam.png") center center no-repeat;
  border: 2px solid rgba(218, 225, 230, 0.25);
  border-radius: 90px;
  box-shadow: 0px 0px 5px rgba(194, 200, 204, 0.55);
  user-select: none;
}

.rotation-pad .handle {
  opacity: 0.1;
  position: absolute;
  height: 40px;
  width: 40px;
  top: 0px;
  left: 0px;
  background: radial-gradient(rgba(215, 225, 255, 0.70) 0%, rgba(215, 225, 255, 0.50) 100%);
  /*border: 1px solid rgba(145, 105, 245, 0.90);*/
  border-radius: 50%;
  box-shadow: 0px 0px 7px rgba(195, 205, 245, 0.9);
  text-align: center;
  font: 24px/44px "Courier New", Courier, monospace;
  user-select: none;
}

.movement-pad {
  position: absolute;
  width: 150px;
  height: 150px;
}

.movement-pad .region {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(rgba(218, 225, 230, 0.25) 5%, rgba(218, 225, 230, 0.50) 95%),
    url("../utils/3DGallery/images/nav.png") center center no-repeat;
  border: 2px solid rgba(218, 225, 230, 0.25);
  border-radius: 90px;
  box-shadow: 0px 0px 5px rgba(194, 200, 204, 0.55);
  user-select: none;
}

.movement-pad .handle {
  opacity: 0.1;
  position: absolute;
  height: 40px;
  width: 40px;
  top: 0px;
  left: 0px;
  background: radial-gradient(rgba(215, 225, 255, 0.70) 0%, rgba(215, 225, 255, 0.50) 100%);
  /*border: 1px solid rgba(145, 105, 245, 0.90);*/
  border-radius: 50%;
  box-shadow: 0px 0px 7px rgba(195, 205, 245, 0.9);
  text-align: center;
  font: 24px/44px "Courier New", Courier, monospace;
  user-select: none;
}
</style>

