import { FaPlusCircle } from "react-icons/fa";

export default function AddElementCard({role, handleShowAdd, label}: {role: string; handleShowAdd: () => void, label: string}) {
  return (
    <>
      {role === "super_admin" && (
        <div
          className="hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center"
          style={{ width: "200px", height: "183px" }}
          onClick={() => handleShowAdd()}
        >
          <FaPlusCircle className="text-primary fs-1" />
          <p className="mt-2 text-center fw-bold fs-5 text-primary">{label}</p>
        </div>
      )}
    </>
  );
}
