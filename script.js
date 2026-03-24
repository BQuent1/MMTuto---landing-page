import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add initial styles for animation
const animateElements = document.querySelectorAll('.detail-card, .benefit-card, .section-header, .product-image-container');

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// Three.js 3D Model Render
const container = document.getElementById('hero-3d-model');
if (container) {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // Set size based on container
    const updateSize = () => {
        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);

    updateSize(); // initial sizing
    window.addEventListener('resize', updateSize);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.6); // Purple glow
    dirLight2.position.set(-5, 0, -5);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x06b6d4, 0.6); // Cyan glow
    dirLight3.position.set(0, -5, 5);
    scene.add(dirLight3);

    // Load OBJ
    const loader = new OBJLoader();
    loader.load(
        'images/3D/Rmk3.obj',
        (object) => {
            // Center and scale object to fit nicely
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 6 / maxDim; // Fit within 5 units

            object.scale.setScalar(scale);
            object.position.sub(center.multiplyScalar(scale)); // Center it

            // Apply premium shiny material
            const material = new THREE.MeshStandardMaterial({
                color: 0xe2e8f0,
                roughness: 0.2,
                metalness: 0.7
            });

            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });

            scene.add(object);
        },
        undefined,
        (error) => {
            console.error('Error loading the OBJ model:', error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required for damping & autoRotate
        renderer.render(scene, camera);
    }

    animate();
}
