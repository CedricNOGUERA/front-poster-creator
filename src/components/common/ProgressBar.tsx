import useStoreApp from '@/stores/storeApp'
import { ResetConfig } from '@/types/DiversType'
import { Button } from 'react-bootstrap'

export const ProgressBar = () => {
  /* States
   *******************************************************************************************/
  const storeApp = useStoreApp()

  const resetConfig: ResetConfig = {
    1: ['shopId', 'categoryId', 'templateId', 'dimensionId'],
    2: ['categoryId', 'templateId', 'dimensionId'],
    3: ['templateId', 'dimensionId'],
    4: ['dimensionId'],
    5: [],
  }

  const goToStep = (step: number) => {
    storeApp.setStep(step)

    resetConfig[step].forEach((key) => {
      if (key === 'shopId') storeApp.setShopId(0)
      if (key === 'categoryId') storeApp.setCategoryId(0)
      if (key === 'templateId') storeApp.setTemplateId(0)
      if (key === 'dimensionId') storeApp.setDimensionId(0)
    })
  }

  /* Render
   *******************************************************************************************/
  return (
    <div className={`progress-bar bg-light border-bottom`}>
      {storeApp.step > 1 && (
        <Button
          variant='link'
          className='p-0 me-3 text-primary'
          onClick={() => goToStep(storeApp.step - 1)}
          style={{ textDecoration: 'none' }}
        >
          <i className='fa fa-circle-arrow-left fs-3'></i>
        </Button>
      )}
      <div
        className={`step ${storeApp.step >= 1 ? 'current' : ''}`}
        onClick={() => goToStep(1)}
      >
        {storeApp.step > 1 ? <i className='fas fa-check text-white'></i> : <>1</>}
        <div className='progress-line'></div>
      </div>
      <div
        className={`step ${storeApp.step >= 2 ? 'current' : ''}`}
        onClick={storeApp.shopId !== 0 ? () => goToStep(2) : undefined}
      >
        {storeApp.step > 2 ? <i className='fas fa-check text-white'></i> : <>2</>}
        <div className='progress-line'></div>
      </div>
      <div
        className={`step ${storeApp.step >= 3 ? 'current' : ''}`}
        onClick={storeApp.categoryId !== 0 ? () => goToStep(3) : undefined}
      >
        {storeApp.step > 3 ? <i className='fas fa-check text-white'></i> : <>3</>}
        <div className='progress-line'></div>
      </div>
      <div
        className={`step ${storeApp.step >= 4 ? 'current' : ''}`}
        onClick={storeApp.templateId !== 0 ? () => goToStep(4) : undefined}
      >
        {storeApp.step > 4 ? <i className='fas fa-check text-white'></i> : <>4</>}
        <div className='progress-line'></div>
      </div>
      <div
        className={`step ${storeApp.step >= 5 ? 'current' : ''}`}
        onClick={
          storeApp.dimensionId !== 0
            ? () => {
                storeApp.setStep(5)
              }
            : undefined
        }
      >
        5
      </div>
    </div>
  )
}
