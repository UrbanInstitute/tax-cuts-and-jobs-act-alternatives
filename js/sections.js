/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
* core scroll functionality based on Jim Vallandingham's scroll demo
* https://github.com/vlandham/scroll_demo
*/


var scrollVis = function () {
  var shown;

  var ease = d3.easeCubic;

  var lastIndex = -1;
  var activeIndex = 0;

  var w, h;
  w = getVisWidth();
  h = getVisHeight();

  var width = w - margin.left - margin.right,
  height = h - margin.top - margin.bottom;

  var scootch = (IS_PHONE()) ? phoneXScootch : 0;

//svg that is beneath canvas dots
  var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "resizeRemove")
    .append("g")
      .attr("transform", "translate(" + (margin.left - scootch) + "," + margin.top + ")");

//axes, scales, containers
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

  var tickPadding = (IS_PHONE()) ? -1*getVisWidth() + phoneXScootch - 20 : 10

  var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(function(d){ return DOLLARS(d).replace("G","") })
    .tickSize(-width)
    .tickSizeOuter(0)
    .tickPadding(tickPadding)

  var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yg = svg.append("g")
    .attr("class", "y axis");

  var chartArea = d3.select("#vis").append("div")
    .attr("class", "resizeRemove")
    .style("left", (margin.left-scootch) + "px")
    .style("top", margin.top + "px")
    .style("position", "absolute")

  var canvas = chartArea.append("canvas")
    .attr("class", "resizeRemove")
    .attr("width", width)
    .attr("height", height);

//set up x and y axis labels with mouseover tooltips
  var yLabel = chartArea.append("div")
    .attr("class","y axisLabel resizeRemove")

  yLabel.append("div")
    .text("Revenue change ($ billions)")
    .attr("class", "y axisLabelText")

  yLabel.append("img")
    .attr("class", "y axisLabelTooltip")
    .attr("src", "images/infoDot.png")
    .on("mouseover", function(){
      d3.select(this).attr("src", "images/infoDotHover.png")
      d3.select("#vis")
        .append("div")
        .attr("class", function(){
          if(IS_MOBILE() || IS_SHORT()) return "axis tooltip side"
          else return "axis tooltip"
        })
        .style("top", function(){
          if(IS_SHORT() || IS_MOBILE()) return (d3.select(".y.axisLabelTooltip").node().getBoundingClientRect().top - 165) + "px"
          else return "0px"
        })
        .html(yTooltipText)
        .append("div")
        .attr("class", "ttArrow")
    })
    .on("mouseout", function(){
      d3.select(this).attr("src", "images/infoDot.png")
      d3.selectAll(".axis.tooltip").remove()
    })

  var xLabel = chartArea.append("div")
    .attr("class","x axisLabel resizeRemove")
  
  xLabel.append("div")
    .text("Change in average after-tax income (%)")
    .attr("class", "x axisLabelText")

  xLabel.append("img")
    .attr("class", "x axisLabelTooltip")
    .attr("src", "images/infoDot.png")
    .on("mouseover", function(){
      d3.select(this).attr("src", "images/infoDotHover.png")
      d3.select("#vis")
        .append("div")
        .attr("class", function(){
          return "xaxis tooltip"
        })
        .style("top", function(){
          return (d3.select(".x.axisLabelTooltip").node().getBoundingClientRect().top - 245) + "px"
        })
        .style("left", function(){
          if(d3.select(".x.axisLabelTooltip").node().getBoundingClientRect().left + 130 + 10 > getDeviceWidth()) return (getDeviceWidth() - 260 - 5) + "px"
          else return (d3.select(".x.axisLabelTooltip").node().getBoundingClientRect().left - d3.select("#vis").node().getBoundingClientRect().left - 123) + "px"
        })
        .html(xTooltipText)
        .append("div")
        .attr("class", function(){
          if(d3.select(".x.axisLabelTooltip").node().getBoundingClientRect().left + 130 + 10 > getDeviceWidth()) return "ttArrow customX"
          else return "ttArrow"
        })
    })
    .on("mouseout", function(){
      d3.select(this).attr("src", "images/infoDot.png")
      d3.selectAll(".xaxis.tooltip").remove()
    })

//income and filing group labels at the top of the chart
  var catLabels = d3.select("#vis").append("div")
    .attr("id", "catLabels")
    .attr("class", "resizeRemove")

  var incomeGroup = catLabels.append("div")
    .attr("class", "catLabel income")
  
  incomeGroup.append("div")
    .attr("class", "catDesc income")
    .text("Income group:")

  incomeGroup.append("div")
    .attr("class", "catName income")


  var filingGroup = catLabels.append("div")
    .attr("class", "catLabel filing")

  filingGroup.append("div")
    .attr("class", "catDesc filing")
    .text("Filing group:")

  filingGroup.append("div")
    .attr("class", "catName filing")


  var context = canvas.node().getContext("2d");

//svg that is on top of canvas dots
  var overlaySvg = chartArea.append("svg")
    .attr("class", "resizeRemove")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("left", 0)
    .style("top", 0)

//mouseover dot for explore section
  var highlight = overlaySvg.append("circle")
    .attr("r", 3)
    .classed("hidden", true)
    .classed("highlightDot", true)
    .attr("cx", -10)
    .attr("cy", -10)

//tcja dot on all graphs
  var tcjaDot = overlaySvg.append("circle")
    .attr("r", 3)
    .classed("tcjaDot", true)
    .attr("cx", -10)
    .attr("cy", -10)

//pre tcja dot at origin
  var pretcjaDot = overlaySvg.append("circle")
    .attr("r", 4.5)
    .classed("pretcjaDot", true)
    .attr("cx", x(0))
    .attr("cy", y(0))

//tcja and pretcja axis lines
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

