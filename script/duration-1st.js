var m = {t:30,r:100,b:30,l:100},
    w = d3.select('.plot').node().clientWidth- m.l- m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var plot = d3.select(".container").select('.plot').append('svg')
    .attr('width',w+ m.l+ m.r)
    .attr('height',h+ m.t+ m.b)
    .append('g').attr('class','dots')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var globalDispatch = d3.dispatch('pickTime');


//import data
d3.csv('data/311calls.csv',parse,dataLoaded);

function dataLoaded (err,rows){
   console.log(rows);
    // get the duration of each case
    rows.forEach(function(d){
        if(+d.endTime != NaN){
        d.duration =  Math.abs(d.startTime - d.endTime)/(1000*60*60*24); //in days
        }else{}
    });

    //max and min duration
    console.log(d3.extent(rows,function(d){return d.duration}));

    var data = rows;

    //nest by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function(d){return d.neighbor})
        .entries(data);


    nestedNeighborhood.forEach(function(t){
        //console.log(t.key);
        t.maxDuration = d3.max(t.values,function(neighborhood){return neighborhood.duration});
        t.minDuration = d3.min(t.values,function(neighborhood){if (neighborhood.duration>0) {return neighborhood.duration}else{return }});
        t.meanDuration = d3.mean(t.values,function(neighborhood){if (neighborhood.duration>0) {return neighborhood.duration}else{return }});
        t.medianDuration = d3.median(t.values,function(neighborhood){if (neighborhood.duration>0) {return neighborhood.duration}else{return }});
    });

    nestedNeighborhood.sort(function(a, b) {return a.maxDuration - b.maxDuration});

    console.log(nestedNeighborhood);
    var neighborhoodsNames = nestedNeighborhood.map(function(d){return d.key});
    console.log(neighborhoodsNames);

//scales. ScaleX is duration (in hours), scaleY is neighborhood
    var distanceAxisY = 170;
    scaleX = d3.scale.linear().domain([0,400]).range([0, w-distanceAxisY]);
    scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([h,0]);

//AXIS
    var axisX = d3.svg.axis()
        .scale(scaleX)
        .ticks(10)
        .orient("top");

    var axisY = d3.svg.axis()
        .orient('left')
        .tickSize(-w)
        .scale(scaleY);

    //Draw Axis1
    plot.append('g')
        .attr('class','axis axis-x')
        .attr("transform","translate("+distanceAxisY+",0)")
        .call(axisX);

    plot.append('g')
        .attr('class','axis axis-y')
        .attr("transform","translate("+(distanceAxisY-5)+",0)")
        .call(axisY);

    //interval
    plot0 = plot.append("g")
        .attr("class","dots maxDuration")
        .attr("transform","translate("+(distanceAxisY)+",0)");
    plot0
        .selectAll(".dotsRange")
        .data(nestedNeighborhood)
        .enter()
        .append("line")
        .attr("class","dotsRange")
        .attr("x1",function(d,i){
            return scaleX(d.minDuration)
        })
        .attr("x2",function(d,i){
            return scaleX(d.maxDuration)
        })
        .attr("y1",function(d){
            return scaleY(d.key)})
        .attr("y2",function(d){
            return scaleY(d.key)});

    //MAX DURATION
    plot1 = plot.append("g")
        .attr("class","dots maxDuration")
        .attr("transform","translate("+(distanceAxisY)+",0)");

    plot1
        .selectAll(".dotsMax")
        .data(nestedNeighborhood)
        .enter()
        .append("circle")
        .attr("class","dotsMax")
        .attr("r",5)
        .attr("cx",function(d,i){
            return scaleX(d.maxDuration)
        })
        .attr("cy",function(d){
            return scaleY(d.key)});

    //Min DURATION
    plot2 = plot.append("g")
        .attr("class","dots minDuration")
        .attr("transform","translate("+(distanceAxisY)+",0)");

    plot2
        .selectAll(".dotsMin")
        .data(nestedNeighborhood)
        .enter()
        .append("circle")
        .attr("class","dotsMin")
        .attr("r",5)
        .attr("cx",function(d,i){
            return scaleX(d.minDuration)
        })
        .attr("cy",function(d){
            return scaleY(d.key)});

    //Mean DURATION
    plot3 = plot.append("g")
        .attr("class","dots meanDuration")
        .attr("transform","translate("+(distanceAxisY)+",0)");

    plot3
        .selectAll(".dotsMean")
        .data(nestedNeighborhood)
        .enter()
        .append("circle")
        .attr("class","dotsMean")
        .attr("r",5)
        .attr("cx",function(d,i){
            return scaleX(d.meanDuration)
        })
        .attr("cy",function(d){
            return scaleY(d.key)});

    //Median DURATION
    plot4 = plot.append("g")
        .attr("class","dots medianDuration")
        .attr("transform","translate("+(distanceAxisY)+",0)");

    plot4
        .selectAll(".dotsMedian")
        .data(nestedNeighborhood)
        .enter()
        .append("circle")
        .attr("class","dotsMedian")
        .attr("r",5)
        .attr("cx",function(d,i){
            return scaleX(d.medianDuration)
        })
        .attr("cy",function(d){
            return scaleY(d.key)});



}




// parse data
function parse(d){

    return {
        startTime: new Date(d.OPEN_DT),
        endTime: new Date(d.CLOSED_DT),
        type: d.TYPE,
        neighbor: d.neighborhood,

    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}



