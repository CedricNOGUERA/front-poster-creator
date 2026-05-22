import {
  ComponentTypeMulti,
  TextComponentType,
} from "@/types/ComponentType";
import { DragDropHookType } from "@/types/DragDropEditor";
import { JSX } from "react";

interface TextRendererType {
    index: number;
    commonProps: React.HTMLAttributes<HTMLDivElement>;
  comp: ComponentTypeMulti;
  isEditing: boolean;
//   isHovered: boolean;
  deleteButton: JSX.Element
  useDrag: DragDropHookType;
}

export function TextRenderer({ TextRendererProps }:{ TextRendererProps: TextRendererType}) {
    const { index, commonProps, comp, isEditing, deleteButton, useDrag } = TextRendererProps;
    const textComp = comp as TextComponentType;

  if (isEditing) {
    return (
      <foreignObject key={index} x={textComp.left} y={textComp.top} width={150} height={50}
        style={{ ...useDrag.getStyleFromComponent(comp, true), border: "1px dashed blue", overflow: "visible" }}
      >
        <textarea
          value={textComp.text}
          onChange={(e) => useDrag.updateComponent({ text: e.target.value })}
          onBlur={() => useDrag.setEditingIndex(null)}
          onKeyDown={(e) => { if (e.key === "Escape") useDrag.setEditingIndex(null); }}
          style={{
            width: "100%", height: "100%",
            fontFamily: textComp.fontFamily, fontSize: textComp.fontSize,
            fontWeight: textComp.fontWeight, color: textComp.color,
            border: "none", outline: "none", background: "transparent",
            transform: `rotate(${textComp.rotation ?? 0}deg)`,
          }}
          autoFocus
        />
      </foreignObject>
    );
  }

  return (
    <div key={index} {...commonProps} className="text-start">
      <span
        style={{ fontFamily: textComp.fontFamily, textDecoration: textComp.textDecoration ?? "none", whiteSpace: "pre-line" }}
        dangerouslySetInnerHTML={{ __html: textComp.text }}
      />
      {deleteButton}
    </div>
  );
}