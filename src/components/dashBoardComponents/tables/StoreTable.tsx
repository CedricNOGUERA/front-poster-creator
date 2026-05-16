import TableLoader from "@/components/ui/squeleton/TableLoader";
import ResetFormButton from "@/components/ui/table/ResetFormButton";
import { ShopType } from "@/types/ShopType";
import { StoreHookType } from "@/types/StoresType";
import { createResetForm } from "@/utils/admin/function";
import { Form, Table } from "react-bootstrap";
import DropMenuStore from "../dropMenu/DropMenuStore";
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

  return (
    <Table striped hover responsive="sm" className="shadow">
      <thead className="sticky-sm-top ">
        <tr>
          <th>Id</th>
          <th>Enseigne</th>
          <th>Magasin</th>
          <th style={{ width: "150px" }}>Actions</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th className="py-3">
            <Form.Group controlId="id">
              <Form.Control
                placeholder="id.."
                value={useStore.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  useStore.setId(e.target.value);
                  useStore.setPage("1");
                }}
              />
            </Form.Group>
          </th>
          <th className="py-3">
            <Form.Group controlId="company">
              <Form.Select
                value={useStore.company}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  useStore.setCompany(e.target.value);
                  useStore.setPage("1");
                }}
              >
                <option value="">enseigne...</option>
                {shops?.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </th>
          <th className="py-3">
            <Form.Group controlId="id">
              <Form.Control
                placeholder="Nom.."
                value={useStore.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  useStore.setName(e.target.value);
                  useStore.setPage("1");
                }}
              />
            </Form.Group>
          </th>
          <th className="py-3" style={{ width: "150px" }}>
            <ResetFormButton
              resetForm={resetForm}
              isFiltering={useStore.isFiltering}
            />
          </th>
        </tr>
      </thead>
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
