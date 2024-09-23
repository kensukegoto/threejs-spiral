import * as THREE from 'three';
import * as GSAP from 'gsap';

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
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  // renderer.setClearColor(new THREE.Color(0xffffff));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width/ height, 1, 10000);
  camera.position.set(0, 200, 800);
  camera.lookAt(new THREE.Vector3(0, 200, 0));


  const light1 = new THREE.AmbientLight(0xFFFFFF, 4.0);
  scene.add(light1);

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( 0, 100, 100 );
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.shadow.camera.top = 100 * 4;
  directionalLight.shadow.camera.bottom = -100 * 4;
  directionalLight.shadow.camera.left = -100 * 4;
  directionalLight.shadow.camera.right = 100 * 4;
  directionalLight.shadow.radius = 10;
  scene.add(directionalLight);
  // directionalLight.shadow.radius = 4;

  const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
  scene.add( helper );

  // 床
  const floorGeometry = new THREE.PlaneGeometry(800, 800);
  const floorMaterial = new THREE.MeshStandardMaterial({color: 0xcccccc});
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.rotation.x = -0.5 * Math.PI;
  floor.position.x = 0;
  floor.position.y = 0;
  floor.position.z = 0;
  scene.add(floor);

  // const geometry = new THREE.BoxGeometry(50, 50, 50, 10);
  // const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );

  // const box = new THREE.Mesh( geometry, material );
  // box.castShadow = true;
  // box.position.y = 100;
  // box.rotation.y = - Math.PI / 180 * 45;
  // scene.add( box );

  const group = new THREE.Group();
  // group.position.y = 200;
  scene.add(group);

  // const vector = new THREE.Vector3();

  const cards = [];

  let pY = 0;
  let pR = 0;

  for (let i = 0; i < 20; i++) {

    // const color = parseInt(`0x${Math.random().toString(16).slice(-6)}`, 16);

    const geometry = new THREE.CylinderGeometry(50, 50, .1, 32);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./images/cat_01.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 面1
      new THREE.MeshBasicMaterial({ map: texture }), // 面2
      new THREE.MeshBasicMaterial({ map: texture }), // 面3
    ];

    // const material = new THREE.MeshStandardMaterial({
    //   map: texture,
    //   side: THREE.DoubleSide
    // });
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.name = i;
    mesh.castShadow = true;

    // 360度に10ずつ
    const radian =  (Math.PI * 2 / 10) * i  + Math.PI / 2;
    const dy = i * (200 / 10 )

    mesh.position.set(
      200 * Math.cos(radian) * -1,
      dy,
      200 * Math.sin(radian)
    );

    mesh.rotation.y = radian - Math.PI * 2;
    mesh.rotation.z = Math.PI / 2;

    group.add(mesh);

    cards.push({
      r: radian,
      y: mesh.position.y
    });

  }


  const step = (() => {

    const s = cards[0];
    const e = cards[cards.length - 1];

    const scrolY = window.innerHeight * 2;

    return { r: (e.r - s.r) / scrolY, y: (e.y - s.y) / scrolY };
  })();

  function move (r, y) {

    GSAP.gsap.to(group.rotation, {
      duration: 2,
      y: r,
      delay: .5,
      ease: "power3.inOut",
      onComplete () {
        pR = r
      }
    });

    if(y === undefined) return;

    GSAP.gsap.to(group.position, {
      duration: 2,
      y: y,
      delay: .5,
      ease: "power3.inOut",
      onComplete () {
        pY = y;
      }
    });

  }


  tick();

  function tick () {

    renderer.render(scene, camera);
    
    // 慣性
    group.position.y += (pY - group.position.y) * .1;
    group.rotation.y += (pR - group.rotation.y) * .1;

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

    const v = 5;
    const ry = e.deltaY > 0 ? -1 * v * step.r : v * step.r;
    const dy = e.deltaY > 0 ? -1 * v * step.y : v * step.y;

    pR += ry;
    pY += dy;


    // console.log(cards[0], pR, pY)

    // group.rotation.y += ry;
    // group.position.y += dy;

  });

  

})();

