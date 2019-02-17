/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/

  function getFilterVals(){
    // var returned = {}
    // var filterVars = ["standard", "rates", "amtThreshold", "amtAmount", "personal","salt", "ctcAmount", "ctcThreshold"]
    // for(var i = 0; i < filterVars.length; i++){
    //   var vals = []
    //   var filterVar = filterVars[i]
    //   d3.selectAll(".control." + filterVar).each(function(){
    //     if(this.checked){ vals.push(this.value) }
    //   })
    //   returned[filterVar] = vals
    // }
    // return returned
    // var cs = d3.selectAll(".rangeDot").data(),
    out = {
      "rates": [],
      "standard": [],
      "amtThreshold": [],
      "amtAmount": [],
      "personal": [],
      "salt": [],
      "ctcThreshold": [],
      "ctcAmount": []
    }

    d3.selectAll(".rangeDot.active").each(function(o){
      var classes = this.classList,
        targetClass;
      for(var i = 0; i< classes.length; i++){
        if(classes[i].indexOf("_") != -1){
          targetClass = classes[i]
        }
      }
      var k = targetClass.split("_")[0],
          v = targetClass.split("_")[1]

      out[k].push(v)
    })

    // console.log(out)

    // for(var i = 0; i< cs.length; i++){
    //   var d = cs[i]
    //   // console.log(d)
    //   if(out.hasOwnProperty(d[1]) ){
    //     if(d3.select(".rangeDot." + d[1] + "_" + d[0] ).classed("active") ){
    //       out[ d[1] ].push(d[0])  
    //     }
    //   }else{
    //     out[ d[1] ] = [ d[0] ]
    //   }

    // }
    // console.log(out)

    return out;
  }


