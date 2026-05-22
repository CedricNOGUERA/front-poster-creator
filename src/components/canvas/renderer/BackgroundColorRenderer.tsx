interface BackgroundColorRendererType {
    index: number;
    commonProps: React.HTMLAttributes<HTMLDivElement>;
  
}

export function BackgroundColorRenderer({ index, commonProps }: BackgroundColorRendererType) {
  return <div key={index} {...commonProps} />;
}