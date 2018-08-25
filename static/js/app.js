d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Define the SVG Area
    var svgWidth = (window.innerWidth)*.8;
    var svgHeight = window.innerHeight;

    // Define chart margins
    var margin = {
        top: 50,
        right: 50,
        bottom: 150,
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
    var url = "/data";
    d3.json(url).then(successHandle, errorHandle);

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
            .call(xAxis).attr("fill", "white").style("stroke", "white");

        chartGroup.append("g")
            .call(yAxis).attr("fill", "white").style("stroke", "white");

        // Append labels to the axis
        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 40})`)
            .text("Minimum Travel Time")
            .attr("fill", "white");

        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight/2))
            .attr("y", 50 - margin.left)
            .text("Planet Radius")
            .attr("fill", "white");

        // Append circles to datapoints
        var circlesGroup = chartGroup.selectAll("circle")
            .data(planetData)
            .enter()
            .append("circle")
            .attr("cx", data => xScale(data.minimum_Travel_Time_yr))
            .attr("cy", data => yScale(data.Planet_Radius_Earth_Radii))
            .attr("r", "15")
            .attr("stroke-width", "1")
            .attr("fill", "lightblue")
            .attr("class", "planetCircle");

        var toolTip3 = d3.select("#planet-distance")
            .append("div")
            .style("display", "none")
            .attr("class", "toolTip3");

        circlesGroup.on("mouseover", function() {
            d3.select(this)
              .transition()
              .duration(1000)
              .attr("r", 20)
              .attr("fill", "red");
        })
            .on("mouseout", function() {
                d3.select(this)
                  .transition()
                  .duration(1000)
                  .attr("r", 15)
                  .attr("fill", "lightblue"),
                toolTip3.style("display", "none");
            });

        circlesGroup.on("click", function(d) {
            toolTip3.style("display", "block")
                .html(
                    `<strong>${d.Planet_Name}</strong>
                    <hr>
                    <p>Distance to Star: ${d.Distance_to_Star_ly}</p>
                    <p>Travel Time to Star(yr): ${d.minimum_Travel_Time_yr}</p>
                    <p>Orbital Period: ${d.Orbital_Period_days}</p>
                    <p>Host Star:  ${d.Host_Name}</p>`
                )
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        });
            // .on("mouseout", function() {
            //     toolTip3.style("display", "none");
            // });
       

    }

}