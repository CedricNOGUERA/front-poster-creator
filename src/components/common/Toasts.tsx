import { ToastDataType } from '@/types/DiversType'
import { Alert, Toast, ToastContainer } from 'react-bootstrap'

export default function ToastInfo({show, toggleShow, toastData}: {show: boolean, toggleShow: () => void, toastData: ToastDataType}) {
  return (
    <ToastContainer
    containerPosition='fixed'
    position={toastData.position}
    className='mt-2 me-2'
    style={{ zIndex: 1500000 }}
  >
    <Toast show={show} onClose={toggleShow} delay={toastData.delay} autohide>
      <Alert
        variant={toastData.bg}
        className='p-3 mb-0 d-flex justify-content-start align-items-center'
      >
        <i className={`${toastData.icon} text-${toastData.bg} fs-3 me-2`}></i>{' '}
        <strong className=''>{toastData.message}</strong>
      </Alert>
    </Toast>
  </ToastContainer>
  )
}
