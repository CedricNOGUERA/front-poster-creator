import { JSX } from "react";

interface LineRendererType {
    index: number;
    commonProps: React.HTMLAttributes<HTMLDivElement>;
    deleteButton: JSX.Element;
}

export function LineRenderer({ index, commonProps, deleteButton }: LineRendererType) {
  return (
    <div key={index} {...commonProps}>
      {deleteButton}
    </div>
  );
}