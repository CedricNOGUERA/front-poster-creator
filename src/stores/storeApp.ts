import { create } from "zustand";

export type StoreType = {
  step: number;
  shopId: number;
  categoryId: number;
  templateId: number;
  dimensionId: number;
  canvasId: number;
  setStep: (id: number) => void;
  setShopId: (id: number) => void;
  setCategoryId: (id: number) => void;
  setTemplateId: (id: number) => void;
  setDimensionId: (id: number) => void;
  setCanvasId: (id: number) => void;
  resetStep: () => void;
  resetShopId: () => void;
  resetCategoryId: () => void;
  prevStep: () => void;
  nextStep: () => void;
  resetTemplateId: () => void;
  resetDimensionId: () => void;
  resetCanvasId: () => void;
  resetAll: () => void;
}

const useStoreApp = create<StoreType>((set) => ({
  step: 1,
  shopId: 0,
  categoryId: 0,
  templateId: 0,
  dimensionId: 0,
  canvasId: 0,
  setStep: (id: number) => set(() => ({ step: id })),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setShopId: (id: number) => set(() => ({ shopId: id })),
  setCategoryId: (id: number) => set(() => ({ categoryId: id })),
  setTemplateId: (id: number) => set(() => ({ templateId: id })),
  setDimensionId: (id: number) => set(() => ({ dimensionId: id })),
  setCanvasId: (id: number) => set(() => ({ canvasId: id })),
  resetStep: () => set(() => ({ step: 1 })),
  resetShopId: () => set(() => ({ shopId: 0 })),
  resetCategoryId: () => set(() => ({ categoryId: 0 })),
  resetTemplateId: () => set(() => ({ templateId: 0 })),
  resetDimensionId: () => set(() => ({ dimensionId: 0 })),
  resetCanvasId: () => set(() => ({ canvasId: 0 })),
  resetAll: () => set(() => ({ step: 1, shopId: 0, categoryId: 0, templateId: 0, dimensionId: 0, canvasId: 0 })),

}));

export default useStoreApp;
