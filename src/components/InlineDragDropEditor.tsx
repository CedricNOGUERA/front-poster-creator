import useStoreApp from "@/stores/storeApp";
import { Container } from "react-bootstrap";
import SideBar from "./DragDropComponents/SideBar";
import ComponentEditor from "./DragDropComponents/ComponentEditor";
import { ModalValidateModel } from "./ui/Modals";
import useDragDropEditor from "@/hook/useDragDropEditor";
import { useRenderedComponents } from "./canvas/renderer";
import DimensionSelecter from "./DragDropComponents/DimensionSelecter";
import CanvasComponent from "./DragDropComponents/CanvasComponent";
import CanvasButtons from "./DragDropComponents/CanvasButtons";

export default function InlineDragDropEditor() {
  const useDrag = useDragDropEditor();
  /* States
   *******************************************************************************************/
  const API_URL = import.meta.env.VITE_API_URL;
  const storeApp = useStoreApp();

  /* UseMemo
   *******************************************************************************************/
  const renderedComponents = useRenderedComponents({useDrag, API_URL});

  /* component props
   *******************************************************************************************/
  const ComponentEditorProps = {
    components: useDrag.components,
    selectedIndex: useDrag.selectedIndex,
    updateComponent: useDrag.updateComponent,
  };
  const modalValidateModelProps = {
    showValidateModel: useDrag.showValidateModel,
    handleCloseValidateModel: useDrag.handleCloseValidateModel,
    addModel: useDrag.addModel,
    imageName: useDrag.imageName,
    setImageName: useDrag.setImageName,
    idTemplate: useDrag.idTemplate,
    template: useDrag.template,
    setTemplate: useDrag.setTemplate,
    isErrorModel: useDrag.isErrorModel,
    hasModel: useDrag.hasModel,
  };

  /* render
   *******************************************************************************************/
  return (
    <Container fluid className="bg-light px-0">
      <div className="d-flex h-screen ">
        <SideBar
          storeApp={storeApp}
          selectedCanvas={useDrag.selectedCategory.canvas}
        />
        {/* Canvas */}
        <div className="m-auto">
          <Container className="px-5 mb-3">
            <h4>Dimensions prédéfinies</h4>
            <DimensionSelecter useDrag={useDrag} storeApp={storeApp} />
          </Container>
          <CanvasComponent useDrag={useDrag} renderedComponents={renderedComponents} />
          <CanvasButtons useDrag={useDrag} />
        </div>
        {/* Éditeur dynamique */}
        <ComponentEditor ComponentEditorProps={ComponentEditorProps} />
      </div>
      <ModalValidateModel modalValidateModelProps={modalValidateModelProps} />
    </Container>
  );
}