//quadrant bgs and labels for first slide
  var rightQuadScootch = (IS_SMALL_PHONE()) ? 105 : 45;
  var leftQuadScootch = (IS_SMALL_PHONE()) ? 125 : 30;
  var incomeQuadText = (IS_SMALL_PHONE()) ? "after-tax income" : "after-tax income than TCJA";
  var revenueQuadText= (IS_SMALL_PHONE()) ? "revenue" : "revenue than TCJA";

  var quad1 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(" + x(TCJA["a0"]) + ",0)")

  quad1.append("rect")
    .attr("fill","rgba(202,224,231, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", width - x(TCJA["a0"]))
    .attr("height", y(TCJA["burden"]))

  var qg1 = quad1
    .append("g")
    .attr("transform", "translate(" + (.5 * (width - x(TCJA["a0"]) - 200 + rightQuadScootch)) + "," + .5*( y(TCJA["burden"]) -1.7*quadTextLineHeight) + ")" )

  qg1.append("text")
    .text("MORE")
    .attr("class","big")
    .attr("dy", "0px")
    .attr("dx", "23px")

  qg1.append("polygon")
    .attr("class", "quadArrow more")
    .attr("points", "0,-1 9,-10, 18,-1")

  qg1.append("text")
    .text(incomeQuadText)
    .attr("dy", (quadTextLineHeight*.8) + "px")

  qg1.append("text")
    .text("MORE")
    .attr("class","big")
    .attr("dy", (quadTextLineHeight*2.8) + "px")
    .attr("dx", "23px")

  qg1.append("polygon")
    .attr("class", "quadArrow more")
    .attr("points", "0," + (quadTextLineHeight*2.8-1) + " 9," + (quadTextLineHeight*2.8-10) + " 18," + (quadTextLineHeight*2.8-1))

  qg1.append("text")
    .text(revenueQuadText)
    .attr("dy", (quadTextLineHeight*3.6) + "px")


  var quad2 = svg.append("g")
    .attr("class", "quadGroup")

  quad2.append("rect")
    .attr("fill","rgba(149,192,207, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", x(TCJA["a0"]))
    .attr("height", y(TCJA["burden"]))

  var qg2 = quad2
    .append("g")
    .attr("transform", "translate(" + (.5 * ( x(TCJA["a0"]) - 290 + leftQuadScootch)) + "," + .5*( y(TCJA["burden"]) -1.7*quadTextLineHeight) + ")" )

  qg2.append("text")
    .text("LESS")
    .attr("class","big")
    .attr("dy", "0px")
    .attr("dx", "23px")

  qg2.append("polygon")
    .attr("class", "quadArrow less")
    .attr("points", "0,-10 9,-1, 18,-10")

  qg2.append("text")
    .text(incomeQuadText)
    .attr("dy", (quadTextLineHeight*.8) + "px")

  qg2.append("text")
    .text("MORE")
    .attr("class","big")
    .attr("dy", (quadTextLineHeight*2.8) + "px")
    .attr("dx", "23px")

  qg2.append("polygon")
    .attr("class", "quadArrow more")
    .attr("points", "0," + (quadTextLineHeight*2.8-1) + " 9," + (quadTextLineHeight*2.8-10) + " 18," + (quadTextLineHeight*2.8-1))

  qg2.append("text")
    .text(revenueQuadText)
    .attr("dy", (quadTextLineHeight*3.6) + "px")

  var quad3 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(0," + y(TCJA["burden"]) + ")")

  quad3.append("rect")
    .attr("fill","rgba(96,161,182, .7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", x(TCJA["a0"]))
    .attr("height", height - y(TCJA["burden"]))


    var qg3 = quad3
    .append("g")
    .attr("transform", "translate(" + (.5 * ( x(TCJA["a0"]) - 290 + leftQuadScootch)) + "," + .5*(height - y(TCJA["burden"]) -1.7*quadTextLineHeight) + ")" )

  qg3.append("text")
    .text("LESS")
    .attr("class","big")
    .attr("dy", "0px")
    .attr("dx", "23px")

  qg3.append("polygon")
    .attr("class", "quadArrow less")
    .attr("points", "0,-10 9,-1, 18,-10")

  qg3.append("text")
    .text(incomeQuadText)
    .attr("dy", (quadTextLineHeight*.8) + "px")

  qg3.append("text")
    .text("LESS")
    .attr("class","big")
    .attr("dy", (quadTextLineHeight*2.8) + "px")
    .attr("dx", "23px")

  qg3.append("polygon")
    .attr("class", "quadArrow more")
    .attr("points", "0," + (quadTextLineHeight*2.8-10) + " 9," + (quadTextLineHeight*2.8-1) + " 18," + (quadTextLineHeight*2.8-10))

  qg3.append("text")
    .text(revenueQuadText)
    .attr("dy", (quadTextLineHeight*3.6) + "px")

  var quad4 = svg.append("g")
    .attr("class", "quadGroup")
    .attr("transform", "translate(" + x(TCJA["a0"]) + "," + y(TCJA["burden"]) + ")")

  quad4.append("rect")
    .attr("fill","rgba(0,139,176,.7)")
    .attr("x",0)
    .attr("y", 0)
    .attr("width", width - x(TCJA["a0"]))
    .attr("height", height - y(TCJA["burden"]))

  var qg4 = quad4
    .append("g")
    .attr("transform", "translate(" + (.5 * (width - x(TCJA["a0"]) - 200 + rightQuadScootch)) + "," + .5*(height - y(TCJA["burden"]) -1.7*quadTextLineHeight) + ")" )

  qg4.append("text")
    .text("MORE")
    .attr("class","big")
    .attr("dy", "0px")
    .attr("dx", "23px")

  qg4.append("polygon")
    .attr("class", "quadArrow less")
    .attr("points", "0,-1 9,-10, 18,-1")

  qg4.append("text")
    .text(incomeQuadText)
    .attr("dy", (quadTextLineHeight*.8) + "px")

  qg4.append("text")
    .text("LESS")
    .attr("class","big")
    .attr("dy", (quadTextLineHeight*2.8) + "px")
    .attr("dx", "23px")

  qg4.append("polygon")
    .attr("class", "quadArrow more")
    .attr("points", "0," + (quadTextLineHeight*2.8-10) + " 9," + (quadTextLineHeight*2.8-1) + " 18," + (quadTextLineHeight*2.8-10))

  qg4.append("text")
    .text(revenueQuadText)
    .attr("dy", (quadTextLineHeight*3.6) + "px")

//ellipse to circle the CTC dots in slide 4
  highlightEllipse = svg.append("ellipse")
    .attr("class", "highlightEllipse")
    .attr("fill","rgb(207,232,243)")
    .attr("cx", x(-.43))
    .attr("cy", y(102 * 1000000000))
    .attr("rx", 34)
    .attr("ry", 18)
    .style("opacity",0)

//build legend
  var legendSvg = (IS_PHONE()) ? overlaySvg : svg;
  var legendLeft = (IS_PHONE()) ? -300 : 10
  var legendTop = (IS_PHONE()) ? 40 : 10

//legend show/hide buttons on mobile
  if(IS_PHONE()){
    var legendButton = overlaySvg.append("g")
      .attr("transform", "translate(1,10)")
      .style("cursor", "pointer")

    legendButton.append("rect")
      .attr("width", 67)
      .attr("height", 26)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("id", "phoneLegendButton")

    legendButton.append("text")
      .attr("x", 8)
      .attr("y", 18)
      .text("LEGEND")
      .attr("id", "phoneLegendText")
      .style("opacity", 1)

    legendButton.append("image")
      .attr("xlink:href", "images/closeWhite.png")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", 5.5)
      .attr("y", 5.5)
      .style("opacity", 0)

    legendButton.on("click", function(){
      if(d3.select(this).classed("open")){
        d3.select(this).classed("open", false)

        d3.select("#legendG")
          .transition()
          .attr("transform", "translate(" + legendLeft + "," + legendTop + ")")
        
        d3.select(this).select("rect")
          .transition()
          .attr("width", 67)
        
        d3.select(this).select("text")
          .transition()
          .style("opacity", 1)
        
        d3.select(this).select("image")
          .transition()
          .style("opacity", 0)
      }else{
        d3.select(this).classed("open", true)

        d3.select("#legendG")
          .transition()
          .attr("transform", "translate(" + 1 + "," + legendTop + ")")

        d3.select(this).select("rect")
          .transition()
          .attr("width", 26)
        
        d3.select(this).select("image")
          .transition()
          .style("opacity", 1)
        
        d3.select(this).select("text")
          .transition()
          .style("opacity", 0)
      }

    })
  }

