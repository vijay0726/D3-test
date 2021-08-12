<template>
  <div>
    <button>change</button>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      // 数据
      treeData: {
        name: "flare",
        children: [
          {
            name: "animate",
            children: [
              { name: "Easing", value: 17010 },
              { name: "FunctionSequence", value: 5842 },
              {
                name: "interpolate",
                children: [
                  { name: "ArrayInterpolator", value: 1983 },
                  { name: "ColorInterpolator", value: 2047 },
                  { name: "DateInterpolator", value: 1375 },
                  { name: "Interpolator", value: 8746 },
                  { name: "MatrixInterpolator", value: 2202 },
                  { name: "NumberInterpolator", value: 1382 },
                  { name: "ObjectInterpolator", value: 1629 },
                  { name: "PointInterpolator", value: 1675 },
                  { name: "RectangleInterpolator", value: 2042 },
                ],
              },
              { name: "ISchedulable", value: 1041 },
              { name: "Parallel", value: 5176 },
              { name: "Pause", value: 449 },
              { name: "Scheduler", value: 5593 },
              { name: "Sequence", value: 5534 },
              { name: "Transition", value: 9201 },
              { name: "Transitioner", value: 19975 },
              { name: "TransitionEvent", value: 1116 },
              { name: "Tween", value: 6006 },
            ],
          },
          {
            name: "display",
            children: [
              { name: "DirtySprite", value: 8833 },
              { name: "LineSprite", value: 1732 },
              { name: "RectSprite", value: 3623 },
              { name: "TextSprite", value: 10066 },
            ],
          },
          {
            name: "flex",
            children: [{ name: "FlareVis", value: 4116 }],
          },
          {
            name: "physics",
            children: [
              { name: "DragForce", value: 1082 },
              { name: "GravityForce", value: 1336 },
              { name: "IForce", value: 319 },
              { name: "NBodyForce", value: 10498 },
              { name: "Particle", value: 2822 },
              { name: "Simulation", value: 9983 },
              { name: "Spring", value: 2213 },
              { name: "SpringForce", value: 1681 },
            ],
          },
          {
            name: "scale",
            children: [
              { name: "IScaleMap", value: 2105 },
              { name: "LinearScale", value: 1316 },
              { name: "LogScale", value: 3151 },
              { name: "OrdinalScale", value: 3770 },
              { name: "QuantileScale", value: 2435 },
              { name: "QuantitativeScale", value: 4839 },
              { name: "RootScale", value: 1756 },
              { name: "Scale", value: 4268 },
              { name: "ScaleType", value: 1821 },
              { name: "TimeScale", value: 5833 },
              { name: "ad", value: 1756 },
              { name: "fd", value: 4268 },
              { name: "ScgfgfaleType", value: 1821 },
              { name: "TimeS2wcale", value: 5833 },
            ],
          },
        ],
      },
      // 树布局
      tree: null,
    };
  },
  mounted() {
      this.initTree()
  },
  methods: {
    initTree() {
      // 数据

      // 1、 选中页面给页面添加svg标签；设置Svg绘制区域的宽和高；添加g元素(svg的group分组标签元素)并设置位置。
      var width = 500;
      var height = 500;
      var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(150,150)");
      // 2、生成树状布局，设置树图布局容器尺寸。
      this.tree = d3.tree().size([2 * Math.PI, 100]).separation(function (a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      });//[360,320]
      let root = d3.hierarchy(this.treeData);
      console.log('root',root);
      let temp = this.tree(root);
        console.log('temp',temp);
      // 3、对角线生成器,并旋转90度。
      let diagonal = d3
        .linkHorizontal()
        .x(function (d) {
          return d.y;
        })
        .y(function (d) {
          return d.x;
        }); //横纵坐标对调(x,y) => (y,x)

      // 4、请求数据：

      // 4.1获取nodes节点数组和links连线数组。
      let nodes = root.descendants();
      let links = root.links();
      // 4.2生成连线。
      let link = svg
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
          .angle(function(d) { return d.x; })
          .radius(function(d) { return d.y; }));
      // 4.3生成节点。
      let node = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        })
        .on("click", () => {
          console.log(`----------click------------`);
        })
        .on("mouseover", () => {
          console.log(`----------hover------------`);
        });

      // 4.4给节点添加圆圈，设置半径。
      node.append("circle").attr("r", 5);
      // 4.5给节点添加文本，设置文本的样式位置。
      node
        .append("text")
        .text((d) => d.name)
        .attr("dx", (d) => (d.children ? -15 : 15))
        .attr("dy", 5)
        .attr("text-anchor", (d) => (d.children ? "end" : "start"));
    },
  },
};
</script>

<style scoped>
/* 圈圈节点样式 */
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1.5px;
}
/* 文字样式 */
.node text {
  font-size: 12px;
}
/* 连线的样式 */
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
button {
  background-color: rgb(100, 190, 100);
  border: 1px solid #000;
}
</style>