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


    return out;
  }


var scrollVis = function () {
  var shown;


  const ease = d3.easeCubic;
  // let timer;

  var lastIndex = -1;
  var activeIndex = 0;

  var w, h;
  w = getVisWidth();
  h = getVisHeight();



  // var margin = {top: 20, right: 10, bottom: 30, left: 120},
  var width = w - margin.left - margin.right,
  height = h - margin.top - margin.bottom;

  var scootch = (IS_PHONE()) ? phoneXScootch : 0;



  var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "resizeRemove")
    .append("g")
      .attr("transform", "translate(" + (margin.left - scootch) + "," + margin.top + ")");

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




    // x.domain([-3.50, 5.50]);
    // y.domain([-550000000000, 300000000000]);


  var chartArea = d3.select("#vis").append("div")
    .attr("class", "resizeRemove")
    .style("left", (margin.left-scootch) + "px")
    .style("top", margin.top + "px")
    .style("position", "absolute")

  var canvas = chartArea.append("canvas")
    .attr("class", "resizeRemove")
    .attr("width", width)
    .attr("height", height);


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
      .classed("highlightDot", true)
      .attr("cx", -10)
      .attr("cy", -10)

  var tcjaDot = overlaySvg.append("circle")
      .attr("r", 3)
      // .classed("hidden", true)
      .classed("tcjaDot", true)
      .attr("cx", -10)
      .attr("cy", -10)


  var pretcjaDot = overlaySvg.append("circle")
      .attr("r", 4.5)
      .classed("pretcjaDot", true)
      .attr("cx", x(0))
      .attr("cy", y(0))





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


  var legendSvg = (IS_PHONE()) ? overlaySvg : svg;
  var legendLeft = (IS_PHONE()) ? -300 : 10
  var legendTop = (IS_PHONE()) ? 40 : 10


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

  var legend = legendSvg.append("g")
    .attr("transform", "translate(" + legendLeft + "," + legendTop + ")")
    .attr("id", "legendG")
    // .style("opacity",0)

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
    // .attr("r", 3)
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
    // .attr("r", 3)
    .attr("class", "pretcjaLegendText legendText")
    .text("Pre-TCJA")



    var exploreWidth;
    if(IS_PHONE()) exploreWidth = getDeviceWidth() + "px";
    else if(IS_MOBILE()) exploreWidth = "480px";
    else exploreWidth = "inherit"

    d3.selectAll(".mobileExplore").style("width", exploreWidth)

    if(IS_MOBILE() && activeIndex != 24){
      hideMobileExplore(true, true);
    }



  var activateFunctions = [];

  var chart = function (selection) {
    selection.each(function (points) {
      init(points);
      setupSections(points)
      
      draw(points);
    });
  };



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
  function getTcjaVals(i, g){
    var income = (typeof(i) == "undefined") ? getIncome() : i;
    var group = (typeof(g) == "undefined") ? getGroup() : g;
    var xkey = (group == "tcja") ? "a0" : group + income;
    return [TCJA[xkey], TCJA["burden"]]
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
    // if(origKey[0] == "b"){ return false}
    var key;
    if(origKey == "ct1" || origKey == "ct2" || origKey == "ct3"){
    key = "ctcAmount"
    }
    else if(origKey == "q1" && colors["1"] != colors["2"]){
      key = "q1a"
    }
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

    if(key == "ctcAmount" && colors.l == DOT_COLOR && colors.medium == DOT_COLOR && colors.h == DOT_COLOR){
    // "no legend"
    }
    else if(paramaterText.hasOwnProperty(key)){
    var i = 2
    var h = legend.append("g")
    .attr("class", "lrow temp")
    .attr("transform", "translate(20, " + (70 + 20) + ")")
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
    // .attr("r", 3)
    .attr("class", "legendText legendText")
    .text(text)
    i++;
    }
    }
    if(key == "ctcAmount" && colors.medium != DOT_COLOR && activeIndex > 4){
      // console.log(activeIndex)
      var amt;
      if (activeIndex == 5) amt = "$2,500"
      else if(activeIndex == 6) amt = "$1,250"
      else amt = "$0"
      var rowT = legend.append("g")
      .attr("class", "lrow temp")
      .attr("transform", "translate(20, " + (70 + 6* 20) + ")")
      .style("opacity",0)
      rowT.transition()
      .duration(500)
      .style("opacity",1)

      rowT.append("text")
        .attr("class", "legendText bottomLegendText")
        .text("Filtered by CTC threshold of " + amt)



    }


    }else{
      // var color = colors["1"].replace(/rgba\((.*?\,.*?\,.*?)\,.*?\)/,"rgb($1)"),
      var color = (key == "q4") ? COLOR_4 : COLOR_2
      var color2 = (key[0] == "b") ? COLOR_1 : COLOR_4
      if(key == "t1") color = COLOR_1
      if(key[0] == "b") color = COLOR_3

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
        // .attr("r", 3)
        .attr("class", "legendText legendText")
        .text(text[0])
        .call(wrap, 260, 6)

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
          // .attr("r", 3)
          .attr("class", "legendText legendText")
          .text(text[1])
          .call(wrap, 260, 16)

      }



    }

     d3.select("#legendBg")
     .transition()
     .duration(duration)
    .attr("width", legendWidth(activeIndex))
    .attr("height", legendHeight(activeIndex))

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
    // d3.select("#vis").datum([points])
    draw(points);


  }


  function recolorPoints(key, colors, points){
    points[0].forEach(function(point){

      point.color = colors[point[key]]

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

      // if(moveY == false){
      //   points[0].forEach(function(point){
      //     point.x = interpolateVal(point.sx, point.tx, t)
      //     point.color = interpolateRGBAColors(point.sc, point.tc, t)
      //   });
      // }else{
        points[0].forEach(function(point){        
            point.x = interpolateVal(point.sx, point.tx, t);
            point.y = interpolateVal(point.sy, point.ty, t);
            if(!IS_PHONE()) point.color = interpolateRGBAColors(point.sc, point.tc, t)
        });

      // }



      draw(points);
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
      if (!IS_PHONE()) point.tc = colors[point[key]]
      else point.color = colors[point[key]]
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

    // if(true){
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



    timerCount = 0;
    loopAnimate(points, moveY);

  }


function showExploreTooltip(point){

d3.selectAll(".rangeDot").classed("highlight", false)
d3.selectAll(".explore.tooltip").remove()
var tt = d3.select("#vis")
  .append("div")
  .attr("class", "explore tooltip")
  .style("top", (getVisHeight() - 330) + "px")

var xRow = tt.append("div").attr("class", "ttRow x")
xRow.append("div").attr("class", "ttTitle").text("Change in average after-tax income:")
xRow.append("div").attr("class", "ttValue").text(RATIOS(point[getGroup() + getIncome()]) + "%" )

var yRow = tt.append("div").attr("class", "ttRow y")
yRow.append("div").attr("class", "ttTitle").text("Revenue change:")
yRow.append("div").attr("class", "ttValue").text(SMALL_DOLLARS(point["burden"]) )



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



       highlight.classed("hidden", false)
        .attr("cx", x(point.x))
        .attr("cy", y(point.y));
}

function hideExploreTooltip(){
  highlight.classed("hidden", true)
  d3.selectAll(".explore.tooltip").remove()
  d3.selectAll(".rangeDot").classed("highlight", false)

}
function showInputTooltip(dot, d){
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

    console.log(dot, d)
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
function hideInputTooltip(){
  d3.selectAll(".input.tooltip").remove()

}

function showInfoTooltip(dot, key){
  hideInputTooltip()
var container = d3.select(dot.parentNode.parentNode)


var tt = container.append("div")
  .attr("class", "info tooltip")


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

tt.append("div")
  .attr("class", "infoTitle")
  .html(paramaterText[key]["label"])


tt.append("div")
  .attr("class", "ttContent")
  .html(paramaterText[ key ][ "info" ][0] )


if(paramaterText[ key ][ "info" ][1]){
tt.append("div")
  .attr("class", "infoTitle where")
  .html("<img src = \"images/questionDot.png\"/>Where is the pre-TCJA value?")

  tt.append("div")
    .attr("class", "ttContent")
    .html(paramaterText[ key ][ "info" ][1] )
}


}
function hideInfoTooltip(){
  d3.selectAll(".info.tooltip").remove()
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


    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(p.hide){
        context.fillStyle = COLOR_HIDE;
        context.fill();
      }
    });

    points[0].forEach(function(p,i){
      context.beginPath();
      context.arc(x(p.x), y(p.y), 3, 0, 2 * Math.PI);
      if(!p.hide){
        context.fillStyle = p.color;
        context.fill();
        tree.add(p)
      }
    });

    overlaySvg.on("mousemove",function(){
      if(activeIndex == 24 && !IS_PHONE()){
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

  function showTcjaDot(points){
    if(activeIndex != 0){ return false }
    //display just the tcja dot (in move tcja func)
    //display tcja lines and axis lines (in move tcja func)
    // display info in 4 quadrants (html divs, will be transitioned to 0 opacity and z index -1)
    animateLayout("tcja","tcja", points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
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
    hideQuads();
    if(activeIndex != 1){ return false }



// d3.select(".highlightEllipse")
//     .transition()
//     .duration(duration)
//     .delay(lag)
//     .attr("cx", x(-.88))
//     .attr("rx", 15)
//     .style("opacity",0)

    animateLayout("0","a", points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})


  }

  function showQ1(points){
    hideQuads();
    if(activeIndex != 2){ return false }
d3.select(".highlightEllipse")
    .transition()
    .style("opacity",0)

    animateLayout("1","a", points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})

  }

  function showQ1_CTC(points){
    hideQuads();
    if(activeIndex != 3){ return false }


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
  }

  function showMarriedKids(points){
    hideQuads();
    if(activeIndex != 4){ return false }
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

  }

  function showMarriedKidsFilter1(points){
    hideQuads();
    if(activeIndex != 5){ return false }
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct1", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

  }

  function showMarriedKidsFilter2(points){
    hideQuads();
    if(activeIndex != 6){ return false }
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct2", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

  }

    function showMarriedKidsFilter3(points){
      hideQuads();
      if(activeIndex != 7){ return false }
    //shade dots based on CTC threshold
    //legend
    // recolorPoints("ctcThreshold", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3}, points)
    animateLayout("1","g", points, false, "ct3", {"l": COLOR_1, "medium": COLOR_2, "h": COLOR_3, "l0": HIDE_1, "m0": HIDE_2, "h0": HIDE_3})

  }


  function showQ1_PersonalExcemption(points){
    hideQuads();
    if(activeIndex != 8){ return false }
    //shade dots based on personal exemption 
    //legend
    // recolorPoints("personal", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4}, points)
    animateLayout("1","a", points, false, "personal", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4})

  }
  function showQ1_StandardDeduction(points){
    hideQuads();
    if(activeIndex != 9){ return false }
    //shade dots based on std deduction 
    //legend
    // recolorPoints("standard", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4}, points)
    animateLayout("1","l", points, false, "standard", {"l": COLOR_1, "ml": COLOR_2, "mh": COLOR_3, "h": COLOR_4})

  }
  function showTop5_Rates(points){
    hideQuads();
    if(activeIndex != 10){ return false }
    //shade dots based on std deduction 
    //legend
    animateLayout("8","a", points, false, "rates", {"b": COLOR_1, "d": COLOR_2, "a": COLOR_3, "c": COLOR_4})

  }
  function compareQ1(points){
    hideQuads();
    if(activeIndex != 11 && activeIndex != 13){ return false }
    //shade dots based on std deduction 
    //legend

    animateLayout("1","a", points, false, "q1", {"0": DARK_HIDE, "1": COLOR_2, "2": COLOR_2})

  }
  function compareTop1(points){
    hideQuads();
    if(activeIndex != 12){ return false }
    //shade dots based on std deduction 
    //legend

    animateLayout("8","a", points, false, "t1", {"0": DARK_HIDE, "1": COLOR_1})

  }



  function compareQ2(points){
    hideQuads();
    if(activeIndex != 14){ return false }
    //shade dots based on std deduction 
    //legend
      
    animateLayout("2","a", points, false, "q1", {"0": DARK_HIDE, "1": COLOR_2, "2": COLOR_4 })
  }

  function compareQ3(points){
    hideQuads();
    if(activeIndex != 15){ return false }
    //shade dots based on std deduction 
    //legend





    animateLayout("2","a", points, false, "q1", {"0": DARK_HIDE, "1": COLOR_2, "2": DARK_HIDE})
    setTimeout(function(){
      if(activeIndex == 15){
        animateLayout("3","a", points, false, "q2", {"0": DARK_HIDE, "2": COLOR_2, "1": COLOR_4})
      }
    }, duration + lag + lag)

  }

  function compareQ4(points){
    hideQuads();
    if(activeIndex != 16){ return false }
    //shade dots based on std deduction 
    //legend
    animateLayout("3","a", points, false, "q2", {"0": DARK_HIDE, "2": COLOR_2, "1": DARK_HIDE})
    setTimeout(function(){
      if(activeIndex == 16){
        animateLayout("4","a", points, false, "q3", {"0": DARK_HIDE, "1": COLOR_2, "2": COLOR_4})
      }
    }, duration + lag+ lag)

  }
  function compareQ5(points){
    hideQuads();
    if(activeIndex != 17){ return false }
    //shade dots based on std deduction 
    //legend
    // if(IS_MOBILE()){
    //   hideMobileExplore(true, true);
    // }
    // hideExploreTooltip()
    // filterPoints(DEFAULT_FILTERS, points)

    animateLayout("4","a", points, false, "q3", {"0": DARK_HIDE, "1": COLOR_2, "2": DARK_HIDE})
    setTimeout(function(){
      if(activeIndex == 17){
        animateLayout("5","a", points, false, "q4", {"0": DARK_HIDE, "1": COLOR_4})
      }
    }, duration + lag+ lag)

  }


  function compareQ5Alt1(points){
    hideQuads();
    if(activeIndex != 18){ return false }

    animateLayout("5","a", points, false, "b5", {"0": DARK_HIDE, "1": COLOR_3, "2": COLOR_1})

  }
  function compareQ5Alt2(points){
    hideQuads();
    if(activeIndex != 19){ return false }

    animateLayout("5","a", points, false, "b4", {"0": DARK_HIDE, "1": COLOR_3, "2": COLOR_1})

  }
  function compareQ5Alt3(points){
    hideQuads();
    if(activeIndex != 20){ return false }

    animateLayout("5","a", points, false, "b3", {"0": DARK_HIDE, "1": COLOR_3, "2": COLOR_1})

  }
  function compareQ5Alt4(points){
    hideQuads();
    if(activeIndex != 21){ return false }


    animateLayout("5","a", points, false, "b2", {"0": DARK_HIDE, "1": COLOR_3, "2": COLOR_1})

  }
  function compareQ5Alt(points){
    hideQuads();
    if(activeIndex != 22){ return false }
    if(IS_MOBILE()){
      hideMobileExplore(true, true);
    }
    hideExploreTooltip()
    filterPoints(DEFAULT_FILTERS, points)

    animateLayout("5","a", points, false, "b1", {"0": DARK_HIDE, "1": COLOR_3, "2": COLOR_3, "3": COLOR_3, "4": COLOR_3, "6": COLOR_1})

  }

  function preExplore(points){
    hideQuads();
    if(activeIndex != 23){ return false }
    if(IS_MOBILE()){
      hideMobileExplore(true, true);
    }
    animateLayout(getIncome(),getGroup(), points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})

  }

  function showExplore(points){
    hideQuads();
    if(activeIndex != 24){ return false }



// d3.select(".highlightEllipse")
//     .transition()
//     .duration(duration)
//     .delay(lag)
//     .attr("cx", x(-.88))
//     .attr("rx", 15)
//     .style("opacity",0)

    if(IS_MOBILE()){
      showMobileExplore();
    }

    filterPoints(getFilterVals(), points)

    animateLayout(getIncome(),getGroup(), points, true, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})




  }






function checkDot(dot, points){
  if(d3.select(dot).classed("active")){
  d3.select(dot)
  .transition()
  .duration(200)
  .style("background", "#fff")
  .style("stroke", "#cccccc")
  .on("end", function(d){
  d3.select(dot).classed("active", false)
  // d3.select(d3.select(this.parentNode().parentNode()).select(".to") )
  d3.select(".rangeLabel." + d[1] + "_" + d[2] ).classed("active", false)
  // getFilterVals()
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
  // getFilterVals()
  filterPoints(getFilterVals(), points)
  })

  }
}

function buildCheckboxes(key, vals, numVals, filterVals, points){
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

  var info = title.append("div")
  .attr("class", key +  " controlInfo")
  info.on("click", function(d){
    showInfoTooltip(this, key)
  })
  .on("mouseover", function(){
    d3.select(this).select("img").attr("src", "images/infoDotHover.png")
  })
  .on("mouseout", function(){
    d3.select(this).select("img").attr("src", "images/infoDot.png")
  })


  info.append("img").attr("src", "images/infoDot.png")

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
    checkDot(this, points)

  })
    .on("mouseover", function(d){
    showInputTooltip(this, d)
  })
  .on("mouseout", hideInputTooltip)


    var lineData = [ { "x": 5,   "y": 9},
             { "x":9,  "y": 13},
             { "x": 15,  "y": 4}];

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      // .interpolate("linear");

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
            // console.log(d3.select(".rangeDot." + d[1] + "_" + d[2]).node())
    showInputTooltip(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), d)
  })
  .on("click", function(d){
    checkDot(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), points)
  })
          
  .on("mouseout", hideInputTooltip)
  // .attr("cy", h/2)

      var totalLength = path.node().getTotalLength();

      path
      // .attr("stroke-dasharray", totalLength + " " + totalLength)
      // .attr("stroke-dashoffset", totalLength)
      // .transition()
      // .duration(500)
      // .ease("linear")
      .attr("stroke-dashoffset", 0);



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

  var info = title.append("div")
  .attr("class", key +  " controlInfo")
  info.on("click", function(d){
    showInfoTooltip(this, key)
  })
  .on("mouseover", function(){
    d3.select(this).select("img").attr("src", "images/infoDotHover.png")
  })
  .on("mouseout", function(){
    d3.select(this).select("img").attr("src", "images/infoDot.png")
  })

  info.append("img").attr("src", "images/infoDot.png")

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
  .attr("x1",4)
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
    checkDot(this, points)

  })
  .on("mouseover", function(d){
    showInputTooltip(this, d)
  })
  .on("mouseout", hideInputTooltip)



    var lineData = [ { "x": 5,   "y": 9},
             { "x":9,  "y": 13},
             { "x": 15,  "y": 4}];

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      // .interpolate("linear");

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
            // console.log(d3.select(".rangeDot." + d[1] + "_" + d[2]).node())
    showInputTooltip(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), d)
  })
  .on("click", function(d){
    checkDot(d3.select(".rangeDot." + d[1] + "_" + d[2]).node(), points)
  })
          
  .on("mouseout", hideInputTooltip)
  // .attr("cy", h/2)

      var totalLength = path.node().getTotalLength();

      path
      // .attr("stroke-dasharray", totalLength + " " + totalLength)
      // .attr("stroke-dashoffset", totalLength)
      // .transition()
      // .duration(500)
      // .ease("linear")
      .attr("stroke-dashoffset", 0);




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