//first two rows of legend, on all slides
  var legend = legendSvg.append("g")
    .attr("transform", "translate(" + legendLeft + "," + legendTop + ")")
    .attr("id", "legendG")

  legend.append("rect")
    .attr("id", "legendBg")
    .attr("width", legendWidth(0))
    .attr("height", legendHeight(0))

  legend.append("text")
    .attr("id", "legendTitle")
    .text("Legend")
    .attr("text-anchor","start")
    .attr("x", 16)
    .attr("y", 30)

  var lrow = legend.append("g")
    .attr("class", "lrow")
    .attr("transform", "translate(16, 40)")

  lrow.append("circle")
    .attr("cx", 3)
    .attr("cy", 5)
    .attr("r", 3)
    .attr("class", "tcjaLegendDot")

  lrow.append("text")
    .attr("x", 12)
    .attr("y", 10)
    .attr("class", "tcjaLegendText legendText")
    .text("TCJA")

  var lrow2 = legend.append("g")
    .attr("class", "lrow")
    .attr("transform", "translate(16  , 60)")

  lrow2.append("circle")
    .attr("cx", 3)
    .attr("cy", 5)
    .attr("r", 4.5)
    .attr("class", "pretcjaLegendDot")

  lrow2.append("text")
    .attr("x", 12)
    .attr("y", 10)
    .attr("class", "pretcjaLegendText legendText")
    .text("Pre-TCJA")

//set width of explore section on mobile
  var exploreWidth;
  if(IS_PHONE()) exploreWidth = getDeviceWidth() + "px";
  else if(IS_MOBILE()) exploreWidth = "480px";
  else exploreWidth = "inherit"

  d3.selectAll(".mobileExplore").style("width", exploreWidth)

  if(IS_MOBILE() && activeIndex != 24){
    hideMobileExplore(true, true);
  }


//set up array of functions that run each section
  var activateFunctions = [];

//build chart object and run initializing functions
  var chart = function (selection) {
    selection.each(function (points) {
      init(points);
      setupSections(points)

      draw(points);
    });
  };


//getters and setters for income and filing groups in the explore section
  function getIncome(){
    return d3.select("#incomeMenu").node().value
  }
  function getGroup(){
    return d3.select("#groupMenu").node().value
  }
  function setIncome(income){
    $("#incomeMenu" ).val(income).selectmenu("refresh")
  }
  function setGroup(group){
    $("#groupMenu" ).val(group).selectmenu("refresh")
  }

//TCJA x and y values stored in data/source/tcja.js
//Get values based on income/group menus, or passed in params
  function getTcjaVals(i, g){
    var income = (typeof(i) == "undefined") ? getIncome() : i;
    var group = (typeof(g) == "undefined") ? getGroup() : g;
    var xkey = (group == "tcja") ? "a0" : group + income;
    return [TCJA[xkey], TCJA["burden"]]
  }

