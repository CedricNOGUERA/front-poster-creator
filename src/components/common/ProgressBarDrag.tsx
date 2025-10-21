import useStoreApp from '@/stores/storeApp'
import { ResetConfig } from '@/types/DiversType'
import React from 'react'
import { Button } from 'react-bootstrap'
import { FaCheck, FaCircleArrowLeft } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'

interface ProgressBarContextType {
  setHasModel: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProgressBarDrag = () => {
  /* States
   *******************************************************************************************/
  const { setHasModel } = useOutletContext<ProgressBarContextType>()
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
          className='p-0 me-3 text-muted'
          onClick={() => goToStep(storeApp.step - 1)}
          style={{ textDecoration: 'none' }}
        >
          <FaCircleArrowLeft className='fs-3' />
        </Button>
      )}
      <div
        className={`step ${storeApp.step >= 1 ? 'current' : ''}`}
        onClick={() => goToStep(1)}
      >
        {storeApp.step > 1 ? <FaCheck className='text-white' /> : <>1</>}
        <div className='progress-line'></div>
      </div>
      <div
        className={`step ${storeApp.step >= 2 ? 'current' : ''}`}
        onClick={
          storeApp.shopId !== 0
            ? () => {
                goToStep(2)
                setHasModel(false)
              }
            : undefined
        }
      >
        {storeApp.step > 2 ? <FaCheck className='text-white' /> : <>2</>}
        <div className='progress-line'></div>
      </div>
      <div className={`step ${storeApp.step >= 3 ? 'current' : ''}`}>
        {storeApp.step > 3 ? <FaCheck className='text-white' /> : <>3</>}
      </div>
    </div>
  )
}
