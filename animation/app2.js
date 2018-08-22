var w = 800, h = 600;
var t0 = Date.now();
var stopTooltip = false;	

// Data for example
// var planets = [
//     { R: 300, r: 5, speed: 5, phi0: 90 },
//     { R: 150, r: 10, speed: 16, phi0: 190 }
// ];
// reading in the csv file


// defining the svg
var svg = d3.select("#planetarium").insert("svg")
    .attr("width", w).attr("height", h);

// svg.append("circle").attr("r", 20).attr("cx", w / 2)
//     .attr("cy", h / 2).attr("class", "sun")

//  Adding an image of the sun to act as our star
svg.append("svg:image")
    .attr("x", -4 + w / 2)
    .attr("y", -4 + h / 2)
    .attr("class", "sun")
    .attr("xlink:href", "sun.png")
    .attr("width", 8)
    .attr("height", 8)
    .attr("text-anchor", "middle");

// 
var container = svg.append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

d3.csv("cleaned_planets.csv").then(function (data) {

    console.log(data[0]);

    filtered = data.filter(d => d.Planet_Radius_Earth_Radii && d.Semi_Major_Axis_proportional && d.Orbital_Velocity_proportional);
    
    filtered.forEach((d) => {

        console.log(d.Semi_Major_Axis_proportional)
        // planetary radius. Also r.
        d.Planet_Radius_Earth_Radii  = +d.Planet_Radius_Earth_Radii;

        // applying a logrithmic scale to get the orbits to show up
        d.Semi_Major_Axis_proportional = Math.abs((35 * (Math.log(+d.Semi_Major_Axis_proportional))).toFixed(5));
        // d.Semi_Major_Axis_proportional = 100 * (+d.Semi_Major_Axis_proportional)
        // console.log(d.pl_orbsmax)

        // I'm using a column from the table called  Radial Velocity [km/s]
        // Might be related to the star and not the planet

        d.Orbital_Velocity_proportional = +d.Orbital_Velocity_proportional;
    });


    init(filtered);


});

function init(planets) {





    // Making the planets based on r and R
    container.selectAll("g.planet")
        .data(planets)
        .enter()
        .append("g")
        .attr("class", "planet")
        .each(function (d, i) {
            // console.log(d);

            // making the orbit
            d3.select(this).append("circle").attr("class", "orbit").attr("r", d.Semi_Major_Axis_proportional );

            // making the planet
            var exoplanet = d3.select(this).append("circle")
                .attr("r", d.Planet_Radius_Earth_Radii)
                .attr("cx", d.Semi_Major_Axis_proportional)
                .attr("cy", 0)
                .attr("class", "planet");
                

            // var toolTip = d3.select("body").append("div")
            //     .attr("class", "tooltip");
            // Defining the first position for the tooltip

            // Keep the tool tip moving


        });

    var phi0 = 0;

    // Using the timer function to rotate the planets
    d3.timer(function () {
        var delta = (Date.now() - t0);
        svg.selectAll(".planet")
            .attr("transform", function (data) {
                return "rotate(" + phi0 + delta * data.Orbital_Velocity_proportional/ 2000 + ")"
                // .on("mouseover", function (d) {
                //     // stopTooltip = false;
                //     // showTooltip(d);
                //     toolTip.style("display", "block")
                //     .style("left", d3.event.pageX + "px")
                //     .style("top", d3.event.pageY + "px");
                // })
                // // Step 3: Add an onmouseout event to make the tooltip invisible
                // .on("mouseout", function () {
                //     toolTip.style("display", "none");
                // });
            });
    });
}

var showTooltip = function (d) {

    var xpos = d.w + w / 2 - xOffset + 3;
    var ypos = d.h + h / 2 - yOffset - 5;

    var xOffset = ((10 * d.Planet_Radius_Earth_Radii) / 2 < 3) ? 6 : (10 * d.Planet_Radius_Earth_Radii) / 2;
    var yOffset = ((10 * d.Planet_Radius_Earth_Radii) / 2 < 3) ? 0 : (10 * d.Planet_Radius_Earth_Radii) / 2;

    var toolTip = d3.select("#tooltip")
        .style('top', ypos + "px")
        .style('left', xpos + "px")
        .transition().duration(500)
        .style('opacity', 1)
        .html(`Planet Name:<strong>${d.Planet_Name}</strong>`)
};

// Step 2: Add an onmouseover event to display a tooltip
//= =======================================================

function endall(transition, callback) {
    var n = 0;
    transition
        .each(function () { ++n; })
        .each("end", function () { if (!--n) callback.apply(this, arguments); });
};


// TO DO:
// tooltip
// planet colors based on star temperature
// 

// Code: 
// var link = d.pl_pelink;
    //         // console.log(link);

    //         // planetary radius. Also r.
    //         var rad_planet = d.pl_radj;

    //         // major axis which we are using for the radius from the star. Subbing for R.
    //         var orb_planet = d.pl_orbsmax;

    //         // orbital velocity or speed probably for the star tho. Just subbing
    //         var velocity = d.st_radv
    //         // console.log(velocity)

    //         // parsec! distance from our solar system
    //         var distance = d.st_dist
