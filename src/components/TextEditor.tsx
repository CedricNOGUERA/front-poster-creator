import { ComponentTypeMulti, TextComponentType, NumberComponentType, PrincipalPriceComponentType } from '@/types/ComponentType'
import { Form, Button, ButtonGroup } from 'react-bootstrap'
import fonts from '@/data/fonts.json'
import React from 'react'

export function TextEditor({
  component,
  updateComponent,
}: {
  component: ComponentTypeMulti
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}) {

  // if (!component) return null
  const comp = component as TextComponentType | NumberComponentType | PrincipalPriceComponentType
  
  const [text, setText] = React.useState(comp.text || '')
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)


  React.useEffect(() => {
    setText(comp.text || '')
  }, [comp.text])

  const handleTextChange = (newText: string) => {
    setText(newText)
    updateComponent({ text: newText })
  }

  const addSuperscript = () => {
    const textArea = textAreaRef.current
    if (!textArea) return

    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const selectedText = text.substring(start, end)
    
    if (selectedText) {
      const newText = text.substring(0, start) + `<sup>${selectedText}</sup>` + text.substring(end)
      handleTextChange(newText)
      
      // Remettre le focus et la sélection
      setTimeout(() => {
        textArea.focus()
        textArea.setSelectionRange(start + 7, start + 7 + selectedText.length)
      }, 0)
    }
  }

  const removeSuperscript = () => {
    const textArea = textAreaRef.current
    if (!textArea) return

    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const selectedText = text.substring(start, end)
    
    if (selectedText.includes('<sup>') && selectedText.includes('</sup>')) {
      const cleanText = selectedText.replace(/<sup>(.*?)<\/sup>/g, '$1')
      const newText = text.substring(0, start) + cleanText + text.substring(end)
      handleTextChange(newText)
      
      // Remettre le focus et la sélection
      setTimeout(() => {
        textArea.focus()
        textArea.setSelectionRange(start, start + cleanText.length)
      }, 0)
    }
  }

  // const isSuperscriptSelected = () => {
  //   const textArea = textAreaRef.current
  //   if (!textArea) return false
    
  //   const start = textArea.selectionStart
  //   const end = textArea.selectionEnd
  //   const selectedText = text.substring(start, end)
    
  //   return selectedText.includes('<sup>') && selectedText.includes('</sup>')
  // }

  return (
    <div>
      <h4 className='fw-bold text-secondary'>Éditer le texte</h4>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Contenu'>
          <Form.Label>Contenu</Form.Label>
          <div className='mb-2'>
            <ButtonGroup size='sm'>
              <Button
                variant='outline-secondary'
                onClick={addSuperscript}
                title='Mettre en exposant'
              >
                <b>X</b><sup>2</sup>
              </Button>
              <Button
                variant='outline-secondary'
                onClick={removeSuperscript}
                // disabled={!isSuperscriptSelected()}
                title="Retirer l'exposant"
              >
                <b>X</b>
                <span style={{ textDecoration: 'line-through' }}>
                  <sup>2</sup>
                </span>
              </Button>
            </ButtonGroup>
            <div>
              <small className='text-muted ms-2'>
                Sélectionnez du texte puis cliquez sur{' '}
                <sup>
                  <b>X</b>
                </sup>
              </small>
            </div>
            <div>
              <small className='text-muted ms-2'>
                pour le mettre en exposant
              </small>
            </div>
          </div>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Saisissez le texte ici. Utilisez les boutons ci-dessus pour le formatage.'
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            ref={textAreaRef}
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
            onChange={(e) => {
              updateComponent({ fontFamily: e.target.value })
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
