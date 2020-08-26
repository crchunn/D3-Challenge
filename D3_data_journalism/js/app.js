
// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // csv data
  d3.csv("data.csv").then(function(medalData) {

    // create date parser
    var dateParser = d3.timeParse("%d-%b");

    // parse data
    medalData.forEach(function(data) {
      data.date = dateParser(data.date);
      data.medals = +data.medals;
    });
  })
