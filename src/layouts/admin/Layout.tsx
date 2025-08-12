import { Outlet, useNavigate } from "react-router-dom";
import { AdminFooter } from "./Footer";
import { AdminHeader } from "./Header";
import React from "react";
import { FeedBackSatateType, ToastDataType } from "@/types/DiversType";
import ToastInfo from "@/components/common/Toasts";
import { ShopType } from "@/types/ShopType";
import { _getAllShops } from "@/utils/apiFunctions";

export const AdminLayout = () => {
  /* States
   *******************************************************************************************/
  const [show, setShow] = React.useState(false)
  const toggleShow = () => setShow(!show)
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
  const token = sessionStorage.getItem('token')

  React.useEffect(() => {
    _getAllShops(setShops)
  }, [])
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
              setTitleHeader
            }}
          />
        </div>
        <AdminFooter />
        <ToastInfo show={show} toggleShow={toggleShow} toastData={toastData} />
      </div>
    </>
  )
};
