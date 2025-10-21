/* eslint-disable react-hooks/exhaustive-deps */
import dimensions from "@/mocks/dimensions.json";
import useStoreApp from "@/stores/storeApp";
import {
  BackgroundComponentType,
  ComponentTypeMulti,
  HeaderComponentType,
  ImageComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
} from "@/types/ComponentType";
import { ModelType } from "@/types/modelType";
import { _getModels } from "@/utils/apiFunctions";
import { _thousandSeparator } from "@/utils/functions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export const EditorTemplate = () => {
  /* States / Hooks
   *******************************************************************************************/
  const storeApp = useStoreApp();
  const printRef = useRef(null);
  const [canvasData, setCanvasData] = useState<ComponentTypeMulti[]>([]);
  const [models, setModels] = React.useState<ModelType[]>([])
  const [modelId, setModelId] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({
    width: "100%",
    height: "100%",
    border: "2px dashed #ccc",
    position: "relative",
    background: "white",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    margin: "auto",
  });

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    const init = async () => {
      await getCanvasData();
      await getPageDimensions();
      await setPageForPrint();
      await setPageForPreview();
    };
    init();
  }, [storeApp, storeApp.dimensionId, pageWidth, pageHeight, models]);

  React.useEffect(() => {
    _getModels(setModels)
  }, [])

  /* Functions
   *******************************************************************************************/
  const getCanvasData = async () => {
    const selectedSchema = models.find(
      (p) =>
        p.dimensionId === storeApp.dimensionId &&
        p.templateId === storeApp.templateId &&
        p.categoryId === storeApp.categoryId
    );
    setCanvasData(selectedSchema?.canvas as ComponentTypeMulti[]);
    setModelId(selectedSchema?.id ?? 0);
  };

  const getPageDimensions = async () => {
    const selectedDimension = dimensions.find(
      (d) => d.id === storeApp.dimensionId
    );
    setPageHeight(selectedDimension?.height ?? 0);
    setPageWidth(selectedDimension?.width ?? 0);
  };

  const setPageForPrint = async () => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
            size: ${pageWidth} ${pageHeight};
            margin: 0 !important;
            padding: 0 !important;
            position: absolute;
            top: 0 !important;
            left: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  };

  const setPageForPreview = async () => {
    const maxPreviewHeight = pageHeight < 100 ? 150 : 500; // en pixels
    const scaleFactor = maxPreviewHeight / pageHeight;

    setPreviewStyle({
      width: `${pageWidth * scaleFactor}px`,
      height: `${pageHeight * scaleFactor}px`,
      border: canvasData?.length < 0 ? "2px dashed #ccc" : "none",
      position: "relative",
      background: "white",
      boxShadow: canvasData?.length < 0 ? "0 0 5px rgba(0,0,0,0.2)" : "none",
      margin: "auto",
    });
  };

  const handleExportToPDF = async () => {
    if (!printRef.current) return;

    try {
      // Capture le contenu de l'aperçu avec une meilleure résolution
      const canvas = await html2canvas(printRef.current, {
        scale: 4, // Augmente significativement la qualité
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: false,
      });

      // Crée un nouveau PDF avec les dimensions en millimètres
      const pdf = new jsPDF({
        orientation: pageHeight > pageWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pageHeight, pageWidth],
      });

      // Convertit le canvas en image et l'ajoute au PDF
      const imgData = canvas.toDataURL("image/png", 1.0); // Qualité maximale
      const imgWidth = pageWidth;
      const imgHeight = pageHeight;

      // Ajoute l'image au PDF avec les dimensions exactes
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      // pdf.save(template?.templateId?.name + ".pdf");
      pdf.save("document.pdf");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };


  /* Render
   *******************************************************************************************/
  return (
    <Container fluid className="bg-light px-0 height-container">
      <Row className="gx-0 d-flex h-100">
        <Col
          xs={9}
          className="d-flex flex-column justify-content-center align-items-center p-4 bg-body-secondary"
        >
          <h4>Aperçu</h4>
          <small>Modèle : #{modelId}</small>
          <div
            id="canvas"
            className="canvas mt-4"
            ref={printRef}
            style={previewStyle}
          >
            {canvasData?.map((component: ComponentTypeMulti, index: number) => {
              if (component.type === "price") {
                const priceComp = component as PrincipalPriceComponentType;
                const numberValue = parseInt(
                  priceComp?.text.replace(/\D/g, ""),
                  10
                );
                const formattedNumber = !isNaN(numberValue)
                  ? _thousandSeparator(numberValue)
                  : priceComp?.text;

                const baseFontSize = priceComp?.fontSize;
                const numLength = formattedNumber.length;

                let lengthAdjustmentFactor = 1;
                let positionAdjustmentFactor = 0;

                // Condition de la taille du prix en fonction du format et du nombre de chiffres
                if (pageWidth < pageHeight) {
                  if (numLength <= 3) {
                    lengthAdjustmentFactor = 1.8;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      baseFontSize / lengthAdjustmentFactor;
                  }

                  if (numLength === 5) {
                    lengthAdjustmentFactor = 1.5;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.5;
                  }

                  if (numLength === 6) {
                    lengthAdjustmentFactor = 1.25;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.1;
                  }

                  if (numLength === 7) {
                    lengthAdjustmentFactor = 1.05;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.00005;
                  }
                } else if (pageWidth > pageHeight) {
                  if (numLength <= 3) {
                    lengthAdjustmentFactor = 1;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.005;
                  }

                  if (numLength === 5) {
                    lengthAdjustmentFactor = 1.2;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.2;
                  }

                  if (numLength === 6) {
                    lengthAdjustmentFactor = 1.05;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.01;
                  }

                  if (numLength === 7) {
                    lengthAdjustmentFactor = 0.9;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.001;
                  }
                } else if (pageWidth === pageHeight) {
                  if (numLength <= 3) {
                    lengthAdjustmentFactor = 1.5;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.6;
                  }

                  if (numLength === 5) {
                    lengthAdjustmentFactor = 1.2;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.2;
                  }

                  if (numLength === 6) {
                    lengthAdjustmentFactor = 1.05;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.01;
                  }

                  if (numLength === 7) {
                    lengthAdjustmentFactor = 1.15;
                    positionAdjustmentFactor =
                      (priceComp?.bottom ?? 0) -
                      (baseFontSize / lengthAdjustmentFactor) * 0.001;
                  }
                }
                console.log(positionAdjustmentFactor)
                const adjustedFontSize = baseFontSize * lengthAdjustmentFactor;

                return (
                  <div
                    onClick={() => {
                      console.log("taille initial : " + adjustedFontSize);
                      console.log(priceComp);
                    
                    }}
                    key={index}
                    className={`absolute cursor-move pointer`}
                    style={{
                      position: "absolute",
                      bottom: `${priceComp?.bottom ?? 0}px`,
                      // bottom: `${positionAdjustmentFactor}px`,
                      right: `${priceComp?.right ?? 0}px`,
                      // width: "100%",
                      height: "auto",
                      fontFamily: priceComp?.fontFamily,
                      fontSize: `${priceComp?.fontSize}px`,
                      // fontSize: `${adjustedFontSize}px`,
                      fontWeight: priceComp?.fontWeight,
                      color: priceComp?.color,
                      wordBreak: "break-word",
                      transform: `rotate(${priceComp?.rotation}deg)`,
                      // padding: `0 ${10}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          textDecoration: priceComp?.textDecoration ?? "none",
                          // letterSpacing: `0.02em`,
                        }}
                      >
                        {formattedNumber}
                      </span>
                      <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>
                        F
                      </sup>
                    </div>
                  </div>
                );
              }
              if (component.type === "number") {
                console.log(component.type)
                const numberComp = component as NumberComponentType;
                const numberValue = parseInt(
                  numberComp.text.replace(/\D/g, ""),
                  10
                );
                const formattedNumber = !isNaN(numberValue)
                  ? _thousandSeparator(numberValue)
                  : numberComp.text;
                const baseFontSize = numberComp.fontSize ?? 16;

                const numLength = formattedNumber.length;
                let lengthAdjustmentFactor = 1;
                let letterSpacing = 0.15;
                if (pageHeight > 100) {
                  if (numLength > 7) {
                    lengthAdjustmentFactor = 0.5;
                    letterSpacing = 0.05;
                  } else if (numLength > 5) {
                    lengthAdjustmentFactor = 0.7;
                    letterSpacing = 0.05;
                  }
                } else {
                  if (numLength > 8) {
                    lengthAdjustmentFactor = 0.9;
                    letterSpacing = 0.04;
                  } else if (numLength > 6) {
                    letterSpacing = 0.05;
                  }
                }
                const adjustedFontSize = baseFontSize * lengthAdjustmentFactor;
                console.log(letterSpacing)
                console.log(adjustedFontSize)
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move pointer`}
                    style={{
                      position: "absolute",
                      bottom: `${numberComp.bottom ?? 0}px`,
                      right: `${numberComp.right ?? 0}px`,
                      minWidth: `${20}px`,
                      minHeight: `${10}px`,
                      fontFamily: numberComp?.fontFamily,
                      // fontSize: `${adjustedFontSize}px`,
                      fontSize: numberComp?.fontSize,
                      fontWeight: numberComp.fontWeight,
                      color: numberComp.color,
                      wordBreak: "break-word",
                      transform: `rotate(${numberComp.rotation}deg)`,
                      padding: `0 ${5}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          textDecoration: numberComp.textDecoration ?? "none",
                          // letterSpacing: `${letterSpacing}em`,
                        }}
                      >
                        {formattedNumber}
                      </span>
                      <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>
                        F
                      </sup>
                    </div>
                  </div>
                );
              }
              if (
                component.type === "text" ||
                component.type === "enableText"
              ) {
                const textComp = component as TextComponentType;
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move pointer text-end`}
                    style={{
                      position: "absolute",
                      top: `${textComp?.top ?? 0}px`,
                      left: `${textComp?.left ?? 0}px`,
                      fontSize: `${textComp?.fontSize ?? 16}px`,
                      fontWeight: textComp?.fontWeight,
                      color: textComp?.color,
                      minWidth: `${20}px`,
                      minHeight: `${10}px`,
                      wordBreak: "break-word",
                      transform: `rotate(${textComp?.rotation}deg)`,
                      padding: `0 ${5}px`,
                    }}
                  >
                    {textComp?.text}
                  </div>
                );
              }
              if (component.type === "background-color") {
                const bgComp = component as BackgroundComponentType;
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move`}
                    style={{
                      position: "absolute",
                      top: `${bgComp.top ?? 0}px`,
                      left: `${bgComp.left ?? 0}px`,
                      width: `${bgComp.width ?? 0}px`,
                      height: `${bgComp.height ?? 0}px`,
                      backgroundColor: bgComp.backgroundColor,
                    }}
                  ></div>
                );
              }
              if (component.type === "header") {
                const headerComp = component as HeaderComponentType;
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move`}
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: `${headerComp.top ?? 0}px`,
                      left: `${headerComp.left ?? 0}px`,
                      width: `${headerComp.width ?? 0}px`,
                      height: `${headerComp.height ?? 0}px`,
                      backgroundColor: headerComp.backgroundColor,
                      padding:
                      headerComp?.width &&
                      headerComp?.height &&
                      headerComp?.width > headerComp?.height
                        ? '5%'
                        : '1%',
                    }}
                  >
                     <img
              src={headerComp.src ? headerComp.src : undefined}
              alt=''
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
                  </div>
                );
              }
              if (component.type === "image") {
                const imgComp = component as ImageComponentType;
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move`}
                    style={{
                      position: "absolute",
                      top: `${imgComp.top ?? 0}px`,
                      left: `${imgComp.left ?? 0}px`,
                    }}
                  >
                    <img
                      src={imgComp?.src ?? ""}
                      alt={imgComp?.src ?? ""}
                      style={{
                        width: `${imgComp.width ?? 0}px`,
                        height: `auto`,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </Col>
        <Col xs={3} className="bg-white border-start border-bottom p-4">
          <h4>Formulaire d'édition</h4>
          {canvasData?.map((component: ComponentTypeMulti, index: number) => {
            if (
              component.type === "text" ||
              component.type === "number" ||
              component.type === "price"
            ) {
              const comp = component as
                | TextComponentType
                | NumberComponentType
                | PrincipalPriceComponentType;
              // const promoPrice =
              //   component.type === "price"
              //     ? "Prix remisé"
              //     : component.type === "number"
              //     ? "Prix d'origine"
              //     : "";
              return (
                <React.Fragment key={index}>
                  <Form.Group
                    className="text-start mb-3"
                    controlId="title"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Entrez la valeur"
                        value={comp.text || ""}
                        onChange={(e) => {
                          const updatedCanvas = [...canvasData];
                          updatedCanvas[index] = {
                            ...updatedCanvas[index],
                            text: e.target.value,
                          };
                          setCanvasData(updatedCanvas);
                        }}
                      />
                      {/* {component.type === "price" && ( */}
                      <i
                        className="fas fa-cog fs-5 cursor-pointer"
                        onClick={() => {
                          const updatedCanvas = [...canvasData];
                          updatedCanvas[index] = {
                            ...updatedCanvas[index],
                            showCustomValue:
                              !updatedCanvas[index]?.showCustomValue,
                          };
                          setCanvasData(updatedCanvas);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      {/* )} */}
                    </div>
                  </Form.Group>
                  {/* {component.type === "price" && comp.showCustomValue && ( */}
                  {comp.showCustomValue && (
                    <div className="custom-value d-flex gap-2 mb-3">
                      {/* Size */}
                      <Form.Group
                        className="text-center mb-3"
                        controlId="fontSize"
                      >
                        <Form.Label>
                          <i className="fas fa-text-height"></i>
                        </Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Range
                            min={10}
                            max={pageWidth * 2}
                            step={1}
                            value={comp.fontSize || 0}
                            onChange={(e) => {
                              const updatedCanvas = [...canvasData];
                              updatedCanvas[index] = {
                                ...updatedCanvas[index],
                                fontSize: parseInt(e.target.value) || 0,
                              };
                              setCanvasData(updatedCanvas);
                            }}
                          />
                        </div>
                      </Form.Group>
                      {/* Up/Down position */}
                      {comp.type !== "price" && comp.type !== "number" ? (
                        <Form.Group
                          className="text-center mb-3"
                          controlId="positionY"
                        >
                          <Form.Label>
                            <i className="fas fa-arrows-up-down"></i>
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Range
                              min={0}
                              max={1000}
                              step={1}
                              value={comp.top || 0}
                              onChange={(e) => {
                                const updatedCanvas = [...canvasData];
                                updatedCanvas[index] = {
                                  ...updatedCanvas[index],
                                  top: parseInt(e.target.value) || 0,
                                };
                                setCanvasData(updatedCanvas);
                              }}
                            />
                          </div>
                        </Form.Group>
                      ) : (
                        <Form.Group
                          className="text-center mb-3"
                          controlId="positionY"
                        >
                          <Form.Label>
                            <i className="fas fa-arrows-up-down"></i>
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Range
                              min={0}
                              max={pageHeight * 2}
                              step={1}
                              value={comp.bottom || 0}
                              onChange={(e) => {
                                const updatedCanvas = [...canvasData];
                                updatedCanvas[index] = {
                                  ...updatedCanvas[index],
                                  bottom: parseInt(e.target.value) || 0,
                                };
                                setCanvasData(updatedCanvas);
                              }}
                            />
                          </div>
                        </Form.Group>
                      )}
                      {/* left/Right position */}
                      {comp.type !== "price" && comp.type !== "number" ? (
                        <Form.Group
                          className="text-center mb-3"
                          controlId="positionX"
                        >
                          <Form.Label>
                            <i className="fas fa-arrows-left-right"></i>
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Range
                              min={-pageWidth * 2}
                              max={pageWidth * 2}
                              step={1}
                              value={comp.left || 0}
                              onChange={(e) => {
                                const updatedCanvas = [...canvasData];
                                updatedCanvas[index] = {
                                  ...updatedCanvas[index],
                                  left: parseInt(e.target.value) || 0,
                                };
                                setCanvasData(updatedCanvas);
                              }}
                            />
                          </div>
                        </Form.Group>
                      ) : (
                        <Form.Group
                          className="text-center mb-3"
                          controlId="positionX"
                        >
                          <Form.Label>
                            <i className="fas fa-arrows-left-right"></i>
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Range
                              min={-pageWidth * 2}
                              max={pageWidth * 2}
                              step={1}
                              value={comp.right || 0}
                              onChange={(e) => {
                                const updatedCanvas = [...canvasData];
                                updatedCanvas[index] = {
                                  ...updatedCanvas[index],
                                  right: parseInt(e.target.value) || 0,
                                };
                                setCanvasData(updatedCanvas);
                              }}
                            />
                          </div>
                        </Form.Group>
                      )}
                    </div>
                  )}
                </ React.Fragment>
              );
            }
          })}
          <Button
            variant="primary"
            onClick={handleExportToPDF}
            className="mt-4"
          >
            Génerer le PDF
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
