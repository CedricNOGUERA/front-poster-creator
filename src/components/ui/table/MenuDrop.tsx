import { CategoriesType } from '@/types/CategoriesType'
import { ShopType } from '@/types/ShopType'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FaCopy, FaEllipsisVertical, FaPencil, FaTrash } from 'react-icons/fa6'

export default function MenuDrop<T extends CategoriesType | ShopType>({
  trigger,
  data,
  handleShowEditModal,
  handleShowDuplicate,
  handleShowDeleteModal,
}: {
  trigger: string
  data: T
  handleShowEditModal?: (data: T) => void | undefined | null
  handleShowDuplicate?: (data: T) => void | undefined | null
  
  handleShowDeleteModal: (id: number) => void
}) {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant='transparent'
        id={`dropdown-category-${data.id}`}
        className='border-0 no-chevron'
      >
        <b>
          <FaEllipsisVertical />
        </b>
      </Dropdown.Toggle>
      <Dropdown.Menu align='end'>
        {trigger === 'categories' && (
          <React.Fragment>
            <Dropdown.Item onClick={() => handleShowEditModal && handleShowEditModal(data)}>
              <FaPencil className='me-2' />
              Modifier
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleShowDuplicate && handleShowDuplicate(data)}>
              <FaCopy className='me-2 text-info' />
              Dupliquer
            </Dropdown.Item>
          </React.Fragment>
        )}
        <Dropdown.Item
          onClick={() => handleShowDeleteModal(data.id as number)}
          className='d-flex align-items-center text-danger'
        >
          <FaTrash className='me-2' />
          Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
