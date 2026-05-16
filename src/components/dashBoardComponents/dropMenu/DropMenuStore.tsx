import { StoresType } from "@/types/StoresType";
import { _handleShowDeleteModal, _handleShowEditModal } from "@/utils/modalFunction";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisVertical, FaPencil, FaTrash } from "react-icons/fa6";

interface DropMenuStoreType {
    store: StoresType
    setSelectedStore: React.Dispatch<React.SetStateAction<StoresType>>
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropMenuStore({store, setSelectedStore, setShowEditModal, setShowDeleteModal}: DropMenuStoreType) {

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="transparent"
        id="dropdown-basic"
        className="border-0 no-chevron"
      >
        <FaEllipsisVertical />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item
          onClick={() => {
            _handleShowEditModal(setSelectedStore, store, setShowEditModal);
          }}
        >
          <FaPencil className="text-success" /> Modifier
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setSelectedStore(store);
            _handleShowDeleteModal(setSelectedStore, store, setShowDeleteModal);
          }}
          className="text-danger"
        >
          <FaTrash /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
