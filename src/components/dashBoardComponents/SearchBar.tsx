import { CategoriesType } from "@/types/CategoriesType";
import { ModelType } from "@/types/modelType";
import { TemplateType } from "@/types/TemplatesType";
import { UserType } from "@/types/UserType";
import { Container, Form, InputGroup } from "react-bootstrap";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

interface SearchBarType {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    data: ModelType[] | TemplateType[] | CategoriesType[] | UserType[]
}

export default function SearchBar({seachBarProps}: {seachBarProps: SearchBarType}) {

    const {searchTerm, setSearchTerm, data} = seachBarProps;

    console.log(data)

    return (
      <Container className="d-flex align-items-center">
        <Form.Group className="mb-3 mt-2" controlId="search">
          <InputGroup>
            <InputGroup.Text className="rounded-end rounded-pill border-end-0">
              <FaMagnifyingGlass />
            </InputGroup.Text>
            <Form.Control
              className="rounded-start rounded-pill"
              name="searchBar"
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              required
            />
            <div
              className="p-absolute rounded-pill px-2 py-0 pb-1 "
              onClick={() => setSearchTerm("")}
            >
              <FaXmark  />
            </div>
          </InputGroup>
        </Form.Group>

        {/* Affichage du nombre de résultats */}
        {searchTerm && (
          <div className="text-muted ms-2 mb-2">
            {data.length} résultat{data.length > 1 ? "s" : ""} trouvé
            {data.length > 1 ? "s" : ""}
          </div>
        )}
      </Container>
    );
}