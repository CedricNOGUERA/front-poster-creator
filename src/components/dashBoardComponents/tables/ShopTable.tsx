import TableLoader from "@/components/ui/squeleton/TableLoader";
import MenuDrop from "@/components/ui/table/MenuDrop";
import TableHeader from "@/components/ui/table/TableHeader";
import { ShopHookType, ShopType } from "@/types/ShopType";
import { Table } from "react-bootstrap";
 const API_URL = import.meta.env.VITE_API_URL;

export default function ShopTable({
  useShop
}: {
  useShop: ShopHookType;
}) {



      const shopDisplay = (shops: ShopType[]) => {
        return shops.map((shop) => (
          <tr key={shop.id} className="align-middle">
            <td>{shop.id}</td>
            <td>
              <img src={API_URL + "/" + shop.cover} alt={shop?.name} width={50} />
            </td>
            <td>{shop?.name}</td>
            <td>
              <MenuDrop
                trigger={useShop.trigger}
                data={shop}
                handleShowDeleteModal={useShop.handleShowDeleteModal}
              />
            </td>
          </tr>
        ));
      };

  return (
    <Table striped hover responsive="sm" className="shadow">
      <TableHeader columnsData={useShop.columnsData} />
      <tbody>
        {!useShop.isLoading && useShop.shops?.length > 0 ? (
          <>{shopDisplay(useShop.shops)}</>
        ) : (
          <TableLoader lengthTr={5} lengthTd={3} />
        )}
      </tbody>
    </Table>
  );
}
