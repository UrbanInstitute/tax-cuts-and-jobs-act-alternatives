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
var COLOR_1 = "rgba(23,74,124,0.3)" // dark blue
var COLOR_2 = "rgba(22,150,210,0.3)" // blue
var COLOR_3 = "rgba(137,14,202,0.3)" // purple
var COLOR_4 = "rgba(236,0,139,0.3)" // pink
var COLOR_5 = "rgba(22,150,210,0.3)"
var COLOR_6 = "rgba(202,88,0,0.3)"


var HIDE_1 = "rgba(23,74,124,0.01)" // dark blue
var HIDE_2 = "rgba(22,150,210,0.01)" // blue
var HIDE_3 = "rgba(137,14,202,0.01)" // purple


var COLOR_HIDE = "rgba(0, 0, 0, 0.008)"
var DARK_HIDE = "rgba(0, 0, 0, 0.01)"

var SEQ_1 = "rgba(115,191,226,0.3)"
var SEQ_2 = "rgba(70,171,219,0.3)"
var SEQ_3 = "rgba(22,150,210,0.3)"
var SEQ_4 = "rgba(18,113,158,0.3)"




var xMin = -3.50,
    xMax = 5.5,
    yMin = -550000000000,
    yMax = 300000000000;



const duration = 700;
const increment = 50;
const lag = 500;
const longLag = 900;


var quadTextWidth = 280,
  quadTextLineHeight = 20
  legendWidth = 200,
  legendHeight = 100;


var customLegendText = {
  "t1": "Benefits the top 1%",
  "q1": "Benefits the 1st quintile",
  "q2": "Benefits the 1st and 2nd quintiles",
  "q3": "Benefits the 1st, 2nd, and 3rd quintiles",
  "q4": "Benefits the 1st, 2nd, 3rd, and 4th quintiles"
}

