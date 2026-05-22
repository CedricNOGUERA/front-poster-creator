import { ComponentTypeMulti } from "@/types/ComponentType";

export const createGroupTexts = (
  top: number,
  left: number,
): ComponentTypeMulti[] => {
  return [
    {
      type: "text",
      top,
      left,
      text: "Carton Cup Nouilles",
      fontFamily: "Mulish",
      fontSize: 19,
      fontWeight: 900,
      color: "#000000",
      rotation: 0,
    },

    {
      type: "text",
      top: top + 24,
      left,
      text: "NONGHIM",
      fontFamily: "Mulish",
      fontSize: 16,
      fontWeight: 900,
      color: "#000000",
      rotation: 0,
    },

    {
      type: "text",
      top: top + 43,
      left,
      text: "Boeuf",
      fontFamily: "Mulish",
      fontSize: 16,
      fontWeight: 700,
      color: "#000000",
      rotation: 0,
    },

    {
      type: "text",
      top: top + 64,
      left: left - 2,
      text: "12x175g",
      fontFamily: "Mulish",
      fontSize: 16,
      fontWeight: 400,
      color: "#000000",
      rotation: 0,
    },
  ];
};

export const createComponent = ({
  type,
  src,
  top,
  left,
  right,
  bottom,
}: {
  type: string;
  src: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}): ComponentTypeMulti | null => {
  const componentMap = {
    text: {
      type: "text",
      top,
      left,
      text: "Texte par défaut",
      fontSize: 16,
      fontWeight: 900,
      color: "#000000",
      rotation: 0,
    },

    enableText: {
      type: "enableText",
      top,
      left,
      text: "Texte qui ne change pas",
      fontFamily: "Mulish",
      fontSize: 16,
      fontWeight: 700,
      color: "#000000",
      rotation: 0,
    },

    number: {
      type: "number",
      bottom,
      right,
      text: "1000",
      fontFamily: "Mulish",
      fontSize: 16,
      fontWeight: 700,
      color: "#000000",
      rotation: 0,
      textDecoration: "none",
    },

    price: {
      type: "price",
      bottom,
      right,
      width: 100,
      text: "1000",
      fontFamily: "Impact",
      fontSize: 50,
      fontWeight: 1000,
      color: "#000000",
      rotation: 0,
      textDecoration: "none",
    },

    image: {
      type: "image",
      top,
      left,
      width: 150,
      height: "auto",
      src,
    },

    horizontalLine: {
      type: "horizontalLine",
      top,
      left,
      width: 200,
      color: "#000000",
      thickness: 2,
    },

    verticalLine: {
      type: "verticalLine",
      top,
      left,
      height: 200,
      color: "#000000",
      thickness: 2,
    },
  };

  return (
    (componentMap[type as keyof typeof componentMap] as ComponentTypeMulti) ||
    null
  );
};
