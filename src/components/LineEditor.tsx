import { Form, Row, Col } from 'react-bootstrap'
import { ComponentTypeMulti, HorizontalLineComponentType, VerticalLineComponentType } from '@/types/ComponentType'

interface LineEditorProps {
  component: ComponentTypeMulti
  updateComponent: (updatedFields: Partial<ComponentTypeMulti>) => void
}

export default function LineEditor({ component, updateComponent }: LineEditorProps) {
  const isHorizontal = component.type === 'horizontalLine'
  const lineComp = component as HorizontalLineComponentType | VerticalLineComponentType

  return (
    <div>
      <h5 className='fw-bold text-secondary mb-3'>
        Éditeur de {isHorizontal ? 'ligne horizontale' : 'ligne verticale'}
      </h5>
      
      <Row className='mb-3'>
        <Col>
          <Form.Group>
            <Form.Label>Couleur</Form.Label>
            <Form.Control
              type='color'
              value={lineComp.color}
              onChange={(e) => updateComponent({ color: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col>
          <Form.Group>
            <Form.Label>Épaisseur (px)</Form.Label>
            <Form.Control
              type='number'
              min='1'
              max='20'
              value={lineComp.thickness}
              onChange={(e) => updateComponent({ thickness: parseInt(e.target.value) })}
            />
          </Form.Group>
        </Col>
      </Row>

      {isHorizontal ? (
        <Row className='mb-3'>
          <Col>
            <Form.Group>
              <Form.Label>Largeur (px)</Form.Label>
              <Form.Control
                type='number'
                min='10'
                max='1000'
                value={(lineComp as HorizontalLineComponentType).width}
                onChange={(e) => updateComponent({ width: parseInt(e.target.value) })}
              />
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <Row className='mb-3'>
          <Col>
            <Form.Group>
              <Form.Label>Hauteur (px)</Form.Label>
              <Form.Control
                type='number'
                min='10'
                max='1000'
                value={(lineComp as VerticalLineComponentType).height}
                onChange={(e) => updateComponent({ height: parseInt(e.target.value) })}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      <Row className='mb-3'>
        <Col>
          <Form.Group>
            <Form.Label>Position X (px)</Form.Label>
            <Form.Control
              type='number'
              value={lineComp.left}
              onChange={(e) => updateComponent({ left: parseInt(e.target.value) })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col>
          <Form.Group>
            <Form.Label>Position Y (px)</Form.Label>
            <Form.Control
              type='number'
              value={lineComp.top}
              onChange={(e) => updateComponent({ top: parseInt(e.target.value) })}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}
