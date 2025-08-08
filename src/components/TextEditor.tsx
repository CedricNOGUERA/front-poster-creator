import { ComponentTypeMulti, TextComponentType, NumberComponentType, PrincipalPriceComponentType } from '@/types/ComponentType'
import { Form } from 'react-bootstrap'
import fonts from '@/data/fonts.json'

export function TextEditor({
  component,
  updateComponent,
}: {
  component: ComponentTypeMulti
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}) {

  if (!component) return null
  const comp = component as TextComponentType | NumberComponentType | PrincipalPriceComponentType
  return (
    <div>
      <h4 className='fw-bold text-secondary'>Éditer le texte</h4>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Contenu'>
          <Form.Label>Contenu</Form.Label>
          <Form.Control
            type='text'
            placeholder='Saisissez le texte ici'
            value={comp.text || ''}
            onChange={(e) => updateComponent({ text: e.target.value })}
          />
        </Form.Group>
      </div>
      {comp.type === 'price' && 'width' in comp && (
        <div className='text-start'>
          <Form.Group className='mb-3' controlId='Contenu'>
            <Form.Label>Position</Form.Label>
            <Form.Control
              type='number'
              placeholder='Saisissez le texte ici'
              value={comp.width || ''}
              onChange={(e) => updateComponent({ width: parseInt(e.target.value) })}
            />
          </Form.Group>
        </div>
      )}

      <div className='text-start'>
        <Form.Group className='mb-3' controlId='PoliceSize'>
          <Form.Label>Police</Form.Label>
          <Form.Select
            aria-label='Default select example'
            value={comp.fontFamily || ''}
            onChange={(e) => {updateComponent({ fontFamily: e.target.value})
          console.log(e.target.value)
          }}
          >
            <option>Sélectionnez une police</option>
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
              
            
          </Form.Select>
        </Form.Group>
      </div>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='PoliceSize'>
          <Form.Label>Taile de police</Form.Label>
          <Form.Control
            type='number'
            placeholder='150'
            value={comp.fontSize || 0}
            onChange={(e) => updateComponent({ fontSize: parseInt(e.target.value) })}
          />
        </Form.Group>
      </div>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='PoliceWeight'>
          <Form.Label>Epaissuer de police</Form.Label>
          <Form.Select
            aria-label='Default select example'
            value={comp.fontWeight}
            onChange={(e) => updateComponent({ fontWeight: parseInt(e.target.value) })}
          >
            <option>Sélectionnez un style</option>
            {comp.type === 'price' || comp.type === 'number' ? (
              <>
                <option value={400}>Normal</option>
                <option value={700}>Gras</option>
              </>
            ) : (
              <>
                <option value={200}>Fin</option>
                <option value={400}>Normal</option>
                <option value={700}>Gras</option>
                <option value={1000}>Très gras</option>
              </>
            )}
          </Form.Select>
        </Form.Group>
      </div>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Rotation'>
          <Form.Label>Rotation</Form.Label>
          <Form.Control
            type='number'
            placeholder='0'
            value={comp.rotation || 0}
            onChange={(e) => updateComponent({ rotation: parseInt(e.target.value) })}
          />
        </Form.Group>
      </div>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='color'>
          <Form.Label>Couleur du texte</Form.Label>
          <Form.Control
            type='color'
            value={comp.color || '#000000'}
            onChange={(e) => updateComponent({ color: e.target.value })}
          />
        </Form.Group>
      </div>
      <div className='text-start'>
        <Form.Check
          type='checkbox'
          id='strikethrough-checkbox'
          label='Texte barré'
          checked={comp.textDecoration === 'line-through'}
          onChange={(e) =>
            updateComponent({ textDecoration: e.target.checked ? 'line-through' : 'none' })
          }
        />
      </div>
    </div>
  )
}
