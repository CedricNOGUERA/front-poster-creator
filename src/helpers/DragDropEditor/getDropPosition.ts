export const getDropPosition = (
  e: React.DragEvent<HTMLDivElement>,
  canvasElement: HTMLDivElement
) => {
  const canvasRect =
    canvasElement.getBoundingClientRect();

  const left =
    e.clientX - canvasRect.left;

  const top =
    e.clientY - canvasRect.top;

  return {
    top,
    left,
    right: canvasRect.width - left,
    bottom: canvasRect.height - top,
  };
};