
// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 960;
var svgHeight = 660;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// bring on the svg
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// BONUS ATTEMPT
// everyone needs parameters
// var chosenXAxis = "poverty";

/* function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
            d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}
// setting up an axis
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}
// setting up a circle
fuction renderCircles */

// csv data
d3.csv("data/data.csv").then(function (stateData) {
    // if (err) throw err;

    // create date parser
    // var dateParser = d3.timeParse("%d-%b");

    // parse data
    stateData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // setting up the scale

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.age)])
        .range([height, 0]);

    //   axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // appendig the axes

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // making the donuts

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        // .attr("cx", d => xLinearScale(d.healthcare))
        // .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.age))
        // .attr("cy", d => yLinearScale(d.smokes))
        // .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "tan")
        .attr("opacity", ".5")

        // .text(d.abbr);

    // setting up tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .style("position", "absolute")
        .style("z-index", "10")
        // .style("visibility", "hidden")
        //  .text("a simple tooltip");
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Age: ${d.age}<br>Income: ${d.income}<br>Healthcare: ${d.healthcare}<br>Smokes: ${d.smokes}<br>Obesity: ${d.obesity}`);
        });

    // put tooltip in chart
    chartGroup.call(toolTip);

    // set up the bugs
    // on
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // off
        /* circlesGroup.on("mouseover", function () {
            return toolTip.style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px") */

        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // label it
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% in Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "stateText")
        .attr("x", 0 + margin.right - 2)
        .attr("y", 0 - (width / 20))
        .text("Average Age");

}).catch(function (error) {
    console.log(error);
});
