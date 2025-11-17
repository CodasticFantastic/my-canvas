import { Group, Rect, Text } from "react-konva";

type ElementDimensionsLabelProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
};

export function ElementDimensionsLabel({ x, y, width, height, zoom }: ElementDimensionsLabelProps) {
  const fontSize = 12 / zoom;
  const text = `${Math.round(width)} × ${Math.round(height)}`;

  const avgCharWidth = fontSize * 0.6;
  const padding = 6 / zoom;
  const textWidthApprox = text.length * avgCharWidth;

  const labelWidth = textWidthApprox + padding * 2;
  const labelHeight = fontSize + padding * 2;

  // Position of the label - below the element, centered
  const labelX = x + width / 2 - labelWidth / 2;
  const labelY = y + height + 8 / zoom;

  return (
    <Group>
      {/* Background of the label */}
      <Rect
        x={labelX}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
        fill="#3b82f6"
        cornerRadius={4 / zoom}
        shadowBlur={4 / zoom}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowOffset={{ x: 0, y: 2 / zoom }}
        listening={false}
      />
      {/* Text of the dimensions */}
      <Text
        x={labelX}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
        text={text}
        fontSize={fontSize}
        fontFamily="sans-serif"
        fill="#ffffff"
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </Group>
  );
}
