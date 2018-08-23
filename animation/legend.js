function createGradient() {
    var legendRectSize = 7;
    var legendSpacing = 20;
    // Stellar Classes taken from http://hyperphysics.phy-astr.gsu.edu/hbase/Starlog/staspe.html
    var stellarClass = [
        { "sClassName": "B [10,000 - 30,000 K]", "sClass": "B", "color": "#10E3F4" },
        { "sClassName": "A [7,500 - 10,000 K]", "sClass": "A", "color": "#CEF8FC" },
        { "sClassName": "F [6,000 - 7,500 K]", "sClass": "F", "color": "#F9FCA9" },
        { "sClassName": "G [5,000 - 6,000 K]", "sClass": "G", "color": "#EDF410" },
        { "sClassName": "K [3,500 - 5,000 K]", "sClass": "K", "color": "#F4AB10" }
    ];

    function colors(d) {
    
        return d > 7 ? '#800026' :
            d > 6 ? '#BD0026' :
            d > 5 ? '#E31A1C' :
            d > 4 ? '#FC4E2A' :
            d > 3 ? '#FD8D3C' :
            d > 2 ? '#FEB24C' :
            d > 1 ? '#FED976' :'#FFEDA0';
    };


    
    var legend = d3.select('svg')
        .append("g")
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize;
            var x = 0;
            var y = i * height;
            return 'translate(' + x + ',' + y + ')';
        });
    //Initiate container around Legend
    // var legendContainer = svg.append("g").attr("class", "legendContainer")
    //     .attr("transform", "translate(" + 30 + "," + (y - 90) + ")");
    // //Create title of Legend
    // var legendTitle = legendContainer.append('text')
    // // x and y taken from app3.js
    //     .attr('x', 0)
    //     .attr('y', legendRectSize - legendSpacing)
    //     .attr("dy", "1em")
    //     .attr('class', 'legendTitle')
    //     .attr('transform', function () {
    //         var height = legendRectSize + legendSpacing;
    //         var offset = height * stellarClass.length / 2;
    //         var horz = -2 * legendRectSize;
    //         var vert = -2.3 * height - offset;
    //         return 'translate(' + horz + ',' + vert + ')';
    //     })
    //     .text("Stellar class of the star around which the planet orbits");
}


