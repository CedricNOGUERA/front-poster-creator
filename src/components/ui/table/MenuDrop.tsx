import { CategoriesType } from '@/types/CategoriesType'
import { ShopType } from '@/types/ShopType'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FaEllipsisVertical } from 'react-icons/fa6'

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
            <i className='fa fa-pencil me-2'></i> Modifier
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleShowDuplicate && handleShowDuplicate(data)}>
            <i className='fa fa-copy me-2'></i> Dupliquer
          </Dropdown.Item>
          </React.Fragment>
        )}
        <Dropdown.Item
          onClick={() => handleShowDeleteModal(data.id as number)}
          className='text-danger'
        >
          <i className='fa-solid fa-trash me-2'></i> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
