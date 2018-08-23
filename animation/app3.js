var w = 1200, h = 600;
var t0 = Date.now();
// var stopTooltip = false;	
// 
// defining the svg
var svg = d3.select("#planetarium").insert("svg")
    .attr("width", w).attr("height", h);

// svg.append("circle").attr("r", 20).attr("cx", w / 2)
//     .attr("cy", h / 2).attr("class", "sun")
svg.html(`<defs>
<radialGradient id="stellarB"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#c1440e"/>
  <stop offset="100%" stop-color="#451804"/>
</radialGradient>

<radialGradient id="stellarA"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#e77d11"/>
  <stop offset="100%" stop-color="#c1440e"/>
</radialGradient>

<radialGradient id="stellarF"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#d7c797"/>
  <stop offset="100%" stop-color="#845422"/>
</radialGradient>

<radialGradient id="stellarG"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#9fc164"/>
  <stop offset="100%" stop-color="#6b93d6"/>
</radialGradient>

<radialGradient id="stellarK"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#6b93d6"/>
  <stop offset="100%" stop-color="#4f4cb0"/>
</radialGradient>

<radialGradient id="stellarM"  cx="20%" cy="50%" r="60%" fx="50%" fy="50%">
  <stop offset="0%" stop-color="#7e8173"/>
  <stop offset="100%" stop-color="#361d1d"/>
</radialGradient>
</defs>`)

//  Adding an image of the sun to act as our star
svg.append("svg:image")
    .attr("x", -20 + w / 2)
    .attr("y", -20 + h / 2)
    .attr("class", "sun")
    .attr("xlink:href", "sun.png")
    .attr("width", 40)
    .attr("height", 40)
    .attr("text-anchor", "middle");


// 
var container = svg.append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

// var toolTip = d3.select("body").append("div")
//     .attr("class", "tooltip");
const toolTip = d3.select("#tooltip")

d3.csv("cleaned_planets.csv").then(function (data) {

    planets = data.filter(d => d.Planet_Radius_Earth_Radii && d.Semi_Major_Axis_proportional && d.Orbital_Velocity_proportional);
    planets.forEach((d) => {

        // planetary radius. Also r.
        d.Planet_Radius_Earth_Radii = +d.Planet_Radius_Earth_Radii;

        // applying a logrithmic scale to get the orbits to show up
        d.Semi_Major_Axis_proportional = Math.abs((35 * (Math.log(+d.Semi_Major_Axis_proportional))).toFixed(5));
        // d.Semi_Major_Axis_proportional = 100 * (+d.Semi_Major_Axis_proportional)

        // I'm using a column from the table called  Radial Velocity [km/s]

        d.Orbital_Velocity_proportional = +d.Orbital_Velocity_proportional / 5;

        d.Effective_temperature_K = +d.Effective_temperature_K;
    });


    // Making the planets based on r and R
    container.selectAll("g.planet")
        .data(planets)
        .enter()
        .append("g")
        .attr("class", "planet")
        .each(function (d, i) {

            var planetClass = d.Effective_temperature_K >= 10000 ? "stellarB" :
                d.Effective_temperature_K >= 7500 ? "stellarA" :
                    d.Effective_temperature_K >= 6000 ? "stellarF" :
                        d.Effective_temperature_K >= 5000 ? "stellarG" :
                            d.Effective_temperature_K >= 3500 ? "stellarK" : "stellarM";
            // console.log(d);

            // making the orbit
            d3.select(this).append("circle").attr("class", "orbit").attr("r", d.Semi_Major_Axis_proportional);
            // console.log(d)
            // making the planet
            var exoplanet = d3.select(this)
                .append("circle")
                .attr("r", d.Planet_Radius_Earth_Radii)
                .attr("cx", d.Semi_Major_Axis_proportional)
                .attr("cy", 0)
                .attr("class", planetClass)

                .attr("id", "planet-body");
        });

    var phi0 = 0;
    let vel, axis = 0;
    // Using the timer function to rotate the planets
    d3.timer(function (delta) {
        const x = (w / 2) + axis * Math.cos(toRad(delta * vel / 200))
        const y = (h / 2) + axis * Math.sin(toRad(delta * vel / 200))
        svg.selectAll(".planet")
            .attr("transform", function (datum) {
                return "rotate(" + phi0 + delta * datum.Orbital_Velocity_proportional / 200 + ")"
            }).selectAll('#planet-body')
            .on('mouseover', function (datum) {

                vel = datum.Orbital_Velocity_proportional
                axis = datum.Semi_Major_Axis_proportional
                toolTip.style("visibility", "visible");
                toolTip.select('.tooltip-container').html(`<div>Planet Name: <strong>${datum.Planet_Name}</strong></div>
                <div>Radius: <strong>${datum.Planet_Radius_Earth_Radii}</strong></div>
                <div>Rotation (Days): <strong>${datum.Orbital_Period_days}</strong></div>
                <div>Stellar Temp (k): <strong>${datum.Effective_temperature_K}</strong></div>
                `)
                // toolTip.select(".orbit").attr("stroke-opacity", 1)
                // toolTip.select(".earth_radius").html(`Planet Radii: <strong>${datum.Planet_Radius_Earth_Radii}</strong>`)
            })
            .on("mouseout", function (datum) {
                // toolTip.style("visibility", "hidden");
                // toolTip.select("#planetarium")
            })

        toolTip
            .style('left', `${x - 125}px`)
            .style('top', `${y - 25}px`)
    });
});

svg.on("click", function () {
    toolTip.style("visibility", "hidden");
})


function toRad(deg) {
    return deg * Math.PI / 180
}

var stellarClass = [
    { "sClassName": "B [10,000 - 30,000 K]", "planetClass": "stellarB", "color": "#10E3F4", "y": 20 },
    { "sClassName": "A [7,500 - 10,000 K]", "planetClass": "stellarA", "color": "#CEF8FC", "y": 40 },
    { "sClassName": "F [6,000 - 7,500 K]", "planetClass": "stellarF", "color": "#F9FCA9", "y": 60 },
    { "sClassName": "G [5,000 - 6,000 K]", "planetClass": "stellarG", "color": "#EDF410", "y": 80 },
    { "sClassName": "K [3,500 - 5,000 K]", "planetClass": "stellarK", "color": "#F4AB10", "y": 100 },
    { "sClassName": "M [0 - 3,500 K]", "planetClass": "stellarM", "color": "#F4AB10", "y": 120 }

];


container.append("g").selectAll("text").data(stellarClass).enter().append("text")
    // .text("Class of Star (Temp): ")
    .text(d => d.sClassName)
    .attr("class", d => d.planetClass)
    .attr("font-size", "20px")
    // .position("right")
    .attr("x", 350)
    .attr("y", d => 20 + d.y)
    .attr("font-family", "Oswald")
    // .attr("background-color", white)
    // .attr('color', gray)
    // .attr("fill", "#9CF1F4")
    // .text("Orbiting Star Heat (K)")
    // .attr("text-align", center)
    .on("mouseover", function () {
        var selectedClass = d3.select(this).attr("class");

        d3.selectAll("circle").style("opacity", 0.2).classed("selected-planets", false);
        d3.selectAll("." + selectedClass).style("opacity", 1).classed("selected-planets", true);
    })
    .on("mouseout", function () {
        d3.select(this).classed("selected-planets", false);
        d3.selectAll("circle").style("opacity", 1).classed("selected-planets", false);
    });
