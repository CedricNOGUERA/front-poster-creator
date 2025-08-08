import { ComponentTypeMulti } from "@/types/ComponentType"
import { Button } from "react-bootstrap"

export const CanvasComponent = ({
    index,
    isSelected,
    hoveredIndex,
    style,
    children,
    handleDragOnCanvas,
    setSelectedIndex,
    setHoveredIndex,
    _handleDeleteComponent,
    setComponents,
  }: {
    index: number
    isSelected: boolean
    hoveredIndex: number | null
    style: React.CSSProperties
    children: React.ReactNode
    handleDragOnCanvas: (e: React.MouseEvent<HTMLDivElement | HTMLImageElement>, index: number) => void
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>
    setHoveredIndex: (index: number | null) => void
    _handleDeleteComponent: (indexToDelete: number, setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>, setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>) => void
    setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>
  }) => (
    <div
      key={index}
      className={`absolute cursor-move pointer ${isSelected ? 'ring-1 ring-blue-400' : ''}`}
      onMouseDown={(e) => handleDragOnCanvas(e, index)}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedIndex(index)
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={style}
    >
      {children}
      {hoveredIndex === index && (
        <Button
          variant="light"
          className="rounded-circle"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            zIndex: 20,
            width: '20px',
            height: '20px',
            padding: '0',
            lineHeight: '1',
          }}
          onClick={(e) => {
            e.stopPropagation()
            _handleDeleteComponent(index, setComponents, setSelectedIndex)
          }}
          title="Supprimer"
        >
          <i className="fa-solid fa-xmark"></i>
        </Button>
      )}
    </div>
  )