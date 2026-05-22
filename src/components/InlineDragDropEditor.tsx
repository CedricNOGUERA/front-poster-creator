import React from "react";
import useStoreApp from "@/stores/storeApp";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import dimensions from "@/data/dimensions.json";
import {
  _handleDragOver,
  _handleExportToPDF,
} from "@/utils/functions";
import SideBar from "./DragDropComponents/SideBar";
import { DimensionType } from "@/types/DimensionType";
import ComponentEditor from "./DragDropComponents/ComponentEditor";
import { ModalValidateModel } from "./ui/Modals";
import useDragDropEditor from "@/hook/useDragDropEditor";
import { useRenderedComponents } from "./canvas/renderer";

export default function InlineDragDropEditor() {
  const useDrag = useDragDropEditor();
  /* States
   *******************************************************************************************/
  const API_URL = import.meta.env.VITE_API_URL;

  const storeApp = useStoreApp();

  /* UseMemo
   *******************************************************************************************/
  // const renderedComponents = React.useMemo(() => {
  //   return useDrag.components.map((comp, index) => {
  //     const isSelected = index === useDrag.selectedIndex;
  //     const isHovered = index === useDrag.hoveredIndex;
  //     const isEditing = index === useDrag.editingIndex;
  //     let commonProps;

  //     if (comp.type === "background-color" || comp.type === "header") {
  //       commonProps = {
  //         className: `absolute cursor-move pointer`,
  //         onClick: (e: React.MouseEvent) => {
  //           e.stopPropagation();
  //           useDrag.setSelectedIndex(index);
  //           useDrag.setEditingIndex(null);
  //         },
  //         onMouseEnter: () => useDrag.setHoveredIndex(index),
  //         onMouseLeave: () => useDrag.setHoveredIndex(null),
  //         style: useDrag.getStyleFromComponent(comp, isSelected),
  //       };
  //     } else {
  //       commonProps = {
  //         className: `absolute cursor-move pointer`,
  //         onMouseDown: (
  //           e: React.MouseEvent<HTMLDivElement | HTMLImageElement>,
  //         ) => {
  //           if (!isEditing) {
  //             useDrag.handleDragOnCanvas(e, index);
  //           }
  //         },
  //         onDoubleClick: (e: React.MouseEvent) => {
  //           e.stopPropagation();
  //           useDrag.setSelectedIndex(index);
  //           if (
  //             comp.type === "text" ||
  //             comp.type === "enableText" ||
  //             comp.type === "number" ||
  //             comp.type === "price"
  //           ) {
  //             if (isEditing) {
  //               useDrag.setEditingIndex(null);
  //             } else {
  //               useDrag.setEditingIndex(index);
  //             }
  //           } else {
  //             useDrag.setEditingIndex(null);
  //           }
  //         },
  //         onMouseEnter: () => useDrag.setHoveredIndex(index),
  //         onMouseLeave: () => useDrag.setHoveredIndex(null),
  //         style: useDrag.getStyleFromComponent(comp, isSelected),
  //       };
  //     }

  //      const deleteButton = <CanvasDeleteButton
  //       visible={isHovered && !isEditing}
  //       comp={comp}
  //       index={index}
  //       setComponents={useDrag.setComponents}
  //       setSelectedIndex={useDrag.setSelectedIndex}
  //     />;
      

  //     if (comp.type === "price" || comp.type === "number") {
  //       const typedComp = comp as
  //         | PrincipalPriceComponentType
  //         | NumberComponentType;

  //       if (isEditing) {
  //         return (
  //          <PriceEditingRenderer 
  //          priceEditingRendererProps={{index, commonProps, typedComp, useDrag, isSelected}}
  //          />
  //         );
  //       }
  //       return (
  //         <PriceRenderer
  //           PriceRendererProps={{index, commonProps, typedComp, isEditing, isHovered, deleteButton}} />
     
  //       );
  //     }

  //     if (comp.type === "text" || comp.type === "enableText") {
  //       const textComp = comp as TextComponentType;
  //       if (isEditing) {
  //         return (
  //           <foreignObject
  //             key={index}
  //             x={textComp.left}
  //             y={textComp.top}
  //             width={150}
  //             height={50}
  //             style={{
  //               ...useDrag.getStyleFromComponent(comp, isSelected),

  //               border: "1px dashed blue",
  //               overflow: "visible",
  //             }}
  //           >
  //             <textarea
  //               // type='text'
  //               value={textComp.text}
  //               onChange={(e) =>
  //                 useDrag.updateComponent({ text: e.target.value })
  //               }
  //               onBlur={() => useDrag.setEditingIndex(null)}
  //               onKeyDown={(e) => {
  //                 if (e.key === "Escape") {
  //                   useDrag.setEditingIndex(null);
  //                 }
  //               }}
  //               style={{
  //                 width: "100%",
  //                 height: "100%",
  //                 fontFamily: textComp.fontFamily,
  //                 fontSize: textComp.fontSize,
  //                 fontWeight: textComp.fontWeight,
  //                 color: textComp.color,
  //                 border: "none",
  //                 outline: "none",
  //                 background: "transparent",
  //                 transform: `rotate(${textComp.rotation ?? 0}deg)`,
  //               }}
  //               autoFocus
  //             />
  //           </foreignObject>
  //         );
  //       }
  //       return (
  //         <div key={index} {...commonProps} className="text-start">
  //           <span
  //             style={{
  //               fontFamily: textComp.fontFamily,
  //               textDecoration: textComp.textDecoration ?? "none",
  //               whiteSpace: "pre-line",
  //             }}
  //             dangerouslySetInnerHTML={{ __html: textComp.text }}
  //           />
  //           {deleteButton}
  //         </div>
  //       );
  //     }

  //     if (comp.type === "background-color") {
  //       return <div key={index} {...commonProps}></div>;
  //     }

  //     if (comp.type === "header") {
  //       const headerComp = comp as HeaderComponentType;
  //       return (
  //         <div key={index} {...commonProps}>
  //           {headerComp.src !== null && (
  //             <img
  //               src={API_URL + headerComp.src}
  //               alt=""
  //               style={{
  //                 maxWidth: "100%",
  //                 maxHeight: "100%",
  //               }}
  //             />
  //           )}
  //         </div>
  //       );
  //     }

  //     if (comp.type === "image") {
  //       const imgComp = comp as ImageComponentType;
  //       return (
  //         <div key={index} {...commonProps}>
  //           <img
  //             src={API_URL + imgComp.src}
  //             alt=""
  //             width={imgComp.width}
  //             height={imgComp.height}
  //             style={{ width: "100%", height: "100%" }}
  //           />
  //           {deleteButton}
  //         </div>
  //       );
  //     }

  //     if (comp.type === "horizontalLine") {
  //       return (
  //         <div key={index} {...commonProps}>
  //           {deleteButton}
  //         </div>
  //       );
  //     }

  //     if (comp.type === "verticalLine") {
  //       return (
  //         <div key={index} {...commonProps}>
  //           {deleteButton}
  //         </div>
  //       );
  //     }

  //     return null;
  //   });
  // }, [
  //   useDrag.components,
  //   useDrag.selectedIndex,
  //   useDrag.hoveredIndex,
  //   useDrag.editingIndex,
  //   useDrag.handleDragOnCanvas,
  //   useDrag.getStyleFromComponent,
  //   useDrag.updateComponent,
  //   API_URL,
  // ]);
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
        {/* Drag 'n Drop éditeur  */}
        <SideBar
          storeApp={storeApp}
          selectedCanvas={useDrag.selectedCategory.canvas}
        />
        {/* Canvas */}
        <div className="m-auto">
          <Container className="px-5 mb-3">
            <h4>Dimensions prédéfinies</h4>
            <Row className="text-start">
              <Col xs={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Select
                    value={useDrag.selectedDimension || ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const dimensionId = parseInt(e.target.value);
                      useDrag.setSelectedDimension(dimensionId);
                      storeApp.setDimensionId(dimensionId);
                      const selectedDim = dimensions.find(
                        (d) => d.id === dimensionId,
                      );
                      if (selectedDim) {
                        useDrag.setNewTemplateState((prev) => ({
                          ...prev,
                          width: selectedDim.width,
                          height: selectedDim.height,
                        }));
                      }
                    }}
                  >
                    <option value="">Sélection une dimension</option>
                    {dimensions.map(
                      (dimension: DimensionType, index: number) => (
                        <option key={index} value={dimension.id}>
                          {dimension.name}
                        </option>
                      ),
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Container>
          <div
            id="canvas"
            ref={useDrag.posterRef}
            className=" relative bg-gray-50 shadow m-auto m-4 canvas"
            onDrop={useDrag.handleDrop}
            onDragOver={_handleDragOver}
            style={{
              width:
                useDrag.newTemplateState?.width && useDrag.dimensionFactor
                  ? `${useDrag.newTemplateState.width * useDrag.dimensionFactor}px`
                  : "500px",
              height: useDrag.maxPreviewHeight
                ? `${useDrag.maxPreviewHeight}px`
                : "500px",
            }}
          >
            {renderedComponents}
          </div>
          <div className="p-4 flex gap-2">
            <Button
              variant="primary"
              onClick={() => _handleExportToPDF(useDrag.newTemplateState)}
              className="me-4"
            >
              Exporter en PDF
            </Button>
            <Button
              variant="success"
              onClick={() => {
                useDrag.handleShowValidateModel();
              }}
              className=""
            >
              Enregistrer
            </Button>
          </div>
        </div>
        {/* Éditeur dynamique */}
        <ComponentEditor ComponentEditorProps={ComponentEditorProps} />
      </div>
      <ModalValidateModel modalValidateModelProps={modalValidateModelProps} />
    </Container>
  );
}
