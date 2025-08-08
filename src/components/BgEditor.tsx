import { BackgroundComponentType, ComponentTypeMulti } from '@/types/ComponentType'
import { Form } from 'react-bootstrap'

export default function BgEditor({
    component,
    updateComponent,
  }: { component: ComponentTypeMulti
    updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
  }) {
     if (!component) return null
      const comp = component as BackgroundComponentType
  return (
    <div>
      <h4 className='fw-bold text-secondary'>Éditer l'arrière plan</h4>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Contenu'>
          <Form.Label>Couleur de fond</Form.Label>
          <Form.Control
            type='color'
            placeholder='Saisissez le texte ici'
            value={comp?.backgroundColor || ''}
            onChange={(e) => updateComponent({ backgroundColor: e.target.value })}
          />
        </Form.Group>
      </div>
    </div>
  )
}
