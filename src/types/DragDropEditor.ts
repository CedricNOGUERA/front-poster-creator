import { CategoriesType } from "./CategoriesType";
import { ComponentTypeMulti } from "./ComponentType";
import { NewTemplateType } from "./DiversType";
import { TemplateType } from "./TemplatesType";

export interface DragDropHookType {
  components: ComponentTypeMulti[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>;
  imageName: string;
  setImageName: React.Dispatch<React.SetStateAction<string>>;
  idTemplate: number;
  template: TemplateType[];
  setTemplate: React.Dispatch<React.SetStateAction<TemplateType[]>>;
  isErrorModel: boolean;
  hasModel: boolean;
  selectedCategory: CategoriesType;
  selectedDimension: number;
  setSelectedDimension: React.Dispatch<React.SetStateAction<number>>;
  dimensionFactor: number | null;
  selectedIndex: number | null;
  hoveredIndex: number | null;
  editingIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
//   posterRef: React.RefObject<HTMLDivElement>;
  posterRef: React.RefObject<HTMLDivElement | null>;
  newTemplateState: NewTemplateType;
  setNewTemplateState: React.Dispatch<React.SetStateAction<NewTemplateType>>;
  maxPreviewHeight: number;
  //Handlers
  handleDragOnCanvas: (e: React.MouseEvent<HTMLDivElement | HTMLImageElement, MouseEvent>, index: number) => void;
  getStyleFromComponent: (comp: ComponentTypeMulti, isSelected: boolean) => React.CSSProperties;
  addModel: (name: string) => Promise<void>;
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void;
  showValidateModel: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleCloseValidateModel: () => void;
  handleShowValidateModel: () => void;
}
