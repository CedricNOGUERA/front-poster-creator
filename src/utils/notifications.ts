import { ToastDataType } from "@/types/DiversType";
import { NavigateOptions, To } from "react-router-dom";

export const _showToast = (success: boolean, message: string, setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>, toggleShow: () => void, delay: number) => {
    setToastData({
        bg: success ? 'success' : 'danger',
        position: 'top-end',
        delay: delay,
        icon: success ? 'fa fa-check-circle' : 'fa fa-circle-xmark',
        message,
    })
    toggleShow()
}

type ToastCallback = (success: boolean, message: string, delay: number) => void;

export const _expiredSession = (
    toast: ToastCallback,
    userLogOut: () => void,
    navigate: (to: To, options?: NavigateOptions) => void
) => {
    toast(false, 'Votre session est expirée, veuillez vous reconnecter', 4000)
    userLogOut()
    setTimeout(() => navigate('/login'), 5000)
}

// export const _expiredSession = (
//     setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
//     toggleShow: () => void,
//     userLogOut: () => void,
//     navigate: (to: To, options?: NavigateOptions) => void,
//     _showToast: (
//         success: boolean,
//         message: string,
//         setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
//         toggleShow: () => void,
//         delay: number
//     ) => void
// ) => {
//     _showToast(
//         false,
//         'Votre session est expirée, veuillez vous reconnecter',
//         setToastData,
//         toggleShow,
//         4000
//     )
//     userLogOut()
//     setTimeout(() => {
//         navigate('/login')
//     }, 5000)
// }