//Move the TCJA dot and lines based on x and y vals
  function moveTCJA(vals){
    d3.selectAll(".tick line")
      .style("opacity", function(d){
        return (d == 0) ? 0 : 0.8;
      })

    var tx = vals[0],
      ty = vals[1]
    
    tcjaDot.classed("hidden", false)
      .transition()
      .delay(longLag)
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

//update the legend
  function updateLegend(origKey, colors){
    var key;
//for CTC sections, use the same color pallete/layout
    if(origKey == "ct1" || origKey == "ct2" || origKey == "ct3"){
      key = "ctcAmount"
    }
//For q1 slide that also shows q2 data
    else if(origKey == "q1" && colors["1"] != colors["2"]){
      key = "q1a"
    }
//standard deduction legend shows dollar values, vs the values in `paramaterText`
//which are strings
    else if(origKey == "standard"){
      key = "standardSingle"
    }
    else{
      key = origKey
    }

    d3.selectAll(".lrow.temp")
      .transition()
      .duration(500)
      .style("opacity",0)
      .on("end", function(){
        d3.select(this).remove()
      })

    if(key == "ctcAmount" && colors.l == TPC_BLUE && colors.medium == TPC_BLUE && colors.h == TPC_BLUE){
      // this is the key and color values passed in for slides where the visualization doesn't need
      // legend values (i.e. no additional use of color)
    }
    else if(paramaterText.hasOwnProperty(key)){
//slides where the legend shows the values of a given parameter (CTC, standard deduction, personal exemption)
      var i = 2
      var h = legend.append("g")
        .attr("class", "lrow temp")
        .attr("transform", "translate(16, " + (70 + 20) + ")")
      
//legend header w/ paramater name
      h.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("class", "tcjaLegendText legendText")
        .text(paramaterText[key]["label"])
        .style("opacity",0)
        .transition()
        .duration(500)
          .style("opacity",1)

//draw dot and label for each param value
      for (var c in colors) {
        if (colors.hasOwnProperty(c) && c != "l0" && c != "m0" && c != "h0" ) {
          var color = colors[c].replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"),
            text = paramaterText[key][c][0].replace("<span class = \"tcjaLabel\">","").replace("<span class = \"pretcjaLabel\">","").replace("</span>","")

          var row = legend.append("g")
            .attr("class", "lrow temp")
            .attr("transform", "translate(16, " + (70 + i* 20) + ")")
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
            .attr("class", "legendText legendText")
            .text(text)
          
          i++;
        }
      }
//CTC slides that list the CTC threshold at the bottom of the legend
      if(key == "ctcAmount" && colors.l != TPC_BLUE && activeIndex > 4){
        var amt;
        if (activeIndex == 5) amt = "$2,500"
        else if(activeIndex == 6) amt = "$1,250"
        else amt = "$0"

        var rowT = legend.append("g")
          .attr("class", "lrow temp")
          .attr("transform", "translate(16, " + (70 + 6* 20) + ")")
          .style("opacity",0)
        
        rowT.transition()
          .duration(500)
          .style("opacity",1)

        rowT.append("text")
          .attr("class", "legendText bottomLegendText")
          .text("Filtered by CTC threshold of " + amt)
      }


    }else{
//For the last series of slides walking through the quintiles
//when shading the region that benefits q1-4, those dots are pink not standard blue
      var color = (key == "q4") ? PINK : TPC_BLUE
//for the first series of quinitle graphs, we use a blue/pink pallete
//for the second series of quinitle graphs, we use a dark blue/purple pallete
      var color2 = (key[0] == "b") ? DARK_BLUE : PINK
      if(key[0] == "b") color = PURPLE
//when highlighting the top 1% we use dark blue to differentiate from the quintiles
      if(key == "t1") color = DARK_BLUE

      var text = customLegendText[key]

      var row1 = legend.append("g")
        .attr("class", "lrow temp")
        .attr("transform", "translate(16, " + (80) + ")")
        .style("opacity",0)

      row1.transition()
        .duration(500)
        .style("opacity",1)

      row1.append("circle")
        .attr("cx", 3)
        .attr("cy", 5)
        .attr("r", 3)
        .style("stroke-width", "4px")
        .style("stroke", color.replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"))
        .style("fill", color.replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"))
        .attr("class", "legendDot")

      row1.append("text")
        .attr("dx", 12)
        .attr("dy", 10)
        .attr("class", "legendText legendText")
        .text(text[0])
        .call(wrap, 260, 6)

//for quintile slides that have 2 rows of legend values
      if(text.length == 2){
        var row2 = legend.append("g")
          .attr("class", "lrow temp")
          .attr("transform", "translate(16, " + (100) + ")")
          .style("opacity",0)

        row2.transition()
          .duration(500)
          .style("opacity",1)

        row2.append("circle")
          .attr("cx", 3)
          .attr("cy", 25)
          .attr("r", 3)
          .style("stroke-width", "4px")
          .style("stroke", color2.replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"))
          .style("fill", color2.replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"))
          .attr("class", "legendDot")

        row2.append("text")
          .attr("dx", 12)
          .attr("y",20)
          .attr("dy", 10)
          .attr("class", "legendText legendText")
          .text(text[1])
          .call(wrap, 260, 16)
      }

    }

//resize legend based on global size params
    d3.select("#legendBg")
      .transition()
      .duration(duration)
      .attr("width", legendWidth(activeIndex))
      .attr("height", legendHeight(activeIndex))
  }

//based on a set of filters set boolean hide param per point
//param is used in `draw`function to grey out points and disable mouseover
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

//a var in the shared scope that is a subset of all points
    shown = points[0]
      .filter(function(p){ return p.hide == false })
      .map(function(p){ return [p.x, p.y] })

    draw(points);
  }

//recolor all points based on color dictionary
  function recolorPoints(key, colors, points){
    points[0].forEach(function(point){
      point.color = colors[point[key]]
    })
    draw(points);
  }


//interpolator functions to tween between RGBA colors and positions
  function interpolateVal(source, target, t){
    return source * (1-t) + target*t
  }
  function interpolateRGBAColors(c1, c2, t){
    rgb1 = c1.replace("rgba(","").replace(")","").split(",")
    rgb2 = c2.replace("rgba(","").replace(")","").split(",")

    return "rgba(" + interpolateVal(+(rgb1[0]), +(rgb2[0]), t) + "," + interpolateVal(+(rgb1[1]), +(rgb2[1]), t) + "," + interpolateVal(+(rgb1[2]), (rgb2[2]), t) + "," + interpolateVal(+(rgb1[3]), (rgb2[3]), t) + ")"
  }

//run custom interpolator animation loop for position and color of points
  var timerCount;
  function loopAnimate (points, moveY) {
    setTimeout(function () {
      var t = Math.min(1, ease(timerCount / duration));
      points[0].forEach(function(point){
        point.x = interpolateVal(point.sx, point.tx, t);
        point.y = interpolateVal(point.sy, point.ty, t);
        //disable color interpretation on browsers/devices where it's too computationally intensive
        if(!IS_PHONE() && !IS_SAFARI()) point.color = interpolateRGBAColors(point.sc, point.tc, t)
      });

      draw(points);
      if (t === 1) {
        shown = points[0].map(function(p){ return [p.x, p.y] })
        draw(points);
      }  

      timerCount += increment;
      if (timerCount < duration) {
        loopAnimate(points, moveY);
      }
    }, increment)
  }


  function animateLayout(income, group, points, moveY, key, colors) {
    moveTCJA(getTcjaVals(income, group))
    updateLegend(key, colors)

//update labels at top of chart
    if(income != "tcja"){
      d3.select(".catName.filing").text(d3.select("option[value=\'" + group + "\']").text())
      d3.select(".catName.income").text(d3.select("option[value=\'" + income + "\']").text())
    }

//set the starting x and y values to their current vals
//set starting color to current color
    points[0].forEach(function(point){
      point.sx = point.x;
      point.sy = point.y; 
      point.sc = point.color
    });

//for first slide, dots collapse to/expand from a single point (the TCJA value)
    if(income == "tcja" && group == "tcja"){
      points[0].forEach(function(point){
        point.tx = TCJA["a0"];
        point.ty = TCJA["burden"];
        //disable color interpretation on browsers/devices where it's too computationally intensive
        if (!IS_PHONE() && !IS_SAFARI()) point.tc = TPC_BLUE
        else point.color = TPC_BLUE
      });
//otherwise set target position and color based on input parameters
    }else{
      points[0].forEach(function(point){
        point.tx = point[group + income];
        point.ty = point["burden"];
        //disable color interpretation on browsers/devices where it's too computationally intensive
        if (!IS_PHONE() && !IS_SAFARI()) point.tc = colors[point[key]]
        else point.color = colors[point[key]]
      });
    }

    timerCount = 0;
    loopAnimate(points, moveY);
  }

//show the tooltip in the explore section
  function showExploreTooltip(point){

    d3.selectAll(".rangeDot").classed("highlight", false)
    d3.selectAll(".explore.tooltip").remove()

    var tt = d3.select("#vis")
      .append("div")
      .attr("class", "explore tooltip")
      .style("top", (getVisHeight() - 330) + "px")

//top of tooltip lists x and y values
    var xRow = tt.append("div").attr("class", "ttRow x")
    xRow.append("div").attr("class", "ttTitle").text("Change in average after-tax income:")
    xRow.append("div").attr("class", "ttValue").text(RATIOS(point[getGroup() + getIncome()]) + "%" )

    var yRow = tt.append("div").attr("class", "ttRow y")
    yRow.append("div").attr("class", "ttTitle").text("Revenue change:")
    yRow.append("div").attr("class", "ttValue").text(SMALL_DOLLARS(point["burden"]) )

//remaineder of tooltip lists values for each filter parameter
    for (var p in DEFAULT_FILTERS) {
      if (DEFAULT_FILTERS.hasOwnProperty(p)) {
        d3.select(".rangeDot." + p + "_" + point[p] ).classed("highlight", true)
        
        var ttRow = tt.append("div").attr("class", "ttRow")
        
        ttRow.append("div")
          .attr("class", "ttTitle")
          .text(paramaterText[p]["label"] + ":")
        
        ttRow.append("div")
          .attr("class", "ttValue")
          .html( paramaterText[p][ point[p] ][0].replace("<span class = \"tcjaLabel\">","").replace("<span class = \"pretcjaLabel\">","").replace("</span>",""))
      }
    }

//move highlight dot on top of point
    highlight.classed("hidden", false)
      .attr("cx", x(point.x))
      .attr("cy", y(point.y));
  }

//hide the explore section tooltip
  function hideExploreTooltip(){
    highlight.classed("hidden", true)
    d3.selectAll(".explore.tooltip").remove()
    d3.selectAll(".rangeDot").classed("highlight", false)
  }
//show tooltip for input dots in explore section
  function showInputTooltip(dot, d){
//don't show tooltips if there's no tooltip needed
    if(paramaterText[ d[1] ][ d[2] ][1] == false){
      hideInputTooltip() 
    }else{
      var container = d3.select(dot.parentNode.parentNode.parentNode)

//if tooltips extend past the left screen edge, make them off-centered and scootched right
      var leftShift = (dot.getBoundingClientRect().left - ttWidths[d[1]]*.5 + 9 < 0) ? -16 : -.5*ttWidths[d[1]] + 9;
      var leftClass = (dot.getBoundingClientRect().left - ttWidths[d[1]]*.5 + 9 < 0) ? " left" : ""

//if tooltips extend past the right screen edge, make them off-centered and scootched left
      var rightShift = (dot.getBoundingClientRect().right + ttWidths[d[1]]*.5 - 9 > getDeviceWidth()) ? -.5*ttWidths[d[1]] + 29 : 0;
      var rightClass = (dot.getBoundingClientRect().right + ttWidths[d[1]]*.5 - 9 > getDeviceWidth() ) ? " right" : ""

      var tt;

//on smaller phones, the above scootching still cuts off 2 specific tooltips. Give them bespoke custom positions.
      if(getDeviceWidth() < 405 && d[1] == "standard" && (d[2] == "mh" || d[2] == "ml")){
        tt = container.append("div")
          .attr("class", "input tooltip")
          .style("width", ttWidths[d[1]] + "px" )
          .style("left", "0px")
      }else{
        tt = container.append("div")
          .attr("class", "input tooltip")
          .style("width", ttWidths[d[1]] + "px" )
          .style("left", (dot.getBoundingClientRect().left - d3.select("#controls").node().getBoundingClientRect().left + leftShift + rightShift) + "px")
      }

//the rates checkboxes are arranged as a list, not a faux-slider, so get unique positions
      if(d[1] == "rates"){
        tt.style("top", (dot.getBoundingClientRect().top - d3.select("#controls").node().getBoundingClientRect().top  - 433) + "px")
      }

//populate the tooltip text
      tt.append("div")
        .attr("class", "ttContent")
        .html(paramaterText[ d[1] ][ d[2] ][1] )

//on smaller phones, the above scootching still cuts off 2 specific tooltips. Give them bespoke custom positions.
      if(getDeviceWidth() < 405 && d[1] == "standard" && (d[2] == "mh" || d[2] == "ml")){
        var customClass = " customTT_" + d[2]
        
        tt.append("div")
          .attr("class", "ttArrow" + customClass)  
          .style("left", (dot.getBoundingClientRect().left-10) + "px")
      }
      else{
        tt.append("div")
          .attr("class", "ttArrow" + leftClass + rightClass)      
      }

    }
  }

//hide the input tooltip
  function hideInputTooltip(){
    d3.selectAll(".input.tooltip").remove()

  }

  function showInfoTooltip(dot, key){
//show tooltips on info icons in the explore section
    hideInputTooltip()

    var container = d3.select(dot.parentNode.parentNode)

    var tt = container.append("div")
      .attr("class", "info tooltip")

//add X icon to close tooltip
    tt.append("img")
      .attr("class", "infoClose")
      .attr("src", "images/closeDot.png")
      .on("mouseover", function(){
        d3.select(this).attr("src", "images/closeDotHover.png")
      })
      .on("mouseout", function(){
        d3.select(this).attr("src", "images/closeDot.png")
      })
      .on("click", hideInfoTooltip)

//Title is name of parameter
    tt.append("div")
      .attr("class", "infoTitle")
      .html(paramaterText[key]["label"])

//Add tooltip info text
    tt.append("div")
      .attr("class", "ttContent")
      .html(paramaterText[ key ][ "info" ][0] )

//For paramaters that need it, add a section explaining why there is no pre-TCJA value
    if(paramaterText[ key ][ "info" ][1]){
      tt.append("div")
        .attr("class", "infoTitle where")
        .html("<img src = \"images/questionDot.png\"/>Where is the pre-TCJA value?")

      tt.append("div")
        .attr("class", "ttContent")
        .html(paramaterText[ key ][ "info" ][1] )
    }
  }

//hide the info pop up tooltip
  function hideInfoTooltip(){
    d3.selectAll(".info.tooltip").remove()
  }


//initializer function
//Set initial color and position of points, and set up `shown` object to include no filters
  function init(points){
    points[0].forEach(function(p,i){
      p.x = TCJA["a0"]
      p.y = TCJA["burden"]
      p.color = TPC_BLUE
    })
    shown = points.map(function(p){ return [p.x, p.y] })
  }

//draw function which redraws the canvas on each loop of the interpolator,
//plus various other times such as init and refilter
  function draw(points) {
    xg.call(xAxis);
    yg.call(yAxis);

//build a quadtree from the points object to search for the point closest to the cursor on mouseover
    var tree = d3.quadtree()
      .x(function(p){ return x(p.x) })
      .y(function(p){ return y(p.y) })
      .extent([[-1, -1], [width + 1, height + 1]])

//clear the canvas
    context.clearRect(0, 0, width, height);

//first loop over the points and draw the hidden (greyed out) points, so that they sit underneath the drawn points
    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(p.hide){
        context.fillStyle = COLOR_HIDE;
        context.fill();
      }
    });

//then loop over the points again and draw the shown points on top of the greyed out points
    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(!p.hide){
        context.fillStyle = p.color;
        context.fill();
        tree.add(p)
      }
    });

//mouseover function for the explore section
    overlaySvg.on("mousemove",function(){
//only allow mouseover functionality if in the last section, and not below 768px width
      if(activeIndex == 24 && !IS_PHONE()){
//search the quadtree for the closest point to the cursor
        var mouse = d3.mouse(this),
        closest = tree.find(mouse[0], mouse[1]);

//hide tooltip if the cursor is too far away from any point to trigger mouseover
        if(typeof(closest) != "undefined"){
          showExploreTooltip(closest)
        }else{
          hideExploreTooltip()
        }
      }else{
        hideExploreTooltip()
      }
    });

//show the mouseover dot when mouseover fires, to prevent flickering
    overlaySvg.on("mouseover",function(){
      highlight.classed("hidden", false);
    });

//hide the tooltip if moused out of the SVG, even during explore section
    overlaySvg.on("mouseout",function(){
      hideExploreTooltip()
    });

  }

