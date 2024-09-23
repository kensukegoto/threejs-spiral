import * as THREE from 'three';

(() => {

  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.querySelector('#canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );


  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( 0, 10, 40 );
  camera.lookAt( 0, 10, 0 );

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );

  // 高いところから照らす。影を落とさない
  const ambLight = new THREE.AmbientLight( 0xffffff, 4 );
  scene.add( ambLight );


  const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
  directionalLight.position.set( 20, 200, 20 );
  directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize.width = 512;
  // directionalLight.shadow.mapSize.height = 512;
  
  // シャドウの半径（ぼかし範囲）を設定
  directionalLight.shadow.radius = 4;  // エッジをぼかす
  
  // シャドウカメラの範囲を設定
  directionalLight.shadow.camera.near = 190;
  directionalLight.shadow.camera.far = 203;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  
  // ？？
  // directionalLight.shadow.camera.top = 1000;
  // directionalLight.shadow.camera.bottom = - 1000;
  // directionalLight.shadow.camera.left = - 1000;
  // directionalLight.shadow.camera.right = 1000;
  scene.add( directionalLight );

  const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
  scene.add( helper );

  const ground = new THREE.Mesh( new THREE.PlaneGeometry( 40, 40 ), new THREE.MeshStandardMaterial( { color: 0xbbbbbb, depthWrite: false } ) );
  ground.rotation.x = - Math.PI / 2;
  ground.receiveShadow = true;
  scene.add( ground );

  const grid = new THREE.GridHelper( 40, 20, 0x000000, 0x000000 );
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add( grid );

  const geometry = new THREE.BoxGeometry(5, 5, 5, 10);
  const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );

  const mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;
  mesh.position.y = 2.5;
  // scene.add( mesh );

  const paper = new THREE.Mesh( new THREE.CylinderGeometry(5, 5, .01, 32), [
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面1
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 面2
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 面3
  ] );
  
  paper.rotation.x = - Math.PI / 2;
  paper.rotation.z =  Math.PI / 180 * 135;
  paper.position.y = 10;
  paper.castShadow = true;
  scene.add( paper );

  const paper2 = new THREE.Mesh( new THREE.BoxGeometry(5, 5, .01), [
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面1
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面2
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面3
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面4
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 面5
    new THREE.MeshBasicMaterial({ color: 0x00ffff }), // 面6
  ] );

  paper2.rotation.y = - Math.PI / 180 * 75;
  paper2.position.y = 20;
  paper2.castShadow = true;
  scene.add( paper2 );


  tick();


  function tick () {

    renderer.render(scene, camera);

    requestAnimationFrame(tick);

  }



})();