var scrollVis = function () {
  var shown;


  const ease = d3.easeCubic;
  // let timer;

  var lastIndex = -1;
  var activeIndex = 0;

  var w, h;

  if(IS_MOBILE()){
    w = 300;
  }else{
    w = 900;
  }

  if(IS_MOBILE()){
    h = 300
  }else{
    h = 700;
  }

  var margin = {top: 20, right: 10, bottom: 30, left: 120},
  width = w - margin.left - margin.right,
  height = h - margin.top - margin.bottom;

  var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "resizeRemove")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .range([0, width])
    .domain([xMin, xMax])

  var y = d3.scaleLinear()
    .range([height,0])
    .domain([yMin, yMax])

  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(function(d){ return d + "%" })
    .tickSize(-height)
    .tickSizeOuter(0)
    .tickPadding(10)

  var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(function(d){ return DOLLARS(d).replace("G","") })
    .tickSize(-width)
    .tickSizeOuter(0)
    .tickPadding(10)



  var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yg = svg.append("g")
    .attr("class", "y axis");




    // x.domain([-3.50, 5.50]);
    // y.domain([-550000000000, 300000000000]);


  var chartArea = d3.select("#vis").append("div")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px")
    .style("position", "absolute")

  var canvas = chartArea.append("canvas")
    .attr("class", "resizeRemove")
    .attr("width", width)
    .attr("height", height);


  var yLabel = chartArea.append("div")
    .attr("class","y axisLabel")
  yLabel.append("div")
    .text("Adjusted revenue change ($ billions)")
    .attr("class", "y axisLabelText")
  yLabel.append("span")
    .attr("class", "y axisLabelTooltip")
    .on("mouseover", function(){
      console.log("tooltip y")
    })


  var xLabel = chartArea.append("div")
    .attr("class","x axisLabel")
  xLabel.append("div")
    .text("Change in average after-tax income (%)")
    .attr("class", "x axisLabelText")



  var catLabels = d3.select("#vis").append("div")
    .attr("id", "catLabels")

  var filingGroup = catLabels.append("div")
    .attr("class", "catLabel filing")
  filingGroup.append("div")
    .attr("class", "catDesc filing")
    .text("Filing group:")
  filingGroup.append("div")
    .attr("class", "catName filing")

  var incomeGroup = catLabels.append("div")
    .attr("class", "catLabel income")
  incomeGroup.append("div")
    .attr("class", "catDesc income")
    .text("Income group:")
  incomeGroup.append("div")
    .attr("class", "catName income")



  var context = canvas.node().getContext("2d");

  var overlaySvg = chartArea.append("svg")
    .attr("class", "resizeRemove")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("left", 0)
    .style("top", 0)

  var highlight = overlaySvg.append("circle")
      .attr("r", 3)
      .classed("hidden", true)
      .classed("highlightDot", true);

  var tcjaDot = overlaySvg.append("circle")
      .attr("r", 3)
      // .classed("hidden", true)
      .classed("tcjaDot", true);







  svg.append("line")
    .attr("class", "axisLine zero horizontal")
    .attr("x1", x(xMin))
    .attr("x2", x(xMax))
    .attr("y1", y(0))
    .attr("y2", y(0))

  svg.append("line")
    .attr("class", "axisLine zero vertical")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y1", y(yMin))
    .attr("y2", y(yMax))


  var quad1 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(" + x(TCJA["a0"]) + ",0)")

  quad1.append("rect")
    .attr("fill","rgba(202,224,231, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", width - x(TCJA["a0"]))
    .attr("height", y(TCJA["burden"]))

  quad1.append("text")
    .text("Plans in this quadrant would lead to more average after-tax income and more adjusted revenue than the TCJA.")
    .attr("y", function(){
      return (.5 * ( y(TCJA["burden"]) -2*quadTextLineHeight) + "px")
    })
    .attr("dx", function(){
      return (.5 * (width - x(TCJA["a0"]) ) + "px")
    })
    .attr("dy", "0px")
    .call(wrap, quadTextWidth)

  var quad2 = svg.append("g")
    .attr("class", "quadGroup")

  quad2.append("rect")
    .attr("fill","rgba(149,192,207, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", x(TCJA["a0"]))
    .attr("height", y(TCJA["burden"]))

  quad2.append("text")
    .text("Plans in this quadrant would lead to less average after-tax income and more adjusted revenue than the TCJA.")
    .attr("y", function(){
      return (.5 * ( y(TCJA["burden"]) -2*quadTextLineHeight) + "px")
    })
    .attr("dx", function(){
      return (.5 * ( x(TCJA["a0"]) ) + "px")
    })
    .attr("dy", "0px")
    .call(wrap, quadTextWidth)


  var quad3 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(0," + y(TCJA["burden"]) + ")")

  quad3.append("rect")
    .attr("fill","rgba(96,161,182, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", x(TCJA["a0"]))
    .attr("height", height - y(TCJA["burden"]))

  quad3.append("text")
    .text("Plans in this quadrant would lead to less average after-tax income and less adjusted revenue than the TCJA.")
    .attr("y", function(){
      return (.5 * ( height - y(TCJA["burden"]) -2*quadTextLineHeight) + "px")
    })
    .attr("dx", function(){
      return (.5 * ( x(TCJA["a0"]) ) + "px")
    })
    .attr("dy", "0px")
    .call(wrap, quadTextWidth)



  var quad4 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(" + x(TCJA["a0"]) + "," + y(TCJA["burden"]) + ")")

  quad4.append("rect")
    .attr("fill","rgba(0,139,176,.7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", width - x(TCJA["a0"]))
    .attr("height", height - y(TCJA["burden"]))

  quad4.append("text")
    .text("Plans in this quadrant would lead to more average after-tax income and less adjusted revenue than the TCJA.")
    .attr("y", function(){
      return (.5 * ( height - y(TCJA["burden"]) -2*quadTextLineHeight) + "px")
    })
    .attr("dx", function(){
      return (.5 * (width - x(TCJA["a0"]) ) + "px")
    })
    .attr("dy", "0px")
    .call(wrap, quadTextWidth)


  var quadO = svg.append("g")
    .attr("class", "quadGroupOverlap")
    .attr("transform", "translate(" + x(TCJA["a2"]) + ",0)")
    .style("opacity", 0)

  quadO.append("rect")
    .attr("fill","rgba(207,232,243, .6)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", width - x(TCJA["a2"]))
    .attr("height",y(TCJA["burden"]))

  quadO.append("text")
    .text("Benefits the second quintle")
    .attr("y", function(){
      return (.5 * ( height - y(TCJA["burden"]) -2*quadTextLineHeight) + "px")
    })
    .attr("dx", function(){
      return "20px"
    })
    .attr("dy", "0px")
    .call(wrap, quadTextWidth)


