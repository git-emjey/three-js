import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'
import earth from './earth.jpg'
import ice from './ice.jpg'

const parameters = {
    color: 0xff0000,
    texturePath: earth,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI *2 })
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// GUI
const gui = new dat.GUI()

// Texture loader
const texture_loader = new THREE.TextureLoader()
const texture = texture_loader.load(parameters.texturePath)
const text_texture = texture_loader.load(ice)
const text_material = new THREE.MeshBasicMaterial({ map: text_texture })

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 34, 34)
const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    color: 'white', 
    wireframe: false
})
const mesh = new THREE.Mesh(geometry, material)
gui.add(mesh.position, 'x', -3, 3, 0.01)
gui.add(mesh.position, 'y', -3, 3, 0.01)
gui.add(mesh.position, 'z', -3, 3, 0.01)
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })
gui.add(parameters, 'spin')
scene.add(mesh)

// Text
let text_mesh
const font_loader = new FontLoader()
font_loader.load('./helvetiker_regular.typeface.json', (font) => {
    const text_geometry = new TextGeometry('Hello, World!', {
        font: font,
        size: 0.25,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: false
    })
    text_mesh = new THREE.Mesh(text_geometry, text_material)
    text_geometry.center()

    text_mesh.position.set(0, 0, 1)
    text_mesh.rotation.set(0, 0, 0)
    text_mesh.lookAt(new THREE.Vector3(0, 0, 3))
    scene.add(text_mesh)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Rotate the sphere
    mesh.rotation.y = elapsedTime * 0.5

    if (text_mesh) {
        text_mesh.position.set(0, 0, 1.5)
        text_mesh.rotation.set(0, 0, 0)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Fullscreen
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } 
        else if(canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if(document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})
