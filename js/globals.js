var IS_SHORT = function(){
  return (d3.select("#isShort").style("display") == "block")
}
var IS_PHONE = function(){
  return (d3.select("#isPhone").style("display") == "block")
}
var IS_MOBILE = function(){
  return (d3.select("#isMobile").style("display") == "block")
}
var SECTION_INDEX = function(){
  return d3.select("#sectionIndex").attr("data-index")
}

var IS_IE = false;
function getInternetExplorerVersion()
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

var PHONE_VIS_WIDTH = 230;
var PHONE_VIS_HEIGHT = 400;
var SHORT_VIS_WIDTH = 600;
var SHORT_VIS_HEIGHT = 480;
var SHORT_SCATTER_WIDTH = 480;
var PHONE_SCATTER_WIDTH = 235
var VIS_WIDTH = 600;
var VIS_HEIGHT = 680;


var MARGIN = { top: 60, left: 120, bottom: 104, right: 20 };
var PHONE_MARGIN = { top: 100, left: 30, bottom: 30, right: 30 };



var desktopHistMargin = {top: 20, right: 20, bottom: 120, left: 120},
  desktopHistWidth = 600 - desktopHistMargin.left - desktopHistMargin.right,
  desktopHistHeight = 380 - desktopHistMargin.top - desktopHistMargin.bottom;
var phoneHistMargin = {top: 20, right: 20, bottom: 40, left: 35},
  phoneHistWidth = 300 - phoneHistMargin.left - phoneHistMargin.right,
  phoneHistHeight = 210 - phoneHistMargin.top - phoneHistMargin.bottom;
var histBinWidth = 5;


var margin = ( IS_PHONE() ) ? PHONE_MARGIN : MARGIN;
var DOT_RADIUS = (IS_PHONE()) ? 4 : 5;
var SMALL_DOT_RADIUS = (IS_PHONE()) ? 2 : 3;
var histMargin = (IS_PHONE()) ? phoneHistMargin : desktopHistMargin;
var histWidth = (IS_PHONE()) ? phoneHistWidth : desktopHistWidth;
var histHeight = (IS_PHONE()) ? phoneHistHeight : desktopHistHeight;


var mapColor = d3.scaleThreshold()
    .domain([0,.05, .1, .15, .2, .25, .3,.35,.4])
    .range(["#9d9d9d","#cfe8f3","#a2d4ec","#73bfe2","#46abdb","#1696d2","#12719e","#0a4c6a","#062635","#000"]);

var DOLLARS = d3.format("$.0s")
var RATIOS = d3.format(".2f")


var DOT_COLOR = "rgba(0,139,176,0.3)"
var COLOR_1 = "rgba(23,74,124,0.3)"
var COLOR_2 = "rgba(252,182,75,0.3)"
var COLOR_3 = "rgba(85,183,72,0.3)"
var COLOR_4 = "rgba(236,0,139,0.3)"
var COLOR_5 = "rgba(22,150,210,0.3)"

var SEQ_1 = "rgba(176,208,219,0.3)"
var SEQ_2 = "rgba(117,173,192,0.3)"
var SEQ_3 = "rgba(0,139,176,0.3)"



var xMin = -3.50,
    xMax = 5.5,
    yMin = -550000000000,
    yMax = 300000000000;



var quadTextWidth = 280,
  quadTextLineHeight = 20
  legendWidth = 200,
  legendHeight = 20;


var paramaterText = {
  "ctcAmount" : {
    "label": "CTCrefundable portion",
    "l" : "50%",
    "medium": "70%",
    "h": "100%"
  }
}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = quadTextLineHeight, // px
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        dx = parseFloat(text.attr("dx")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px").attr("dx", dx + "px");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px").attr("dx", dx + "px").text(word);
      }
    }
  });
}
