import TableLoader from "@/components/ui/squeleton/TableLoader";
import { ShopType } from "@/types/ShopType";
import { StoreHookType } from "@/types/StoresType";
import { createResetForm } from "@/utils/admin/function";
import { Table } from "react-bootstrap";
import DropMenuStore from "../dropMenu/DropMenuStore";
import TableFilters, { FilterField } from "@/components/ui/table/TableFilter";
import TableHeader from "@/components/ui/table/TableHeader";
const API_URL = import.meta.env.VITE_API_URL;

export default function StoreTable({
  useStore,
  shops,
}: {
  useStore: StoreHookType;
  shops: ShopType[];
}) {

  const resetForm = createResetForm({
    setId: useStore?.setId,
    setNAme: useStore.setName,
    setCompany: useStore.setCompany,
  });

  const fields: FilterField[] = [
    {
      type: "text",
      controlId: "id",
      placeholder: "Id",
      value: useStore.id,
      onChange: (v: string) => {
        useStore.setId(v);
        useStore.setPage("1");
      },
    },
    {
      type: "select",
      controlId: "company",
      placeholder: "Enseigne",
      value: useStore.company,
      options: shops,
      onChange: (v: string) => {
        useStore.setCompany(v);
        useStore.setPage("1");
      },
    },
    {
      type: "text",
      controlId: "name",
      placeholder: "Magasin",
      value: useStore.name,
      onChange: (v: string) => {
        useStore.setName(v);
        useStore.setPage("1");
      },
    },
  ];

  return (
    <Table striped hover responsive="sm" className="shadow">
      <TableHeader columnsData={useStore.columnsData} />

      <TableFilters
        fields={fields}
        resetForm={resetForm}
        isFiltering={useStore.isFiltering}
      />
      <tbody>
        {useStore.paginatedStores?.stores?.map((store) => {
          const shop = shops.find((shop) => shop.id === store.companyId);
          return (
            <tr key={store.id} className="align-middle">
              <td>{store.id}</td>
              <td>
                <img
                  src={API_URL + "/" + shop?.cover || ""}
                  alt={shop?.name}
                  width={50}
                />
              </td>
              <td>{store?.name}</td>
              <td>
                <DropMenuStore
                  store={store}
                  setSelectedStore={useStore.setSelectedStore}
                  setShowEditModal={useStore.setShowEditModal}
                  setShowDeleteModal={useStore.setShowDeleteModal}
                />
              </td>
            </tr>
          );
        })}
        {useStore.paginatedStores?.stores?.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center">
              Aucune connexion trouvée.
            </td>
          </tr>
        )}
        {useStore.isLoadingDisplay && <TableLoader lengthTr={5} lengthTd={4} />}
      </tbody>
    </Table>
  );
}
