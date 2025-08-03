import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// Register the components and charts
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

export default defineNuxtPlugin(() => {
  // Make echarts available globally
  return {
    provide: {
      echarts,
    },
  };
});
