interface GetRandomColorProps {
  hue?: number;
  saturation?: number;
  lightness?: number;
}
export const getRandomColor = ({
  hue,
  saturation,
  lightness,
}: GetRandomColorProps = {}) => {
  if (!hue) hue = 360 * Math.random();
  if (!saturation) saturation = 50;
  if (!lightness) lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
