'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';

const DEFAULT_MODEL = '/animation/691dbc778e7eb12743aabf09.glb'

/**
 * Avatar3D – composant chargé d'afficher un avatar Ready Player Me.
 * Toute la logique Three.js est encapsulée ici pour préserver la lisibilité des pages.
 */
const Avatar3D = forwardRef(({
  modelPath = DEFAULT_MODEL,
  autoRotate = false,
  className = '',
  backgroundColor = 'transparent',
  onPushComplete,
  cameraPosition = [-1.1, 1, 2.3],
  cameraLookAt = [0, 1, 0],
  cameraFOV = 35,
  modelPosition = [0, -2, 0],
  modelScale = 1.9,
  enableWaving = false,
  enablePush = false,
  enableHoverAnimation = false,
}, ref) => {
  const mountRef = useRef(null)
  const controlsRef = useRef(null)
  const animationFrameRef = useRef(null)
  const rendererRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const modelRef = useRef(null)
  const mixerRef = useRef(null)
  const pushAnimationRef = useRef(null)
  const wavingAnimationRef = useRef(null)
  const wavingActionRef = useRef(null)
  const idleActionRef = useRef(null)
  const isWavingRef = useRef(false)
  const waveTimeoutRef = useRef(null)
  const waveStartTimeoutRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const isHoveringRef = useRef(false)
  const hoverAnimationRef = useRef(null)

  useImperativeHandle(ref, () => ({
    playPushAnimation() {
      if (pushAnimationRef.current && mixerRef.current) {
        const action = mixerRef.current.clipAction(pushAnimationRef.current)
        action.reset().play()
        action.setLoop(THREE.LoopOnce)
        action.clampWhenFinished = true
        
        // Call onPushComplete when animation finishes
        const duration = pushAnimationRef.current.duration * 1000 // convert to ms
        setTimeout(() => {
          if (onPushComplete) onPushComplete()
        }, duration)
      }
    },
    playWavingAnimation() {
      if (wavingAnimationRef.current && mixerRef.current) {
        if (wavingActionRef.current) {
          wavingActionRef.current.reset().play()
          wavingActionRef.current.setLoop(THREE.LoopOnce)
          wavingActionRef.current.clampWhenFinished = true
          
          // Fade back to idle when waving finishes
          const duration = wavingAnimationRef.current.duration * 1000
          setTimeout(() => {
            if (idleActionRef.current && wavingActionRef.current) {
              wavingActionRef.current.fadeOut(0.3)
              idleActionRef.current.reset().fadeIn(0.3).play()
            }
          }, duration)
        }
      }
    }
  }), [onPushComplete])

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
    
    // Performance optimization: reduce pixel ratio on lower-end devices
    const pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Initialisation du renderer WebGL + antialias pour des contours lisses
    const renderer = new THREE.WebGLRenderer({
      antialias: pixelRatio <= 1.5, // Only enable antialiasing on lower DPI screens
      alpha: backgroundColor === 'transparent',
      powerPreference: 'high-performance',
      stencil: false,
    })
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(sizes.width, sizes.height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Camera configuration - customizable per page
    const camera = new THREE.PerspectiveCamera(cameraFOV, sizes.width / sizes.height, 0.2, 100);
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]);
    camera.updateProjectionMatrix();


    // Lumière douce venant du ciel + rebond du sol
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x6b7a8f, 1.05)
    hemiLight.position.set(0, 2.5, 0)
    scene.add(hemiLight)

    // Projecteur principal pour dessiner les volumes du visage
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15)
    dirLight.position.set(2.5, 2.5, 2.5)
    dirLight.castShadow = false
    scene.add(dirLight)

    // No controls: the camera is static and uninteractive

    // Chargement du modèle Ready Player Me (GLTF/GLB)
    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        currentModel = gltf.scene
        modelRef.current = currentModel
        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        currentModel.position.set(modelPosition[0], modelPosition[1], modelPosition[2]);
        currentModel.scale.set(modelScale, modelScale, modelScale);
        scene.add(currentModel);
        
        // Load animations only if needed
        const fbxLoader = new FBXLoader()
        const mixer = new THREE.AnimationMixer(currentModel)
        mixerRef.current = mixer
        
        // Load Push animation only if enabled
        if (enablePush) {
          fbxLoader.load(
            '/animation/Push.fbx',
            (fbx) => {
              // Find the push animation in the FBX
              if (fbx.animations && fbx.animations.length > 0) {
                pushAnimationRef.current = fbx.animations[0]
              } else {
                console.warn('[Avatar3D] No animations found in Push.fbx')
              }
            },
            undefined,
            (error) => {
              console.warn('[Avatar3D] Failed to load Push animation:', error)
            }
          )
        }
        
        // Load Idle and Waving animations only if waving is enabled
        if (enableWaving) {
          // Load Idle animation first
          fbxLoader.load(
            '/animation/Standing WBriefcase Idle.fbx',
            (fbx) => {
              if (fbx.animations && fbx.animations.length > 0) {
                const idleClip = fbx.animations[0]
                idleActionRef.current = mixer.clipAction(idleClip)
                idleActionRef.current.setLoop(THREE.LoopRepeat)
                idleActionRef.current.play()
              } else {
                console.warn('[Avatar3D] No animations found in Standing WBriefcase Idle.fbx')
              }
            },
            undefined,
            (error) => {
              console.warn('[Avatar3D] Failed to load Idle animation:', error)
            }
          )
          
          // Load Waving animation
          fbxLoader.load(
            '/animation/Waving.fbx',
            (fbx) => {
              if (fbx.animations && fbx.animations.length > 0) {
                wavingAnimationRef.current = fbx.animations[0]
                wavingActionRef.current = mixer.clipAction(wavingAnimationRef.current)
                wavingActionRef.current.setLoop(THREE.LoopOnce)
                wavingActionRef.current.clampWhenFinished = true
              } else {
                console.warn('[Avatar3D] No animations found in Waving.fbx')
              }
            },
            undefined,
            (error) => {
              console.warn('[Avatar3D] Failed to load Waving animation:', error)
            }
          )
        }
        
        setHasError(false);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.warn('[Avatar3D] Échec du chargement du modèle Ready Player Me.', error)
        setHasError(true)
        setIsLoading(false)
      }
    )

    // Boucle d'animation (60 fps) : met à jour les contrôles et dessine la scène
    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getDelta()
      if (mixerRef.current) {
        mixerRef.current.update(delta)
      }
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
      // Clear any pending timeouts
      if (waveTimeoutRef.current) {
        clearTimeout(waveTimeoutRef.current)
        waveTimeoutRef.current = null
      }
      if (waveStartTimeoutRef.current) {
        clearTimeout(waveStartTimeoutRef.current)
        waveStartTimeoutRef.current = null
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      // Kill any ongoing hover animation
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill()
        hoverAnimationRef.current = null
      }
      // controls.dispose() // Removed as controls are removed
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
  }, [modelPath, autoRotate, backgroundColor, onPushComplete, cameraPosition, cameraLookAt, cameraFOV, modelPosition, modelScale, enableWaving, enablePush])
  
  const handleMouseEnter = () => {
    if (enableWaving && wavingAnimationRef.current && mixerRef.current && wavingActionRef.current && !isWavingRef.current) {
      // Clear any pending start timeout
      if (waveStartTimeoutRef.current) {
        clearTimeout(waveStartTimeoutRef.current)
        waveStartTimeoutRef.current = null
      }
      
      // Add delay before starting animation to prevent bugs on fast mouse movements
      waveStartTimeoutRef.current = setTimeout(() => {
        // Check again if still valid (user might have moved mouse away)
        if (enableWaving && wavingAnimationRef.current && mixerRef.current && wavingActionRef.current && !isWavingRef.current) {
          // Mark as waving
          isWavingRef.current = true
          
          // Stop any current animation
          if (idleActionRef.current) {
            idleActionRef.current.fadeOut(0.2)
          }
          
          // Play waving animation
          wavingActionRef.current.reset().fadeIn(0.2).play()
          wavingActionRef.current.setLoop(THREE.LoopOnce)
          wavingActionRef.current.clampWhenFinished = true
          
          // Fade back to idle when waving finishes
          const duration = wavingAnimationRef.current.duration * 1000
          waveTimeoutRef.current = setTimeout(() => {
            if (idleActionRef.current && wavingActionRef.current) {
              wavingActionRef.current.fadeOut(0.3)
              if (idleActionRef.current) {
                idleActionRef.current.reset().fadeIn(0.3).play()
              }
            }
            isWavingRef.current = false
            waveTimeoutRef.current = null
          }, duration)
        }
        waveStartTimeoutRef.current = null
      }, 300) // 300ms delay before starting animation
    }
  }

  const handleMouseLeave = () => {
    // Clear pending start timeout if user leaves before delay completes
    if (waveStartTimeoutRef.current) {
      clearTimeout(waveStartTimeoutRef.current)
      waveStartTimeoutRef.current = null
    }
    // Don't interrupt if already waving, let it complete naturally
  }

  // Hover animation with delay to prevent bugs on fast mouse movements
  const handleHoverEnter = () => {
    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Set a delay before starting the animation (300ms)
    hoverTimeoutRef.current = setTimeout(() => {
      if (modelRef.current && !isHoveringRef.current) {
        isHoveringRef.current = true
        
        // Animate the model with GSAP - scale up slightly and add a bounce
        hoverAnimationRef.current = gsap.to(modelRef.current.scale, {
          x: modelScale * 1.1,
          y: modelScale * 1.1,
          z: modelScale * 1.1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        })

        // Also animate position slightly up
        gsap.to(modelRef.current.position, {
          y: modelPosition[1] + 0.2,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }, 300) // 300ms delay
  }

  const handleHoverLeave = () => {
    // Clear the pending hover timeout if user leaves before delay
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // If already hovering, animate back
    if (isHoveringRef.current && modelRef.current) {
      isHoveringRef.current = false

      // Kill any ongoing hover animation
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill()
      }

      // Animate back to original scale
      gsap.to(modelRef.current.scale, {
        x: modelScale,
        y: modelScale,
        z: modelScale,
        duration: 0.3,
        ease: 'power2.out',
      })

      // Animate back to original position
      gsap.to(modelRef.current.position, {
        y: modelPosition[1],
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      onMouseEnter={enableWaving ? handleMouseEnter : enableHoverAnimation ? handleHoverEnter : undefined}
      onMouseLeave={enableWaving ? handleMouseLeave : enableHoverAnimation ? handleHoverLeave : undefined}
    >
      <div ref={mountRef} className="w-full h-full" style={{opacity: 'inherit', background: 'none', borderRadius: 0, overflow: 'visible'}} />

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
})

Avatar3D.displayName = 'Avatar3D'
export default Avatar3D

Avatar3D.propTypes = {
  modelPath: PropTypes.string,
  autoRotate: PropTypes.bool,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
  onPushComplete: PropTypes.func,
  cameraPosition: PropTypes.arrayOf(PropTypes.number),
  cameraLookAt: PropTypes.arrayOf(PropTypes.number),
  cameraFOV: PropTypes.number,
  modelPosition: PropTypes.arrayOf(PropTypes.number),
  modelScale: PropTypes.number,
  enableWaving: PropTypes.bool,
  enablePush: PropTypes.bool,
  enableHoverAnimation: PropTypes.bool,
}

