import React from "react";
import { Form, Button, ButtonGroup, InputGroup } from "react-bootstrap";
import {
  ComponentTypeMulti,
  TextComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
} from "@/types/ComponentType";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowsLeftRight,
  FaArrowsUpDown,
  FaArrowUp,
} from "react-icons/fa6";
import { FaArrowsAlt } from "react-icons/fa";
import {
  movePosition,
  updateComponent,
} from "@/utils/positionControlFunctions";

interface PositionControlsProps {
  component:
    | TextComponentType
    | NumberComponentType
    | PrincipalPriceComponentType;
  index: number;
  canvasData: ComponentTypeMulti[];
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>;
  pageWidth: number;
  pageHeight: number;
  scaleFactor: number;
}

interface MoveButtonType {
  direction: "up" | "down" | "left" | "right";
  icon: React.ReactNode;
  title: string;
}

export default function PositionControls({
  component,
  index,
  canvasData,
  setCanvasData,
  pageWidth,
  pageHeight,
  scaleFactor,
}: PositionControlsProps) {

  const isPriceOrNumber =
    component.type === "price" || component.type === "number";


  const moveButton: MoveButtonType[] = [
    { direction: "up", icon: <FaArrowUp />, title: "Déplacer vers le haut" },
    { direction: "down", icon: <FaArrowDown />, title: "Déplacer vers le bas" },
    {
      direction: "left",
      icon: <FaArrowLeft />,
      title: "Déplacer vers la gauche",
    },
    {
      direction: "right",
      icon: <FaArrowRight />,
      title: "Déplacer vers la droite",
    },
  ];
 

  return (
    <div className="position-controls">
      {/* Contrôles de déplacement avec boutons directionnels */}
      <div className="mb-3">
        <Form.Label className="fw-bold">
          <FaArrowsAlt className="me-2" />
          Position
        </Form.Label>

        {/* Boutons de déplacement rapide */}
        <div className="d-flex justify-content-center mb-2">
          <ButtonGroup size="sm">
            {moveButton.map((btn) => (
              <Button
                key={btn.direction}
                variant="outline-secondary"
                onClick={() =>
                  movePosition(
                    btn.direction,
                    10,
                    component,
                    canvasData,
                    setCanvasData,
                    index,
                    pageHeight,
                    pageWidth,
                    scaleFactor,
                  )
                }
                title={btn.title}
              >
                {btn.icon}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Contrôles précis avec inputs numériques */}
        <div className="row g-2">
          {/* Position verticale */}
          <div className="col-6">
            <Form.Label className="small">
              <FaArrowsUpDown className="me-1" />
              Vert.
            </Form.Label>
            <Form.Range
              min={0}
              max={pageHeight * scaleFactor}
              step={1}
              value={
                isPriceOrNumber ? component.bottom || 0 : component.top || 0
              }
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (isPriceOrNumber) {
                  updateComponent(
                    {
                      bottom: value,
                    } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >,
                    canvasData,
                    setCanvasData,
                    index,
                  );
                } else {
                  updateComponent(
                    {
                      top: value,
                    } as Partial<TextComponentType>,
                    canvasData,
                    setCanvasData,
                    index,
                  );
                }
              }}
            />
            <InputGroup size="sm">
              <Form.Control
                type="number"
                min={0}
                max={
                  isPriceOrNumber
                    ? pageHeight * scaleFactor
                    : pageHeight * scaleFactor
                }
                step={1}
                value={
                  isPriceOrNumber ? component.bottom || 0 : component.top || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (
                    component.type === "price" ||
                    component.type === "number"
                  ) {
                    updateComponent(
                      { bottom: value } as Partial<
                        NumberComponentType | PrincipalPriceComponentType
                      >,
                      canvasData,
                      setCanvasData,
                      index,
                    );
                  } else {
                    updateComponent(
                      {
                        top: value,
                      } as Partial<TextComponentType>,
                      canvasData,
                      setCanvasData,
                      index,
                    );
                  }
                }}
              />
            </InputGroup>
          </div>

          {/* Position horizontale */}
          <div className="col-6">
            <Form.Label className="small">
              <FaArrowsLeftRight className="me-1" />
              Horiz.
            </Form.Label>
            <Form.Range
              min={0}
              max={pageWidth * scaleFactor}
              step={1}
              value={
                isPriceOrNumber
                  ? pageWidth * scaleFactor - (component.right || 0) // Inversion ici
                  : component.left || 0
              }
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (isPriceOrNumber) {
                  updateComponent(
                    {
                      right: pageWidth * scaleFactor - value, // Inversion ici
                    } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >,
                    canvasData,
                    setCanvasData,
                    index,
                  );
                } else {
                  updateComponent(
                    {
                      left: value,
                    } as Partial<TextComponentType>,
                    canvasData,
                    setCanvasData,
                    index,
                  );
                }
              }}
            />
            <InputGroup size="sm">
              <Form.Control
                type="number"
                min={0}
                max={pageWidth * scaleFactor}
                step={1}
                value={
                  isPriceOrNumber
                    ? pageWidth * scaleFactor - (component.right || 0) // Inversion ici
                    : component.left || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (
                    component.type === "price" ||
                    component.type === "number"
                  ) {
                    updateComponent(
                      {
                        right: pageWidth * scaleFactor - value,
                      } as Partial<
                        NumberComponentType | PrincipalPriceComponentType
                      >,
                      canvasData,
                      setCanvasData,
                      index,
                    );
                  } else {
                    updateComponent(
                      {
                        left: value,
                      } as Partial<TextComponentType>,
                      canvasData,
                      setCanvasData,
                      index,
                    );
                  }
                }}
              />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