function buildExploreSection(points){
  var filterVals = points[1]
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
      animateLayout(getIncome(), d.item.value, points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    }
  })

   $("#incomeMenu" ).selectmenu({
    change: function(event, d){
      animateLayout(d.item.value, getGroup(), points, false, "ctcAmount", {"l": DOT_COLOR, "medium": DOT_COLOR, "h": DOT_COLOR})
    }
  })

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
    activateFunctions[18] = function(){ compareQ5Alt1(points); };
    activateFunctions[19] = function(){ compareQ5Alt2(points); };
    activateFunctions[20] = function(){ compareQ5Alt3(points); };
    activateFunctions[21] = function(){ compareQ5Alt4(points); };
    activateFunctions[22] = function(){ compareQ5Alt(points); };
    activateFunctions[23] = function(){ preExplore(points) };
    activateFunctions[24] = function(){ showExplore(points); };


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
    buildExploreSection(points)
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




function display(points, filterVals) {
  if(getInternetExplorerVersion() != -1){
    IS_IE = true;
  }

  var plot = scrollVis();

  d3.select('#vis')
    .style("left", function(){
      return getVisLeft();
    })
    .datum([points, filterVals])
    .call(plot);

  var scroll = scroller()
    .container(d3.select('#graphic'));

  scroll(d3.selectAll('.step'));

  function runResize(){
      screenW = $(window).width()
      screenH = $(window).height()
      var filterVals = getFilterVals()
      d3.selectAll(".resizeRemove").remove()
      display(points, filterVals)
  }
  scroll.on('resized', function(){

    if(IS_PHONE()){
      if($(window).width() != screenW){
        runResize()
      } 
    }
    else{
      if($(window).width() != screenW || $(window).height() != screenH){
        runResize()
      }
    }
  })

  scroll.on('active', function (index) {
    var offOpacity = (IS_MOBILE()) ? 1 : .1
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return (i === index || i == 19) ? 1 : offOpacity; });
    plot.activate(index);  
  });
}

var counter = 0;
function checkReady() {
  counter += 1;
  var drawn = d3.selectAll(".quadGroup").nodes().length
  if (drawn < 4) {
    if(counter >= 7){
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

d3.select("#loadingContainer")
  .style("position", function(){
    if(d3.select("#topText").node().getBoundingClientRect().bottom < 110) return "fixed"
    else return "absolute"
  })
  .style("top", function(){
    if(d3.select("#topText").node().getBoundingClientRect().bottom < 110) return "40px"
    else return (d3.select("#vis").node().getBoundingClientRect().top - d3.select("body").node().getBoundingClientRect().top - 40) + "px"
  })



d3.json("data/data.json", function(points){
  display(points, DEFAULT_FILTERS);
});
checkReady()