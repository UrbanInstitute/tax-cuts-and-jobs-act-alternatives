/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/
var scrollVis = function () {
  var shown;

  const duration = 1000;
  const ease = d3.easeCubic;
  let timer;

  var lastIndex = -1;
  var activeIndex = 0;

  var margin = {top: 20, right: 10, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

  var x = d3.scaleLinear()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height,0]);

  var xAxis = d3.axisBottom()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)

  var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yg = svg.append("g")
    .attr("class", "y axis");

  var chartArea = d3.select("#vis").append("div")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px")
    .style("position", "absolute")


  var canvas = chartArea.append("canvas")
    .attr("width", width)
    .attr("height", height);

  var context = canvas.node().getContext("2d");

  var highlight = chartArea.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("left", 0)
    .style("top", 0)
      .append("circle")
      .attr("r", 3)
      .classed("hidden", true);


  var activateFunctions = [];

  var chart = function (selection) {
    selection.each(function (points) {
      setupSections(points)
      init(points);
      draw(points);
    });
  };



  function getIncome(){

  }
  function getGroup(){

  }
  function setIncome(income){

  }
  function setGroup(group){

  }
  function getTcjaVals(i, g){
    var income = (typeof(i) == "undefined") ? getIncome() : i;
    var group = (typeof(g) == "undefined") ? getGroup() : g;
    return [TCJA[group + income], TCJA["burden"]]
  }

  function moveTCJA(vals){
    var income = vals[0],
        group = vals[1]
    //animate some svg dot/lines for the TCJA dot
  }

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

  function filterPoints(filters, points){
    points[0].forEach(function(point){
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
    shown = points[0].filter(function(p){ return p.hide == false })
      .map(function(p){ return [p.x, p.y] })
    draw(points);
  }

  function highlightPoints(){

  }

  function animateLayout(income, group, points) {
    moveTCJA(getTcjaVals(income, group))

    points[0].forEach(function(point){
      point.sx = point.x;
    });

    points[0].forEach(function(point){
      point.tx = point[group + income];
    });


    timer = d3.timer(function(elapsed){
      const t = Math.min(1, ease(elapsed / duration));

      points[0].forEach(function(point){
        point.x = point.sx * (1 - t) + point.tx * t;
      });

      draw(points);

      if (t === 1) {
        shown = points[0].map(function(p){ return [p.x, p.y] })
        draw(points);
        timer.stop()
      }
    });
  }


  function init(points){
    points[0].forEach(function(p,i){
      p.x = p["a1"]
      p.y = p["burden"]
    })
    shown = points.map(function(p){ return [p.x, p.y] })
  }

  function draw(points) {
    x.domain([-3.50, 5.50]);
    y.domain([-550000000000, 300000000000]);

    xg.call(xAxis);
    yg.call(yAxis);

    var tree = d3.quadtree()
      .x(function(p){ return x(p.x) })
      .y(function(p){ return y(p.y) })
      .extent([[-1, -1], [width + 1, height + 1]])

    context.clearRect(0, 0, width, height);


    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(p.hide){
        context.fillStyle = "rgba(0, 0, 0, 0.008)";
        context.fill();
      }
    });

    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(!p.hide){
        context.fillStyle = "rgba(22,150,210, 0.3)";
        context.fill();
        tree.add(p)
      }
    });

    canvas.on("mousemove",function(){
      var mouse = d3.mouse(this),
      closest = tree.find(mouse[0], mouse[1]);
      if(typeof(closest) != "undefined"){
        showExploreTooltip(closest)
      }else{
        hideExploreTooltip()
      }
    });

    canvas.on("mouseover",function(){
      highlight.classed("hidden", false);
    });

    canvas.on("mouseout",function(){
      hideExploreTooltip()
    });
  }




  var setupSections = function (points) {
    activateFunctions[0] = function(){ console.log(0) };
    activateFunctions[1] = function(){ console.log(1) };
    activateFunctions[2] = function(){ console.log(2) };
    activateFunctions[3] = function(){ console.log(3) };
    activateFunctions[4] = function(){ console.log(4) };
    activateFunctions[5] = function(){ console.log(5) };
    activateFunctions[6] = function(){ console.log(6) };
    activateFunctions[7] = function(){ console.log(7) };
    activateFunctions[8] = function(){ console.log(8) };


    d3.select("#groupMenu").on("input", function(){
      animateLayout(d3.select("#incomeMenu").node().value, this.value, points)
    })

    d3.select("#incomeMenu").on("input", function(){
      animateLayout(this.value, d3.select("#groupMenu").node().value, points)
    })


    d3.selectAll(".control")
      .on("input", function(){
        filterPoints(getFilterVals(), points)
    })
  };


  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  return chart;
};


function display(points) {
  if(getInternetExplorerVersion() != -1){
    IS_IE = true;
  }

  var plot = scrollVis();

  d3.select('#vis')
    .style("left", function(){
      if(IS_PHONE()){
        return ( (window.innerWidth - PHONE_VIS_WIDTH - margin.left - margin.right)*.5 ) + "px"
      }
      if(IS_MOBILE()){
        return ( (window.innerWidth - VIS_WIDTH - margin.left - margin.right)*.5 ) + "px"
      }else{
        return "inherit"
      }
    })
    .datum([points])
    .call(plot);

  var scroll = scroller()
    .container(d3.select('#graphic'));

  scroll(d3.selectAll('.step'));

  scroll.on('resized', function(){
    d3.select("#vis svg").remove()
    display(points)
  })

  scroll.on('active', function (index) {
    var offOpacity = (IS_MOBILE()) ? 1 : .1
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : offOpacity; });
    plot.activate(index);  
  });
}


d3.json("data/data.json", function(points){
  display(points);
});