var paramaterText = {
//note order should be b, d, a, c
  "rates": {
    "label": "Marginal tax rates",
    "info": ["Average tax rates measure tax burden; marginal tax rates measure the taxes&rsquo; effect on incentives to earn, save, invest, or spend. The TCJA reduced tax rates at almost all levels of taxable income and shifted the thresholds for several income tax brackets.", false],
    "b": ["<span class = \"tcjaLabel\">TCJA</span>", "Tax rates for each tax bracket are as follows: 10% (first bracket), 12% (second bracket), 22% (third bracket), 24% (fourth bracket), 32% (fifth bracket), 35% (sixth bracket), 37% (seventh bracket)", "tcja"],
    "d": ["Between TCJA and pre-TCJA ","$13,200 (single), $26,400 (married filing jointly), $21,600 (head of household), $13,200 (married filing separately)", false],
    "a" : ["<span class = \"pretcjaLabel\">Pre-TCJA</span>","Tax rates for each tax bracket are as follows: 10% (first bracket), 15% (second bracket), 25% (third bracket), 28% (fourth bracket), 33% (fifth bracket), 35% (sixth bracket), 39.6% (seventh bracket)","pretcja"],
    "c": ["10 percent higher than TCJA","$Tax rates for each tax bracket are as follows: 11% (first bracket), 13.2% (second bracket), 24.2% (third bracket), 26.4% (fourth bracket), 35.2% (fifth bracket), 38.5% (sixth bracket), 40.7% (seventh bracket)", false]
  },
  "standard": {
    "label": "Standard deduction",
    "info": ["Tax filers can choose to claim a standard deduction based on their filing status or to itemize their deductions. The TCJA nearly doubled the standard deduction, which is expected to substantially reduce the number of taxpayers choosing to itemize their deductions.", false],
    "l" : ["Low","$6,500 (single)<br/>$13,000 (married filing jointly)<br/>$9,550 (head of household)<br/>$6,500 (married filing separately)", "pretcja"],
    "ml": ["Medium low", "$9,250 (single)<br/>$18,500 (married filing jointly)<br/>$13,775 (head of household)<br/>$9,250 (married filing separately)", false],
    "mh": ["Medium high","$12,000 (single)<br/>$24,000 (married filing jointly)<br/>$18,000 (head of household)<br/>$12,000 (married filing separately)", "tcja"],
    "h": ["High","$13,200 (single)<br/>$26,400 (married filing jointly)<br/>$21,600 (head of household)<br/>$13,200 (married filing separately)", false]
  },
  "amtThreshold": {
    "label": "Alternative minimum tax exemption phase-out threshold",
    "info": ["The individual alternative minimum tax, or AMT, operates alongside the regular income tax. It requires some taxpayers to calculate their liability twice&mdash;once under the rules for the regular income tax and once under the AMT rules&mdash;and pay the higher amount. The TCJA raised the income threshold at which the AMT exemption phases out, which will significantly reduce the number of taxpayers subject to the AMT.", false],
    "l" : ["Low","Phases out at adjusted gross income above $123,100 (single) or $164,100 (joint)", "pretcja"],
    "h": ["High","Phases out at adjusted gross income above $500,000 (single) or $1,000,000 (joint)", "tcja"],
  },
  "amtAmount": {
    "label": "Alternative minimum tax exemption amount",
    "info": ["The individual alternative minimum tax, or AMT, operates alongside the regular income tax. It requires some taxpayers to calculate their liability twice&mdash;once under the rules for the regular income tax and once under the AMT rules&mdash;and pay the higher amount. The AMT exemption is an amount that taxpayers can deduct from their AMT-taxable income before calculating their AMT liability. The TCJA increased the AMT exemption, reducing the number of middle-income households subject to the AMT.", false],
    "l" : ["Low","$55,400 (single)<br/>$86,200 (joint)", "pretcja"],
    "h": ["High","$70,300 (single)<br/>$109,400 (joint)", "tcja"],
  },
  "personal": {
    "label": "Personal exemption amount",
    "info": ["Under prior law, taxpayers could deduct the personal exemption for themselves and for their dependents. The amount was the same for all filing statuses. The TCJA repealed personal and dependent exemptions. In place of personal exemptions, the TCJA increased the standard deduction. And in place of dependent exemptions, the TCJA increased the CTC and created a new $500 tax credit for dependents not eligible for the CTC.", false],
    "l" : ["$0",false, "tcja"],
    "ml": ["$2,050", false, false],
    "mh": ["$4,150",false, "pretcja"],
    "h": ["$5,500",false, false]
  },
  "salt": {
    "label": "State and local tax deduction cap",
    "info": ["Under prior law, taxpayers who itemized their deductions could, with no cap, deduct from their taxable income all their state and local property tax as well as either their income or sales taxes. The TCJA capped the total state and local tax (SALT) deduction at $10,000, leading to a steep drop in the share of taxpayers with a tax benefit from the SALT deduction.", "Under prior law, there was no limit to the SALT deduction. We did not simulate &ldquo;no limit&rdquo; in our data."],
    "l" : ["$0","A $0 cap means the SALT deduction is repealed", false],
    "ml": ["$10,000", false, "tcja"],
    "mh": ["$15,000",false, false],
    "h": ["$20,000",false, false]
  },
  "ctcThreshold": {
    "label": "CTC refundability threshold",
    "info": ["The TCJA&rsquo;s boost to the CTC offset the loss of personal exemptions for many taxpayers with dependents. The new law increased the CTC from $1,000 to $2,000 and raised the income at which the credit begins to phase out. The TCJA also lowered the refundability threshold from $3,000 to $2,5000, which expands the credit to more households.", "The TCJA increased the CTC from $1,000 to $2,000 per child. Our simulations fix the maximum CTC at the TCJA amount of $2,000 and change other factors. Because prior law had a different CTC amount (and therefore a different reference point for a refundability threshold), we don&rsquo;t include the pre-TCJA value in our options."],
    "l" : ["$0","The refundable portion equals 15 percent of all earnings", false],
    "medium" : ["$1,250","The refundable portion equals 15 percent of earnings above $1,250", false],
    "h": ["$2,500","The refundable portion equals 15 percent of earnings above $2,500", "tcja"],
  },
  "ctcAmount": {
    "label": "CTC refundable portion",
    "info": ["The TCJA&rsquo;s boost to the CTC offset the loss of personal exemptions for many taxpayers with dependents. The new law increased the CTC from $1,000 to $2,000 and raised the maximum refundable credit amount. It also introduced a new $500 credit for nonchild dependents (we do not include this credit in our options). The values below are a share of the TCJA&rsquo;s $2,000 CTC credit.", "The TCJA increased the CTC from $1,000 to $2,000 per child. Our simulations hold the maximum CTC at the TCJA amount of $2,000 and change other factors. Because prior law had a different CTC amount (and therefore a different reference point for a refundable portion), we don&rsquo;t include the pre-TCJA value in our options."],
    "l" : ["50%","$1,000", false],
    "medium" : ["70%","$1,400", "tcja"],
    "h": ["100%","$2,000", false],
  },

}


var DEFAULT_FILTERS = {
  "rates": ["b", "d", "a", "c"],
  "standard": ["l", "ml", "mh", "h"],
  "amtThreshold": ["l", "h"],
  "amtAmount": ["l", "h"],
  "personal": ["l", "ml", "mh", "h"],
  "salt": ["l", "ml", "mh", "h"],
  "ctcThreshold": ["l", "medium", "h"],
  "ctcAmount": ["l", "medium", "h"]
}

var ttWidths = {
  "rates": 280,
  "standard": 284,
  "amtThreshold": 268,
  "amtAmount": 154,
  "personal": 0,
  "salt": 230,
  "ctcThreshold": 206,
  "ctcAmount": 50
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
