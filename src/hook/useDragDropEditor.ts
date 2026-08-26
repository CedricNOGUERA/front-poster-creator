import {
  createComponent,
  createGroupTexts,
} from "@/helpers/DragDropEditor/createGroupText";
import { getDropPosition } from "@/helpers/DragDropEditor/getDropPosition";
import dimensionsServiceInstance from "@/services/DimensionsService";
import modelsServiceInstance from "@/services/modelsServices";
import templatesServiceInstance from "@/services/TemplatesServices";
import useStoreApp from "@/stores/storeApp";
import { CategoriesType } from "@/types/CategoriesType";
import {
  BackgroundComponentType,
  ComponentTypeMulti,
  HorizontalLineComponentType,
  ImageComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
  VerticalLineComponentType,
} from "@/types/ComponentType";
import { DimensionType } from "@/types/DimensionType";
import {
  FeedBackSatateType,
  NewTemplateType,
  ToastDataType,
} from "@/types/DiversType";
import { ModelType } from "@/types/modelType";
import { TemplateType } from "@/types/TemplatesType";
import {
  _getCategoryById,
  _getModels,
  _getTemplates,
} from "@/utils/apiFunctions";
import { _generateInitalComponent } from "@/utils/functions";
import { _showToast } from "@/utils/notifications";
import { AxiosError } from "axios";
import html2canvas from "html2canvas";
import React from "react";
import { useOutletContext } from "react-router-dom";

interface ContextInlineDragDropEditorType {
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  toggleShow: () => void;
  feedBackState: FeedBackSatateType;
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>;
  hasModel: boolean;
  setHasModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useDragDropEditor() {
  /* States
   *******************************************************************************************/
  const { setToastData, toggleShow, setFeedBackState, hasModel, setHasModel } =
    useOutletContext<ContextInlineDragDropEditorType>();

  const storeApp = useStoreApp();
  const idTemplate = storeApp.templateId;
  const [isErrorModel, setIsErrorModel] = React.useState<boolean>(false);
  const [components, setComponents] = React.useState<ComponentTypeMulti[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [dimensions, setDimensions] = React.useState<DimensionType[]>([]);
  const [selectedDimension, setSelectedDimension] = React.useState<number>(0);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoriesType>({} as CategoriesType);
  const [models, setModels] = React.useState<ModelType[]>([]);
  const [modelId, setModelId] = React.useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [dimensionFactor, setDimensionFactor] = React.useState<number | null>(
    null,
  );
  const [copiedComponent, setCopiedComponent] =
    React.useState<ComponentTypeMulti>({} as ComponentTypeMulti);

  const [template, setTemplate] = React.useState<TemplateType[]>([]);
  const [imageName, setImageName] = React.useState<string>("");
  const [newTemplateState, setNewTemplateState] =
    React.useState<NewTemplateType>({
      idShop: undefined,
      idCategory: undefined,
      nameCategory: "",
      nameTemplate: "",
      width: 600,
      height: 600,
      orientation: "",
    });
  const h = newTemplateState.height && newTemplateState.height;
  const maxPreviewHeight = h && h < 98 ? 150 : 500;
  const posterRef = React.useRef<HTMLDivElement | null>(null);

  const [showValidateModel, setShowValidateModel] =
    React.useState<boolean>(false);
  const handleCloseValidateModel = () => {
    setImageName("");
    setShowValidateModel(false);
  };
  const handleShowValidateModel = () => setShowValidateModel(true);

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getTemplates(setTemplate);
    _getModels(setModels);
    getDimensions();
  }, []);

  React.useEffect(() => {
    _getCategoryById(storeApp?.categoryId, setSelectedCategory);
    setSelectedDimension(storeApp?.dimensionId || 0);
  }, [
    setToastData,
    storeApp?.canvasId,
    storeApp?.dimensionId,
    toggleShow,
    storeApp?.categoryId,
  ]);

