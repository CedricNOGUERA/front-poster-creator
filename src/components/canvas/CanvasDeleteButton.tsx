import { ComponentTypeMulti } from "@/types/ComponentType";
import { _handleDeleteComponent } from "@/utils/functions";
import { FaXmark } from "react-icons/fa6";

type Props = {
  index: number;
  comp: ComponentTypeMulti;
  visible: boolean;
  setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function CanvasDeleteButton({
  visible,
  comp,
  index,
  setComponents,
  setSelectedIndex,
}: Props) {
  if (!visible) return null;

  const isPrice = comp.type === "price";

  return (
    <FaXmark
      className="bg-light rounded-circle pointer border border-1 border-dark"
      style={{
        position: "absolute",

        top: isPrice ? "5px" : "-10px",

        right: "-15px",
        zIndex: 20,
        width: "20px",
        height: "20px",
        padding: 0,
      }}
      onClick={(e) => {
        e.stopPropagation();
        _handleDeleteComponent(index, setComponents, setSelectedIndex);
      }}
    />
  );
}
