// LAYER: characters
// ASSET SLOTS: character_lion.png · character_bear.png · character_owl.png
//              character_rabbit.png · character_sheep.png
// Rules: centered anchor, same sizing for all slots (~1.5–2x base size),
//        only the active character is visible (controlled by `characterId` prop).
// To swap: replace the import path below with your character_*.png
import lionSrc   from '@/imports/lion.png'
import bearSrc   from '@/imports/bear.png'
import owlSrc    from '@/imports/owl.png'
import rabbitSrc from '@/imports/rabbit.png'
import sheepSrc  from '@/imports/sheep.png'

const CHARACTER_IMAGES: Record<string, string | null> = {
  lion:   lionSrc,   // swap → replace lionSrc import with character_lion.png
  bear:   bearSrc,   // swap → replace bearSrc import with character_bear.png
  owl:    owlSrc,    // swap → replace owlSrc import with character_owl.png
  rabbit: rabbitSrc, // swap → replace rabbitSrc import with character_rabbit.png
  sheep:  sheepSrc,  // swap → replace sheepSrc import with character_sheep.png
}

// Accent colors per character — used for the placeholder until the real PNG is dropped in
const CHARACTER_ACCENTS: Record<string, string> = {
  lion:   '#F5A623',
  bear:   '#A0522D',
  owl:    '#6B4226',
  rabbit: '#5A9E5A',
  sheep:  '#7BAFD4',
}

const CHARACTER_EMOJIS: Record<string, string> = {
  lion:   '🦁',
  bear:   '🐻',
  owl:    '🦉',
  rabbit: '🐰',
  sheep:  '🐑',
}

interface CharacterLayerProps {
  characterId: string
  size?: string | number
  locked?: boolean
  animClass?: string
  style?: React.CSSProperties
}

export default function CharacterLayer({
  characterId,
  size = 'clamp(190px, 30vh, 260px)',
  locked = false,
  animClass = '',
  style,
}: CharacterLayerProps) {
  const src = CHARACTER_IMAGES[characterId] ?? null
  const accent = CHARACTER_ACCENTS[characterId] ?? '#f5c518'
  const emoji  = CHARACTER_EMOJIS[characterId]  ?? '❓'

  const lockFilter = 'grayscale(100%) brightness(0.3) drop-shadow(0 6px 16px rgba(0,0,0,0.5))'
  const idleFilter = 'drop-shadow(0 6px 18px rgba(0,0,0,0.55))'

  const sizeStyle: React.CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    display: 'block',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={characterId}
        data-layer={`character_${characterId}`}
        className={animClass}
        style={{
          ...sizeStyle,
          objectFit: 'contain',
          background: 'transparent',
          filter: locked ? lockFilter : idleFilter,
          transition: 'filter 0.3s',
          ...style,
        }}
      />
    )
  }

  // Placeholder shown until the real character_*.png is dropped in
  return (
    <div
      data-layer={`character_${characterId}`}
      className={animClass}
      style={{
        ...sizeStyle,
        borderRadius: '50%',
        background: locked
          ? 'rgba(30,30,30,0.55)'
          : `radial-gradient(circle at 38% 38%, ${accent}cc, ${accent}55)`,
        border: `3px dashed ${locked ? 'rgba(255,255,255,0.15)' : accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(60px, 10vh, 90px)',
        filter: locked ? lockFilter : idleFilter,
        transition: 'filter 0.3s',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {emoji}
    </div>
  )
}
