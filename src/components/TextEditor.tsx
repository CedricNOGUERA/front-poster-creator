import { ComponentTypeMulti, TextComponentType, NumberComponentType, PrincipalPriceComponentType } from '@/types/ComponentType'
import { Form, Button, ButtonGroup } from 'react-bootstrap'
import fonts from '@/data/fonts.json'
import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { TINYMCE_CONFIG } from '@/config/tinymce'

export function TextEditor({
  component,
  updateComponent,
}: {
  component: ComponentTypeMulti
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}) {

  const comp = component as TextComponentType | NumberComponentType | PrincipalPriceComponentType
  
  const [text, setText] = React.useState(comp.text || '')
  const [editorRef, setEditorRef] = React.useState<unknown>(null)

  React.useEffect(() => {
    setText(comp.text || '')
  }, [comp.text])

  const handleTextChange = (newText: string) => {
    setText(newText)
    updateComponent({ text: newText })
  }

  const handleEditorInit = (_evt: unknown, editor: unknown) => {
    setEditorRef(editor)
  }

  const addSuperscript = () => {
    if (editorRef && typeof editorRef === 'object' && editorRef !== null) {
      const editor = editorRef as { execCommand: (command: string, showUI: boolean, value: string) => boolean; selection: { getContent: () => string } }
      editor.execCommand('mceInsertContent', false, '<sup>' + editor.selection.getContent() + '</sup>')
    }
  }

  const addSubscript = () => {
    if (editorRef && typeof editorRef === 'object' && editorRef !== null) {
      const editor = editorRef as { execCommand: (command: string, showUI: boolean, value: string) => boolean; selection: { getContent: () => string } }
      editor.execCommand('mceInsertContent', false, '<sub>' + editor.selection.getContent() + '</sub>')
    }
  }

  if (!component) return null

  return (
    <div>
      <h4 className='fw-bold text-secondary'>Éditer le texte</h4>
      <div className='text-start'>
        <Form.Group className='mb-3' controlId='Contenu'>
          <Form.Label>Contenu</Form.Label>
          <div className='mb-2'>
            <small className='text-muted'>
              Utilisez la barre d'outils pour formater votre texte
            </small>
            <div className='mt-2'>
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
                  onClick={addSubscript}
                  title='Mettre en indice'
                >
                  <b>X</b><sub>2</sub>
                </Button>
              </ButtonGroup>
              {/* <div>
                <small className='text-muted ms-2'>
                  Sélectionnez du texte puis cliquez sur les boutons pour le mettre en exposant/indice
                </small>
              </div> */}
            </div>
          </div>
          <div style={{width: '300px', border: '1px solid #ced4da', borderRadius: '0.375rem' }}>
            <Editor
              apiKey={TINYMCE_CONFIG.API_KEY}
              value={text}
              onEditorChange={handleTextChange}
              onInit={handleEditorInit}
              init={TINYMCE_CONFIG.DEFAULT_CONFIG}
            />
          </div>
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
