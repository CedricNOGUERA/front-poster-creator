import { ProgressBar } from "@/components/common/ProgressBar";
import { CategorySelector } from "@/components/step-selector/CategorySelector";
import { DimensionSelector } from "@/components/step-selector/DimensionSelector";
import { EditorTemplate } from "@/components/step-selector/EditorTemplate";
import { ShopSelector } from "@/components/step-selector/ShopSelector";
import { TemplateSelector } from "@/components/step-selector/TemplateSelector";
import useStoreApp from "@/stores/storeApp";
import { Container } from "react-bootstrap";

export const StepSelectorMockupBuilder = () => {
  /* States
   *******************************************************************************************/
  const step = useStoreApp((state) => state.step);

  /* Render
   *******************************************************************************************/
  return (
    <Container fluid className='px-0 bg-light'>
      <ProgressBar />
      {step === 1 && <ShopSelector title={'Étape 1: Choisis ton magasin'} />}
      {step === 2 && <CategorySelector title={"Étape 2: Choisis le type d'affichage"} />}
      {step === 3 && <TemplateSelector title={'Étape 3: Choisis le modèle'} />}
      {step === 4 && <DimensionSelector title={'Étape 4: Choisis les dimensions'} />}
      {step === 5 && <EditorTemplate />}
    </Container>
  )
};
