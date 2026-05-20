import { ShopSelectorHookType, ShopType } from "@/types/ShopType";

const API_URL = import.meta.env.VITE_API_URL;

export default function ShopCard({useShopSelector}: {useShopSelector: ShopSelectorHookType}) {
  return (
    <>
      {useShopSelector.shops
        .filter((shop) => {
          if (useShopSelector.userStoreData.role === "super_admin") {
            return true;
          } else {
            useShopSelector.userStoreData.company.some(
              (uc) => uc.idCompany === shop.id,
            );
          }
        })
        .map((shop: ShopType) => {
          return (
            <div
              key={shop.id}
              className="hover-card mb-3 mx-4 border rounded-1 border-primary p-3 px-4"
              onClick={() => useShopSelector.onHandleShop(shop.id)}
            >
              <img
                src={`${API_URL}/${shop.cover}`}
                alt={shop.name}
                width={150}
                height={150}
              />
            </div>
          );
        })}
    </>
  );
}
