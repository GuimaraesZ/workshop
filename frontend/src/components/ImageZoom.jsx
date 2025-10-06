import { useState, useRef } from 'react'

export default function ImageZoom({ src, alt }) {
  const [isZooming, setIsZooming] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const handleMouseMove = (e) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  return (
    <div 
      ref={imageRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in bg-gray-100 dark:bg-gray-800"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-150 ease-out"
        style={{
          transform: isZooming ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
        draggable={false}
      />
      
      {/* Indicador de Zoom */}
      {isZooming && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm pointer-events-none animate-fade-in">
          🔍 Zoom 2.5x
        </div>
      )}
    </div>
  )
}
