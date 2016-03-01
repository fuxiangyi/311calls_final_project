 var
    w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;



//load data
d3.csv('../data/311calls.csv',parse,dataloaded);

//draw
     var his1 = d3.timeSeries()
    .width(w)
    .height(h)
    .maxY(1500)
    .value(function(d){return d.startTime})
    .timeRange([new Date(2014,12,31),new Date(2016,1,01)])
    .binSize(d3.time.week);

function dataloaded(err,rows){
    //d3.range(start,end, increment)


    var caseByNeighboor = d3.nest()
        .key(function(d){return d.neighbor})
        .entries(rows);
    
    var plots = d3.select('.container').selectAll('.plot')
                  .data(caseByNeighboor);

        plots
                  .enter()
                  .append('div')
                  .attr('class','plot')
        
        plots
                  .each(function(d){
                   // console.log(d.values);
                   d3.select(this).datum(d.values)
                   .call(his1);
                })

}

// parse data
function parse(d){


	return {
		startTime: new Date(d.OPEN_DT),
		endTime: new Date(d.CLOSED_DT),
		type: d.TYPE,
		neighbor: d.neighborhood	

	}

	
}

 