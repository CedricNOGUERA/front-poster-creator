import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export function TinyMCETest() {
  const [value, setValue] = React.useState('')

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h3>Test de l'éditeur TinyMCE</h3>
      <p>Si vous voyez une barre d'outils complète au-dessus de cette zone de texte, TinyMCE fonctionne correctement !</p>
      
      <div style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', marginBottom: '20px' }}>
                 <Editor
           value={value}
          onEditorChange={setValue}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      </div>
      
      <div>
        <h4>Contenu HTML généré :</h4>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          border: '1px solid #ddd',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {value || '<p>Aucun contenu</p>'}
        </pre>
      </div>
    </div>
  )
}
