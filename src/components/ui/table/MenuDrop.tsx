import { CategoriesType } from '@/types/CategoriesType'
import { ShopType } from '@/types/ShopType'
import { Dropdown } from 'react-bootstrap'

export default function MenuDrop<T extends CategoriesType | ShopType>({
  trigger,
  data,
  handleShowEditModal,
  handleShowDeleteModal,
}: {
  trigger: string
  data: T
  handleShowEditModal?: (data: T) => void | undefined | null
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
          <i className='fa-solid fa-ellipsis-vertical'></i>
        </b>
      </Dropdown.Toggle>
      <Dropdown.Menu align='end'>
        {trigger === 'categories' && (
          <Dropdown.Item onClick={() => handleShowEditModal && handleShowEditModal(data)}>
            <i className='fa fa-pencil me-2'></i> Modifier
          </Dropdown.Item>
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
