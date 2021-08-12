<template>
  <div class="links">
    <h2>TreeIII</h2>
    <div>tree editor with node create, delete, and rename</div>
    <div class="container container-border">
      <div class="width-300">
        Current Node
        <br />
        <br />
        Id: {{ currentNode.id }}
        <br />
        <br />
        Name: {{ currentNode.data.name }}
      </div>
      <div class="width-300">
        New Node
        <br />
        <br />Name:
        <!-- <input type="text" v-model="newNode.name" /> -->
        <v-text-field
          v-model="newNode.name"
          label="New node name"
        ></v-text-field>
      </div>
      <div class="width-300">
        <v-btn small color="primary" @click="addNode">Add Node</v-btn>
        <br />
        <br />
        <v-btn small color="success" @click="addSomeNodes"
          >Add Some Nodes</v-btn
        >
        <br />
        <br />
        <v-btn small color="secondary" @click="renameNode">Rename Node</v-btn>
        <br />
        <br />
        <v-btn small color="error" @click="deleteNode">Delete Node</v-btn>
      </div>
    </div>
    <svg id="vizTreeIII" class="container-border" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      root: null,
      svg: null,
      duration: null,
      treeData: {
        name: "Top Level",
        // 'children': [
        //   {
        //     'name': 'Level 2: A',
        //     'children': [
        //       { 'name': 'Son of A' },
        //       { 'name': 'Daughter of A' }
        //     ]
        //   },
        //   { 'name': 'Level 2: B' }
        // ]
      },
      i: null,
      treemap: null,
      currentNode: {
        id: null,
        data: { name: "" },
      },
      newNode: {
        id: 0,
        name: "",
      },
      nodeObj: null,
    };
  },
  mounted() {
    // Set the dimensions and margins of the diagram
    var margin = { top: -200, right: 90, bottom: 30, left: 90 };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    // var svg = d3.select('#viz').attr("viewBox', [-10, -10, width, height])
    // var svg = d3.select('body').append('svg')
    //   .attr('width', width + margin.right + margin.left)
    //   .attr('height', height + margin.top + margin.bottom)
    this.svg = d3
      .select("#vizTreeIII")
      .attr("viewBox", [-10, -10, width, height])
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.nodeObj = d3.hierarchy.prototype.constructor;
    this.i = 0;
    // this.root = null
    this.duration = 750;

    // declares a tree layout and assigns the size
    this.treemap = d3.tree().size([height, width]);
    console.log("this.treemap", this.treemap);

    // Assigns parent, children, height, depth
    // 数据层次化，根据指定的层次结构数据构造一个根节点。指定的数据 data 必须为一个表示根节点的对象。
    // 返回的节点和每一个后代会被附加如下属性：
    /* 
    node.data - 关联的数据，由 constructor 指定.
    node.depth - 当前节点的深度, 根节点为 0.
    node.height - 当前节点的高度, 叶节点为 0.
    node.parent - 当前节点的父节点, 根节点为 null.
    node.children - 当前节点的孩子节点(如果有的话); 叶节点为 undefined.
    node.value - 当前节点以及 descendants(后代节点) 的总计值; 可以通过 node.sum 和 node.count 计算.
    */
    this.root = d3.hierarchy(this.treeData, function (d) {
      return d.children;
    });
    console.log('this.root',this.root);
    this.root.x0 = height / 2;
    this.root.y0 = 0;

    // Collapse after the second level
    // root.children.forEach(collapse)

    // ****************  zoom ************************
    // add zoom capabilities
    let zoomHandler = d3
      .zoom()
      .on("zoom", zoomActions)
      .scaleExtent([1 / 2, 8]);

    this.svg.call(zoomHandler).on("dblclick.zoom", null);
    zoomHandler(this.svg);

    // Zoom functions
    function zoomActions() {
      // gNode.attr('transform', d3.event.transform)
      // gLink.attr('transform', d3.event.transform)
      console.log(`----------zoom------------`);
    }
    // ***********************************************

    this.update(this.root);
  },
  methods: {
    update(source) {
      let self = this;
      // Assigns the x and y position for the nodes
      var treeMapData = this.treemap(this.root);

      // Compute the new tree layout.
      this.nodes = treeMapData.descendants();
      this.links = treeMapData.descendants().slice(1);

      // Normalize for fixed-depth.
      this.nodes.forEach(function (d) {
        d.y = d.depth * 180;
      });

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = this.svg.selectAll("g.node").data(self.nodes, function (d) {
        return d.id || (d.id = ++self.i);
      });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function () {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", self.click);

      // Add Circle for the nodes
      nodeEnter
        .append("circle")
        .attr("class", "node")
        .attr("r", 1e-6)
        .style("fill", function (d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      // Add labels for the nodes
      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", function (d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function (d) {
          return d.data.name;
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // update the text
      node
        .select("text")
        .attr("dy", ".35em")
        .attr("x", function (d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function (d) {
          return d.data.name;
        });

      // Transition to the proper position for the node
      nodeUpdate
        .transition()
        .duration(self.duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // Update the node attributes and style
      nodeUpdate
        .select("circle.node")
        .attr("r", 10)
        .style("fill", function (d) {
          return d._children ? "lightsteelblue" : "#fff";
        })
        .attr("cursor", "pointer");

      // Remove any exiting nodes
      var nodeExit = node
        .exit()
        .transition()
        .duration(self.duration)
        .attr("transform", function () {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select("circle").attr("r", 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = this.svg.selectAll("path.link").data(self.links, function (d) {
        return d.id;
      });

      // Enter any new links at the parent's previous position.
      var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", function () {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        .transition()
        .duration(self.duration)
        .attr("d", function (d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      link
        .exit()
        .transition()
        .duration(self.duration)
        .attr("d", function () {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      this.nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
        return path;
      }
    },
  },
};
</script>

<style scoped>
.links {
  width: 100%;
  height: 100%;
  /* background-color: green; */
}
</style>
<style >
#vizTreeIII circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

#vizTreeIII .node text {
  font: 12px sans-serif;
}

#vizTreeIII .link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
</style>
<style scoped>
.container {
  display: flex;
  margin: 10px 0;
  text-align: left;
  width: 100%;
}
.width-300 {
  width: 300px;
  margin: 0 10px;
}
</style>