import useStoreApp from '@/stores/storeApp'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { ToastDataType } from '@/types/DiversType'
import { ShopType } from '@/types/ShopType'

import React from 'react'
import {useOutletContext } from 'react-router-dom'

type Props = {
  title: string
}

interface ContextShopSelectorType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  shops: ShopType[]
}

const API_URL = import.meta.env.VITE_API_URL

export const ShopSelector = ({ title }: Props) => {
  /* States
   *******************************************************************************************/
  const { shops } = useOutletContext<ContextShopSelectorType>()
  const userStoreData = userDataStore((state: UserDataType) => state)
  const storeApp = useStoreApp()


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
          .filter((shop) => {
            if(userStoreData.role === "super_admin"){
              return true
            }else{
              if(userStoreData.role === "admin" || userStoreData.role === "user"){
                return (
                  userStoreData.company.some((uc) =>
                    uc.idCompany === shop.id)
                )
              }
            }
          
          })
          .map((shop: ShopType) => {
            return (
              <div
                key={shop.id}
                className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 px-4'
                onClick={() => onHandleShop(shop.id)}
              >
                <img src={`${API_URL}/${shop.cover}`} alt={shop.name} width={150} height={150} />
              </div>
            )
          })}
      </div>
    </>
  )
}
