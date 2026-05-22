import { 
    ComponentTypeMulti,
    ImageComponentType } from "@/types/ComponentType";
import { JSX } from "react";

interface ImageRendererType {
    index: number;
    commonProps: React.HTMLAttributes<HTMLDivElement>;
    comp: ComponentTypeMulti;
    deleteButton: JSX.Element;
    API_URL: string;
}

export function ImageRenderer({ index, commonProps, comp, deleteButton, API_URL }: ImageRendererType ) {
  const imgComp = comp as ImageComponentType;
  return (
    <div key={index} {...commonProps}>
      <img src={API_URL + imgComp.src} alt="" width={imgComp.width} height={imgComp.height}
        style={{ width: "100%", height: "100%" }} />
      {deleteButton}
    </div>
  );
}