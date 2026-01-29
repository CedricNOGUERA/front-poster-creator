import { ModelType } from "@/types/modelType";
import { TemplateType } from "@/types/TemplatesType";
import { Container, Form, InputGroup } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface SearchBarType {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    data: ModelType[] | TemplateType[]
}

export default function SearchBar({seachBarProps}: {seachBarProps: SearchBarType}) {

    const {searchTerm, setSearchTerm, data} = seachBarProps;

    return(
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
              placeholder="Id, nom ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              required
            />
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
    )
}