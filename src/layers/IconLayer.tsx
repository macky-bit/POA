// LAYER: UI icons
// ASSET SLOTS: icon_hint.png · icon_play.png · icon_home.png · icon_settings.png
//              icon_mute.png · icon_speaker.png · icon_left.png · icon_right.png
// Rules: each icon is its own independent layer; not merged into any background.
// To swap: set the matching entry from null to your imported PNG.
//
// Replace null with:  import iconHintSrc from '@/imports/icon_hint.png'
const ICON_IMAGES: Record<string, string | null> = {
  hint:     null, // swap → import iconHintSrc     from '@/imports/icon_hint.png'
  play:     null, // swap → import iconPlaySrc     from '@/imports/icon_play.png'
  home:     null, // swap → import iconHomeSrc     from '@/imports/icon_home.png'
  settings: null, // swap → import iconSettingsSrc from '@/imports/icon_settings.png'
  mute:     null, // swap → import iconMuteSrc     from '@/imports/icon_mute.png'
  speaker:  null, // swap → import iconSpeakerSrc  from '@/imports/icon_speaker.png'
  left:     null, // swap → import iconLeftSrc     from '@/imports/icon_left.png'
  right:    null, // swap → import iconRightSrc    from '@/imports/icon_right.png'
}

const ICON_FALLBACKS: Record<string, string> = {
  hint:     '💡',
  play:     '▶',
  home:     '🏠',
  settings: '⚙️',
  mute:     '🔇',
  speaker:  '🔊',
  left:     '◀',
  right:    '▶',
}

interface IconLayerProps {
  icon: keyof typeof ICON_FALLBACKS
  size?: number
  color?: string
  style?: React.CSSProperties
}

export default function IconLayer({ icon, size = 24, color = '#5a3e08', style }: IconLayerProps) {
  const src = ICON_IMAGES[icon] ?? null
  const fallback = ICON_FALLBACKS[icon] ?? '?'

  if (src) {
    return (
      <img
        src={src}
        alt={icon}
        data-layer={`icon_${icon}`}
        style={{ width: size, height: size, objectFit: 'contain', display: 'block', ...style }}
      />
    )
  }

  return (
    <span
      data-layer={`icon_${icon}`}
      style={{ fontSize: size * 0.9, color, lineHeight: 1, display: 'block', ...style }}
    >
      {fallback}
    </span>
  )
}
