import useStoreApp from '@/stores/storeApp'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { ShopType } from '@/types/ShopType'
import { _getAllShops } from '@/utils/apiFunctions'
import React from 'react'

type Props = {
  title: string
}

const API_URL = import.meta.env.VITE_API_URL

export const ShopSelector = ({ title }: Props) => {
  /* States
   *******************************************************************************************/
  const userStoreData = userDataStore((state: UserDataType) => state)
  const storeApp = useStoreApp()
  const [shops, setShops] = React.useState<ShopType[]>([])
 

  /* UseEffect
   *******************************************************************************************/

  React.useEffect(() => {
    _getAllShops(setShops)
  }, [])

  /* Functions
   *******************************************************************************************/
  const onHandleShop = (id: number) => {
    storeApp.setShopId(id)
    storeApp.nextStep()
  }

  /* Render
   *******************************************************************************************/
  return (
    <>
      <h2 className='fs-4 fw-bold text-primary'>{title}</h2>
      <div className='d-flex flex-wrap justify-content-center align-items-center mt-5 mb-5'>
        {shops
          .filter((shop) => userStoreData.company.some((uc) => uc.idCompany === shop.id))
          .map((shop: ShopType) => {
            // if (
            //   userStoreData.company.nameCompany !== shop.name &&
            //   userStoreData.role !== 'super_admin'
            // ) {
            //   return null
            // }
            return (
              <div
                key={shop.id}
                className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 px-4'
                onClick={() => onHandleShop(shop.id)}
              >
                <img src={`${API_URL}/${shop.cover}`} alt={shop.name} width={150} />
              </div>
            )
          })}
      </div>
    </>
  )
}
