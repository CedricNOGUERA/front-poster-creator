import TableLoader from "@/components/ui/squeleton/TableLoader";
import MenuDrop from "@/components/ui/table/MenuDrop";
import TableFilters, { FilterField } from "@/components/ui/table/TableFilter";
import TableHeader from "@/components/ui/table/TableHeader";
import { CategoriesHookType, CategoriesType } from "@/types/CategoriesType";
import { createResetForm } from "@/utils/admin/function";
import { Image, Table } from "react-bootstrap";
const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryTable({
  useCategories,
}: {
  useCategories: CategoriesHookType;
}) {
  const resetForm = createResetForm({
    setId: useCategories.setId,
    setName: useCategories.setName,
    setStore: useCategories.setStore,
  });

  const fields: FilterField[] = [
    {
      type: "text",
      controlId: "id",
      placeholder: "Id",
      value: useCategories.id,
      onChange: (v: string) => {
        useCategories.setId(v);
        useCategories.setPage("1");
      },
    },
    {
      type: "text",
      controlId: "name",
      placeholder: "Nom",
      value: useCategories.name,
      onChange: (v: string) => {
        useCategories.setName(v);
        useCategories.setPage("1");
      },
    },
    { type: "empty" },
    {
      type: "select",
      controlId: "company",
      placeholder: "Enseigne",
      value: useCategories.store,
      options: useCategories.shops,
      onChange: (v: string) => {
        useCategories.setStore(v);
        useCategories.setPage("1");
      },
    },
  ];

  return (
    <Table striped hover responsive="sm" className="shadow">
      <TableHeader columnsData={useCategories.columnsData} />
      <TableFilters
        fields={fields}
        resetForm={resetForm}
        isFiltering={useCategories.isFiltering}
      />
      <tbody>
        {useCategories.paginatedCategories?.categories?.length > 0 && (
        useCategories.paginatedCategories.categories
      .filter((item) => {
        if (useCategories.userRole === "super_admin") {
          return true;
        }
        if (useCategories.userRole === "admin") {
          return item.shopIds.some((shopId) =>
            useCategories.userData.company.some(
              (comp) => shopId === comp.idCompany,
            ),
          );
        }
      })
      .map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td className="bg-secondary">
            {category.image && (
              <Image
                src={API_URL + category.image}
                alt={category.name}
                width={100}
              />
            )}
          </td>
          <td>
            {category.shopIds.map((shop: number, indx: number) => (
              <span key={indx}>
                {useCategories.shopDisplay(
                  useCategories.shops,
                  shop,
                  indx,
                  category,
                )}
              </span>
            ))}
          </td>
          <td>
            <MenuDrop
              trigger={useCategories.trigger}
              data={category}
              handleShowEditModal={
                useCategories.handleShowEditModal as (
                  data: CategoriesType,
                ) => void | null | undefined
              }
              handleShowDuplicate={
                useCategories.handleShowDuplicate as (
                  category: CategoriesType,
                ) => void | null | undefined
              }
              handleShowDeleteModal={useCategories.handleShowDeleteModal}
            />
          </td>
        </tr>
        )))}
        {useCategories.paginatedCategories?.categories?.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center">
              Aucune catégorie trouvée.
            </td>
          </tr>
        )}
        {useCategories.isLoading && <TableLoader lengthTr={5} lengthTd={5} />}
      </tbody>
    </Table>
  );
}
