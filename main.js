import * as THREE from 'three';
import * as GSAP from 'gsap';

console.log(GSAP);

(() => {

  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.querySelector('#app');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width/ height, 1, 10000);
  camera.position.set(0, 0, 800);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const group = new THREE.Group();
  scene.add(group);

  const vector = new THREE.Vector3();

  const cards = [];

  for (let i = 0; i < 10; i++) {

    const color = parseInt(`0x${Math.random().toString(16).slice(-6)}`, 16);

    const geometry = new THREE.PlaneGeometry( 100, 100 );
    const material = new THREE.MeshBasicMaterial( {color: new THREE.Color(color), side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = i;

    // 360度で分散
    const radian =  (Math.PI * 2 / 10) * i  + Math.PI / 2;
    const dy = i * (200 / 10 )

    mesh.position.set(
      200 * Math.cos(radian) * -1,
      dy,
      200 * Math.sin(radian)
    );

    vector.x = mesh.position.x * 2;
    vector.y = mesh.position.y;
    vector.z = mesh.position.z * 2;

    mesh.lookAt(vector);

    group.add(mesh);

    cards.push({
      r: radian,
      y: mesh.position.y
    });

  }

  console.log(cards);
  console.log(group);

  function move (r, y) {

    GSAP.gsap.to(group.rotation, {
      duration: 2,
      y: r,
      delay: 1,
      ease: "power3.inOut",
    });

    if(!y) return;

    GSAP.gsap.to(group.position, {
      duration: 2,
      y: y,
      delay: 1,
      ease: "power3.inOut",
    });

  }


  tick();

  function tick () {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  window.addEventListener('click', (evt) => {


    const raycaster = new THREE.Raycaster();
    const vector = new THREE.Vector2(
      (evt.clientX / window.innerWidth) * 2 - 1,
      (evt.clientY / window.innerHeight) * -2 + 1
    );
  
    raycaster.setFromCamera(vector, camera);
  
    const intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length) {

      const __item = intersects[0].object;

      const item = cards[__item.name];
    
      const r = -1 * ( item.r - Math.PI / 2 );
      const y = -1 * item.y;
      
      move(r, y);
      
    }
  
  });

  canvas.addEventListener('wheel', e => {

    const ry = e.deltaY > 0 ? -.01 : .01;
    const dy = e.deltaY > 0 ? -.75 : .75;

    group.rotation.y += ry;
    group.position.y += dy;

  });

  

})();

