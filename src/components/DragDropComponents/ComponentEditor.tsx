import React from 'react'
import { TextEditor } from '../TextEditor'
import { ImageEditor } from '../ImageEditor'
import { ComponentTypeMulti } from '@/types/ComponentType'
import BgEditor from '../BgEditor'

interface ComponentEditorType {
    components: ComponentTypeMulti[]
    selectedIndex: number | null
    updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}

export default function ComponentEditor({ComponentEditorProps}: {ComponentEditorProps: ComponentEditorType}) {
    const {components, selectedIndex, updateComponent} = ComponentEditorProps
return (
  <React.Fragment>
      {selectedIndex !== null && components[selectedIndex] ? (
              <div className='bg-white p-4 border-0 border-start'>
                {(components[selectedIndex]?.type === 'text' ||
                  components[selectedIndex]?.type === 'enableText' ||
                  components[selectedIndex]?.type === 'number' ||
                  components[selectedIndex]?.type === 'price') && (
                  <TextEditor
                    component={components[selectedIndex]}
                    updateComponent={updateComponent}
                  />
                )}
                {components[selectedIndex]?.type === 'image' && (
                  <ImageEditor
                    component={components[selectedIndex]}
                    updateComponent={updateComponent}
                  />
                )}
                {(components[selectedIndex]?.type === 'background-color' ||
                  components[selectedIndex]?.type === 'header') && (
                  <BgEditor
                    component={components[selectedIndex]}
                    updateComponent={updateComponent}
                  />
                )}
              </div>
            ) : (
              <div className='bg-white p-4 border-0 border-start' style={{ width: '272px' }}>
                <h4 className='fw-bold text-secondary'>Éditeur</h4>
                <p className='text-secondary'>Sélectionnez un élément</p>
              </div>
            )}
  </React.Fragment>
)
}
