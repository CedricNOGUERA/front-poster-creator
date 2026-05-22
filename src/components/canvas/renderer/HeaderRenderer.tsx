import { ComponentTypeMulti, HeaderComponentType } from "@/types/ComponentType";

interface HeaderRendererType {
  index: number;
  commonProps: React.HTMLAttributes<HTMLDivElement>;
  comp: ComponentTypeMulti;
  API_URL: string;
}

export function HeaderRenderer({
  HeaderRendererProps,
}: {
  HeaderRendererProps: HeaderRendererType;
}) {
  const { index, commonProps, comp, API_URL } = HeaderRendererProps;
  const headerComp = comp as HeaderComponentType;
  return (
    <div key={index} {...commonProps}>
      {headerComp.src !== null && (
        <img
          src={API_URL + headerComp.src}
          alt=""
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      )}
    </div>
  );
}
