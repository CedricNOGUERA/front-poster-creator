import { DragDropHookType } from "@/types/DragDropEditor";
import { _handleDragOver } from "@/utils/functions";
import { JSX } from "react";

export default function CanvasComponent({
  useDrag,
  renderedComponents,
}: {
  useDrag: DragDropHookType;
  renderedComponents: (JSX.Element | null)[];
}) {
  return (
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
  );
}
