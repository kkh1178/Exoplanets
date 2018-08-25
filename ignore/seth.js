d3.csv("data/cleaned_planets.csv").then(function(data) {

    planets = data.filter(d => d.Planet_Radius_Earth_Radii && d.Semi_Major_Axis_proportional && d.Orbital_Velocity_proportional);

    planets.forEach((d) => {

        // planetary radius. Also r.
        d.Planet_Radius_Earth_Radii = +d.Planet_Radius_Earth_Radii;

        // applying a logrithmic scale to get the orbits to show up
        d.Semi_Major_Axis_proportional = Math.abs((35 * (Math.log(+d.Semi_Major_Axis_proportional))).toFixed(5));
        // d.Semi_Major_Axis_proportional = 100 * (+d.Semi_Major_Axis_proportional)
        // console.log(d.pl_orbsmax)

        // I'm using a column from the table called  Radial Velocity [km/s]
        // Might be related to the star and not the planet

        d.Orbital_Velocity_proportional = +d.Orbital_Velocity_proportional;
    });


    // Making the planets based on r and R
    container.selectAll("g.planet")
        .data(planets)
        .enter()
        .append("g")
        .attr("class", "planet")
        .each(function(d, i) {
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
                .attr("class", "planet-body");
        });

    var phi0 = 0;
    let vel, axis = 0;
    // Using the timer function to rotate the planets
    d3.timer(function(delta) {
        const x = (w / 2) + axis * Math.cos(toRad(delta * vel / 200))
        const y = (h / 2) + axis * Math.sin(toRad(delta * vel / 200))
        svg.selectAll(".planet")
            .attr("transform", function(datum) {
                return "rotate(" + phi0 + delta * datum.Orbital_Velocity_proportional / 200 + ")"
            }).selectAll('.planet-body')
            .on('mouseover', function(datum) {

                vel = datum.Orbital_Velocity_proportional
                axis = datum.Semi_Major_Axis_proportional
                toolTip.select('.tooltip-container').html(`Planet Name:<strong>${datum.Planet_Name}</strong>`)
            })

        toolTip
            .style('left', `${x - 125}px`)
            .style('top', `${y - 25}px`)
    });
});


function toRad(deg) {
    return deg * Math.PI / 180
}
