import {
  ComponentTypeMulti,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
} from "@/types/ComponentType";

export const updateComponent = (
  updates: Partial<ComponentTypeMulti>,
  canvasData: ComponentTypeMulti[],
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>,
  index: number,
) => {
  const updatedCanvas = [...canvasData];
  updatedCanvas[index] = {
    ...updatedCanvas[index],
    ...updates,
  };
  setCanvasData(updatedCanvas);
};

export const movePosition = (
  direction: "up" | "down" | "left" | "right",
  step: number = 5,
  component: NumberComponentType | TextComponentType | PrincipalPriceComponentType,
  canvasData: ComponentTypeMulti[],
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>,
  index: number,
  pageHeight: number,
  pageWidth: number,
  scaleFactor: number
) => {
  if (component.type === "price" || component.type === "number") {
    // Pour les prix et nombres, on utilise bottom et right
    const updates: Partial<NumberComponentType | PrincipalPriceComponentType> =
      {};
    if (direction === "up")
      updates.bottom = Math.max(0, (component.bottom || 0) + step);
    if (direction === "down")
      updates.bottom = Math.min(
        pageHeight * scaleFactor,
        (component.bottom || 0) - step,
      );
    if (direction === "left")
      updates.right = Math.max(-pageWidth * 2, (component.right || 0) + step);
    if (direction === "right")
      updates.right = Math.min(pageWidth * 2, (component.right || 0) - step);
    updateComponent(updates, canvasData, setCanvasData, index);
  } else {
    // Pour les textes, on utilise top et left
    const updates: Partial<TextComponentType> = {};
    if (direction === "up")
      updates.top = Math.max(0, (component.top || 0) - step);
    if (direction === "down")
      updates.top = Math.min(
        pageHeight * scaleFactor,
        (component.top || 0) + step,
      );
    if (direction === "left")
      updates.left = Math.max(0, (component.left || 0) - step);
    if (direction === "right")
      updates.left = Math.min(
        pageWidth * scaleFactor,
        (component.left || 0) + step,
      );
    updateComponent(updates, canvasData, setCanvasData, index);
  }
};