highlightEllipse = svg.append("ellipse")
    .attr("class", "highlightEllipse")
    // .style("opacity", 1)
    .attr("fill","rgb(207,232,243)")
    .attr("cx", x(-.43))
    .attr("cy", y(102 * 1000000000))
    .attr("rx", 34)
    .attr("ry", 18)
    .style("opacity",0)




  overlaySvg.append("line")
    .attr("class", "axisLine tcja horizontal")
    .attr("x1", x(xMin))
    .attr("x2", x(xMax))
    .attr("y1", y(TCJA["burden"]))
    .attr("y2", y(TCJA["burden"]))

  var tcjaLine = overlaySvg.append("line")
    .attr("class", "axisLine tcja vertical")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y1", y(yMin))
    .attr("y2", y(yMax))




  var legend = overlaySvg.append("g")
    .attr("transform", "translate(20,20)")
    .attr("id", "legendG")
    .style("opacity",0)

  legend.append("rect")
    .attr("id", "legendBg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)

  legend.append("text")
    .attr("id", "legendTitle")
    .text("Legend")
    .attr("text-anchor","start")
    .attr("x", 20)
    .attr("y", 30)

  var lrow = legend.append("g")
    .attr("class", "lrow")
    .attr("transform", "translate(20, 40)")

  lrow.append("circle")
    .attr("cx", 3)
    .attr("cy", 5)
    .attr("r", 3)
    .attr("class", "tcjaLegendDot")

  lrow.append("text")
    .attr("x", 12)
    .attr("y", 10)
    // .attr("r", 3)
    .attr("class", "tcjaLegendText legendText")
    .text("TCJA")





  var activateFunctions = [];

  var chart = function (selection) {
    selection.each(function (points) {
      init(points);
      setupSections(points)
      
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
    var xkey = (group == "tcja") ? "a0" : group + income;
    return [TCJA[xkey], TCJA["burden"]]
  }

  function moveQuadO(number, word){
    quadO
    .transition()
    .delay(longLag + duration + lag)
    .duration(duration)
    .attr("transform", "translate(" + x(TCJA["a" + number]) + ",0)")
    .style("opacity",1)

    quadO.select("rect")
    .transition()
    .delay(longLag + duration + lag)
    .duration(duration)
    .attr("width", width - x(TCJA["a" + number]))
    .on("start", function(){
    quadO.select("text")
    .text("Benefits the " + word + " quintile")
    })

  }

  function moveTCJA(vals){
  d3.selectAll(".tick line")
    .style("opacity", function(d){
      return (d == 0) ? 0 : 0.8;
    })


    var tx = vals[0],
        ty = vals[1]
    //animate some svg dot/lines for the TCJA dot
    tcjaDot.classed("hidden", false)
        .transition()
        .delay(longLag)
        // .ease(ease)
        .duration(duration)
        .attr("cx", x(tx))
        .attr("cy", y(ty));

    tcjaLine
    .transition()
    .delay(longLag)
    .duration(duration)
    .attr("x1", x(tx))
    .attr("x2", x(tx))

  }

  function updateLegend(origKey, colors){
    var key;
    if(origKey == "ct1" || origKey == "ct2" || origKey == "ct3"){
    key = "ctcAmount"
    }else{
    key = origKey
    }
    d3.selectAll(".lrow.temp")
    .transition()
    .duration(500)
    .style("opacity",0)
    .on("end", function(){
    d3.select(this).remove()
    })

    if(key == "ctcAmount" && colors.l == DOT_COLOR && colors.medium == DOT_COLOR && colors.h == DOT_COLOR){
    // console.log("no legend")
    }
    else if(paramaterText.hasOwnProperty(key)){
    var i = 2
    var h = legend.append("g")
    .attr("class", "lrow temp")
    .attr("transform", "translate(20, " + (50 + 20) + ")")
    h.append("text")
    .attr("x", 0)
    .attr("y", 10)
    // .attr("r", 3)
    .attr("class", "tcjaLegendText legendText")
    .text(paramaterText[key]["label"])
    .style("opacity",0)
    .transition()
    .duration(500)
    .style("opacity",1)

    for (var c in colors) {
    if (colors.hasOwnProperty(c) && c != "l0" && c != "m0" && c != "h0" ) {
    // console.log(key, yourobject[key]);
    var color = colors[c].replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"),
    text = paramaterText[key][c][0].replace("<span class = \"tcjaLabel\">","").replace("<span class = \"pretcjaLabel\">","").replace("</span>","")

    var row = legend.append("g")
    .attr("class", "lrow temp")
    .attr("transform", "translate(30, " + (50 + i* 20) + ")")
    .style("opacity",0)
    row.transition()
    .duration(500)
    .style("opacity",1)

    row.append("circle")
    .attr("cx", 3)
    .attr("cy", 5)
    .attr("r", 3)
    .style("stroke-width", "2px")
    .style("stroke", color)
    .style("fill", color)
    .attr("class", "legendDot")
    row.append("text")
    .attr("x", 12)
    .attr("y", 10)
    // .attr("r", 3)
    .attr("class", "legendText legendText")
    .text(text)
    i++;
    }
    }



    }else{
      var color = colors["1"].replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"),
        text = customLegendText[key]
    var row = legend.append("g")
    .attr("class", "lrow temp")
    .attr("transform", "translate(20, " + (60) + ")")
    .style("opacity",0)
    row.transition()
    .duration(500)
    .style("opacity",1)

    row.append("circle")
    .attr("cx", 3)
    .attr("cy", 5)
    .attr("r", 3)
    .style("stroke-width", "4px")
    .style("stroke", color)
    .style("fill", color)
    .attr("class", "legendDot")
    row.append("text")
    .attr("x", 12)
    .attr("y", 10)
    // .attr("r", 3)
    .attr("class", "legendText legendText")
    .text(text)

    }

  }



  function filterPoints(filters, points){
    // console.log(filters, points)
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
    // d3.select("#vis").datum([points])
    draw(points);


  }


  function recolorPoints(key, colors, points){
    points[0].forEach(function(point){

      point.color = colors[point[key]]
      // console.log(colors, point, key)
      // point.hide = false;
      // for(var filter in filters){
      //   if(point.hide){
      //     continue
      //   }else{
      //     if(filters.hasOwnProperty(filter)){
      //       var vals = filters[filter]
      //       if(vals.indexOf(point[filter]) == -1){
      //         point.hide = true
      //       }else{
      //         point.hide = false;
      //       }
      //     }
      //   }
      // }

    })

    draw(points);
  }




var timerCount;

function interpolateVal(source, target, t){
  return source * (1-t) + target*t
}
function interpolateRGBAColors(c1, c2, t){
  rgb1 = c1.replace("rgba(","").replace(")","").split(",")
  rgb2 = c2.replace("rgba(","").replace(")","").split(",")

  return "rgba(" + interpolateVal(+(rgb1[0]), +(rgb2[0]), t) + "," + interpolateVal(+(rgb1[1]), +(rgb2[1]), t) + "," + interpolateVal(+(rgb1[2]), (rgb2[2]), t) + "," + interpolateVal(+(rgb1[3]), (rgb2[3]), t) + ")"

}

function loopAnimate (points, moveY) {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
               



       var t = Math.min(1, ease(timerCount / duration));

      if(moveY == false){
        points[0].forEach(function(point){
          point.x = interpolateVal(point.sx, point.tx, t)
          point.color = interpolateRGBAColors(point.sc, point.tc, t)
        });
      }else{
        points[0].forEach(function(point){        
            point.x = interpolateVal(point.sx, point.tx, t);
            point.y = interpolateVal(point.sy, point.ty, t);
            point.color = interpolateRGBAColors(point.sc, point.tc, t)
        });

      }



      draw(points);
      // console.log(t)
      if (t === 1) {
        shown = points[0].map(function(p){ return [p.x, p.y] })
        draw(points);

        // timer.stop()

      }  





      timerCount += increment;                     //  increment the counter
      if (timerCount < duration) {            //  if the counter < 10, call the loop function
         loopAnimate(points, moveY);             //  ..  again which will trigger another 
      }                        //  ..  setTimeout()
   }, increment)
}


  function animateLayout(income, group, points, moveY, key, colors) {
    moveTCJA(getTcjaVals(income, group))
    updateLegend(key, colors)


    if(income != "tcja"){
      d3.select(".catName.filing").text(d3.select("option[value=\'" + group + "\']").text())
      d3.select(".catName.income").text(d3.select("option[value=\'" + income + "\']").text())
    }

    points[0].forEach(function(point){
      point.sx = point.x;
      point.sc = point.color
      point.tc = colors[point[key]]
    });


    if(income == "tcja" && group == "tcja"){
      points[0].forEach(function(point){
        point.tx = TCJA["a0"];
      });
    }else{
      points[0].forEach(function(point){
        point.tx = point[group + income];
      });
    }

    if(moveY){
      points[0].forEach(function(point){
        point.sy = point.y;
      });

      if(income == "tcja" && group == "tcja"){
        points[0].forEach(function(point){
          point.ty = TCJA["burden"];
        });
      }else{
        points[0].forEach(function(point){
          point.ty = point["burden"];
        });
      }
    }



    timerCount = 0;
    loopAnimate(points, moveY);



   
    


  //   timer = d3.timer(function(elapsed){
  //     const t = Math.min(1, ease(elapsed / duration));

  //     if(moveY == false){
  //       points[0].forEach(function(point){
  //         point.x = point.sx * (1 - t) + point.tx * t;
  //       });
  //     }else{
  //       points[0].forEach(function(point){        
  //           point.x = point.sx * (1 - t) + point.tx * t;
  //           point.y = point.sy * (1 - t) + point.ty * t;
  //       });

  //     }



  //     // draw(points);
  //     console.log(t)
  //     if (t === 1) {
  //       shown = points[0].map(function(p){ return [p.x, p.y] })
  //       // draw(points);

  //       timer.stop()

  //     }
  //   });
  }


function showExploreTooltip(point){
// d3.select("#revdisp span").text(d3.format("$.4s")(point.burden).replace(/G/,"B"))

// d3.select("#incdisp span").text(point[d3.select("#groupMenu").node().value + d3.select("#incomeMenu").node().value] + "%")



//   for(property in point){
//     if(point.hasOwnProperty(property)){

//       if(d3.select(".control." + property).node() != null){
//         console.log(property, point[property])
//         d3.selectAll(".control." + property).nodes().forEach(function(n){
//           d3.select(n.parentNode).classed("tempHighlight", false)
//         })

          
//         d3.select(d3.select(".control." + property + "." + point[property]).node().parentNode).classed("tempHighlight", true)
//       }
//     }
//   }

// console.log(point)
d3.selectAll(".rangeDot").classed("highlight", false)

for (var p in DEFAULT_FILTERS) {
    if (DEFAULT_FILTERS.hasOwnProperty(p)) {
      d3.select(".rangeDot." + p + "_" + point[p] ).classed("highlight", true)
    }
}



       highlight.classed("hidden", false)
        .attr("cx", x(point.x))
        .attr("cy", y(point.y));
// console.log(point)
}

function hideExploreTooltip(){
  highlight.classed("hidden", true)
  d3.selectAll(".rangeDot").classed("highlight", false)
  // d3.selectAll(".tempHighlight").classed("tempHighlight", false)

  console.log("hide")
}
function showInputTooltip(dot, d){
  if(paramaterText[ d[1] ][ d[2] ][1] == false){
    hideInputTooltip()
  }else{
    var container = d3.select(dot.parentNode.parentNode.parentNode)
    // console.log(container.node())
    // console.log(d)
    var tt = container.append("div")
      .attr("class", "input tooltip")
      .style("left", (dot.getBoundingClientRect().left - 50) + "px")
    tt.append("div")
      .html(paramaterText[ d[1] ][ d[2] ][1] )
  }
    // .html()
}
function hideInputTooltip(){
  // d3.selectAll(".input.tooltip").remove()

}



  function init(points){
    points[0].forEach(function(p,i){
      p.x = TCJA["a0"]
      p.y = TCJA["burden"]
      p.color = DOT_COLOR
    })
    // console.log(points.filter(function(p){ return p.tcja ==  true}))
    
    shown = points.map(function(p){ return [p.x, p.y] })
  }

  function draw(points) {
    // console.log(points)

    xg.call(xAxis);
    yg.call(yAxis);

    var tree = d3.quadtree()
      .x(function(p){ return x(p.x) })
      .y(function(p){ return y(p.y) })
      .extent([[-1, -1], [width + 1, height + 1]])

    context.clearRect(0, 0, width, height);


    // points[0].forEach(function(p,i){
    //   context.beginPath();
    //   context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
    //   if(p.hide){
    //     context.fillStyle = "rgba(0, 0, 0, 0.008)";
    //     context.fill();
    //   }
    // });

    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(!p.hide){
        context.fillStyle = p.color;
        context.fill();
        tree.add(p)
      }else{
        context.fillStyle = COLOR_HIDE;
        context.fill();
      }
    });

    overlaySvg.on("mousemove",function(){
      if(activeIndex == 18){
        var mouse = d3.mouse(this),
        closest = tree.find(mouse[0], mouse[1]);
        if(typeof(closest) != "undefined"){
          showExploreTooltip(closest)
        }else{
          hideExploreTooltip()
        }
      }else{
        hideExploreTooltip()
      }
    });

    overlaySvg.on("mouseover",function(){
      highlight.classed("hidden", false);
    });

    overlaySvg.on("mouseout",function(){
      hideExploreTooltip()
    });

    // d3.select("#vis").datum([points])
  }

  function showTcjaDot(points){
    //display just the tcja dot (in move tcja func)
    //display tcja lines and axis lines (in move tcja func)
    // display info in 4 quadrants (html divs, will be transitioned to 0 opacity and z index -1)
    animateLayout("tcja","tcja", points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    d3.selectAll(".quadGroup")
      .transition()
      .duration(duration)
      .style("opacity",1)
    d3.selectAll("#legendG")
      .transition()
      .duration(duration)
      .style("opacity",0)
    console.log(0, activeIndex)
  }

  function showAllAll(points){



// d3.select(".highlightEllipse")
//     .transition()
//     .duration(duration)
//     .delay(lag)
//     .attr("cx", x(-.88))
//     .attr("rx", 15)
//     .style("opacity",0)

    animateLayout("0","a", points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    d3.selectAll(".quadGroup")
      .transition()
      .duration(duration)
      .style("opacity",0)
    quadO.transition()
      .style("opacity",0)

    d3.selectAll("#legendG")
      .transition()
      .duration(duration)
      .style("opacity",1)

    console.log(1, activeIndex)
  }

  function showQ1(points){
d3.select(".highlightEllipse")
    .transition()
    .style("opacity",0)

    animateLayout("1","a", points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})

    console.log(2, activeIndex)
  }

  function showQ1_CTC(points){


d3.select(".highlightEllipse")
    .transition()
    .duration(duration + 300)
    .delay(lag)
    .attr("cx", x(-.43))
    .attr("rx", 34)
    .style("opacity",1)

    animateLayout("1","a", points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    //highlight the ctc points in upper left
    //direct label
    //mouseover show both ctc parameters??
    // recolorPoints("ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR}, points)
    console.log(3, activeIndex)
  }

  function showMarriedKids(points){
    //shade dots based on refundable portion of CTC
    // recolorPoints("ctcAmount", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    //legend
d3.select(".highlightEllipse")
    .transition()
    .duration(duration + 300)
    .delay(lag)
    .ease(d3.easeLinear)
    .attr("cx", x(.25))
    .attr("rx", 52)
    .on("end", function(){
      d3.select(this)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style("opacity",0)
        .attr("cx", x(.75))
        .attr("rx", 99)
    })
    // .style("opacity",0)


    animateLayout("1","g", points, false, "ctcAmount", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3})

    console.log(4, activeIndex)
  }

  function showMarriedKidsFilter1(points){
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct1", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

    console.log(5, activeIndex)
  }

  function showMarriedKidsFilter2(points){
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct2", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

    console.log(6, activeIndex)
  }

    function showMarriedKidsFilter3(points){
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct3", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

    console.log(7, activeIndex)
  }


  function showQ1_PersonalExcemption(points){
    //shade dots based on personal exemption 
    //legend
    // recolorPoints("personal", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4}, points)
    animateLayout("1","a", points, false, "personal", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4})

    console.log(8, activeIndex)
  }
  function showQ1_StandardDeduction(points){
    //shade dots based on std deduction 
    //legend
    // recolorPoints("standard", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4}, points)
    animateLayout("1","a", points, false, "standard", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4})

    console.log(9, activeIndex)
  }
  function showTop5_Rates(points){
    //shade dots based on std deduction 
    //legend
    animateLayout("8","a", points, false, "rates", {"b": COLOR_1, "d": COLOR_2, "a": COLOR_3, "c": COLOR_4})

    console.log(10, activeIndex)
  }
  function compareQ1(points){
    //shade dots based on std deduction 
    //legend
    quadO.transition()
      .style("opacity",0)
    animateLayout("1","a", points, false, "q1", {"0": DARK_HIDE, "1": SEQ_1})

    console.log(11, activeIndex)
  }
  function compareTop1(points){
    //shade dots based on std deduction 
    //legend
    quadO.transition()
      .style("opacity",0)
    animateLayout("8","a", points, false, "t1", {"0": DARK_HIDE, "1": COLOR_4})

    console.log(12, activeIndex)
  }



  function compareQ2(points){
    //shade dots based on std deduction 
    //legend

  quadO
    .transition()
      .delay(longLag)
      .duration(duration)
      .attr("transform", "translate(" + x(TCJA["a2"]) + ",0)")
      .style("opacity",1)

  quadO.select("rect")
    .transition()
      .delay(longLag)
      .duration(duration)
    .attr("width", width - x(TCJA["a2"]))
    .on("start", function(){
  quadO.select("text")
    .text("Benefits the second quintle")
    })
      
    animateLayout("2","a", points, false, "q1", {"0": DARK_HIDE, "1": SEQ_1})

    console.log(13, activeIndex)
  }

  function compareQ3(points){
    //shade dots based on std deduction 
    //legend


    moveQuadO(3, "third")



    animateLayout("2","a", points, false, "q2", {"0": DARK_HIDE, "1": SEQ_2})
    setTimeout(function(){
      if(activeIndex == 15){
        animateLayout("3","a", points, false, "q2", {"0": DARK_HIDE, "1": SEQ_2})
      }
    }, duration + lag)

    console.log(14, activeIndex)
  }

  function compareQ4(points){
    //shade dots based on std deduction 
    //legend
    moveQuadO(4, "fourth")
    animateLayout("3","a", points, false, "q3", {"0": DARK_HIDE, "1": SEQ_3})
    setTimeout(function(){
      if(activeIndex == 16){
        animateLayout("4","a", points, false, "q3", {"0": DARK_HIDE, "1": SEQ_3})
      }
    }, duration + lag)

    console.log(15, activeIndex)
  }
    function compareQ5(points){
    //shade dots based on std deduction 
    //legend
    hideExploreTooltip()
    filterPoints(DEFAULT_FILTERS, points)

    moveQuadO(5, "fifth")
    animateLayout("4","a", points, false, "q4", {"0": DARK_HIDE, "1": SEQ_4})
    setTimeout(function(){
      if(activeIndex == 17){
        animateLayout("5","a", points, false, "q4", {"0": DARK_HIDE, "1": SEQ_4})
      }
    }, duration + lag)

    console.log(16, activeIndex)
  }


