
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

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// bring on the svg
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// everyone needs parameters
var chosenXAxis = "poverty";

function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
            d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


// csv data
d3.csv("data/data.csv").then(function (stateData, err) {
    if (err) throw err;

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



    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.age)])
        .range([height, 0]);

    //   axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // appendig the axes


    // .call(bottomAxis);

    // chartGroup.append("g")
    // .call(leftAxis);

    // making the donuts

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        // .attr("cx", d => xLinearScale(d.healthcare))
        // .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "aqua")
        .attr("opacity", ".5");

    // setting up tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Age: ${d.age}`);
        });

    // put tooltip in chart
    chartGroup.call(toolTip);

    // set up the bugs

    circlesGroup.on("click", function (data) {
        toolTip.hide(data);
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // label it
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age");
}).catch(function (error) {
    console.log(error);
})