//Fire this function on every slide except the first one, to hide various elements that are specific to a single slide
//This function needs to fire repeatedly because on rapid scroll some activateFunctions get skipped to improve performance
  function hideQuads(){
    d3.selectAll(".quadGroup")
      .transition()
      .duration(duration)
        .style("opacity",0)

    d3.select("#catLabels")
      .transition()
      .duration(duration)
        .style("opacity",1)

    d3.select(".highlightEllipse")
      .transition()
      .style("opacity",0)

    if(IS_MOBILE() && activeIndex != 24){
      hideMobileExplore(true, true);
    }
  }

/***********************************/
//The activate functions that fire on each section/slide
//The if statement at the start of each function ensures that the functions don't all fire on rapid scroll
/***********************************/

  function showTcjaDot(points){
//Show the quadrants, hide the labels above the chart, and place all points at the same location as the TCJA dot
    if(activeIndex != 0){ return false }

    animateLayout("tcja","tcja", points, true, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
    
    d3.selectAll(".quadGroup")
      .transition()
      .duration(duration)
      .style("opacity",1)

    d3.select("#catLabels")
      .transition()
      .duration(duration)
      .style("opacity",0)
  }

  function showAllAll(points){
//Show dots for all incomes, all filing statuses
    hideQuads();
    if(activeIndex != 1){ return false }

    animateLayout("0","a", points, true, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})

  }

  function showQ1(points){
//Show dots for 1st income quintile, all filing statuses
    hideQuads();
    if(activeIndex != 2){ return false }

    animateLayout("1","a", points, false, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
  }

  function showQ1_CTC(points){
//Circle the dots in the upper left corner of the chart
    hideQuads();
    if(activeIndex != 3){ return false }

    d3.select(".highlightEllipse")
      .transition()
      .duration(duration + 300)
      .delay(lag)
        .attr("cx", x(-.43))
        .attr("rx", 34)
        .style("opacity",1)

    animateLayout("1","a", points, false, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
  }

  function showMarriedKids(points){
//Transition to showing married filers with kids
//Slowly stretch out the ellipse around the points to show where they move to in the new filing group
    hideQuads();
    if(activeIndex != 4){ return false }

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

    animateLayout("1","g", points, false, "ctcAmount", {"l": DARK_BLUE, "medium": TPC_BLUE, "h": PURPLE})
  }

  function showMarriedKidsFilter1(points){
//Filter the graph to only show CTC threshold of $2,500
    hideQuads();
    if(activeIndex != 5){ return false }

    animateLayout("1","g", points, false, "ct1", {"l": DARK_BLUE, "medium": TPC_BLUE, "h": PURPLE, "l0": DARK_BLUE_HIDE, "m0": TPC_BLUE_HIDE, "h0": PURPLE_HIDE})
  }

  function showMarriedKidsFilter2(points){
//Filter the graph to only show CTC threshold of $1,250
    hideQuads();
    if(activeIndex != 6){ return false }

    animateLayout("1","g", points, false, "ct2", {"l": DARK_BLUE, "medium": TPC_BLUE, "h": PURPLE, "l0": DARK_BLUE_HIDE, "m0": TPC_BLUE_HIDE, "h0": PURPLE_HIDE})
  }

  function showMarriedKidsFilter3(points){
//Filter the graph to only show CTC threshold of $0
    hideQuads();
    if(activeIndex != 7){ return false }

    animateLayout("1","g", points, false, "ct3", {"l": DARK_BLUE, "medium": TPC_BLUE, "h": PURPLE, "l0": DARK_BLUE_HIDE, "m0": TPC_BLUE_HIDE, "h0": PURPLE_HIDE})
  }

  function showQ1_PersonalExcemption(points){
//Remove filters, move back to all filers, and color by values of personal exemption amount
    hideQuads();
    if(activeIndex != 8){ return false }

    animateLayout("1","a", points, false, "personal", {"l": DARK_BLUE, "ml": TPC_BLUE, "mh": PURPLE, "h": PINK})
  }

  function showQ1_StandardDeduction(points){
//recolor by values of standard deduction
    hideQuads();
    if(activeIndex != 9){ return false }

    animateLayout("1","l", points, false, "standard", {"l": DARK_BLUE, "ml": TPC_BLUE, "mh": PURPLE, "h": PINK})
  }

  function showTop1_Rates(points){
//transition to showing showing top 1% of income, and color by marginal tax rates
    hideQuads();
    if(activeIndex != 10){ return false }

    animateLayout("8","a", points, false, "rates", {"b": DARK_BLUE, "d": TPC_BLUE, "a": PURPLE, "c": PINK})
  }

  function compareQ1(points){
//Show q1 income, and color to show plans that benefit q1. Note that this slide is repeated twice
    hideQuads();
    if(activeIndex != 11 && activeIndex != 13){ return false }

    animateLayout("1","a", points, false, "q1", {"0": DARK_HIDE, "1": TPC_BLUE, "2": TPC_BLUE})
  }

  function compareTop1(points){
//Show top 1% incomes and color to show plans that benefit top 1%
    hideQuads();
    if(activeIndex != 12){ return false }

    animateLayout("8","a", points, false, "t1", {"0": DARK_HIDE, "1": DARK_BLUE})
  }

  function compareQ2(points){
//Show q2 income and color to show plans that benefit q1+2 plus nonoverlap
    hideQuads();
    if(activeIndex != 14){ return false }

    animateLayout("2","a", points, false, "q1", {"0": DARK_HIDE, "1": TPC_BLUE, "2": PINK })
  }

  function compareQ3(points){
//Show q3 income and color to show plans that benefit q1-3 plus nonoverlap
    hideQuads();
    if(activeIndex != 15){ return false }

//On browsers/devices that have no gradual color transition, no need for long lag between steps
    var step2Delay = (IS_SAFARI() || IS_PHONE()) ? 400 : duration + lag + lag;

    animateLayout("2","a", points, false, "q1", {"0": DARK_HIDE, "1": TPC_BLUE, "2": DARK_HIDE})
//Add a lag between the two steps of the animation
    setTimeout(function(){
      if(activeIndex == 15){
        animateLayout("3","a", points, false, "q2", {"0": DARK_HIDE, "2": TPC_BLUE, "1": PINK})
      }
    }, step2Delay)
  }

  function compareQ4(points){
//Show q4 income and color to show plans that benefit q1-4 plus nonoverlap
    hideQuads();
    if(activeIndex != 16){ return false }
  
 //On browsers/devices that have no gradual color transition, no need for long lag between steps 
    var step2Delay = (IS_SAFARI() || IS_PHONE()) ? 400 : duration + lag + lag;

    animateLayout("3","a", points, false, "q2", {"0": DARK_HIDE, "2": TPC_BLUE, "1": DARK_HIDE})
//Add a lag between the two steps of the animation
    setTimeout(function(){
      if(activeIndex == 16){
        animateLayout("4","a", points, false, "q3", {"0": DARK_HIDE, "1": TPC_BLUE, "2": PINK})
      }
    }, step2Delay)
  }

  function compareQ5(points){
//Show q5 income and color to show plans that benefit q1-4 plus nonoverlap
    hideQuads();
    if(activeIndex != 17){ return false }

 //On browsers/devices that have no gradual color transition, no need for long lag between steps 
    var step2Delay = (IS_SAFARI() || IS_PHONE()) ? 400 : duration + lag + lag;

    animateLayout("4","a", points, false, "q3", {"0": DARK_HIDE, "1": TPC_BLUE, "2": DARK_HIDE})
//Add a lag between the two steps of the animation
    setTimeout(function(){
      if(activeIndex == 17){
        animateLayout("5","a", points, false, "q4", {"0": DARK_HIDE, "1": PINK})
      }
    }, step2Delay)
  }

  function compareQ5Alt1(points){
//Show non overlap between benefit q1 and q5
    hideQuads();
    if(activeIndex != 18){ return false }

    animateLayout("5","a", points, false, "b5", {"0": DARK_HIDE, "1": PURPLE, "2": DARK_BLUE})
  }

  function compareQ5Alt2(points){
//Show non overlap between benefit q2 and q5
    hideQuads();
    if(activeIndex != 19){ return false }

    animateLayout("5","a", points, false, "b4", {"0": DARK_HIDE, "1": PURPLE, "2": DARK_BLUE})
  }

  function compareQ5Alt3(points){
//Show non overlap between benefit q3 and q5
    hideQuads();
    if(activeIndex != 20){ return false }

    animateLayout("5","a", points, false, "b3", {"0": DARK_HIDE, "1": PURPLE, "2": DARK_BLUE})
  }

  function compareQ5Alt4(points){
//Show non overlap between benefit q4 and q5
    hideQuads();
    if(activeIndex != 21){ return false }

    animateLayout("5","a", points, false, "b2", {"0": DARK_HIDE, "1": PURPLE, "2": DARK_BLUE})
  }

  function compareQ5Alt(points){
//Show non overlap between benefit q1,2,3, or 4 and q5
    hideQuads();
    if(activeIndex != 22){ return false }

    if(IS_MOBILE()){
      hideMobileExplore(true, true);
    }

    hideExploreTooltip()

    filterPoints(DEFAULT_FILTERS, points)

    animateLayout("5","a", points, false, "b1", {"0": DARK_HIDE, "1": PURPLE, "2": PURPLE, "3": PURPLE, "4": PURPLE, "6": DARK_BLUE})

  }

  function preExplore(points){
//Remove coloring and filters to set up for Explore section
    hideQuads();
    if(activeIndex != 23){ return false }

    if(IS_MOBILE()){
      hideMobileExplore(true, true);
    }
    
    animateLayout(getIncome(),getGroup(), points, true, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
  }

  function showExplore(points){
//Show the explore section
    hideQuads();
    if(activeIndex != 24){ return false }

    if(IS_MOBILE()){
      showMobileExplore();
    }

    filterPoints(getFilterVals(), points)

    animateLayout(getIncome(),getGroup(), points, true, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
  }

  function checkDot(dot, points){
//Either check or uncheck the dots in the explore section (an svg animation)
    if(d3.select(dot).classed("active")){
      d3.select(dot)
        .transition()
        .duration(200)
          .style("background", "#fff")
          .style("stroke", "#cccccc")
          .on("end", function(d){
            d3.select(dot).classed("active", false)
            d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", false)
            filterPoints(getFilterVals(), points)
          })
    }else{
      d3.select(dot)
        .transition()
        .duration(200)
          .style("background", "#008bb0")
          .style("stroke", "#008bb0")
          .on("end", function(d){
            d3.select(dot).classed("active", true)
            d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", true)
            filterPoints(getFilterVals(), points)
          })
    }
  }

  function buildCheckboxes(key, vals, numVals, filterVals, points){
//Some semi duplicative code with `buildRange` below
//Build out a set of checkboxes (veritally stacked), in this feature only used for the `rates` key
    var container = d3.select("#controls")
      .append("div")
      .attr("class", "resizeRemove controlContainer checkboxes " + key)
    
    var filters = filterVals[key],
    w = d3.select(".step.lastStep").node().getBoundingClientRect().width
    h = 150

    var title = container.append("div")
      .attr("class", key + " controlTitle")
    
    title.append("span")
      .text(paramaterText[key]["label"] + ":")

//info icon for info tooltip
    var info = title.append("div")
      .attr("class", key +  " controlInfo")

    info
      .on("click", function(d){
        showInfoTooltip(this, key)
      })
      .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/infoDotHover.png")
      })
      .on("mouseout", function(){
        d3.select(this).select("img").attr("src", "images/infoDot.png")
      })

    info.append("img").attr("src", "images/infoDot.png")

//dots are svg cirlces
    var rsvg = container.append("svg")
      .attr("width", w + "px")
      .attr("height", h + "px")
      .append("g")

    var scale = d3.scaleLinear()
      .range([25, h-40])
      .domain([numVals[0], numVals[numVals.length - 1]] )

//draw the cirlces
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
          checkDot(this, points)
        })
        .on("mouseover", function(d){
          showInputTooltip(this, d)
        })
        .on("mouseout", hideInputTooltip)

//draw the checkmarks
    var lineData = [ { "x": 5,   "y": 9},
    { "x":9,  "y": 13},
    { "x": 15,  "y": 4}];

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })

    rsvg.selectAll("path").remove()

    var path = rsvg
      .selectAll("path")
      .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
      .enter()
      .append("path")
        .attr("class", function(d){
          var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
          return "rangeCheck " + key + "_" + d[2] + active
        })
        .attr("d", lineFunction(lineData))
        .attr("stroke", "white")
        .attr("stroke-width", "3")
        .attr("fill", "none")
        .attr("transform", function(d){ return  "translate(2," + (scale(d[0])-9.5)  + ")"})
        .on("mouseover", function(d){
          showInputTooltip(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), d)
        })
        .on("click", function(d){
          checkDot(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), points)
        })
        .on("mouseout", hideInputTooltip)

    var totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dashoffset", 0);


