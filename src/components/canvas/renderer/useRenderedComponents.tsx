// /* eslint-disable react-hooks/exhaustive-deps */
import { BackgroundColorRenderer } from "./BackgroundColorRenderer";
import { HeaderRenderer } from "./HeaderRenderer";
import { TextRenderer } from "./TextRenderer";
import { ImageRenderer } from "./ImageRenderer";
import { LineRenderer } from "./LineRenderer";
import { PriceRenderer } from "./PriceRenderer";
import { PriceEditingRenderer } from "./PriceRenderer";
import { DragDropHookType } from "@/types/DragDropEditor";
import CanvasDeleteButton from "../CanvasDeleteButton";
import React from "react";
interface RendererComponentsProps {
  useDrag: DragDropHookType;
  API_URL: string;
}

export function useRenderedComponents({
  useDrag,
  API_URL,
}: RendererComponentsProps) {
  return React.useMemo(() => {
    return useDrag.components.map((comp, index) => {
      const isSelected = index === useDrag.selectedIndex;
      const isHovered = index === useDrag.hoveredIndex;
      const isEditing = index === useDrag.editingIndex;

      const isStaticType =
        comp.type === "background-color" || comp.type === "header";

      const commonProps = isStaticType
        ? {
            className: "absolute cursor-move pointer",
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              useDrag.setSelectedIndex(index);
              useDrag.setEditingIndex(null);
            },
            onMouseEnter: () => useDrag.setHoveredIndex(index),
            onMouseLeave: () => useDrag.setHoveredIndex(null),
            style: useDrag.getStyleFromComponent(comp, isSelected),
          }
        : {
            className: "absolute cursor-move pointer",
            onMouseDown: (
              e: React.MouseEvent<HTMLDivElement | HTMLImageElement>,
            ) => {
              if (!isEditing) useDrag.handleDragOnCanvas(e, index);
            },
            onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              useDrag.setSelectedIndex(index);
              const isTextType = [
                "text",
                "enableText",
                "number",
                "price",
              ].includes(comp.type);
              useDrag.setEditingIndex(
                isTextType ? (isEditing ? null : index) : null,
              );
            },
            onMouseEnter: () => useDrag.setHoveredIndex(index),
            onMouseLeave: () => useDrag.setHoveredIndex(null),
            style: useDrag.getStyleFromComponent(comp, isSelected),
          };

      const deleteButton = (
        <CanvasDeleteButton
          visible={isHovered && !isEditing}
          comp={comp}
          index={index}
          setComponents={useDrag.setComponents}
          setSelectedIndex={useDrag.setSelectedIndex}
        />
      );

      const sharedProps = {
        index,
        commonProps,
        comp,
        isEditing,
        isHovered,
        deleteButton,
        useDrag,
        API_URL,
      };

      switch (comp.type) {
        case "price":
        case "number":
          return isEditing ? (
            <PriceEditingRenderer
              priceEditingRendererProps={{
                index,
                commonProps,
                comp,
                useDrag,
                isSelected,
              }}
            />
          ) : (
            <PriceRenderer
              PriceRendererProps={{
                index,
                commonProps,
                comp,
                isEditing,
                isHovered,
                deleteButton,
              }}
            />
          );

        case "text":
        case "enableText":
          return (
            <TextRenderer
              TextRendererProps={{
                index,
                commonProps,
                comp,
                isEditing,
                deleteButton,
                useDrag,
              }}
            />
          );

        case "background-color":
          return <BackgroundColorRenderer {...sharedProps} />;

        case "header":
          return (
            <HeaderRenderer
              HeaderRendererProps={{ index, commonProps, comp, API_URL }}
            />
          );

        case "image":
          return <ImageRenderer {...sharedProps} />;

        case "horizontalLine":
        case "verticalLine":
          return <LineRenderer {...sharedProps} />;

        default:
          return null;
      }
    });
  }, [
    useDrag,
    API_URL,
    
  ]);
}
