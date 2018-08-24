d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

// Set up svg
var width = window.innerWidth*.8;
var height = window.innerHeight;

var svg = d3.select("#planet-bubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// var numNodes = 100;
// var nodes = d3.range(numNodes).map(function(d) {
//   return {radius: Math.random() * 50}
// });

var toolTip = d3.select("#planet-bubble")
                .append("div")
                .attr("class", "toolTip");


var file = "https://raw.githubusercontent.com/cburdon/Exoplanets/master/cleaned_planets.csv";
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    return error;
}

function successHandle(planetdata) {

    planetdata.forEach(function(data) {
        data.Planet_Radius_km = +data.Planet_Radius_km;
        // console.log(nodes);
        data.Effective_temperature_K = +data.Effective_temperature_K;
    })

    console.log(planetdata);

    var simulation = d3.forceSimulation()
       .force("collide", d3.forceCollide( function(d){return markerSize(d.Planet_Radius_km) + 1 }).iterations(24) )
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(0))
        .force("y", d3.forceY(0));

    simulation.nodes(planetdata)
        .on("tick", ticked);

    function ticked() {
        var node = d3.select('svg')
            .selectAll('circle')
            .data(planetdata)  

        node.enter()
            .append('circle')
            .attr('r', d => markerSize(d.Planet_Radius_km))
            .merge(node)
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .attr("fill", function(d, i) {
                return "url(#grad" + i + ")";
            })
            // .style("fill", d => color(d.Effective_temperature_K))
            .call(d3.drag()
                .on("start", dragstart)
                .on("drag", drag)
                .on("end", dragend));

        var grads = svg.append("defs").selectAll("radialGradient")
            .data(planetdata)
            .enter()
            .append("radialGradient")
            .attr("gradientUnits", "objectBoudingBox")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", "100%")
            .attr("id", function(d, i) {return "grad" + i;});

        grads.append("stop")
            .attr("offset", "0%")
            .style("stop-color", function(d) {return color(d.Effective_temperature_K); })

        grads.append("stop")
            .attr("offset", "100%")
            .style("stop-color", function(d) {return color2(d.Effective_temperature_K); })

        // var legend = svg.append("g")
        //                 .attr("class", "legend")
        //                 .attr("x", -width)
        //                 .attr("y", -height)
        //                 .attr("height", 200)
        //                 .attr("width", 100);

        // legend.append("rect")
        //       .attr("x", -width)
        //       .attr("y", -height)
        //       .attr("width", 10)
        //       .attr("height", 10)
        //       .style("fill", function(d) { return color2(d.Effective_temperature_K)});

        // var legendcolor = { 0 : ["B: 10000-30000", "#451804"],
        //                     1 : ["A: 7500-10000", "#451804"],
        //                     2 : ["F: 6000-7500", "#451804"],
        //                     3 : ["G: 5000-6000", "#451804"],
        //                     4 : ["K: 3500-5000", "#451804"],
        //                     5 : ["M: 0-3500", "#451804"],

        // legend.append("text")
        //       .attr("x", -width)
        //       .attr("y", -height)
        //       .text(function(d) { return })
        
        node.on("mouseover", function(d) {
            toolTip.style("display", "block")
                .html(`<p>${d.Planet_Name}</p>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", function() {
            toolTip.style("display", "none");
        });

        node.exit().remove();
    }

    function dragstart(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };
    
    function drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
    
    function dragend(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    function color(Kelvin) {
        
        if (Kelvin > 10000) {
            return "#c1440e";
        }
        if (Kelvin > 7500) {
            return "#e77d11";
        }
        if (Kelvin > 6000) {
            return "#d7c797";
        }
        if (Kelvin > 5000) {
            return "#9fc164";
        }
        if (Kelvin > 3500) {
            return "#6b93d6";
        }
        return "#7e8173";
    }

    function color2(Kelvin) {
        
        if (Kelvin > 10000) {
            return "#451804";
        }
        if (Kelvin > 7500) {
            return "c1440e";
        }
        if (Kelvin > 6000) {
            return "#845422";
        }
        if (Kelvin > 5000) {
            return "#6b93d6";
        }
        if (Kelvin > 3500) {
            return "#4f4cb0";
        }
        return "#361d1d";
    }

    function markerSize(radius) {
        return radius/3700;
    }

}

}