  React.useEffect(() => {
    // copyPaste()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        // Copier : si un élément est sélectionné
        if (selectedIndex !== null && components[selectedIndex]) {
          setCopiedComponent({ ...components[selectedIndex] });
        }
      }

      if (e.ctrlKey && e.key === "v") {
        // Coller
        if (
          copiedComponent &&
          copiedComponent.type !== "background-color" &&
          copiedComponent.type !== "header"
        ) {
          const textComp = copiedComponent as TextComponentType;
          const numberComp = copiedComponent as NumberComponentType;
          const newComp = {
            ...copiedComponent,
            top: textComp.top !== undefined ? textComp.top + 10 : undefined,
            left: textComp.left !== undefined ? textComp.left + 10 : undefined,
            bottom:
              numberComp.bottom !== undefined ? numberComp.bottom : undefined,
            right:
              numberComp.right !== undefined ? numberComp.right : undefined,
          };

          setComponents((prev) => [...prev, newComp as ComponentTypeMulti]);
          setSelectedIndex(components.length);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [components, selectedIndex, copiedComponent]);

  React.useEffect(() => {
    const hasTemplate = template.find((model) => model.name === imageName);
    if (hasTemplate) {
      setHasModel(
        models.some(
          (model) =>
            model.categoryId === storeApp.categoryId &&
            model.dimensionId === storeApp.dimensionId &&
            model.templateId === hasTemplate.id,
        ),
      );
    }

    const idModel = models.find(
      (model) =>
        model.categoryId === storeApp.categoryId &&
        model.dimensionId === storeApp.dimensionId &&
        hasTemplate?.id === model.templateId,
    )?.id;

    if (idModel) {
      setModelId(idModel);
    }
  }, [imageName, storeApp, models, template, setHasModel]);

  React.useEffect(() => {
    _generateInitalComponent(
      selectedCategory.canvas,
      storeApp,
      newTemplateState,
      setNewTemplateState,
      maxPreviewHeight,
      h,
      components,
      setComponents,
      setDimensionFactor,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    storeApp,
    maxPreviewHeight,
    h,
    storeApp,
    models,
    selectedDimension,
  ]);

  /* Functions
   *******************************************************************************************/
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("componentType");

    const src = e.dataTransfer.getData("componentSrc");

    const canvasElement = posterRef.current;

    if (!canvasElement) {
      console.error("Canvas ref is null");
      return;
    }

    const { top, left, right, bottom } = getDropPosition(e, canvasElement);

    if (type === "group") {
      const group = createGroupTexts(top, left);

      setComponents((prev) => [...prev, ...group]);

      setSelectedIndex(components.length);

      return;
    }

    const newComponent = createComponent({
      type,
      src,
      top,
      left,
      right,
      bottom,
    });

    if (!newComponent) {
      console.error("Unknown component:", type);
      return;
    }

    setComponents((prev) => [...prev, newComponent]);

    setSelectedIndex(components.length);
  };


  const handleDragOnCanvas = React.useCallback(
    (
      e: React.MouseEvent<HTMLDivElement | HTMLImageElement, MouseEvent>,
      index: number,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;

      const comp = components[index] as ComponentTypeMulti;
      // Initialiser les positions différemment selon le type
      let initialLeft: number | string = 0;
      let initialTop: number | string = 0;
      let initialRight = 0;
      let initialBottom = 0;

      if (comp.type === "number") {
        const compNumber = comp as NumberComponentType;
        initialRight = compNumber.right || 0;
        initialBottom = compNumber.bottom || 0;
      } else if (comp.type === "price") {
        const compPrice = comp as PrincipalPriceComponentType;
        initialRight = compPrice.right || 0;
        initialBottom = compPrice.bottom || 0;
      } else {
        initialLeft =
          (comp as Exclude<ComponentTypeMulti, NumberComponentType>).left || 0;
        initialTop =
          (comp as Exclude<ComponentTypeMulti, NumberComponentType>).top || 0;
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX: number = moveEvent.clientX - startX;
        const deltaY: number = moveEvent.clientY - startY;

        if (comp.type === "number" || comp.type === "price") {
          const updatedComponents = [...components];

          updatedComponents[index] = {
            ...comp,
            right: initialRight - deltaX,
            bottom: initialBottom - deltaY,
          };
          setComponents(updatedComponents);
        } else {
          const updatedComponents = [...components];

          updatedComponents[index] = {
            ...comp,
            left: initialLeft + deltaX,
            top: initialTop + deltaY,
          };
          setComponents(updatedComponents);
        }
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [components],
  );

  const updateComponent = React.useCallback(
    (updatedFields: Partial<ComponentTypeMulti>) => {
      if (selectedIndex === null) return;

      setComponents((prevComponents) => {
        const updated = [...prevComponents];
        if (updated[selectedIndex]) {
          updated[selectedIndex] = {
            ...updated[selectedIndex],
            ...updatedFields,
          };
        }
        return updated;
      });
    },
    [selectedIndex, setComponents],
  );

  const getStyleFromComponent = React.useCallback(
    (comp: ComponentTypeMulti, isSelected: boolean) => {
      const baseStyle: React.CSSProperties = {
        position: "absolute",
        wordBreak: "break-word",
      };
     const priceStyle ={ bottom: `${
              (comp as PrincipalPriceComponentType | NumberComponentType)
                .bottom ?? 0
            }px`,
            right: `${
              (comp as PrincipalPriceComponentType | NumberComponentType)
                .right ?? 0
            }px`,
            fontFamily:
              (comp as PrincipalPriceComponentType | NumberComponentType)
                .fontFamily || "Impact",
            fontSize: (
              comp as PrincipalPriceComponentType | NumberComponentType
            ).fontSize,
            fontWeight: (
              comp as PrincipalPriceComponentType | NumberComponentType
            ).fontWeight,
            color: (comp as PrincipalPriceComponentType | NumberComponentType)
              .color,
            minWidth: "20px",
            minHeight: "10px",
            borderBottom: isSelected ? "1px gray dashed" : "",
            cursor: "move",}

      switch (comp.type) {
        case "price":
        case "number":
          return {
            ...baseStyle,
            ...priceStyle,
            // bottom: `${
            //   (comp as PrincipalPriceComponentType | NumberComponentType)
            //     .bottom ?? 0
            // }px`,
            // right: `${
            //   (comp as PrincipalPriceComponentType | NumberComponentType)
            //     .right ?? 0
            // }px`,
            // fontFamily:
            //   (comp as PrincipalPriceComponentType | NumberComponentType)
            //     .fontFamily || "Impact",
            // fontSize: (
            //   comp as PrincipalPriceComponentType | NumberComponentType
            // ).fontSize,
            // fontWeight: (
            //   comp as PrincipalPriceComponentType | NumberComponentType
            // ).fontWeight,
            // color: (comp as PrincipalPriceComponentType | NumberComponentType)
            //   .color,
            // minWidth: "20px",
            // minHeight: "10px",
            // borderBottom: isSelected ? "1px gray dashed" : "",
            // cursor: "move",
          };
        case "text":
        case "enableText":
          return {
            ...baseStyle,
            top: `${(comp as TextComponentType).top ?? 0}px`,
            left: `${(comp as TextComponentType).left ?? 0}px`,
            fontFamily: "Mulish",
            fontSize: (comp as TextComponentType).fontSize,
            fontWeight: (comp as TextComponentType).fontWeight,
            transform: `rotate(${(comp as TextComponentType).rotation ?? 0}deg)`,
            color: (comp as TextComponentType).color,
            minWidth: "20px",
            minHeight: "10px",
            borderBottom: isSelected ? "1px gray dashed" : "",
            cursor: "move",
            lineHeight: `${(comp as TextComponentType).fontSize}px`,
          };
        case "background-color":
          return {
            ...baseStyle,
            top: `${(comp as BackgroundComponentType).top ?? 0}px`,
            left: `${(comp as BackgroundComponentType).left ?? 0}px`,
            width: (comp as BackgroundComponentType).width,
            height: (comp as BackgroundComponentType).height,
            backgroundColor: (comp as BackgroundComponentType).backgroundColor,
          };
        case "header":
          return {
            ...baseStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: `${(comp as BackgroundComponentType).top ?? 0}px`,
            left: `${(comp as BackgroundComponentType).left ?? 0}px`,
            width: (comp as BackgroundComponentType).width,
            height: (comp as BackgroundComponentType).height,
            backgroundColor: (comp as BackgroundComponentType).backgroundColor,
            padding:
              newTemplateState?.width &&
              newTemplateState?.height &&
              newTemplateState?.width < newTemplateState?.height
                ? "5%"
                : "1%",
          };
        case "image":
          return {
            ...baseStyle,
            top: `${(comp as ImageComponentType).top ?? 0}px`,
            left: `${(comp as ImageComponentType).left ?? 0}px`,
            width: `${(comp as ImageComponentType).width}px`,
            height: "auto",
            border: isSelected ? "1px gray dashed" : "",
            cursor: "move",
          };
        case "horizontalLine":
          return {
            ...baseStyle,
            top: `${(comp as HorizontalLineComponentType).top ?? 0}px`,
            left: `${(comp as HorizontalLineComponentType).left ?? 0}px`,
            width: `${(comp as HorizontalLineComponentType).width}px`,
            height: `${(comp as HorizontalLineComponentType).thickness}px`,
            backgroundColor: (comp as HorizontalLineComponentType).color,
            border: isSelected ? "1px gray dashed" : "",
            cursor: "move",
          };
        case "verticalLine":
          return {
            ...baseStyle,
            top: `${(comp as VerticalLineComponentType).top ?? 0}px`,
            left: `${(comp as VerticalLineComponentType).left ?? 0}px`,
            height: `${(comp as VerticalLineComponentType).height}px`,
            width: `${(comp as VerticalLineComponentType).thickness}px`,
            backgroundColor: (comp as VerticalLineComponentType).color,
            border: isSelected ? "1px gray dashed" : "",
            cursor: "move",
          };
        default:
          return baseStyle;
      }
    },
    [newTemplateState?.width, newTemplateState?.height],
  );

  const addModel = async (name: string) => {
    if (name === "") {
      setIsErrorModel(true);
      return;
    }

    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement",
    }));

    // Formattage du nom de l'image
    const imageName = modelsServiceInstance.formattedModelPicture(name);

    try {
      const canvasElement = posterRef.current;
      if (!canvasElement) {
        console.error("Élément canvas non trouvé");
        return;
      }

      // ✅ Utiliser html2canvas pour capturer l'affiche
      const canvas = await html2canvas(canvasElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(
            `[data-canvas-id="${modelId}"]`,
          );
          if (clonedElement) {
            // Ajuster les styles si nécessaire
          }
        },
      });

      // ✅ Convertir le canvas en blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          1.0,
        );
      });

      if (!blob) {
        console.error("Erreur de génération de l'image");
        return;
      }

      // Vérifier l'existence d'une miniature pour ce template
      const imageExists = template.some(
        (img: TemplateType) => img.image === imageName.trim(),
      );

      const tempData = template.find(
        (img: TemplateType) => img.image === imageName.trim(),
      );
      const imageModel = tempData?.image || imageName;

      // Préparer les données du modèle
      const newModelData = {
        image: imageModel,
        categoryId: storeApp.categoryId,
        dimensionId: storeApp.dimensionId,
        canvas: components,
      };

      // Préparer le FormData pour le modèle
      const modelFormData = new FormData();
      modelFormData.append("image", blob, imageName);
      modelFormData.append("data", JSON.stringify(newModelData));

      if (hasModel && imageExists) {
        // ========== MODE ÉDITION ==========

        // FormData pour le patch du modèle
        const patchFormData = new FormData();
        patchFormData.append("image", blob, imageModel);
        patchFormData.append("data", JSON.stringify(components));

        const responseModel = await modelsServiceInstance.patchModel(
          modelId,
          patchFormData,
        );

        if (responseModel.status === 200) {
          _showToast(
            true,
            "Model modifiée avec succès !",
            setToastData,
            toggleShow,
            3000,
          );
        }

        // Mettre à jour la miniature du template si nécessaire
        if (storeApp.dimensionId === 9) {
          const thumbnailFormData = new FormData();
          thumbnailFormData.append("image", blob, imageName);

          const responseThumbnail =
            await templatesServiceInstance.patchImageTemplate(
              storeApp.categoryId,
              imageName,
              thumbnailFormData,
            );

          if (responseThumbnail?.ok) {
            _showToast(
              true,
              "Miniature modifiée avec succès !",
              setToastData,
              toggleShow,
              3000,
            );
          }
        }

        handleCloseValidateModel();
        _showToast(
          true,
          "Modèle modifié avec succès !",
          setToastData,
          toggleShow,
          3000,
        );
        setIsErrorModel(false);
      } else {
        // ========== MODE CRÉATION ==========

        // 1. Créer le template avec miniature (si nouveau)
        if (!imageExists) {
          const templateFormData = new FormData();
          templateFormData.append(
            "data",
            JSON.stringify({
              name: name,
              image: imageName,
              categoryId: storeApp.categoryId,
              shopIds: selectedCategory.shopIds,
            }),
          );
          templateFormData.append("image", blob, imageName);

          //✅ Template créé avec miniature
          await templatesServiceInstance.postTemplate(templateFormData);
        }

        // 2. Créer le modèle
        const responseModel =
          await modelsServiceInstance.postModel(modelFormData);

        if (responseModel.ok) {
          handleCloseValidateModel();

          // Rafraîchir les données
          await Promise.all([
            _getTemplates(setTemplate),
            _getModels(setModels),
          ]);

          _showToast(
            true,
            "Modèle ajouté avec succès !",
            setToastData,
            toggleShow,
            3000,
          );

          setIsErrorModel(false);
        } else {
          const err = await responseModel.json();
          throw new Error(err?.error || "Erreur serveur");
        }
      }
    } catch (error: unknown) {
      console.error("Error adding model:", error);
      if (error instanceof AxiosError) {
        _showToast(
          false,
          error instanceof Error
            ? error.response?.data.error
            : "Une erreur est survenue lors de la validation du modèle.",
          setToastData,
          toggleShow,
          3000,
        );
      }
    } finally {
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "",
      }));
    }
  };

  const getDimensions = async () => {
        try {
            const response = await dimensionsServiceInstance.getDimensions();
            setDimensions(response as DimensionType[]);
        } catch (error) {
            console.error("Erreur lors de la récupération des dimensions :", error);
        }
  }

  /* UseMemo
   *******************************************************************************************/

  return {
    //states
    components,
    setComponents,
    imageName,
    setImageName,
    idTemplate,
    template,
    setTemplate,
    isErrorModel,
    hasModel,
    selectedCategory,
    selectedDimension,
    setSelectedDimension,
    dimensionFactor,
    selectedIndex,
    hoveredIndex,
    editingIndex,
    setSelectedIndex,
    setEditingIndex,
    setHoveredIndex,
    posterRef,
    newTemplateState,
    setNewTemplateState,
    maxPreviewHeight,
    dimensions,
    //Handlers
    handleDragOnCanvas,
    getStyleFromComponent,
    addModel,
    updateComponent,
    showValidateModel,
    handleDrop,
    handleCloseValidateModel,
    handleShowValidateModel,
  };
}
