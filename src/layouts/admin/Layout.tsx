/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from "react-router-dom";
import { AdminFooter } from "./Footer";
import { AdminHeader } from "./Header";
import React from "react";
import { FeedBackSatateType, ToastDataType } from "@/types/DiversType";
import ToastInfo from "@/components/common/Toasts";
import { ShopType } from "@/types/ShopType";
import { _getAllShops } from "@/utils/apiFunctions";
import userDataStore, { UserDataType } from "@/stores/userDataStore";

export const AdminLayout = () => {
  /* States
   *******************************************************************************************/
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout)  
  const [show, setShow] = React.useState(false)
  const toggleShow = () => setShow(!show)
  const [hasModel, setHasModel] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const [toastData, setToastData] = React.useState<ToastDataType>({
    bg: '',
    position: undefined,
    delay: 6000,
    icon: '',
    message: '',
  })
  const [feedBackState, setFeedBackState] = React.useState<FeedBackSatateType>({
    isLoading: false,
    loadingMessage: '',
    isError: false,
    errorMessage: '',
  })
  const [shops, setShops] = React.useState<ShopType[]>([])
  const [titleHeader, setTitleHeader] = React.useState<string>("Editeur de bon plan")
  const token = localStorage.getItem('token')

  React.useEffect(() => {
    _getAllShops(setShops, setToastData, userLogOut, navigate, toggleShow)
  }, [navigate, userLogOut])
  React.useEffect(() => {
    if(!token) {
      navigate('/login')
    }
  }, [token, navigate])

  /* render
   *******************************************************************************************/

  return (
    <>
      <div className='d-flex flex-column min-vh-100 p-0 text-center bg-light'>
        <AdminHeader titleHeader={titleHeader} setTitleHeader={setTitleHeader} />
        <div className='flex-grow-1 d-flex flex-column justify-content-start align-items-center '>
          <Outlet
            context={{
              show,
              toggleShow,
              toastData,
              setToastData,
              feedBackState,
              setFeedBackState,
              shops,
              setShops,
              titleHeader,
              setTitleHeader,
              hasModel,
              setHasModel
            }}
          />
        </div>
        <AdminFooter />
        <ToastInfo show={show} toggleShow={toggleShow} toastData={toastData} />
      </div>
    </>
  )
};
