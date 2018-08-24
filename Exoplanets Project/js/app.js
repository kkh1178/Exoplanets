d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Define the SVG Area
    var svgWidth = (window.innerWidth)*.7;
    var svgHeight = (window.innerHeight);

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
    var svg = d3.select("#planet-distance")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append a group area and set margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load data from data.csv
    var file = "https://raw.githubusercontent.com/cburdon/Exoplanets/master/cleaned_planets.csv";
    d3.csv(file).then(successHandle, errorHandle);

    // Throw error if it occurs
    function errorHandle(error) {
        throw error;
    }

    // If successful
    function successHandle(planetData) {

        // Print the data
        console.log(planetData);

        // Cast the integer data as numbers
        planetData.forEach(function(data) {
            data.minimum_Travel_Time_yr = +data.minimum_Travel_Time_yr;
            data.Planet_Radius_Earth_Radii = +data.Planet_Radius_Earth_Radii;
        }); 

        // X Scale
        var xScale = d3.scaleLinear()
            .domain([(d3.min(planetData, data => data.minimum_Travel_Time_yr-25000000)), (d3.max(planetData, data => data.minimum_Travel_Time_yr))])
            .range([0, chartWidth]);

        // Y Scale
        var yScale = d3.scaleLinear()
            .domain([(d3.min(planetData, data => data.Planet_Radius_Earth_Radii-1)), (d3.max(planetData, data => data.Planet_Radius_Earth_Radii))])
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
            .text("Minimum Travel Time");

        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight/2))
            .attr("y", 50 - margin.left)
            .text("Planet Radius");

        // Append circles to datapoints
        var circlesGroup = chartGroup.selectAll("circle")
            .data(planetData)
            .enter()
            .append("circle")
            .attr("cx", data => xScale(data.minimum_Travel_Time_yr))
            .attr("cy", data => yScale(data.Planet_Radius_Earth_Radii))
            .attr("r", "15")
            .attr("stroke-width", "1")
            .attr("class", "planetCircle");

        var toolTip3 = d3.select("#planet-distance")
            .append("div")
            .style("display", "none")
            .attr("class", "toolTip3");

        circlesGroup.on("mouseover", function(d) {
            toolTip3.style("display", "block")
                .html(
                    `<strong>${d.Planet_Name}</strong>
                    <hr>
                    ${d.Distance_to_Star_ly}`
                )
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
            .on("mouseout", function() {
                toolTip3.style("display", "none");
            });
        // Append names to the datapoints
        // chartGroup.append("g")
        //     .selectAll("text")
        //     .data(planetData)
        //     .enter()
        //     .append("text")
        //     .text(d => d.abbr)
        //     .attr("dx", d => xScale(d.Distance_to_Star_ly))
        //     .attr("dy", d => yScale(d.minimum_Travel_Time_yr))
        //     .attr("class", "planetText");

    }

}