// import templates from "@/mocks/templates.json";
import useStoreApp from "@/stores/storeApp";
import { TemplateType } from "@/types/TemplatesType";
import { _getTemplate } from "@/utils/apiFunctions";
import React from "react";

type Props = {
  title: string;
};
const API_URL = import.meta.env.VITE_API_URL

export const TemplateSelector = ({ title }: Props) => {
  /* States
   *******************************************************************************************/
  const storeApp = useStoreApp()
  const [templates, setTemplates] = React.useState<TemplateType[]>([])

  /* useEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getTemplate(setTemplates, storeApp.categoryId)
  }, [storeApp.categoryId])
  console.log(storeApp.categoryId)
  console.log(templates)

  /* Functions
   *******************************************************************************************/
  const onHandleTemplate = (id: number | undefined) => {
    if (id) {
      storeApp.setTemplateId(id)
      storeApp.nextStep()
    }
  }
  /* Render
   *******************************************************************************************/
  return (
    <>
      <h2 className='fs-4 fw-bold text-primary'>{title}</h2>
      <div className='d-flex flex-wrap justify-content-center justify-content-lg-start align-items-center mt-5 mb-5'>
        {templates.map((template) => {
          if (
            template.categoryId === storeApp.categoryId &&
            template.shopIds.includes(storeApp.shopId)
          ) {
            return (
              <div
                key={template.id}
                className='cursor-pointer m-3 rounded-1 border-secondary d-flex flex-column justify-content-center align-items-center'
                onClick={() => onHandleTemplate(template.id)}
              >
                <img src={`${API_URL}/uploads/miniatures/${storeApp.categoryId}/${template.image}`} alt={template.name} width={200} />
              </div>
            )
          }
        })}
      </div>
    </>
  )
};
