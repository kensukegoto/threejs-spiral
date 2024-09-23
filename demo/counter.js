import * as THREE from 'three';

window.addEventListener('load', init);

// 慣性スクロールの値
let inertialScroll = 0;
// 慣性スクロールのパーセント値(0~100)
let inertialScrollPercent = 0;

let scene, camera, renderer;

function init() {

  // const element = document.getElementById('bg');
  // scene = new THREE.Scene();
  
  // camera = new THREE.PerspectiveCamera(
  //     75, element.width / element.height, 0.1, 1000
  //   );
  // camera.position.set(50, 50, 50);
  // camera.rotation.set(0, 0, 0);
  // renderer = new THREE.WebGLRenderer({
  //   canvas: element
  // });
  // renderer.setSize( window.innerWidth, window.innerHeight );
 
  
  render();
}

/**
   * 慣性スクロールのためにスクロール値を取得する
   */
function setScrollPercent() {
  inertialScroll +=
    ((document.documentElement.scrollTop) - inertialScroll) * 0.08;
  // 慣性スクロールでのパーセント
  // inertialScrollPercent = (inertialScroll / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100).toFixed(2);

  console.log(inertialScroll);
  // document.getElementById('percent').innerText = inertialScrollPercent;
}


function render() {
  setScrollPercent();
  window.requestAnimationFrame(render);
}