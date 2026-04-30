import {
  BackgroundComponentType,
  ComponentTypeMulti,
  HeaderComponentType,
  HorizontalLineComponentType,
  ImageComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
  VerticalLineComponentType,
} from "@/types/ComponentType";
import { _thousandSeparator } from "./functions";

/// Fonction pour rendre les composants sur le canvas d'édition
const canvasRenderer = (
  component: ComponentTypeMulti,
  index: number,
  getBaseTextStyle: (
    component:
      | PrincipalPriceComponentType
      | NumberComponentType
      | TextComponentType,
  ) => React.CSSProperties,
  getPositionStyle: (
    component:
      | BackgroundComponentType
      | HeaderComponentType
      | HorizontalLineComponentType
      | VerticalLineComponentType,
  ) => React.CSSProperties,
  API_URL: string,
) => {
  
  const sanitizeHTML = (html: string): string => {
    if (!html) return "";

    // Liste des balises autorisées
    const allowedTags = [
      "b",
      "i",
      "u",
      "strong",
      "em",
      "sup",
      "sub",
      "br",
      "span",
      "div",
      "p",
    ];

    // Créer un élément temporaire pour parser le HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Fonction récursive pour nettoyer les nœuds
    const cleanNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Si la balise n'est pas autorisée, retourner seulement le texte
        if (!allowedTags.includes(tagName)) {
          return element.textContent || "";
        }

        // Récupérer les attributs de style autorisés
        const allowedAttributes = ["style", "class"];
        const attributes = Array.from(element.attributes)
          .filter((attr) => allowedAttributes.includes(attr.name))
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(" ");

        // Construire la balise ouvrante
        const openTag = attributes
          ? `<${tagName} ${attributes}>`
          : `<${tagName}>`;

        // Traiter les enfants
        let innerHTML = "";
        for (const child of Array.from(element.childNodes)) {
          innerHTML += cleanNode(child);
        }

        // Retourner la balise complète
        return `${openTag}${innerHTML}</${tagName}>`;
      }

      return "";
    };

    // Nettoyer tous les nœuds
    let cleanedHTML = "";
    for (const child of Array.from(tempDiv.childNodes)) {
      cleanedHTML += cleanNode(child);
    }

    return cleanedHTML;
  };

  if (component.type === "price") {
    const priceComp = component as PrincipalPriceComponentType;
    const numberValue = parseInt(priceComp?.text.replace(/\D/g, ""), 10);
    const formattedNumber = !isNaN(numberValue)
      ? _thousandSeparator(numberValue)
      : priceComp?.text;

    const priceStyle: React.CSSProperties = {
      ...getBaseTextStyle(priceComp),
      bottom: `${priceComp?.bottom ?? 0}px`,
      right: `${priceComp?.right ?? 0}px`,
      height: "auto",
      fontSize: `${priceComp?.fontSize}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <div
        key={index}
        className={`absolute cursor-move pointer`}
        style={priceStyle}
      >
        <div style={{ whiteSpace: "nowrap" }}>
          <span
            style={{
              textDecoration: priceComp?.textDecoration ?? "none",
            }}
          >
            {formattedNumber}
          </span>
          <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>F</sup>
        </div>
      </div>
    );
  }
  if (component.type === "number") {
    const numberComp = component as NumberComponentType;
    const numberValue = parseFloat(numberComp.text);

    const formattedNumber = isNaN(numberValue)
      ? numberComp.text
      : _thousandSeparator(numberValue);
    const numberStyle: React.CSSProperties = {
      ...getBaseTextStyle(numberComp),
      bottom: `${numberComp.bottom ?? 0}px`,
      right: `${numberComp.right ?? 0}px`,
      minWidth: `${20}px`,
      minHeight: `${10}px`,
      fontSize: numberComp?.fontSize,
      padding: `0 ${5}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <div
        key={index}
        className={`absolute cursor-move pointer`}
        style={numberStyle}
      >
        <div style={{ whiteSpace: "nowrap" }}>
          <span
            style={{
              textDecoration: numberComp.textDecoration ?? "none",
            }}
          >
            {formattedNumber}
          </span>
          <sup style={{ fontSize: "0.6em", marginLeft: "1px" }}>F</sup>
        </div>
      </div>
    );
  }
  if (component.type === "text") {
    const textComp = component as TextComponentType;
    const textStyle: React.CSSProperties = {
      ...getBaseTextStyle(textComp),
      top: `${textComp?.top ?? 0}px`,
      left: `${textComp?.left ?? 0}px`,
      fontSize: `${textComp?.fontSize ?? 16}px`,
      minWidth: `${20}px`,
      minHeight: `${10}px`,
      padding: `0 ${5}px`,
      textDecoration: textComp.textDecoration ?? "none",
      lineHeight: `${textComp.fontSize}px`,
    };

    return (
      <div
        key={index}
        className={`absolute cursor-move pointer text-start`}
        style={textStyle}
      >
        <div>
          <span
            style={{
              fontFamily: textComp.fontFamily,
              textDecoration: textComp.textDecoration ?? "none",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(textComp?.text || ""),
            }}
          />
        </div>
      </div>
    );
  }
  if (component.type === "enableText") {
    const textComp = component as TextComponentType;
    const enableTextStyle: React.CSSProperties = {
      ...getBaseTextStyle(textComp),
      // position: "absolute",
      // fontFamily: textComp.fontFamily,
      // fontWeight: textComp?.fontWeight,
      // transform: `rotate(${textComp?.rotation}deg)`,
      // color: textComp?.color,
      // wordBreak: "break-word",
      top: `${textComp?.top ?? 0}px`,
      left: `${textComp?.left ?? 0}px`,
      fontSize: `${textComp?.fontSize ?? 16}px`,
      minWidth: `${20}px`,
      minHeight: `${10}px`,
      padding: `0 ${5}px`,
      textDecoration: textComp.textDecoration ?? "none",
      lineHeight: `${textComp.fontSize}px`,
    };

    return (
      <div
        key={index}
        className={`absolute cursor-move pointer text-start`}
        style={enableTextStyle}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(textComp?.text || ""),
          }}
        />
      </div>
    );
  }
  if (component.type === "background-color") {
    const bgComp = component as BackgroundComponentType;
    const bgStyle: React.CSSProperties = {
      ...getPositionStyle(bgComp),
      backgroundColor: bgComp.backgroundColor,
    };
    return (
      <div key={index} className={`absolute cursor-move`} style={bgStyle}></div>
    );
  }
  if (component.type === "header") {
    const headerComp = component as HeaderComponentType;
    return (
      <div
        key={index}
        className={`absolute cursor-move`}
        style={{
          ...getPositionStyle(headerComp),
          backgroundColor: headerComp.backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding:
            headerComp?.width &&
            headerComp?.height &&
            headerComp?.width < headerComp?.height
              ? "5%"
              : "1%",
        }}
      >
        <img
          src={headerComp.src ? API_URL + headerComp.src : undefined}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    );
  }
  if (component.type === "image") {
    const imgComp = component as ImageComponentType;
    return (
      <div
        key={index}
        className={`absolute cursor-move`}
        style={{
          position: "absolute",
          top: `${imgComp.top ?? 0}px`,
          left: `${imgComp.left ?? 0}px`,
        }}
      >
        <img
          src={imgComp?.src ? API_URL + imgComp?.src : ""}
          alt={imgComp?.src ?? ""}
          style={{
            width: `${imgComp.width ?? 0}px`,
            height: `auto`,
            objectFit: "contain",
          }}
        />
      </div>
    );
  }
  if (component.type === "horizontalLine") {
    const horizontalComp = component as HorizontalLineComponentType;
    return (
      <div
        key={index}
        className={`absolute cursor-move`}
        style={{
          ...getPositionStyle(horizontalComp),
          width: `${horizontalComp.thickness}px`,
          backgroundColor: horizontalComp.color,
        }}
      ></div>
    );
  }
  if (component.type === "verticalLine") {
    const verticalComp = component as VerticalLineComponentType;
    return (
      <div
        key={index}
        className={`absolute cursor-move`}
        style={{
          ...getPositionStyle(verticalComp),
          width: `${verticalComp.thickness}px`,
          backgroundColor: verticalComp.color,
        }}
      ></div>
    );
  }
  return null;
};

// Boucle pour injecter les styles globaux et les composants nécessaires au canvas d'édition
export const _renderCanvasDisplay = (
  canvasData: ComponentTypeMulti[],
  API_URL: string,
) => {
  const getBaseTextStyle = (
    component:
      | PrincipalPriceComponentType
      | NumberComponentType
      | TextComponentType,
  ): React.CSSProperties => ({
    position: "absolute",
    fontFamily: component.fontFamily,
    fontWeight: component.fontWeight,
    color: component.color,
    wordBreak: "break-word",
    transform: `rotate(${component.rotation ?? 0}deg)`,
  });
  const getPositionStyle = (
    component:
      | BackgroundComponentType
      | HeaderComponentType
      | HorizontalLineComponentType
      | VerticalLineComponentType,
  ): React.CSSProperties => ({
    position: "absolute",
    top: `${component.top ?? 0}px`,
    left: `${component.left ?? 0}px`,
    width: `${component.width ?? 0}px`,
    height: `${component.height ?? 0}px`,
  });

  return canvasData?.map((component: ComponentTypeMulti, index: number) => {
    return canvasRenderer(
      component,
      index,
      getBaseTextStyle,
      getPositionStyle,
      API_URL,
    );
  });
};
