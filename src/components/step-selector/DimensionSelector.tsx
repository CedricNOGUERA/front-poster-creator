import dimensions from "@/data/dimensions.json";
import useStoreApp from "@/stores/storeApp";
import { _getImagesModels, _getModels, _getTemplates } from "@/utils/apiFunctions";
import { ImagemodelType, ModelType } from "@/types/modelType";
import React from "react";
import { TemplateType } from "@/types/TemplatesType";
import { FaImage } from "react-icons/fa6";

type Props = {
  title: string;
};

export const DimensionSelector = ({ title }: Props) => {
  /* Variables / States
   *******************************************************************************************/
  const storeApp = useStoreApp();
  const maxWidth = Math.max(...dimensions.map((d) => d.width));
  const maxHeight = Math.max(...dimensions.map((d) => d.height));
  const [model, setModel] = React.useState<ModelType[]>([]);
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>({} as TemplateType);
  const [imagesmodel, setImagesModel] = React.useState<ImagemodelType[]>([])


  // Contrainte d'affichage
  const maxDisplayWidth = 260;
  const maxDisplayHeight = 180;

  const scaleX = maxDisplayWidth / maxWidth;
  const scaleY = maxDisplayHeight / maxHeight;
  const baseScale = Math.min(scaleX, scaleY);



  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getModels(setModel)
    _getTemplates(setTemplates)
    _getImagesModels(storeApp.categoryId, setImagesModel)
  }, [])
  React.useEffect(() => {
    const filteredTemplate = templates.filter((temp) => temp.id === storeApp.templateId)[0]
    setSelectedTemplate(filteredTemplate)
  }, [templates, storeApp.templateId])


  /* Functions
   *******************************************************************************************/
  const onHandleDimension = (id: number) => {
    storeApp.setDimensionId(id);
    storeApp.nextStep();
  };


  /* Render
   *******************************************************************************************/
  return (
    <>
      <h2 className="fs-4 fw-bold text-primary">{title}</h2>
      <small>({selectedTemplate?.name})</small>
      <div className="list-dimension d-flex flex-wrap justify-content-center align-items-center mt-5 mb-5">
        {dimensions.map((dimension) => {
          let scaledWidth = dimension.width * baseScale;
          let scaledHeight = dimension.height * baseScale;

          // Si largeur < 300px (même après scaling), on applique un petit "zoom"
          if (scaledWidth <= 300) {
            const zoomFactor = 1.2;
            scaledWidth *= zoomFactor;
            scaledHeight *= zoomFactor;
          }
          if (dimension.height <= 250) {
            const zoomFactor = 5;
            scaledWidth *= zoomFactor;
            scaledHeight *= zoomFactor;
          }
          const modelAvailable = model && model.find((model) => model.dimensionId === dimension.id && model.templateId === storeApp.templateId  && model.categoryId === storeApp.categoryId)

          return (
            <div
              key={dimension.id}
              className={`dimension-card hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center ${modelAvailable ? "border-primary" : "border-danger"}`}
              onClick={() => {
                if(modelAvailable){
                onHandleDimension(dimension.id)
              }else{
                alert("Ce modèle n'est pas disponible pour cette dimension")
              }
            }
            }
              style={{
                width: "300px",
                minHeight: "220px",
              }}
            >
              {imagesmodel?.find((img) => img.modelId === modelAvailable?.id)? (

                  
                    <div className="d-flex justify-content-center align-items-center mb-2">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/modelMiniature/${imagesmodel.find((img) => img.modelId === modelAvailable?.id)?.modelId}/${imagesmodel.find((img) => img.modelId === modelAvailable?.id)?.name}`}
                    alt="Image du modèle"
                    style={{
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                      objectFit: "cover",
                    }}
                  />
                </div>
                  )
               :(
                  <div
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  border: "2px dashed #aaa",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                  transition: "transform 0.3s ease",
                }}
              >
                <span className="fw-semibold">
                  <FaImage className="text-secondary" />
                </span>
              </div>
        )}

           
       
            
              {/* <div
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  border: "2px dashed #aaa",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                  transition: "transform 0.3s ease",
                }}
              >
                <span className="fw-semibold">
                  <FaImage className="text-secondary" />
                </span>
              </div> */}
              <p className="mt-2 text-center fw-bold fs-6">
                {dimension.helper_dimensions}
              </p>
              <small>{dimension.orientation}</small>
            </div>

          );
        })}
      </div>
    </>
  );
};
