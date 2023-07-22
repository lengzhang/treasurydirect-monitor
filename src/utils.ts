const CHARTJS_COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

export function getChartJSColor(index: number) {
  return CHARTJS_COLORS[index % CHARTJS_COLORS.length];
}
