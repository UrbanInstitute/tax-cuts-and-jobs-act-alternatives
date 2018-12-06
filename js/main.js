d3.json("data/data.json", function(points){
  var shown;

  var margin = {top: 20, right: 10, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#chartContainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

  // var factory = d3.quadtree()
  //   .extent([
  //     [0, 0],
  //     [width, height]
  //   ]);

  var x = d3.scaleLinear()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)

  var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yg = svg.append("g")
    .attr("class", "y axis");

  var chartArea = d3.select("#chartContainer").append("div")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px")
    .style("position", "absolute")
    // .style("z-index","-1");

  var canvas = chartArea.append("canvas")
    .attr("width", width)
    .attr("height", height);

  var context = canvas.node().getContext("2d");

  

  // Layer on top of canvas, example of selection details
  var highlight = chartArea.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("left", 0)
    .style("top", 0)
      .append("circle")
        .attr("r", 3)
        .classed("hidden", true);

  function init(){
    points.forEach(function(p,i){
      p.x = p["inc_q1_all"]
      p.y = p["burden"]
    })
    shown = points.map(function(p){ return [p.x, p.y] })

  }

  function draw() {

    // Randomize the scale
    var scale = 1 + Math.floor(Math.random() * 10);

  // y, -550 to 250
  // x, -2.5, 5.5


    // Redraw axes
    x.domain([-3.5, 5.5]);
    y.domain([-550, 250]);
    xg.call(xAxis);
    yg.call(yAxis);


    var tree = d3.quadtree()
    .extent([
      [0, 0],
      [width, height]
    ])



    // Update canvas
    context.clearRect(0, 0, width, height);

    points.forEach(function(p,i){

      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(p.hide){
         context.fillStyle = "rgba(0, 0, 0, 0.008)";
         context.fill();
      }
    });

    points.forEach(function(p,i){

      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(!p.hide){
         context.fillStyle = "rgba(22,150,210, 0.3)";
         context.fill();
         tree.add([p.x, p.y])
      }
    });

    console.log(tree.data())
    console.log(shown)


// var  shown2 = points.filter(function(p){ return p.hide == false })
//     .map(function(p){ return [p.x, p.y] })


    // .addAll(shown2);

  canvas.on("mousemove",function(){

    var mouse = d3.mouse(this),
        closest = tree.find(x.invert(mouse[0]), y.invert(mouse[1]),1);
    // tree.visit(function(node, x0, y0, x1, y1){
    //   // console.log(x0, y0)
    // })
    // console.log(mouse, closest)

    if(typeof(closest) != "undefined"){
      highlight.classed("hidden", false)
        .attr("cx", x(closest[0]))
        .attr("cy", y(closest[1]));
    }else{
      highlight.classed("hidden", true);
    }

  });

  canvas.on("mouseover",function(){
    highlight.classed("hidden", false);
  });

  canvas.on("mouseout",function(){
    highlight.classed("hidden", true);
  });


  }

  init();


  draw(); 

d3.select("#groupMenu").on("input", function(){
  animateLayout(d3.select("#incomeMenu").node().value, this.value)
})

d3.select("#incomeMenu").on("input", function(){
  animateLayout(this.value, d3.select("#groupMenu").node().value)
})


d3.selectAll(".control")
  .on("input", function(){
    filterPoints(getFilterVals())
  })



const duration = 1000;
const ease = d3.easeCubic;
let timer;

function getFilterVals(){
  var returned = {}
  var filterVars = ["standard", "rates", "amtThreshold", "amtAmount", "personal","salt", "ctcAmount", "ctcThreshold"]
  for(var i = 0; i < filterVars.length; i++){
    var vals = []
    var filterVar = filterVars[i]
    d3.selectAll(".control." + filterVar).each(function(){
      if(this.checked){ vals.push(this.value) }
    })
    returned[filterVar] = vals
  }
  return returned
}

function filterPoints(filters){
  points.forEach(function(point){
    point.hide = false;
    for(var filter in filters){
      if(point.hide){
        continue
      }else{
        if(filters.hasOwnProperty(filter)){
          var vals = filters[filter]
          if(vals.indexOf(point[filter]) == -1){
              point.hide = true
          }else{
            point.hide = false;
          }
        }
      }
    }

  })
  shown = points.filter(function(p){ return p.hide == false })
    .map(function(p){ return [p.x, p.y] })
  draw();

}

function animateLayout(income, group) {
  // store the source position
  points.forEach(function(point){
    point.sx = point.x;
  });

  points.forEach(function(point){
    point.tx = point["inc_" + income + "_" + group];
  });

  

  timer = d3.timer(function(elapsed){
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
    });

    // update what is drawn on screen
    draw();

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      console.log("foo")
      shown = points.map(function(p){ return [p.x, p.y] })
      draw();
      timer.stop()

    }
  });
}



})