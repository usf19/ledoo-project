import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Point2D, PageView } from '../types';
import {
  createShardExtrudeGeometry,
  createShardFaceGeometry,
  createRoundedShape,
} from '../utils/geometry';
import {
  createPanelCanvas,
  createNavCanvas,
} from '../utils/textCanvas';
import { getHomographyMatrix3D } from '../utils/homography';
import { DomTextOverlay } from './DomTextOverlay';
import { YousefPortfolioView } from './portfolio/YousefPortfolioView';

interface ShardData {
  id: string;
  name: string;
  meshGroup: THREE.Group;
  extrudeMesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhysicalMaterial>;
  faceMesh: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
  basePoints: Point2D[];
  currentPoints: Point2D[];
  center: Point2D;
  // Physics springs:
  currentElevation: number;
  elevationVelocity: number;
  targetElevation: number;
  currentTipX: number;
  tipXVelocity: number;
  targetTipX: number;
  currentTipY: number;
  tipYVelocity: number;
  targetTipY: number;
  currentIridescence: number;
  currentEnvIntensity: number;
  // Shatter dynamics:
  shatterOutward: THREE.Vector3;
  shatterTumbleAxis: THREE.Vector3;
  shatterTumbleSpeed: number;
  shatterDelay: number;
  // Ambient background floating targets:
  ambientPos: THREE.Vector3;
  ambientRot: THREE.Vector3;
}

interface AmbientShard {
  mesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhysicalMaterial>;
  baseX: number;
  baseY: number;
  baseZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  ampX: number;
  ampY: number;
  ampZ: number;
  phase: number;
}

