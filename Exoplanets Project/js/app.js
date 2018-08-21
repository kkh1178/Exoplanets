// Set up svg
var width = window.innerWidth;
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

        // })
    // Step 2: Call forceSimulation to pass the array of objects
    // radius element will be from the csv file
    // Step 3: Add any needed funtions (forceCenter, forceCollide, etc.)
    // Step 4: Set up Callback function to update the element position after each tick
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

        node.exit().remove()
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

    

    function color(radius) {
        
        if (radius > 50) {
            return "darkred";
        }
        if (radius > 40) {
            return "blue";
        }
        if (radius > 30) {
            return "yellow";
        }
        if (radius > 20) {
            return "orange";
        }
        if (radius > 10) {
            return "coral";
        }
        return "red";

    }