import { ProgressBarDrag } from '@/components/common/ProgressBarDrag'
import EditorPage from '@/components/EditorPage'
import CategorySelectorDrag from '@/components/step-selector/CategorySelectorDrag'
import { ShopSelectorDrag } from '@/components/step-selector/ShopSelectorDrag'
import useStoreApp from '@/stores/storeApp'
import { Container } from 'react-bootstrap'

export default function SchemaBuilder() {
  const step = useStoreApp((state) => state.step)

  return (
    <Container fluid className='px-0'>
      <ProgressBarDrag />
      {step === 1 && <ShopSelectorDrag title={'Étape 1: Choisis ton magasin'} />}
      {step === 2 && <CategorySelectorDrag title={"Étape 2: Choisis le type d'affichage"} />}
      {step === 3 && <EditorPage />}
    </Container>
  )
}