function buildCheckboxes(key, vals, numVals, filterVals, points){
  var container = d3.select("#controls")
  .append("div")
  .attr("class", "resizeRemove controlContainer checkboxes " + key)
  var filters = filterVals[key],
  w = d3.select(".step.lastStep").node().getBoundingClientRect().width
  h = 150

  container.append("div")
  .attr("class", key + " controlTitle")
  .text(paramaterText[key]["label"] + ":")

  var rsvg = container.append("svg")
  // .attr("")
  .attr("width", w + "px")
  .attr("height", h + "px")
  .append("g")

  var scale = d3.scaleLinear()
  .range([25, h-40])
  .domain([numVals[0], numVals[numVals.length - 1]] )


  rsvg
  .selectAll("circle")
  .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
  .enter()
  .append("circle")
  .attr("class", function(d){
  var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
  return "rangeDot " + key + "_" + d[2] + active
  })
  .attr("cy", function(d){ return scale(d[0]) })
  .attr("cx", 12)
  .attr("r", 9)
  .on("click", function(){
  if(d3.select(this).classed("active")){
  d3.select(this)
  .transition()
  .duration(200)
  .style("background", "#fff")
  .style("stroke", "#cccccc")
  .on("end", function(d){
  d3.select(this).classed("active", false)
  // d3.select(d3.select(this.parentNode().parentNode()).select(".to") )
  d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", false)
  // getFilterVals()
  filterPoints(getFilterVals(), points)
  })
  }else{
  d3.select(this)
  .transition()
  .duration(200)
  .style("background", "#008bb0")
  .style("stroke", "#008bb0")
  .on("end", function(d){
  d3.select(this).classed("active", true)
  d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", true)
  // getFilterVals()
  filterPoints(getFilterVals(), points)
  })

  }

  })


  var labelContainer = container
  .selectAll(".rangeLabel")
  .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
  .enter()
  .append("div")
  .attr("class", function(d){
  var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
  return "rangeLabel checkboxes " +  key + "_" + d[2] + active
  })
  .style("top", function(d){ return (scale(d[0]) - 11) + "px" } )
  .html(function(d){
  return paramaterText[key][ d[2] ][0]
  })

  // labelContainer.append("div")
  // .attr("class", function(d){
  // return "bottomLabel " + paramaterText[key][ d[2] ][2] 
  // })
  // .html(function(d){
  // var bl = paramaterText[key][ d[2] ][2];
  // if(bl == "tcja") return "TCJA"
  // else if(bl == "pretcja") return "Pre-TCJA"
  // else return ""
  // })


}
function buildRange(key, vals, numVals, filterVals, points){

  var container = d3.select("#controls")
  .append("div")
  .attr("class", "resizeRemove controlContainer " + key)
  var filters = filterVals[key],
  w = d3.select(".step.lastStep").node().getBoundingClientRect().width
  h = 80

  container.append("div")
  .attr("class", key + " controlTitle")
  .text(paramaterText[key]["label"] + ":")

  var rsvg = container.append("svg")
  // .attr("")
  .attr("width", w + "px")
  .attr("height", 80 + "px")
  .append("g")

  var scale = d3.scaleLinear()
  .range([12, w-42])
  .domain([numVals[0], numVals[numVals.length - 1]] )

  rsvg.append("line")
  .attr("class", "rangeLine")
  .attr("x1", 0)
  .attr("x2", w-35)
  .attr("y1", h/2)
  .attr("y2", h/2)

  rsvg
  .selectAll("circle")
  .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
  .enter()
  .append("circle")
  .attr("class", function(d){
  var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
  return "rangeDot " + key + "_" + d[2] + active
  })
  .attr("cx", function(d){ return scale(d[0]) })
  .attr("cy", h/2)
  .attr("r", 9)
  .on("click", function(){
  if(d3.select(this).classed("active")){
  d3.select(this)
  .transition()
  .duration(200)
  .style("background", "#fff")
  .style("stroke", "#cccccc")
  .on("end", function(d){
  d3.select(this).classed("active", false)
  // d3.select(d3.select(this.parentNode().parentNode()).select(".to") )
  d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", false)
  // getFilterVals()
  filterPoints(getFilterVals(), points)
  })
  }else{
  d3.select(this)
  .transition()
  .duration(200)
  .style("background", "#008bb0")
  .style("stroke", "#008bb0")
  .on("end", function(d){
  d3.select(this).classed("active", true)
  d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", true)
  // getFilterVals()
  filterPoints(getFilterVals(), points)
  })

  }

  })
  .on("mouseover", function(d){
    showInputTooltip(this, d)
  })
  .on("mouseout", hideInputTooltip)


  var labelContainer = container
  .selectAll(".rangeLabel")
  .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
  .enter()
  .append("div")
  .attr("class", function(d){
  var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
  return "rangeLabel " +  key + "_" + d[2] + active
  })
  .style("left", function(d){ return (scale(d[0])-50) + "px" } )
  // .attr("x", function(d){ return scale(d) })
  // .attr("y", 10)

  labelContainer.append("div")
  .attr("class", "topLabel")
  .html(function(d){
  return paramaterText[key][ d[2] ][0]
  })

  labelContainer.append("div")
  .attr("class", function(d){
  return "bottomLabel " + paramaterText[key][ d[2] ][2] 
  })
  .html(function(d){
  var bl = paramaterText[key][ d[2] ][2];
  if(bl == "tcja") return "TCJA"
  else if(bl == "pretcja") return "Pre-TCJA"
  else return ""
  })



}

