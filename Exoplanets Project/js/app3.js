d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Define the SVG Area
    var svgWidth = (window.innerWidth)*.7;
    var svgHeight = (window.innerHeight)*.8;

    // Define chart margins
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
    };

    // Define chart area dimensions
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select scatter to append SVG area and set dimensions
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append a group area and set margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load data from data.csv
    var stateFile = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/HOMEWORK/Instructions/data/data.csv?token=Aiw9AiBgR6LiTrmpQBMNqgvQuUI5PZDkks5bdcGdwA%3D%3D";
    d3.csv(stateFile).then(successHandle, errorHandle);

    // Throw error if it occurs
    function errorHandle(error) {
        throw error;
    }

    // If successful
    function successHandle(stateData) {

        // Print the data
        console.log(stateData);

        // Cast the integer data as numbers
        stateData.forEach(function(data) {
            data.age = +data.age;
            data.healthcare = +data.healthcare;
            data.healthcareHigh = +data.healthcareHigh;
            data.healthcareLow = +data.healthcareLow;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.obesityHigh = +data.obesityHigh;
            data.obesityLow = +data.obesityLow;
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
            data.smokesHigh = +data.smokesHigh;
            data.smokesLow = +data.smokesLow;
        });

        // X Scale
        var xScale = d3.scaleLinear()
            .domain([(d3.min(stateData, data => data.poverty)-1), (d3.max(stateData, data => data.poverty)+1)])
            .range([0, chartWidth]);

        // Y Scale
        var yScale = d3.scaleLinear()
            .domain([(d3.min(stateData, data => data.obesity)-1), (d3.max(stateData, data => data.obesity)+1)])
            .range([chartHeight, 0]);

        // Create Axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Append Axes to chartGroup
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // Append labels to the axis
        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 40})`)
            .text("Poverty by State");

        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight/2))
            .attr("y", 50 - margin.left)
            .text("Obesity by State");

        // Append circles to datapoints
        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", data => xScale(data.poverty))
            .attr("cy", data => yScale(data.obesity))
            .attr("r", "15")
            .attr("stroke-width", "1")
            .attr("class", "stateCircle");

        // Append names to the datapoints
        chartGroup.append("g")
            .selectAll("text")
            .data(stateData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("dx", d => xScale(d.poverty))
            .attr("dy", d => yScale(d.obesity)+5)
            .attr("class", "stateText");