//Draw the labels next to the circles
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
  }

  function buildRange(key, vals, numVals, filterVals, points){
//Some semi duplicative code with `buildCheckboxes` above
//Build out faux-slider, a horizontally arranged set of circles spaced apart from each other
//based on their values (like on a sliding scale)
    var container = d3.select("#controls")
      .append("div")
      .attr("class", "resizeRemove controlContainer " + key)
    
    var filters = filterVals[key],
      w,
      h = 80

    if(IS_PHONE()){
      w = getDeviceWidth() - 10
    }
    else if(IS_MOBILE()){
      w = 460
    }else{
      w = d3.select(".step.lastStep").node().getBoundingClientRect().width
    }

    var title = container.append("div")
      .attr("class", key + " controlTitle")
    
    title.append("span")
      .text(paramaterText[key]["label"] + ":")

//info icon for info tooltip
    var info = title.append("div")
      .attr("class", key +  " controlInfo")
    
    info
      .on("click", function(d){
        showInfoTooltip(this, key)
      })
      .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/infoDotHover.png")
      })
      .on("mouseout", function(){
        d3.select(this).select("img").attr("src", "images/infoDot.png")
      })

    info.append("img").attr("src", "images/infoDot.png")

//dots are svg cirlces
    var rsvg = container.append("svg")
      .attr("width", w + "px")
      .attr("height", 80 + "px")
      .append("g")

    var scale = d3.scaleLinear()
      .range([12, w-42])
      .domain([numVals[0], numVals[numVals.length - 1]] )

