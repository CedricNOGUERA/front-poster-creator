import { CategoriesType } from "@/types/CategoriesType";
import { ShopType } from "@/types/ShopType";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaCopy, FaEllipsisVertical, FaPencil, FaTrash } from "react-icons/fa6";
import MenuItem from "../dropdownMenu/MenuItem";

export default function MenuDrop<T extends CategoriesType | ShopType>({
  trigger,
  data,
  handleShowEditModal,
  handleShowDuplicate,
  handleShowDeleteModal,
}: {
  trigger: string | undefined;
  data: T;
  handleShowEditModal?: (data: T) => void | undefined | null ;
  handleShowDuplicate?: (data: T) => void | undefined | null;

  handleShowDeleteModal: (id: number) => void;
}) {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="transparent"
        id={`dropdown-category-${data.id}`}
        className="border-0 no-chevron"
      >
        <b>
          <FaEllipsisVertical />
        </b>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {(trigger !== "magasin" && trigger !== "modele") && (
            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleShowEditModal && handleShowEditModal(data)}
            >
              <MenuItem icon={FaPencil} title="Modifier" iconColor="success" />
            </Dropdown.Item>
        )}
            {trigger === "categories" && (
            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleShowDuplicate && handleShowDuplicate(data)}
            >
              <MenuItem icon={FaCopy} title="Dupliquer" iconColor="info" />
            </Dropdown.Item>
          
        )}
        <Dropdown.Item
          onClick={() => handleShowDeleteModal(data.id as number)}
          className="d-flex align-items-center text-danger gap-1"
        >
          <MenuItem icon={FaTrash} title="Supprimer" iconColor="danger" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
