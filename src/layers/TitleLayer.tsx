// LAYER: title
// ASSET SLOT: title.png
// Rules: anchored top-center, overlays background, sized independently.
// To swap: replace the import below with your new title.png.
import titleSrc from '@/imports/title_game.png'

export default function TitleLayer() {
  return (
    <img
      src={titleSrc}
      alt="Accounting on Jungle"
      data-layer="title"
      style={{
        display: 'block',
        width: 'clamp(220px, 72vw, 400px)',
        height: 'auto',
        flexShrink: 0,
        filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.65))',
      }}
    />
  )
}
