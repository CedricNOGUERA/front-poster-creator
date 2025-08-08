import useStoreApp from "@/stores/storeApp";

export const ProgressBar = () => {
  /* States
   *******************************************************************************************/
  const storeApp = useStoreApp();

  /* Render
   *******************************************************************************************/
  return (
    <div
      className={`progress-bar bg-light border-bottom`}
    >
      <div
        className={`step ${storeApp.step >= 1 ? "current" : ""}`}
        onClick={() => {
          storeApp.setStep(1);
          storeApp.setShopId(0);
          storeApp.setCategoryId(0);
          storeApp.setTemplateId(0);
          storeApp.setDimensionId(0);
        }}
      >
        {storeApp.step > 1 ? (
          <i className="fas fa-check text-white"></i>
        ) : (
          <>1</>
        )}
        <div className="progress-line"></div>
      </div>
      <div
        className={`step ${storeApp.step >= 2 ? "current" : ""}`}
        onClick={
          storeApp.shopId !== 0
            ? () => {
                storeApp.setStep(2);
                storeApp.setCategoryId(0);
                storeApp.setTemplateId(0);
                storeApp.setDimensionId(0);
              }
            : undefined
        }
      >
        {storeApp.step > 2 ? (
          <i className="fas fa-check text-white"></i>
        ) : (
          <>2</>
        )}
        <div className="progress-line"></div>
      </div>
      <div
        className={`step ${storeApp.step >= 3 ? "current" : ""}`}
        onClick={
          storeApp.categoryId !== 0
            ? () => {
                storeApp.setStep(3);
                storeApp.setTemplateId(0);
                storeApp.setDimensionId(0);
              }
            : undefined
        }
      >
        {storeApp.step > 3 ? (
          <i className="fas fa-check text-white"></i>
        ) : (
          <>3</>
        )}
        <div className="progress-line"></div>
      </div>
      <div
        className={`step ${storeApp.step >= 4 ? "current" : ""}`}
        onClick={
          storeApp.templateId !== 0
            ? () => {
                storeApp.setStep(4);
                storeApp.setDimensionId(0);
              }
            : undefined
        }
      >
        {storeApp.step > 4 ? (
          <i className="fas fa-check text-white"></i>
        ) : (
          <>4</>
        )}
        <div className="progress-line"></div>
      </div>
      <div
        className={`step ${storeApp.step >= 5 ? "current" : ""}`}
        onClick={
          storeApp.dimensionId !== 0
            ? () => {
                storeApp.setStep(5);
              }
            : undefined
        }
      >
        5
      </div>
    </div>
  );
};