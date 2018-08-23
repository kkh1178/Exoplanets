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

var numNodes = 100;
var nodes = d3.range(numNodes).map(function(d) {
  return {radius: Math.random() * 50}
});

console.log(nodes);

// Forced Center Bubble Chart Code Steps
    // Step 1: Create the array of objects
        // Use d3 to call the nodes from csv or json
        // d3.csv("exoplanets.csv", function(data) {
        //     data.radius = +data.radius;

 var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(50))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) {
            return d.radius + 1
        }))
        .on('tick', ticked);

    function ticked() {
        var node = d3.select('svg')
            .selectAll('circle')
            .data(nodes)
            

        node.enter()
            .append('circle')
            .attr('r', function(d) {
                return d.radius
            })
            .merge(node)
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .style("fill", function(d) {
                return color(d.radius)
            })
            .call(d3.drag()
                .on("start", dragstart)
                .on("drag", drag)
                .on("end", dragend));

        var toolTip = d3.select("body")
            .append("div")
            .attr("class", "toolTip");
        
        node.on("mouseover", function(d) {
            toolTip.style("display", "block")
                .html(`<p>${d.radius}</p>`)
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
            return "blue";
        }
        if (Kelvin > 6000) {
            return "white";
        }
        if (Kelvin > 3700) {
            return "yellow";
        }
        return "red";

    }

}