//Line in background of slider
    rsvg.append("line")
      .attr("class", "rangeLine")
      .attr("x1",4)
      .attr("x2", w-35)
      .attr("y1", h/2)
      .attr("y2", h/2)

//Draw dots
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
        checkDot(this, points)
      })
      .on("mouseover", function(d){
        showInputTooltip(this, d)
      })
      .on("mouseout", hideInputTooltip)

//Draw the checkmarks
    var lineData = 
      [
        { "x": 5,   "y": 9},
        { "x":9,  "y": 13},
        { "x": 15,  "y": 4}
      ];

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })

    rsvg.selectAll("path").remove()

    var path = rsvg
      .selectAll("path")
      .data(numVals.map(function(d, i){ return [d, key, vals[i] ] }))
      .enter()
      .append("path")
        .attr("class", function(d){
          var active = (filterVals[key].indexOf( d[2] ) != -1) ? " active" : ""
          return "rangeCheck " + key + "_" + d[2] + active
        })
        .attr("d", lineFunction(lineData))
        .attr("stroke", "white")
        .attr("stroke-width", "3")
        .attr("fill", "none")
        .attr("transform", function(d){ return  "translate(" + (scale(d[0])-10.5)  + "," + 31 + ")"})
        .on("mouseover", function(d){
          showInputTooltip(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), d)
        })
        .on("click", function(d){
          checkDot(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), points)
        })
        .on("mouseout", hideInputTooltip)

    var totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dashoffset", 0);

