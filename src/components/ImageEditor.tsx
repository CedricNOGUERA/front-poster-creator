import { ComponentTypeMulti, ImageComponentType } from '@/types/ComponentType'
import { Form } from 'react-bootstrap'

export function ImageEditor({
  component,
  updateComponent,
}: {
  component: ComponentTypeMulti
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}) {
  if (!component) return null
  const imgComp = component as ImageComponentType
  return (
    <div>
      <h3 className='fw-bold text-secondary'>Éditer l'image</h3>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Contenu'>
          <Form.Label>Largeur</Form.Label>
          <Form.Control
            type='number'
            placeholder='150'
            value={imgComp.width || ''}
            onChange={(e) => updateComponent({ width: parseInt(e.target.value) })}
          />
        </Form.Group>
      </div>
    </div>
  )
}
