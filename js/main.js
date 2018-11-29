d3.json("data/data.json", function(points){
  var margin = {top: 20, right: 10, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#chartContainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

  var factory = d3.quadtree()
    .extent([
      [0, 0],
      [width, height]
    ]);

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
    .style("top", margin.top + "px");

  var canvas = chartArea.append("canvas")
    .attr("width", width)
    .attr("height", height);

  var context = canvas.node().getContext("2d");

  context.fillStyle = "rgba(0, 0, 0, 0.2)";

  // Layer on top of canvas, example of selection details
  var highlight = chartArea.append("svg")
    .attr("width", width)
    .attr("height", height)
      .append("circle")
        .attr("r", 7)
        .classed("hidden", true);

  function init(){
    points.forEach(function(p,i){
      p.x = p["inc_all_all"]
      p.y = p["burden"]
    })

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


    // Update canvas
    context.clearRect(0, 0, width, height);

    points.forEach(function(p,i){

      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      context.fill();

    });

  }

  init();

  draw(); 

d3.select("#groupMenu").on("input", function(){
  // console.log(this.value)
  animateLayout(d3.select("#incomeMenu").node().value, this.value)
})

d3.select("#incomeMenu").on("input", function(){
  // console.log(this.value)
  animateLayout(this.value, d3.select("#groupMenu").node().value)
})



const duration = 1000;
const ease = d3.easeCubic;
let timer;




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
      timer.stop()

    }
  });
}


  function getPoints(income, group){
    
      // console.log(data)
      return data.map(function(d){
        return [
          d["inc_" + income + "_" + group],
          d["burden"]
        ]
      })
  }

  function randomPoints(scale) {

    // Get points
    return d3.range(1000).map(function(d){

      return [
        Math.random() * scale,
        Math.random() * scale
      ];

    });

  }
})