//Draw value label above the dot
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

    labelContainer.append("div")
      .attr("class", "topLabel")
      .html(function(d){
        return paramaterText[key][ d[2] ][0]
      })

//Draw bottom labels to indicate TCJA and Pre-TCJA values
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

  function buildExploreSection(points){
//Create the explore section controls
    var filterVals = points[1]
    buildCheckboxes("rates", ["b", "d", "a", "c"], [0, 1, 2, 3], filterVals, points)
    buildRange("standard", ["l", "ml", "mh", "h"], [0, 1, 2, 3], filterVals, points)
    buildRange("amtThreshold", ["l", "h"], [0, 1], filterVals, points)
    buildRange("amtAmount", ["l", "h"], [0, 1], filterVals, points)
    buildRange("personal", ["l", "ml", "mh", "h"], [0, 2050, 4150, 5500], filterVals, points)
    buildRange("salt", ["l", "ml", "mh", "h"], [0, 10, 15, 20], filterVals, points)
    buildRange("ctcThreshold", ["l", "medium", "h"], [0, 1250, 2500], filterVals, points)
    buildRange("ctcAmount", ["l", "medium", "h"], [50, 70, 100], filterVals, points)

//JQuery selectmenu for filing group
    $("#groupMenu" ).selectmenu({
      change: function(event, d){
        animateLayout(getIncome(), d.item.value, points, false, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
      }
    })

//JQuery selectmenu for income group
    $("#incomeMenu" ).selectmenu({
      change: function(event, d){
        animateLayout(d.item.value, getGroup(), points, false, "ctcAmount", {"l": TPC_BLUE, "medium": TPC_BLUE, "h": TPC_BLUE})
      }
    })

//Mobile buttons to show/hide the explore menu
    d3.select("#hideExplore")
      .on("click", function(){
        hideMobileExplore(true, false)
      })
      .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/closeDotHover.png")
      })
      .on("mouseout", function(){
        d3.select(this).select("img").attr("src", "images/closeDot.png")
      })

    d3.select("#showExplore")
      .on("click", function(){
        showMobileExplore(true)
      })

//Buttons and inline links that scroll/jump down to explore section
    d3.selectAll(".jumpTo span")
      .on("click", function(){
        var income = d3.select(this).attr("data-income")
        var group = d3.select(this).attr("data-group")

        setIncome(income)
        setGroup(group)

        $([document.documentElement, document.body]).animate({
          scrollTop: $(".lastStep").offset().top - 100
        }, 1000, function(){
          if(IS_MOBILE()) showMobileExplore(true)  
        });
      })

    d3.selectAll(".defaultJump").on("click", function(){
      $([document.documentElement, document.body]).animate({
        scrollTop: $(".lastStep").offset().top - 100
      }, 1000, function(){
        if(IS_MOBILE()) showMobileExplore(true)  
      });
    })
  }


  var setupSections = function (points) {
//initialize the function array for each slide/section, and build explore section (which is rebuilt on resize etc)
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
    activateFunctions[10] = function(){ showTop1_Rates(points); };
    activateFunctions[11] = function(){ compareQ1(points); };
    activateFunctions[12] = function(){ compareTop1(points); };
    activateFunctions[13] = function(){ compareQ1(points); };
    activateFunctions[14] = function(){ compareQ2(points); };
    activateFunctions[15] = function(){ compareQ3(points); };
    activateFunctions[16] = function(){ compareQ4(points); };
    activateFunctions[17] = function(){ compareQ5(points); };
    activateFunctions[18] = function(){ compareQ5Alt1(points); };
    activateFunctions[19] = function(){ compareQ5Alt2(points); };
    activateFunctions[20] = function(){ compareQ5Alt3(points); };
    activateFunctions[21] = function(){ compareQ5Alt4(points); };
    activateFunctions[22] = function(){ compareQ5Alt(points); };
    activateFunctions[23] = function(){ preExplore(points) };
    activateFunctions[24] = function(){ showExplore(points); };

    buildExploreSection(points)

  };

//get the index number on scroll and run activate functions
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
//end of `scrollVis` function




function display(points, filterVals) {
//Gets run on initialization and on resize

  // if(getInternetExplorerVersion() != -1){
  //   IS_IE = true;
  // }

//Create the DOM elements and set up the activate functions
  var plot = scrollVis();

//Set the position of the right column (based on screen size)
//and bind data to chart container
  d3.select('#vis')
    .style("left", function(){
      return getVisLeft();
    })
    .datum([points, filterVals])
    .call(plot);

//set up scroller object and bind it to left column
  var scroll = scroller()
    .container(d3.select('#graphic'));

  scroll(d3.selectAll('.step'));

//resize functions
  function runResize(){
    screenW = $(window).width()
    screenH = $(window).height()

    var filterVals = getFilterVals()
    d3.selectAll(".resizeRemove").remove()
    display(points, filterVals)
  }

  scroll.on('resized', function(){
//don't trigger resize events on a phone if the height changes, to prevent
//events firing too often when scrolling on mobile Chrome (as toolbars show/hide)
    if(IS_PHONE()){
      if($(window).width() != screenW){
       runResize()
      } 
    }
//On all devices, only fire resize events if width/height is actually changing
    else{
      if($(window).width() != screenW || $(window).height() != screenH){
        runResize()
      }
    }
  })

  scroll.on('active', function (index) {
//fade out non-active steps in the left column
    var offOpacity = (IS_MOBILE()) ? 1 : .1

    d3.selectAll('.step')
      .style('opacity', function (d, i) { return (i === index || i == 19) ? 1 : offOpacity; });

    plot.activate(index);  
  });
}

var counter = 0;
function checkReady() {
//a timeout loop that runs once on load, and removes the loading gif once the charts are drawn
  counter += 1;
  var drawn = d3.selectAll(".quadGroup").nodes().length
  if (drawn < 4) {
    if(counter >= 7){
//A second loading message for long load times
      d3.select("#loadingText")
        .html("Almost done&#8230; thanks for your patience!")
    }
    setTimeout("checkReady()", 100);
  } else {
    setTimeout(function(){
      d3.select("#loadingContainer")
        .transition()
        .style("opacity", 0)
        .on("end", function(){
          d3.select(this).remove()
        })
    },500);
  }
}

//position the loading/gif container on top of the content
d3.select("#loadingContainer")
  .style("position", function(){
    if(d3.select("#topText").node().getBoundingClientRect().bottom < 110) return "fixed"
    else return "absolute"
  })
  .style("top", function(){
    if(d3.select("#topText").node().getBoundingClientRect().bottom < 110) return "40px"
    else return (d3.select("#vis").node().getBoundingClientRect().top - d3.select("body").node().getBoundingClientRect().top - 40) + "px"
  })


//Load the data and build the charts!
d3.json("data/data.json", function(points){
  display(points, DEFAULT_FILTERS);
});
checkReady()