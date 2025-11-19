'use client'

import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const DEFAULT_MODEL = '/animation/691dbc778e7eb12743aabf09 (1).glb'

/**
 * Avatar3D – composant chargé d'afficher un avatar Ready Player Me.
 * Toute la logique Three.js est encapsulée ici pour préserver la lisibilité des pages.
 */
export default function Avatar3D({
  modelPath = DEFAULT_MODEL,
  autoRotate = false,
  className = '',
  backgroundColor = 'transparent',
}) {
  const mountRef = useRef(null)
  const controlsRef = useRef(null)
  const animationFrameRef = useRef(null)
  const rendererRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    if (!container) {
      console.warn('[Avatar3D] Conteneur introuvable.')
      return
    }

    let currentModel = null
    // Scène principale (fond transparent par défaut pour se fondre dans le hero)
    const scene = new THREE.Scene()
    scene.background = backgroundColor === 'transparent' ? null : new THREE.Color(backgroundColor)

    const sizes = {
      width: container.clientWidth || 400,
      height: container.clientHeight || container.clientWidth || 400,
    }

    // Initialisation du renderer WebGL + antialias pour des contours lisses
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: backgroundColor === 'transparent',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setSize(sizes.width, sizes.height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Caméra posée à hauteur de buste pour cadrer le personnage
    const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.2, 100)
    camera.position.set(0, 1.3, 2.5)



    // Lumière douce venant du ciel + rebond du sol
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x6b7a8f, 1.05)
    hemiLight.position.set(0, 2.5, 0)
    scene.add(hemiLight)

    // Projecteur principal pour dessiner les volumes du visage
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15)
    dirLight.position.set(2.5, 2.5, 2.5)
    dirLight.castShadow = false
    scene.add(dirLight)

    // Contrôles orbitaux : rotation libre, zoom bloqué pour garder le cadrage
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = false
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.2
    controls.target.set(0, 1.35, 0)
    controlsRef.current = controls

    // Chargement du modèle Ready Player Me (GLTF/GLB)
    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        currentModel = gltf.scene
        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        currentModel.position.set(0, -1.05, 0)
        currentModel.scale.set(1.9, 1.9, 1.9)
        scene.add(currentModel)
        setHasError(false)
        setIsLoading(false)
      },
      undefined,
      (error) => {
        console.warn('[Avatar3D] Échec du chargement du modèle Ready Player Me.', error)
        setHasError(true)
        setIsLoading(false)
      }
    )

    // Boucle d'animation (60 fps) : met à jour les contrôles et dessine la scène
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    // Ajustement auto quand la fenêtre change de taille
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight || container.clientWidth || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      // Nettoyage complet pour éviter les fuites mémoire
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      container.removeChild(renderer.domElement)
      renderer.dispose()
      if (currentModel) {
        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose())
            } else {
              child.material?.dispose()
            }
          }
        })
      }
      scene.clear()
    }
  }, [modelPath, autoRotate, backgroundColor])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mountRef} className="w-full h-full rounded-[2.5rem] overflow-hidden" />

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2.5rem] bg-white/80 text-gray-700 font-inter">
          <span className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-sm">Chargement de votre avatar...</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[2.5rem] bg-white/80 text-center px-6">
          <p className="text-base font-semibold text-rose-600">
            Avatar indisponible pour le moment.
          </p>
          <p className="text-sm text-gray-600">
            Vérifiez le chemin du modèle GLB ou réessayez plus tard.
          </p>
        </div>
      )}
    </div>
  )
}

Avatar3D.propTypes = {
  modelPath: PropTypes.string,
  autoRotate: PropTypes.bool,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
}