function buildExploreSection(filterVals, points){
  buildCheckboxes("rates", ["b", "d", "a", "c"], [0, 1, 2, 3], filterVals, points)
  buildRange("standard", ["l", "ml", "mh", "h"], [0, 1, 2, 3], filterVals, points)
  buildRange("amtThreshold", ["l", "h"], [0, 1], filterVals, points)
  buildRange("amtAmount", ["l", "h"], [0, 1], filterVals, points)
  buildRange("personal", ["l", "ml", "mh", "h"], [0, 2050, 4150, 5500], filterVals, points)
  buildRange("salt", ["l", "ml", "mh", "h"], [0, 10, 15, 20], filterVals, points)
  buildRange("ctcThreshold", ["l", "medium", "h"], [0, 1250, 2500], filterVals, points)
  buildRange("ctcAmount", ["l", "medium", "h"], [50, 70, 100], filterVals, points)

   $("#groupMenu" ).selectmenu({
    change: function(event, d){
      animateLayout(d3.select("#incomeMenu").node().value,d.item.value, points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    }
  })

   $("#incomeMenu" ).selectmenu({
    change: function(event, d){
      animateLayout(d.item.value, d3.select("#groupMenu").node().value, points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    }
  })


}


  var setupSections = function (points) {
    activateFunctions[0] = function(){ showTcjaDot(points) };
    activateFunctions[1] = function(){ showAllAll(points) };
    activateFunctions[2] = function(){ showQ1(points) };
    activateFunctions[3] = function(){ showQ1_CTC(points) };
    activateFunctions[4] = function(){ showMarriedKids(points); };
    activateFunctions[5] = function(){ showMarriedKidsFilter1(points) };
    activateFunctions[6] = function(){ showMarriedKidsFilter2(points) };
    activateFunctions[7] = function(){ showMarriedKidsFilter3(points) };
    activateFunctions[8] = function(){ showQ1_PersonalExcemption(points); };
    activateFunctions[9] = function(){ showQ1_StandardDeduction(points); };
    activateFunctions[10] = function(){ showTop5_Rates(points); };
    activateFunctions[11] = function(){ compareQ1(points); };
    activateFunctions[12] = function(){ compareTop1(points); };
    activateFunctions[13] = function(){ compareQ1(points); };
    activateFunctions[14] = function(){ compareQ2(points); };
    activateFunctions[15] = function(){ compareQ3(points); };
    activateFunctions[16] = function(){ compareQ4(points); };
    activateFunctions[17] = function(){ compareQ5(points); };
    activateFunctions[18] = function(){ showAllAll(points); };


    d3.select("#groupMenu").on("input", function(){
      animateLayout(d3.select("#incomeMenu").node().value, this.value, points, false,  "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    })

    d3.select("#incomeMenu").on("input", function(){
      animateLayout(this.value, d3.select("#groupMenu").node().value, points, false,  "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    })


    // d3.selectAll(".control")
    //   .on("input", function(){
    //     filterPoints(getFilterVals(), points)
    // })
    buildExploreSection(DEFAULT_FILTERS, points)
    // d3.selectAll(".rangeDot")


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
    var filterVals = getFilterVals()
    d3.selectAll(".resizeRemove").remove()
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