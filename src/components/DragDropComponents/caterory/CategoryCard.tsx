import DynamicIcon from "@/components/ui/DynamicIcon";
import { CategoriesType, CategorySelectorHookType } from "@/types/CategoriesType";

export default function CategoryCard({useCategorySelector, shopId}: {useCategorySelector: CategorySelectorHookType, shopId: number} ){
  return (
    <>
      {useCategorySelector.categories &&
        useCategorySelector.categories.map((category: CategoriesType) => {
          if (category.shopIds.includes(shopId)) {
            return (
              <div
                key={category.id}
                className="hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center"
                style={{ width: "200px", height: "183px" }}
                onClick={() =>
                  useCategorySelector.onHandleCategory(category.id as number)
                }
              >
                {category.icon.value !== "" && [
                  <DynamicIcon
                    key={category.id}
                    iconKey={category.icon.value}
                    size={42}
                    className="text-primary"
                  />,
                ]}
                <p className="mt-2 text-center fw-bold fs-5 text-primary">
                  {category.name}
                </p>
              </div>
            );
          }
        })}
    </>
  );
}
