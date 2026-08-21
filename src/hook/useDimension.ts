import React from "react";
import { DimensionType } from "@/types/DimensionType";
import dimensionsServiceInstance from "@/services/DimensionsService";
import { DimensionFormDataType } from "@/types/ModalType";
import { ToastDataType } from "@/types/DiversType";
import { useOutletContext } from "react-router-dom";
import { _showToast } from "@/utils/notifications";

interface ContextType {
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  toggleShow: () => void;
}

export default function useDimension() {

    const { setToastData, toggleShow } = useOutletContext<ContextType>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const columnsData = ["ID", "Nom", "Dimensions", "Orientation", "Etat", "Actions"];
    const [dimensions, setDimensions] = React.useState<DimensionType[]>([]);
    const [dimensionFormData, setDimensionFormData] = React.useState<DimensionFormDataType>({
        name: "",
        width: "",
        height: "",
        dimension: "",
        orientation: "",
    });
    const [selectedIdDimension, setSelectedIdDimension] = React.useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = React.useState<boolean | null>(null);   
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showStatusModal, setShowStatusModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };
    const handleShowStatusModal = (id: number, status: boolean) => {
        setSelectedIdDimension(id);
        setSelectedStatus(status);
        setShowStatusModal(true);
    };
    const handleCloseStatusModal = () => {
        setShowStatusModal(false);
        setSelectedIdDimension(null);
        setSelectedStatus(null);
    };
    const handleShowDeleteModal = (id: number) => {
        setSelectedIdDimension(id);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedIdDimension(null);
    };

    React.useEffect(() => {
        getDimensions();
    }, [])

    const getDimensions = async () => {
        setIsLoading(true);
        try {
            const response = await dimensionsServiceInstance.getDimensions();
            setDimensions(response as DimensionType[]);
        } catch (error) {
            console.error("Erreur lors de la récupération des dimensions :", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddDimension = async () => {
        setIsLoading(true);
    
        const newData = {...dimensionFormData, dimension: `${dimensionFormData.width}x${dimensionFormData.height}`}
        try{

           const response = await dimensionsServiceInstance.postDimension(newData);

               getDimensions();
               handleCloseAddModal();
               setDimensionFormData({
                   name: "",
                   width: "",
                   height: "",
                   dimension: "",
                   orientation: "",
                });
                _showToast(true, response.message , setToastData, toggleShow, 3000);
        }catch(error){
            _showToast(false, error instanceof Error ? error.message : "Erreur lors de l'ajout de la dimension", setToastData, toggleShow, 3000);
            console.error("Erreur lors de l'ajout de la dimension :", error);
        }finally{
            setIsLoading(false);
        }
    };

    const handleStatusDimension = async() => {
        setIsLoading(true);
        try{

            if (selectedIdDimension !== null && selectedStatus !== null) {
                const response = await dimensionsServiceInstance.patchDimsensionStatus(selectedIdDimension, !selectedStatus);
                _showToast(true, response.message, setToastData, toggleShow, 3000);
                getDimensions();
                handleCloseStatusModal();
                setSelectedIdDimension(null);
                setSelectedStatus(null);
            }
        }catch(error){
            console.error("Erreur lors de la mise à jour de la dimension :", error);
        }finally{
            setIsLoading(false);
        }
    };

    const handleDeleteDimension = () => {
        setIsLoading(true);
        try{
            handleCloseDeleteModal();
            setSelectedIdDimension(null);
        }catch(error){
            console.error("Erreur lors de la suppression de la dimension :", error);
        }finally{
            setIsLoading(false);
        }
    };
    console.log(dimensionFormData)

    const addModalProps = {
      showAddModal,
      handleCloseAddModal,
      dimensionFormData,
      setDimensionFormData,
      handleAddDimension,
    };

    const statusModalProps = {
      showStatusModal,
      handleCloseStatusModal,
      selectedStatus,
      handleStatusDimension,
    };

    const deleteModalProps = {
      showDeleteModal,
      handleCloseDeleteModal,
      handleDeleteDimension,
    };

    return {
      isLoading,
      columnsData,
      addModalProps,
        statusModalProps,
        deleteModalProps,
      dimensions,
   
      handleShowAddModal,
    //   handleCloseAddModal,
      handleShowStatusModal,
    //   handleCloseStatusModal,
    //   handleShowDeleteModal,
    //   handleCloseDeleteModal,
    };
}