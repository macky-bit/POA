// LAYER: background
// ASSET SLOT: background.png
// Rules: fills full viewport, objectFit cover, zIndex 0, no text/characters baked in.
// To swap: replace the import below with your new background.png.
import backgroundSrc from '@/imports/play.png'

export default function BackgroundLayer() {
  return (
    <img
      src={backgroundSrc}
      alt=""
      aria-hidden
      data-layer="background"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        zIndex: 0,
        display: 'block',
      }}
    />
  )
}
