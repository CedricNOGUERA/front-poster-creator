import React from "react";
import { DimensionType } from "@/types/DimensionType";

export interface DimensionFormDataType {
    name: string;
    width: string;
    height: string;
    orientation: string;
}

export default function useDimension() {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const columnsData = ["ID", "Nom", "Dimension", "Orientation", "Etat", "Actions"];
    const [dimensions, setDimensions] = React.useState<DimensionType[]>([]);
    const [dimensionFormData, setDimensionFormData] = React.useState<DimensionFormDataType>({
        name: "",
        width: "",
        height: "",
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
            // Simulate fetching dimensions from an API
            console.log("Fetching dimensions...");
            const response = await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(response)
            // Assuming the API returns an array of dimensions
            setDimensions(response as DimensionType[]);
        } catch (error) {
            console.error("Erreur lors de la récupération des dimensions :", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddDimension = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            handleCloseAddModal();
        }catch(error){
            console.error("Erreur lors de l'ajout de la dimension :", error);
        }finally{
            setIsLoading(false);
        }
    };

    const handleStatusDimension = () => {
        setIsLoading(true);
        try{
            handleCloseStatusModal();
            setSelectedIdDimension(null);
            setSelectedStatus(null);
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

    console.log(dimensions)
       
    return {
      isLoading,
      columnsData,
      dimensionFormData,
      setDimensionFormData,
      selectedIdDimension,
      selectedStatus,

      handleAddDimension,
      handleStatusDimension,
      handleDeleteDimension,

      showAddModal,
      setShowAddModal,
      showStatusModal,
      setShowStatusModal,
      showDeleteModal,
      setShowDeleteModal,
      handleShowAddModal,
      handleCloseAddModal,
      handleShowStatusModal,
      handleCloseStatusModal,
      handleShowDeleteModal,
      handleCloseDeleteModal,
    };
}