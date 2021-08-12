<template>
  <div class="hello">
    <h1>柱状图</h1>
    <svg class="bar-chart"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";
export default {
  name: "HelloWorld",
  data() {
    return {
      
    }
  },
  mounted() {
    console.log(`----------helloworld------------`);
    // 
    let barChartData = [80, 100, 56, 120, 180, 30, 40, 120, 160];

    let svgWidth = 500 ,svgHeight = 300, barPadding = 5;

    let barWidth = (svgWidth / barChartData.length);

    // 绘制图形
    let svg = d3.select('svg').attr('width',svgWidth).attr('height',svgHeight)


    let barChart = svg.selectAll('rect').data(barChartData).enter().append("rect").attr("y", d => svgHeight - d ) // d为数据集每一项的值, 取y坐标
    .attr("height", d => d) // 设定高度
    .attr("width", barWidth - barPadding) // 设定宽度
    .attr("transform", (d, i) =>  {
        let translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    }); // 实际是计算每一项值的x坐标


  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  background-color: red;
  width: 100%;
  height: 100%;
}
text {
  font-family: sans-serif;
  font-size: 10px;
}
.node {
  stroke-linecap: round;
}
.link {
  fill: none;
}
</style>
