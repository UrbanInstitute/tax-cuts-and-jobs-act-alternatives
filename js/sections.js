/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var shown;

const duration = 1000;
const ease = d3.easeCubic;
let timer;



  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
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

  // var factory = d3.quadtree()
  //   .extent([
  //     [0, 0],
  //     [width, height]
  //   ]);

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
    // .style("z-index","-1");

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



  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];


  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (points) {
        setupSections(points)
        init(points);
        draw(points);
    });
  };


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







function animateLayout(income, group, points) {
  // store the source position
  points[0].forEach(function(point){
    point.sx = point.x;
  });

  points[0].forEach(function(point){
    point.tx = point[group + income];
  });

  

  timer = d3.timer(function(elapsed){
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points[0].forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
    });

    // update what is drawn on screen
    draw(points);

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
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

    // Randomize the scale
    var scale = 1 + Math.floor(Math.random() * 10);

  // y, -550 to 250
  // x, -2.5, 5.5


    // Redraw axes
    x.domain([-3.50, 5.50]);
    y.domain([-550000000000, 300000000000]);

    // x.domain([-, 1.5]);
    // y.domain([-550, -200]);

    xg.call(xAxis);
    yg.call(yAxis);


    var tree = d3.quadtree()
    .x(function(p){ return x(p.x) })
    .y(function(p){ return y(p.y) })
    .extent([[-1, -1], [width + 1, height + 1]])



    // Update canvas
    context.clearRect(0, 0, width, height);


    points[0].forEach(function(p,i){
      // console.log(p)

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
    // tree.visit(function(node, x0, y0, x1, y1){
    //   // console.log(x0, y0)
    // })
// console.log(x.invert(mouse[0]), y.invert(mouse[1]))
// console.log(closest)
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




  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function (points) {
    // activateFunctions are called each
    // time the active section changes
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
      console.log(points)
      filterPoints(getFilterVals(), points)
    })



  };



  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */


  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   *
   */


  function getDotChartData(data) {
    return data.map(function (d, i) {
      d.state = d.stabbr;
      d.stateRevenue = +d.adjrevdiff_st;
      d.localRevenue  = +d.adjrevdiff_lo;
      d.federalRevenue = +d.adjrevdiff_fe;

      return d;
    });
  }
  function getScatterplotData(data){
    return data.map(function (d, i) {
      d.state = d.stabbr;
      d.St1995 = +d.adjrevratio_st1995
      d.Lo1995 = +d.adjrevratio_lo1995
      d.Fe1995 = +d.adjrevratio_fe1995
      d.StLo1995 = +d.adjrevratio_stlo1995;
      d.StFe1995 = +d.adjrevratio_stfe1995
      d.LoFe1995 = +d.adjrevratio_lofe1995
      d.StLoFe1995 = +d.adjrevratio_all1995
      d.St2014 = +d.adjrevratio_st2014
      d.Lo2014 = +d.adjrevratio_lo2014
      d.Fe2014 = +d.adjrevratio_fe2014
      d.StLo2014 = +d.adjrevratio_stlo2014;
      d.StFe2014 = +d.adjrevratio_stfe2014
      d.LoFe2014 = +d.adjrevratio_lofe2014
      d.StLoFe2014 = +d.adjrevratio_all2014
      return d;
    });
  }
  function getHistData(data){
    return data.map(function (d, i) {
      d.bin = +d.bin
      d.tractFlCount = +d.tract_fl_count;
      d.distFlCount = +d.dist_fl_count;
      d.tractNyCount = +d.tract_ny_count;
      d.distNyCount = +d.dist_ny_count;
      return d;
    });
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };


  // return chart function
  return chart;
};



/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(points) {
  if(getInternetExplorerVersion() != -1){
    IS_IE = true;
  }
  // create a new plot and
  // display it
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
      // .style("top", function(){
      //   if(IS_PHONE()){
      //     return ( (window.innerHeight - PHONE_VIS_HEIGHT - margin.top - margin.bottom)*.5 ) + "px"
      //   }
      //   if(IS_MOBILE()){
      //     return ( (window.innerHeight - VIS_HEIGHT - margin.top - margin.bottom)*.5 ) + "px"
      //   }else{
      //     return "20px"
      //   }
      // })
    .datum([points])
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  scroll.on('resized', function(){
    d3.select("#vis svg").remove()
    // d3.selectAll(".scatterButton").remove()
    // d3.select("#buttonContainer").remove()
    // d3.selectAll(".mapImg").remove()
    display(points)
  })

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    var offOpacity = (IS_MOBILE()) ? 1 : .1
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : offOpacity; });
    // activate current section
    plot.activate(index);  
    
  });

}

// load data and display
d3.json("data/data.json", function(points){
  display(points);
});