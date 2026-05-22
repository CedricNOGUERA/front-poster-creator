import {
  ComponentTypeMulti,
  NumberComponentType,
  PrincipalPriceComponentType,
} from "@/types/ComponentType";
import { DragDropHookType } from "@/types/DragDropEditor";
import { _thousandSeparator } from "@/utils/functions";
import { JSX } from "react";

interface PriceRendererType {
  index: number;
  commonProps: React.HTMLAttributes<HTMLDivElement>;
  comp: ComponentTypeMulti;
  isEditing: boolean;
  isHovered: boolean;
  deleteButton: JSX.Element;
}

export function PriceRenderer({
  PriceRendererProps,
}: {
  PriceRendererProps: PriceRendererType;
}) {
  const { index, commonProps, comp, deleteButton } = PriceRendererProps;
  const typedComp = comp as PrincipalPriceComponentType | NumberComponentType;
  return (
    <div key={index} {...commonProps}>
      <div style={{ whiteSpace: "nowrap" }}>
        <span
          style={{ textDecoration: typedComp.textDecoration ?? "none" }}
          dangerouslySetInnerHTML={{
            __html: _thousandSeparator(parseInt(typedComp.text)),
          }}
        />
        <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>F</sup>
      </div>
      {deleteButton}
    </div>
  );
}

interface PriceEditingRendererType {
  index: number;
  commonProps: React.HTMLAttributes<HTMLDivElement>;
  comp: ComponentTypeMulti;
  useDrag: DragDropHookType;
  isSelected: boolean;
}

export function PriceEditingRenderer({
  priceEditingRendererProps,
}: {
  priceEditingRendererProps: PriceEditingRendererType;
}) {
  const { index, commonProps, comp, useDrag, isSelected } =
    priceEditingRendererProps;
  const typedComp = comp as PrincipalPriceComponentType | NumberComponentType;

  return (
    <div
      key={index}
      {...commonProps}
      style={{
        ...useDrag.getStyleFromComponent(typedComp, isSelected),
        border: "1px dashed blue",
        overflow: "visible",
        display: "inline-flex",
        alignItems: "center",
        minWidth: "20px",
        width: "auto",
      }}
    >
      <input
        type="text"
        value={typedComp.text}
        onChange={(e) => useDrag.updateComponent({ text: e.target.value })}
        onBlur={() => useDrag.setEditingIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            useDrag.setEditingIndex(null);
          }
        }}
        style={{
          fontSize: typedComp.fontSize,
          fontWeight: typedComp.fontWeight,
          color: typedComp.color,
          fontFamily: typedComp.fontFamily || "Impact",
          border: "none",
          outline: "none",
          background: "transparent",
          textAlign: "end",
          width: `${typedComp.text.length + 1}ch`, // largeur auto selon texte
          minWidth: "20px",
          padding: 0,
          margin: 0,
        }}
        autoFocus
      />
      <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>F</sup>
    </div>
  );
}
