import { ICON_MAP } from '@/data/iconsData'

interface DynamicIconProps {
  iconKey: string
  className?: string
  size?: number
  color?: string
}

export default function DynamicIcon({
  iconKey,
  className,
  size = 24,
  color,
}: DynamicIconProps) {
  const IconComponent = ICON_MAP[iconKey as keyof typeof ICON_MAP]

  if (!IconComponent) {
    console.warn(`Icône non trouvée: ${iconKey}`)
    return <span className={className}>❓</span>
  }

  return <IconComponent className={className} size={size} color={color} />
}