export const GlassHeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Hover states for interactions:
  const [isOpenStudioHovered, setIsOpenStudioHovered] = useState(false);
  const [isReadPaperHovered, setIsReadPaperHovered] = useState(false);
  const [hoveredNavLink, setHoveredNavLink] = useState<string | null>(null);
  const [isBackHovered, setIsBackHovered] = useState(false);

  // App View State:
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeTab, setActiveTab] = useState<PageView>('about');
  const [showProfileView, setShowProfileView] = useState(false);

  // Homography matrices for DOM overlay:
  const [panelMatrix3d, setPanelMatrix3d] = useState<string>('matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');
  const [navMatrix3d, setNavMatrix3d] = useState<string>('matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');

  // Dimensions:
  const [dimensions, setDimensions] = useState({
    panelWidth: 1000,
    panelHeight: 600,
    navWidth: 1000,
    navHeight: 70,
    scaleS: 1,
    isPortrait: false,
  });

  // Shatter animation state refs:
  const shatterProgressRef = useRef(0); // 0 = assembled, 1 = shattered
  const shatterTargetRef = useRef(0);
  const isShatteringRef = useRef(false);

  // Pointer state refs:
  const pointerNormRef = useRef({ x: 0, y: 0, active: false });
  const pointerWorldRef = useRef(new THREE.Vector3(0, 0, 0));
  const pointerPanelRef = useRef<{ x: number; y: number } | null>(null);

  // Scroll offset ref for 3D parallax:
  const scrollYRef = useRef(0);

  // Three.js instances ref:
  const sceneStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    blockGroup: THREE.Group;
    panelGroup: THREE.Group;
    navGroup: THREE.Group;
    ambientGroup: THREE.Group;
    ambientShards: AmbientShard[];
    shards: ShardData[];
    navShard: {
      group: THREE.Group;
      extrudeMesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhysicalMaterial>;
      faceMesh: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
      currentElevation: number;
      elevationVelocity: number;
      targetElevation: number;
      currentTipX: number;
      tipXVelocity: number;
      targetTipX: number;
      currentTipY: number;
      tipYVelocity: number;
      targetTipY: number;
      currentIridescence: number;
      currentEnvIntensity: number;
      shatterOutward: THREE.Vector3;
      shatterTumbleAxis: THREE.Vector3;
      shatterTumbleSpeed: number;
      shatterDelay: number;
    } | null;
    backSliverMesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhysicalMaterial> | null;
    backSliverGroup: THREE.Group | null;
    panelCanvas: HTMLCanvasElement;
    panelTexture: THREE.CanvasTexture;
    navCanvas: HTMLCanvasElement;
    navTexture: THREE.CanvasTexture;
    cursorUniforms: {
      uCursorWorld: { value: THREE.Vector3 };
      uCursorActive: { value: number };
      uScaleS: { value: number };
    };
    raycaster: THREE.Raycaster;
    mouse2D: THREE.Vector2;
    currentRotX: number;
    currentRotY: number;
    targetRotX: number;
    targetRotY: number;
  } | null>(null);


  // Handle Multi-Page Navigation:
  const handleNavigate = useCallback((view: PageView) => {
    if (view === 'home') {
      setShowProfileView(false);
      setTimeout(() => {
        setCurrentPage('home');
        shatterTargetRef.current = 0;
        isShatteringRef.current = true;
      }, 250);
    } else {
      setActiveTab(view);
      if (currentPage === 'home') {
        setCurrentPage(view);
        shatterTargetRef.current = 1;
        isShatteringRef.current = true;
        setTimeout(() => {
          setShowProfileView(true);
        }, 280);
      } else {
        setCurrentPage(view);
        setShowProfileView(true);
      }
    }
  }, [currentPage]);

  // Live Material Tweaker from Studio Tab:
  const handleMaterialTweak = useCallback((roughness: number, iridescence: number) => {
    if (!sceneStateRef.current) return;
    const { shards, navShard } = sceneStateRef.current;
    shards.forEach((s) => {
      s.extrudeMesh.material.roughness = roughness;
      s.extrudeMesh.material.iridescence = iridescence;
    });
    if (navShard) {
      navShard.extrudeMesh.material.roughness = roughness;
      navShard.extrudeMesh.material.iridescence = iridescence;
    }
  }, []);

  // Sync canvas redraw on hover:
  useEffect(() => {
    if (!sceneStateRef.current) return;
    const { panelCanvas, panelTexture, navCanvas, navTexture } = sceneStateRef.current;
    createPanelCanvas(
      {
        width: dimensions.panelWidth,
        height: dimensions.panelHeight,
        scaleS: dimensions.scaleS,
        isOpenStudioHovered,
        isReadPaperHovered,
        isPortrait: dimensions.isPortrait,
      },
      panelCanvas
    );
    panelTexture.needsUpdate = true;

    createNavCanvas(
      {
        width: dimensions.navWidth,
        height: dimensions.navHeight,
        scaleS: dimensions.scaleS,
        hoveredLink: hoveredNavLink,
      },
      navCanvas
    );
    navTexture.needsUpdate = true;
  }, [isOpenStudioHovered, isReadPaperHovered, hoveredNavLink, dimensions]);

  // Main Scene Setup:
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Detect software WebGL guard:
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup:
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Scene & Camera:
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);

    const fov = 30;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
    const cameraDist = (height / 2) / Math.tan((fov * Math.PI / 180) / 2);
    camera.position.set(0, 0, cameraDist);
    camera.lookAt(0, 0, 0);

    // 4. Environment: RoomEnvironment with PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.42;
    pmremGenerator.dispose();

    // 5. Lighting:
    // Soft white-blue key light from top-left:
    const keyLight = new THREE.DirectionalLight(0xe8f2ff, 1.6);
    keyLight.position.set(-width * 0.45, height * 0.65, cameraDist * 0.7);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xffffff, 0x14141e, 0.4);
    scene.add(fillLight);

    // 6. Common Cursor Glow Uniforms for Shaders:
    const cursorUniforms = {
      uCursorWorld: { value: new THREE.Vector3(0, 0, 0) },
      uCursorActive: { value: 0 },
      uScaleS: { value: 1 },
    };

    // Helper to create the Smoked Glass MeshPhysicalMaterial:
    const createSmokedGlassMaterial = (enableGlow: boolean = true) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x17171b,
        roughness: 0.36,
        clearcoat: 0.7,
        clearcoatRoughness: 0.12,
        specularIntensity: 0.7,
        iridescence: 0.55,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [250, 650],
        envMapIntensity: 1.0,
      });

      if (enableGlow) {
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uCursorWorld = cursorUniforms.uCursorWorld;
          shader.uniforms.uCursorActive = cursorUniforms.uCursorActive;
          shader.uniforms.uScaleS = cursorUniforms.uScaleS;

          shader.vertexShader = `
            varying vec3 vWorldPosFacet;
            ${shader.vertexShader}
          `.replace(
            '#include <worldpos_vertex>',
            `
            #include <worldpos_vertex>
            vWorldPosFacet = (modelMatrix * vec4(transformed, 1.0)).xyz;
            `
          );

          shader.fragmentShader = `
            uniform vec3 uCursorWorld;
            uniform float uCursorActive;
            uniform float uScaleS;
            varying vec3 vWorldPosFacet;
            ${shader.fragmentShader}
          `.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            if (uCursorActive > 0.001) {
              float d = distance(vWorldPosFacet, uCursorWorld);
              float rad = 300.0 * max(uScaleS, 0.25);
              float glow = exp(-1.6 * pow(d / rad, 2.0)) * uCursorActive;
              gl_FragColor.rgb += vec3(0.42, 0.37, 0.62) * 0.16 * glow;
            }
            `
          );
        };
      }

      return mat;
    };

    // 7. Calculate Block & Layout:
    const isPortrait = width < 768 || width < height;
    const marginSide = width < 640 ? 16 : width * 0.055;
    const marginTopBottom = height < 640 ? 16 : height * 0.085;
    const blockWidth = width - 2 * marginSide;
    const blockHeight = height - 2 * marginTopBottom;
    const scaleS = blockWidth / 1730;
    cursorUniforms.uScaleS.value = scaleS;

    const navHeight = blockHeight * 0.108;
    const gap = 14 * scaleS;
    const panelHeight = blockHeight - navHeight - gap;

    setDimensions({
      panelWidth: blockWidth,
      panelHeight,
      navWidth: blockWidth,
      navHeight,
      scaleS,
      isPortrait,
    });

    // 8. Canvas Textures:
    const panelCanvas = createPanelCanvas({
      width: blockWidth,
      height: panelHeight,
      scaleS,
      isPortrait,
    });
    const panelTexture = new THREE.CanvasTexture(panelCanvas);
    panelTexture.colorSpace = THREE.SRGBColorSpace;
    panelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const navCanvas = createNavCanvas({
      width: blockWidth,
      height: navHeight,
      scaleS,
    });
    const navTexture = new THREE.CanvasTexture(navCanvas);
    navTexture.colorSpace = THREE.SRGBColorSpace;
    navTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 9. Groups:
    const blockGroup = new THREE.Group();
    scene.add(blockGroup);

    const navGroup = new THREE.Group();
    navGroup.position.set(0, blockHeight / 2 - navHeight / 2, 0);
    blockGroup.add(navGroup);

    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, -blockHeight / 2 + panelHeight / 2, 0);
    blockGroup.add(panelGroup);

    // 10. Nav Slab Mesh:
    const navPoints: Point2D[] = [
      { x: -blockWidth / 2, y: -navHeight / 2 },
      { x: blockWidth / 2, y: -navHeight / 2 },
      { x: blockWidth / 2, y: navHeight / 2 },
      { x: -blockWidth / 2, y: navHeight / 2 },
    ];
    const navGeom = createShardExtrudeGeometry(navPoints, scaleS, 0);
    const navMat = createSmokedGlassMaterial(true);
    const navExtrudeMesh = new THREE.Mesh(navGeom, navMat);
    navExtrudeMesh.name = 'nav_slab';

    // Nav Face Overlay with printed text:
    const navShape = createRoundedShape(navPoints, 20 * scaleS);
    const navFaceGeom = new THREE.ShapeGeometry(navShape, 16);
    // Map UVs for Nav:
    const navPos = navFaceGeom.getAttribute('position');
    const navUv = navFaceGeom.getAttribute('uv');
    for (let i = 0; i < navPos.count; i++) {
      const px = navPos.getX(i);
      const py = navPos.getY(i);
      navUv.setXY(i, (px + blockWidth / 2) / blockWidth, (py + navHeight / 2) / navHeight);
    }
    navUv.needsUpdate = true;

    const navFaceMat = new THREE.MeshBasicMaterial({
      map: navTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const navFaceMesh = new THREE.Mesh(navFaceGeom, navFaceMat);
    navFaceMesh.position.z = 13 * scaleS / 2 + 2.6 * scaleS + 0.1;

    const navShardGroup = new THREE.Group();
    navShardGroup.add(navExtrudeMesh);
    navShardGroup.add(navFaceMesh);
    navGroup.add(navShardGroup);

    const navShardData = {
      group: navShardGroup,
      extrudeMesh: navExtrudeMesh,
      faceMesh: navFaceMesh,
      currentElevation: 0,
      elevationVelocity: 0,
      targetElevation: 0,
      currentTipX: 0,
      tipXVelocity: 0,
      targetTipX: 0,
      currentTipY: 0,
      tipYVelocity: 0,
      targetTipY: 0,
      currentIridescence: 0.55,
      currentEnvIntensity: 1.0,
      shatterOutward: new THREE.Vector3(0, 160 * scaleS, 650 * scaleS),
      shatterTumbleAxis: new THREE.Vector3(1, 0.4, 0.2).normalize(),
      shatterTumbleSpeed: 2.2,
      shatterDelay: 0.0,
    };

    // 11. Define 5 Panel Cut Cells:
    // Coordinates in panel normalized space (x: 0..1 right, y: 0..1 down):
    const baseCutPoints = {
      TL: { x: 0, y: 0 },
      TR: { x: 1, y: 0 },
      BL: { x: 0, y: 1 },
      BR: { x: 1, y: 1 },
      tAB: { x: 0.22, y: 0 },
      tBC: { x: 0.515, y: 0 },
      tCE: { x: 0.84, y: 0 },
      bAD: { x: 0.34, y: 1 },
      bDE: { x: 0.865, y: 1 },
      J0: { x: 0.385, y: 0.72 },
      J1: { x: 0.48, y: 0.62 },
      J2: { x: 0.716, y: 0.49 },
    };

    // Portrait transposition: hero cell sits on top
    const getCellPoints = (pts: typeof baseCutPoints) => {
      if (isPortrait) {
        // Transposed / stacked layout for portrait
        return [
          {
            id: 'cell_A',
            name: 'Hero Cell A',
            points: [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 1, y: 0.46 },
              { x: 0.4, y: 0.46 },
              { x: 0, y: 0.46 },
            ],
            delay: 0.04,
            outward: new THREE.Vector3(-250 * scaleS, 200 * scaleS, 720 * scaleS),
          },
          {
            id: 'cell_B',
            name: 'Cell B',
            points: [
              { x: 0, y: 0.46 },
              { x: 0.5, y: 0.46 },
              { x: 0.5, y: 0.72 },
              { x: 0, y: 0.72 },
            ],
            delay: 0.08,
            outward: new THREE.Vector3(-320 * scaleS, -120 * scaleS, 580 * scaleS),
          },
          {
            id: 'cell_C',
            name: 'Cell C',
            points: [
              { x: 0.5, y: 0.46 },
              { x: 1, y: 0.46 },
              { x: 1, y: 0.72 },
              { x: 0.5, y: 0.72 },
            ],
            delay: 0.11,
            outward: new THREE.Vector3(300 * scaleS, -100 * scaleS, 540 * scaleS),
          },
          {
            id: 'cell_D',
            name: 'Cell D',
            points: [
              { x: 0, y: 0.72 },
              { x: 0.55, y: 0.72 },
              { x: 0.55, y: 1 },
              { x: 0, y: 1 },
            ],
            delay: 0.14,
            outward: new THREE.Vector3(-220 * scaleS, -380 * scaleS, 480 * scaleS),
          },
          {
            id: 'cell_E',
            name: 'Cell E',
            points: [
              { x: 0.55, y: 0.72 },
              { x: 1, y: 0.72 },
              { x: 1, y: 1 },
              { x: 0.55, y: 1 },
            ],
            delay: 0.16,
            outward: new THREE.Vector3(340 * scaleS, -360 * scaleS, 520 * scaleS),
          },
        ];
      }

      // Standard landscape cut pattern:
      return [
        {
          id: 'cell_A',
          name: 'Hero Cell A',
          points: [pts.TL, pts.tAB, pts.J0, pts.bAD, pts.BL],
          delay: 0.03,
          outward: new THREE.Vector3(-450 * scaleS, 180 * scaleS, 750 * scaleS),
        },
        {
          id: 'cell_B',
          name: 'Cell B',
          points: [pts.tAB, pts.tBC, pts.J1, pts.J0],
          delay: 0.06,
          outward: new THREE.Vector3(-120 * scaleS, 320 * scaleS, 620 * scaleS),
        },
        {
          id: 'cell_C',
          name: 'Cell C',
          points: [pts.tBC, pts.tCE, pts.J2, pts.J1],
          delay: 0.09,
          outward: new THREE.Vector3(260 * scaleS, 280 * scaleS, 560 * scaleS),
        },
        {
          id: 'cell_D',
          name: 'Cell D',
          points: [pts.J0, pts.J1, pts.J2, pts.bDE, pts.bAD],
          delay: 0.12,
          outward: new THREE.Vector3(-140 * scaleS, -340 * scaleS, 490 * scaleS),
        },
        {
          id: 'cell_E',
          name: 'Cell E',
          points: [pts.tCE, pts.TR, pts.BR, pts.bDE, pts.J2],
          delay: 0.15,
          outward: new THREE.Vector3(480 * scaleS, -160 * scaleS, 680 * scaleS),
        },
      ];
    };

    // Convert normalized panel points to local panel 3D units:
    const toPanel3D = (p: Point2D) => ({
      x: p.x * blockWidth - blockWidth / 2,
      y: (1 - p.y) * panelHeight - panelHeight / 2, // 3D Y is up
    });

    // 12. Create Shard Meshes:
    const shardDefs = getCellPoints(baseCutPoints);
    const shards: ShardData[] = [];

    const tumbleAxes = [
      new THREE.Vector3(0.6, 0.8, -0.2).normalize(),
      new THREE.Vector3(-0.7, 0.5, 0.5).normalize(),
      new THREE.Vector3(0.4, -0.6, 0.7).normalize(),
      new THREE.Vector3(-0.5, -0.7, -0.5).normalize(),
      new THREE.Vector3(0.8, -0.3, 0.5).normalize(),
    ];
    const tumbleSpeeds = [2.8, 3.4, 2.2, 3.1, 2.5];

    shardDefs.forEach((def, index) => {
      const localPts = def.points.map(toPanel3D);

      // Centroid:
      let cx = 0;
      let cy = 0;
      localPts.forEach((pt) => {
        cx += pt.x;
        cy += pt.y;
      });
      cx /= localPts.length;
      cy /= localPts.length;

      const extrudeGeom = createShardExtrudeGeometry(localPts, scaleS);
      const mat = createSmokedGlassMaterial(true);
      const extrudeMesh = new THREE.Mesh(extrudeGeom, mat);
      extrudeMesh.name = def.id;

      const faceGeom = createShardFaceGeometry(localPts, scaleS, blockWidth, panelHeight);
      const faceMat = new THREE.MeshBasicMaterial({
        map: panelTexture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const faceMesh = new THREE.Mesh(faceGeom, faceMat);
      faceMesh.position.z = 13 * scaleS / 2 + 2.6 * scaleS + 0.1;

      const shardGroup = new THREE.Group();
      shardGroup.add(extrudeMesh);
      shardGroup.add(faceMesh);
      panelGroup.add(shardGroup);

      const ambientConfigs = [
        {
          pos: new THREE.Vector3(-blockWidth * 0.28, panelHeight * 0.16, -50 * scaleS),
          rot: new THREE.Vector3(0.06, -0.12, 0.04),
        },
        {
          pos: new THREE.Vector3(-blockWidth * 0.05, panelHeight * 0.32, -90 * scaleS),
          rot: new THREE.Vector3(-0.08, 0.14, -0.05),
        },
        {
          pos: new THREE.Vector3(blockWidth * 0.28, panelHeight * 0.18, -60 * scaleS),
          rot: new THREE.Vector3(0.10, -0.09, 0.07),
        },
        {
          pos: new THREE.Vector3(-blockWidth * 0.24, -panelHeight * 0.24, -70 * scaleS),
          rot: new THREE.Vector3(-0.06, -0.14, -0.04),
        },
        {
          pos: new THREE.Vector3(blockWidth * 0.26, -panelHeight * 0.22, -80 * scaleS),
          rot: new THREE.Vector3(0.08, 0.11, 0.05),
        },
      ];

      shards.push({
        id: def.id,
        name: def.name,
        meshGroup: shardGroup,
        extrudeMesh,
        faceMesh,
        basePoints: def.points,
        currentPoints: [...def.points],
        center: { x: cx, y: cy },
        currentElevation: 0,
        elevationVelocity: 0,
        targetElevation: 0,
        currentTipX: 0,
        tipXVelocity: 0,
        targetTipX: 0,
        currentTipY: 0,
        tipYVelocity: 0,
        targetTipY: 0,
        currentIridescence: 0.55,
        currentEnvIntensity: 1.0,
        shatterOutward: def.outward,
        shatterTumbleAxis: tumbleAxes[index % tumbleAxes.length],
        shatterTumbleSpeed: tumbleSpeeds[index % tumbleSpeeds.length],
        shatterDelay: def.delay,
        ambientPos: ambientConfigs[index % ambientConfigs.length].pos,
        ambientRot: ambientConfigs[index % ambientConfigs.length].rot,
      });
    });

    // 13. Persistent Ambient Smoked-Glass Shards in 3D Background:
    // Floating at various depths throughout the entire page height with gentle undulating movement
    const ambientGroup = new THREE.Group();
    scene.add(ambientGroup);

    const ambientShards: AmbientShard[] = [];
    const ambientGeomTemplates = [
      [[-55, -40], [60, -50], [75, 35], [-30, 55]],
      [[-70, -25], [35, -65], [85, 12], [25, 70], [-45, 40]],
      [[-60, -45], [45, -35], [65, 45], [-35, 60]],
      [[-40, -60], [70, -30], [50, 65], [-60, 25]],
    ];

    const ambientDefs = [
      { xFrac: -0.38, yFrac: 0.36, z: -140 * scaleS, scale: 1.15, speed: 0.38, amp: 30 },
      { xFrac: 0.40, yFrac: 0.38, z: -170 * scaleS, scale: 1.30, speed: 0.32, amp: 34 },
      { xFrac: -0.44, yFrac: -0.05, z: -120 * scaleS, scale: 1.0, speed: 0.42, amp: 28 },
      { xFrac: 0.45, yFrac: -0.12, z: -150 * scaleS, scale: 1.2, speed: 0.35, amp: 32 },
      { xFrac: -0.36, yFrac: -0.46, z: -160 * scaleS, scale: 1.25, speed: 0.40, amp: 30 },
      { xFrac: 0.39, yFrac: -0.48, z: -130 * scaleS, scale: 1.1, speed: 0.34, amp: 28 },
      { xFrac: -0.18, yFrac: -0.74, z: -190 * scaleS, scale: 1.35, speed: 0.30, amp: 36 },
      { xFrac: 0.24, yFrac: -0.80, z: -180 * scaleS, scale: 1.15, speed: 0.37, amp: 32 },
    ];

    ambientDefs.forEach((def, i) => {
      const pts = ambientGeomTemplates[i % ambientGeomTemplates.length].map((p) => ({
        x: p[0] * scaleS * def.scale,
        y: p[1] * scaleS * def.scale,
      }));
      const geom = createShardExtrudeGeometry(pts, scaleS * def.scale, 0);
      const mat = createSmokedGlassMaterial(true);
      mat.iridescence = 0.65;
      mat.envMapIntensity = 1.35;
      const mesh = new THREE.Mesh(geom, mat);

      const baseX = def.xFrac * width;
      const baseY = def.yFrac * height;
      const baseZ = def.z;
      mesh.position.set(baseX, baseY, baseZ);
      mesh.rotation.set(0.1 + i * 0.4, -0.15 + i * 0.3, i * 0.2);
      ambientGroup.add(mesh);

      ambientShards.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        speedX: 0.32 + (i % 3) * 0.07,
        speedY: 0.26 + (i % 4) * 0.06,
        speedZ: 0.38 + (i % 2) * 0.09,
        rotSpeedX: 0.035 + (i % 3) * 0.015,
        rotSpeedY: 0.045 + (i % 2) * 0.02,
        ampX: def.amp * scaleS,
        ampY: def.amp * 0.85 * scaleS,
        ampZ: def.amp * 1.1 * scaleS,
        phase: i * 1.35,
      });
    });

    // 14. The "← Back" Sliver Mesh in 3D:
    // Outline viewport fractions: (.147,.243) (.252,.169) (.287,.277) (.151,.258)
    // 11*k extrusion, bright bevel, k = W/1918. Leans: rotateY -0.16, rotateX 0.08.
    const kFactor = width / 1918;
    const sliverVpPts = [
      { x: 0.147, y: 0.243 },
      { x: 0.252, y: 0.169 },
      { x: 0.287, y: 0.277 },
      { x: 0.151, y: 0.258 },
    ];
    // In screen-centered 3D space:
    const sliverWorldPts = sliverVpPts.map((p) => ({
      x: (p.x - 0.5) * width,
      y: (0.5 - p.y) * height,
    }));
    // Centroid:
    let sliverCx = 0;
    let sliverCy = 0;
    sliverWorldPts.forEach((p) => {
      sliverCx += p.x;
      sliverCy += p.y;
    });
    sliverCx /= sliverWorldPts.length;
    sliverCy /= sliverWorldPts.length;

    // Relative to centroid:
    const sliverLocalPts = sliverWorldPts.map((p) => ({
      x: p.x - sliverCx,
      y: p.y - sliverCy,
    }));

    const sliverShape = createRoundedShape(sliverLocalPts, 16 * kFactor);
    const sliverGeom = new THREE.ExtrudeGeometry(sliverShape, {
      depth: 11 * kFactor,
      bevelEnabled: true,
      bevelThickness: 2.2 * kFactor,
      bevelSize: 2.2 * kFactor,
      bevelSegments: 3,
      curveSegments: 16,
    });
    sliverGeom.translate(0, 0, -(11 * kFactor) / 2);
    sliverGeom.computeVertexNormals();

    const sliverMat = new THREE.MeshPhysicalMaterial({
      color: 0x17171b,
      roughness: 0.36,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      specularIntensity: 0.7,
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [250, 650],
      envMapIntensity: 1.4,
    });

    const backSliverMesh = new THREE.Mesh(sliverGeom, sliverMat);
    const backSliverGroup = new THREE.Group();
    backSliverGroup.position.set(sliverCx, sliverCy, 40);
    backSliverGroup.rotation.set(0.08, -0.16, 0);
    backSliverGroup.scale.set(0, 0, 0); // Initially hidden, grows in on shatter
    backSliverGroup.add(backSliverMesh);
    scene.add(backSliverGroup);

    // Save refs:
    sceneStateRef.current = {
      renderer,
      scene,
      camera,
      blockGroup,
      panelGroup,
      navGroup,
      ambientGroup,
      ambientShards,
      shards,
      navShard: navShardData,
      backSliverMesh,
      backSliverGroup,
      panelCanvas,
      panelTexture,
      navCanvas,
      navTexture,
      cursorUniforms,
      raycaster: new THREE.Raycaster(),
      mouse2D: new THREE.Vector2(-999, -999),
      currentRotX: 0.8 * Math.PI / 180,
      currentRotY: -1.2 * Math.PI / 180,
      targetRotX: 0.8 * Math.PI / 180,
      targetRotY: -1.2 * Math.PI / 180,
    };


    // 14. Pointer Interaction Listeners:
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalized coordinates [-1, 1]:
      const nx = (clientX / width) * 2 - 1;
      const ny = -(clientY / height) * 2 + 1;

      pointerNormRef.current = { x: nx, y: ny, active: true };
      if (!sceneStateRef.current) return;
      sceneStateRef.current.mouse2D.set(nx, ny);

      // Unproject pointer into z = 0 world plane for cursor glow:
      const worldPos = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = worldPos.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      pointerWorldRef.current.copy(camera.position).add(dir.multiplyScalar(dist));
      sceneStateRef.current.cursorUniforms.uCursorWorld.value.copy(pointerWorldRef.current);

      // Target Global Tilt:
      // rotateY = x * 7° - 1.2°, rotateX = -y * 5.5° + 0.8°
      sceneStateRef.current.targetRotY = (nx * 7.0 - 1.2) * (Math.PI / 180);
      sceneStateRef.current.targetRotX = (-ny * 5.5 + 0.8) * (Math.PI / 180);

      // Check if pointer is on main panel for cursor push:
      const panelLeft = marginSide;
      const panelTop = marginTopBottom + navHeight + gap;
      if (
        clientX >= panelLeft &&
        clientX <= panelLeft + blockWidth &&
        clientY >= panelTop &&
        clientY <= panelTop + panelHeight
      ) {
        pointerPanelRef.current = {
          x: (clientX - panelLeft) / blockWidth,
          y: (clientY - panelTop) / panelHeight,
        };
      } else {
        pointerPanelRef.current = null;
      }
    };

    const handlePointerLeave = () => {
      pointerNormRef.current.active = false;
      pointerPanelRef.current = null;
      if (sceneStateRef.current) {
        sceneStateRef.current.mouse2D.set(-999, -999);
        // Ease back when pointer leaves:
        sceneStateRef.current.targetRotY = -1.2 * (Math.PI / 180);
        sceneStateRef.current.targetRotX = 0.8 * (Math.PI / 180);
      }
    };

    // Mobile touch interaction:
    const handleTouch = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;

      const nx = (clientX / width) * 2 - 1;
      const ny = -(clientY / height) * 2 + 1;

      pointerNormRef.current = { x: nx, y: ny, active: true };
      if (!sceneStateRef.current) return;
      sceneStateRef.current.mouse2D.set(nx, ny);

      const worldPos = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = worldPos.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      pointerWorldRef.current.copy(camera.position).add(dir.multiplyScalar(dist));
      sceneStateRef.current.cursorUniforms.uCursorWorld.value.copy(pointerWorldRef.current);

      sceneStateRef.current.targetRotY = (nx * 6.0 - 1.2) * (Math.PI / 180);
      sceneStateRef.current.targetRotX = (-ny * 4.5 + 0.8) * (Math.PI / 180);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });

    // 15. Window Resize Handler:
    const handleResize = () => {
      if (!container || !sceneStateRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      width = newW;
      height = newH;

      camera.aspect = newW / newH;
      const newDist = (newH / 2) / Math.tan((fov * Math.PI / 180) / 2);
      camera.position.set(0, 0, newDist);
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);

      const newIsPortrait = newW < 768 || newW < newH;
      const newMarginSide = newW < 640 ? 16 : newW * 0.055;
      const newMarginTB = newH < 640 ? 16 : newH * 0.085;
      const newBlockW = newW - 2 * newMarginSide;
      const newBlockH = newH - 2 * newMarginTB;
      const newScaleS = newBlockW / 1730;

      sceneStateRef.current.cursorUniforms.uScaleS.value = newScaleS;

      setDimensions({
        panelWidth: newBlockW,
        panelHeight: newBlockH - newBlockH * 0.108 - 14 * newScaleS,
        navWidth: newBlockW,
        navHeight: newBlockH * 0.108,
        scaleS: newScaleS,
        isPortrait: newIsPortrait,
      });
    };

    window.addEventListener('resize', handleResize);

    // 16. Animation Loop:
    let animationFrameId = 0;
    let lastTime = performance.now();
    let driftTime = 0;
    let rebuildCounter = 0;

    // Load animation: start slightly shattered and fly in on load!
    shatterProgressRef.current = 1.0;
    shatterTargetRef.current = 0.0;
    isShatteringRef.current = true;

    // Corner points projected for homography:
    const cornerLocal = [
      new THREE.Vector3(-blockWidth / 2, panelHeight / 2, 0), // TL
      new THREE.Vector3(blockWidth / 2, panelHeight / 2, 0),  // TR
      new THREE.Vector3(blockWidth / 2, -panelHeight / 2, 0), // BR
      new THREE.Vector3(-blockWidth / 2, -panelHeight / 2, 0), // BL
    ];
    const navCornerLocal = [
      new THREE.Vector3(-blockWidth / 2, navHeight / 2, 0),
      new THREE.Vector3(blockWidth / 2, navHeight / 2, 0),
      new THREE.Vector3(blockWidth / 2, -navHeight / 2, 0),
      new THREE.Vector3(-blockWidth / 2, -navHeight / 2, 0),
    ];

    const projectCorner = (pt: THREE.Vector3, parentObj: THREE.Object3D) => {
      const v = pt.clone();
      parentObj.localToWorld(v);
      v.project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * width,
        y: (-v.y * 0.5 + 0.5) * height,
      };
    };

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      driftTime += dt;

      if (!sceneStateRef.current) return;
      const state = sceneStateRef.current;

      // A. Smooth Global Tilt (0.3s exponential damping):
      state.currentRotX = THREE.MathUtils.damp(state.currentRotX, state.targetRotX, 3.33, dt);
      state.currentRotY = THREE.MathUtils.damp(state.currentRotY, state.targetRotY, 3.33, dt);
      state.blockGroup.rotation.x = state.currentRotX;
      state.blockGroup.rotation.y = state.currentRotY;

      // B. Cursor Glow active uniform smooth transition:
      const targetCursorActive = pointerNormRef.current.active ? 1.0 : 0.0;
      state.cursorUniforms.uCursorActive.value = THREE.MathUtils.damp(
        state.cursorUniforms.uCursorActive.value,
        targetCursorActive,
        6.0,
        dt
      );

      // C. Shatter Progression (0.72s duration):
      if (isShatteringRef.current) {
        const shatterSpeed = 1 / 0.72;
        if (shatterTargetRef.current > shatterProgressRef.current) {
          shatterProgressRef.current = Math.min(1, shatterProgressRef.current + dt * shatterSpeed);
          if (shatterProgressRef.current >= 1) isShatteringRef.current = false;
        } else {
          shatterProgressRef.current = Math.max(0, shatterProgressRef.current - dt * shatterSpeed);
          if (shatterProgressRef.current <= 0) isShatteringRef.current = false;
        }
      }

      const globalShatter = shatterProgressRef.current;
      const easeInCubic = (t: number) => t * t * t;


      // Update Persistent Ambient Background Shards (Gentle 3D Floating Motion):
      if (state.ambientShards) {

        state.ambientShards.forEach((s) => {
          s.mesh.position.x = s.baseX + Math.sin(driftTime * s.speedX + s.phase) * s.ampX;
          s.mesh.position.y = s.baseY + Math.cos(driftTime * s.speedY + s.phase) * s.ampY;
          s.mesh.position.z = s.baseZ + Math.sin(driftTime * s.speedZ + s.phase) * s.ampZ;
          s.mesh.rotation.x += s.rotSpeedX * dt;
          s.mesh.rotation.y += s.rotSpeedY * dt;
        });
      }

      // Smooth vertical scroll parallax:
      const scrollParallax = -scrollYRef.current * 0.14 * scaleS;
      state.blockGroup.position.y = THREE.MathUtils.damp(state.blockGroup.position.y, scrollParallax, 5.0, dt);
      if (state.ambientGroup) {
        state.ambientGroup.position.y = THREE.MathUtils.damp(state.ambientGroup.position.y, scrollParallax * 1.35, 5.0, dt);
      }

      // Ease curves:
      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const easeOutBack = (t: number) => {
        const c1 = 1.4;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };

      // D. Raycasting for hover picking:
      let hoveredPieceId: string | null = null;
      let hitPointLocal: THREE.Vector3 | null = null;

      if (globalShatter < 0.05 && pointerNormRef.current.active) {
        state.raycaster.setFromCamera(state.mouse2D, camera);
        const intersectableMeshes: THREE.Object3D[] = [];
        state.shards.forEach((s) => intersectableMeshes.push(s.extrudeMesh));
        if (state.navShard) intersectableMeshes.push(state.navShard.extrudeMesh);

        const intersects = state.raycaster.intersectObjects(intersectableMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0];
          hoveredPieceId = hit.object.name;
          hitPointLocal = hit.point.clone();
        }
      }

      // E. Update Nav Slab (Springs or Floating Ambient Background):
      if (state.navShard) {
        const nav = state.navShard;
        const isNavHovered = hoveredPieceId === 'nav_slab';

        // Shatter factor with delay:
        const navDelay = nav.shatterDelay;
        const navLocalProgress = Math.max(0, Math.min(1, (globalShatter - navDelay) / (1 - navDelay)));

        if (globalShatter > 0.001) {
          // Floating background ambient motion:
          const factor = shatterTargetRef.current === 1
            ? easeInOutCubic(navLocalProgress)
            : 1 - easeOutBack(1 - navLocalProgress);

          const navFloatX = Math.sin(driftTime * 0.42) * (20 * scaleS);
          const navFloatY = Math.cos(driftTime * 0.35) * (18 * scaleS);

          nav.group.position.x = THREE.MathUtils.lerp(0, navFloatX, factor);
          nav.group.position.y = THREE.MathUtils.lerp(0, blockHeight * 0.38 + navFloatY, factor);
          nav.group.position.z = THREE.MathUtils.lerp(0, -95 * scaleS, factor);

          const navRotX = Math.sin(driftTime * 0.3) * 0.05;
          const navRotY = Math.cos(driftTime * 0.25) * 0.06;
          nav.group.rotation.set(navRotX * factor, navRotY * factor, 0);

          nav.faceMesh.material.opacity = THREE.MathUtils.damp(
            nav.faceMesh.material.opacity,
            showProfileView ? 0.0 : 1.0,
            4.0,
            dt
          );
        } else {
          nav.faceMesh.material.opacity = THREE.MathUtils.damp(nav.faceMesh.material.opacity, 1.0, 6.0, dt);

          // Spring physics: k = 170, c = 19
          nav.targetElevation = isNavHovered ? 32 * scaleS : 0;
          const kSpring = 170;
          const cSpring = 19;

          const dElevation = -kSpring * (nav.currentElevation - nav.targetElevation) - cSpring * nav.elevationVelocity;
          nav.elevationVelocity += dElevation * dt;
          nav.currentElevation += nav.elevationVelocity * dt;

          nav.group.position.set(0, 0, nav.currentElevation);

          // Tipping:
          nav.targetTipX = 0;
          nav.targetTipY = 0;
          if (isNavHovered && hitPointLocal) {
            nav.group.worldToLocal(hitPointLocal);
            nav.targetTipY = Math.max(-0.16, Math.min(0.16, (hitPointLocal.x / (blockWidth / 2)) * 0.16));
            nav.targetTipX = Math.max(-0.16, Math.min(0.16, (-hitPointLocal.y / (navHeight / 2)) * 0.16));
          }

          const dTipX = -kSpring * (nav.currentTipX - nav.targetTipX) - cSpring * nav.tipXVelocity;
          nav.tipXVelocity += dTipX * dt;
          nav.currentTipX += nav.tipXVelocity * dt;

          const dTipY = -kSpring * (nav.currentTipY - nav.targetTipY) - cSpring * nav.tipYVelocity;
          nav.tipYVelocity += dTipY * dt;
          nav.currentTipY += nav.tipYVelocity * dt;

          nav.group.rotation.set(nav.currentTipX, nav.currentTipY, 0);

          // Material sheen:
          nav.currentIridescence = THREE.MathUtils.damp(
            nav.currentIridescence,
            isNavHovered ? 1.0 : 0.55,
            6.0,
            dt
          );
          nav.currentEnvIntensity = THREE.MathUtils.damp(
            nav.currentEnvIntensity,
            isNavHovered ? 1.9 : 1.0,
            6.0,
            dt
          );
          nav.extrudeMesh.material.iridescence = nav.currentIridescence;
          nav.extrudeMesh.material.envMapIntensity = nav.currentEnvIntensity;
        }
      }

      // F. Update 5 Shards (Springs or Floating Ambient Background):
      state.shards.forEach((shard, shardIndex) => {
        const isHovered = hoveredPieceId === shard.id;
        const delay = shard.shatterDelay;
        const localProgress = Math.max(0, Math.min(1, (globalShatter - delay) / (1 - delay)));

        if (globalShatter > 0.001) {
          // Transition into floating ambient formation with continuous gentle movement:
          const factor = shatterTargetRef.current === 1
            ? easeInOutCubic(localProgress)
            : 1 - easeOutBack(1 - localProgress);

          // Continuous gentle floating movement in 3D (حركة خفيفة ورا كدا):
          const floatX = Math.sin(driftTime * 0.45 + shardIndex * 1.3) * (26 * scaleS);
          const floatY = Math.cos(driftTime * 0.38 + shardIndex * 1.1) * (22 * scaleS);
          const floatZ = Math.sin(driftTime * 0.52 + shardIndex * 1.7) * (30 * scaleS);

          const targetX = shard.ambientPos.x + floatX;
          const targetY = shard.ambientPos.y + floatY;
          const targetZ = shard.ambientPos.z + floatZ;

          shard.meshGroup.position.x = THREE.MathUtils.lerp(0, targetX, factor);
          shard.meshGroup.position.y = THREE.MathUtils.lerp(0, targetY, factor);
          shard.meshGroup.position.z = THREE.MathUtils.lerp(0, targetZ, factor);

          // Gentle 3D tumbling & breathing:
          const rotX = Math.sin(driftTime * 0.32 + shardIndex * 0.9) * 0.08;
          const rotY = Math.cos(driftTime * 0.27 + shardIndex * 1.2) * 0.10;
          const rotZ = Math.sin(driftTime * 0.22 + shardIndex * 1.4) * 0.06;

          shard.meshGroup.rotation.x = THREE.MathUtils.lerp(0, shard.ambientRot.x + rotX, factor);
          shard.meshGroup.rotation.y = THREE.MathUtils.lerp(0, shard.ambientRot.y + rotY, factor);
          shard.meshGroup.rotation.z = THREE.MathUtils.lerp(0, shard.ambientRot.z + rotZ, factor);

          // Fade printed text face so shards become pure smoked glass crystals:
          shard.faceMesh.material.opacity = THREE.MathUtils.damp(
            shard.faceMesh.material.opacity,
            showProfileView ? 0.0 : 1.0,
            4.0,
            dt
          );

          // Shimmer and iridescence active in background:
          shard.extrudeMesh.material.iridescence = 0.75;
          shard.extrudeMesh.material.envMapIntensity = 1.35;
        } else {
          shard.faceMesh.material.opacity = THREE.MathUtils.damp(shard.faceMesh.material.opacity, 1.0, 6.0, dt);

          // Spring physics: k = 170, c = 19
          shard.targetElevation = isHovered ? 50 * scaleS : 0;
          const kSpring = 170;
          const cSpring = 19;

          const dElevation = -kSpring * (shard.currentElevation - shard.targetElevation) - cSpring * shard.elevationVelocity;
          shard.elevationVelocity += dElevation * dt;
          shard.currentElevation += shard.elevationVelocity * dt;

          shard.meshGroup.position.set(0, 0, shard.currentElevation);

          // Tipping: edge nearest pointer dipping away (up to ±0.24 rad):
          shard.targetTipX = 0;
          shard.targetTipY = 0;
          if (isHovered && hitPointLocal) {
            const hitLocal = hitPointLocal.clone();
            shard.meshGroup.worldToLocal(hitLocal);
            const dx = (hitLocal.x - shard.center.x) / (blockWidth * 0.25);
            const dy = (hitLocal.y - shard.center.y) / (panelHeight * 0.25);
            shard.targetTipY = Math.max(-0.24, Math.min(0.24, dx * 0.24));
            shard.targetTipX = Math.max(-0.24, Math.min(0.24, -dy * 0.24));
          }

          const dTipX = -kSpring * (shard.currentTipX - shard.targetTipX) - cSpring * shard.tipXVelocity;
          shard.tipXVelocity += dTipX * dt;
          shard.currentTipX += shard.tipXVelocity * dt;

          const dTipY = -kSpring * (shard.currentTipY - shard.targetTipY) - cSpring * shard.tipYVelocity;
          shard.tipYVelocity += dTipY * dt;
          shard.currentTipY += shard.tipYVelocity * dt;

          shard.meshGroup.rotation.set(shard.currentTipX, shard.currentTipY, 0);

          // Material sheen:
          shard.currentIridescence = THREE.MathUtils.damp(
            shard.currentIridescence,
            isHovered ? 1.0 : 0.55,
            6.0,
            dt
          );
          shard.currentEnvIntensity = THREE.MathUtils.damp(
            shard.currentEnvIntensity,
            isHovered ? 1.9 : 1.0,
            6.0,
            dt
          );
          shard.extrudeMesh.material.iridescence = shard.currentIridescence;
          shard.extrudeMesh.material.envMapIntensity = shard.currentEnvIntensity;
        }
      });


      // G. Shard geometries are fixed and rock-solid to keep text permanently affixed to the glass face
      // (No dynamic drift or seam shifting across the typography)

      // H. Update "← Back" Sliver Mesh (wobble and hover):
      if (state.backSliverGroup) {
        const sliver = state.backSliverGroup;
        const targetScale = globalShatter > 0.35 ? 1.0 : 0.0;
        const curScale = sliver.scale.x;
        const nextScale = THREE.MathUtils.damp(curScale, targetScale, 5.0, dt);
        sliver.scale.set(nextScale, nextScale, nextScale);

        if (nextScale > 0.01) {
          // Idle wobble (±0.03–0.04 rad at ~1 Hz):
          const wobbleX = Math.sin(driftTime * 6.28 * 0.95) * 0.035;
          const wobbleY = Math.cos(driftTime * 6.28 * 0.85) * 0.038;

          // Tip toward pointer up to 0.14 rad on hover:
          const hoverTip = isBackHovered ? 0.14 : 0.0;

          sliver.rotation.x = 0.08 + wobbleX + (hoverTip * (pointerNormRef.current.y || 0));
          sliver.rotation.y = -0.16 + wobbleY + (hoverTip * (pointerNormRef.current.x || 0));
        }
      }

      // I. Project 3D Corners to calculate Homography for DOM Layer:
      if (globalShatter < 0.2) {
        const pTL = projectCorner(cornerLocal[0], state.panelGroup);
        const pTR = projectCorner(cornerLocal[1], state.panelGroup);
        const pBR = projectCorner(cornerLocal[2], state.panelGroup);
        const pBL = projectCorner(cornerLocal[3], state.panelGroup);

        const srcRect: [Point2D, Point2D, Point2D, Point2D] = [
          { x: 0, y: 0 },
          { x: blockWidth, y: 0 },
          { x: blockWidth, y: panelHeight },
          { x: 0, y: panelHeight },
        ];
        const dstProjected: [Point2D, Point2D, Point2D, Point2D] = [pTL, pTR, pBR, pBL];
        const panelMat3d = getHomographyMatrix3D(srcRect, dstProjected);
        setPanelMatrix3d(panelMat3d);

        // Nav Slab homography:
        const nTL = projectCorner(navCornerLocal[0], state.navGroup);
        const nTR = projectCorner(navCornerLocal[1], state.navGroup);
        const nBR = projectCorner(navCornerLocal[2], state.navGroup);
        const nBL = projectCorner(navCornerLocal[3], state.navGroup);

        const navSrcRect: [Point2D, Point2D, Point2D, Point2D] = [
          { x: 0, y: 0 },
          { x: blockWidth, y: 0 },
          { x: blockWidth, y: navHeight },
          { x: 0, y: navHeight },
        ];
        const navDstProjected: [Point2D, Point2D, Point2D, Point2D] = [nTL, nTR, nBR, nBL];
        const navMat3d = getHomographyMatrix3D(navSrcRect, navDstProjected);
        setNavMatrix3d(navMat3d);
      }

      // J. Render frame:
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 17. Cleanup on Unmount:
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('resize', handleResize);

      if (sceneStateRef.current) {
        const { renderer, scene } = sceneStateRef.current;
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          }
        });
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050507]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-default" />

      {/* Interactive DOM Homography Layer (when assembled) */}
      <DomTextOverlay
        panelTransform={panelMatrix3d}
        navTransform={navMatrix3d}
        panelWidth={dimensions.panelWidth}
        panelHeight={dimensions.panelHeight}
        navWidth={dimensions.navWidth}
        navHeight={dimensions.navHeight}
        scaleS={dimensions.scaleS}
        visible={currentPage === 'home' && !showProfileView}
        isOpenStudioHovered={isOpenStudioHovered}
        setIsOpenStudioHovered={setIsOpenStudioHovered}
        isReadPaperHovered={isReadPaperHovered}
        setIsReadPaperHovered={setIsReadPaperHovered}
        hoveredNavLink={hoveredNavLink}
        setHoveredNavLink={setHoveredNavLink}
        onNavigate={handleNavigate}
        isPortrait={dimensions.isPortrait}
      />

      {/* Second Page: Full Professional Portfolio for Yousef Waleed */}
      <YousefPortfolioView
        visible={showProfileView}
        onBackToGlassHero={() => handleNavigate('home')}
        isBackHovered={isBackHovered}
        onBackHoverChange={setIsBackHovered}
        onScrollOffsetChange={(offset) => {
          scrollYRef.current = offset;
        }}
      />
    </div>
  );
};

