var m = {t:30,r:100,b:30,l:100},
    w = d3.select('.plot').node().clientWidth- m.l- m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;


var globalDispatch = d3.dispatch('pickTime');

var neighborhood_name = [];

//import data

d3.csv('data/311calls_reduced.csv',parse,dataLoaded);


function dataLoaded (err,rows){
   //console.log(rows);

    // get the duration of each case
    rows.forEach(function(d){
        if(+d.endTime != NaN){
        d.duration =  Math.abs(d.startTime - d.endTime)/(1000*60*60*24); //in days
        }else{}
    });

    //max and min duration
    //console.log(d3.extent(rows,function(d){return d.duration}));

    var data = rows;

    //nest by type and then by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function(d){return d.neighborhood})
        .entries(data);

    var neighborhoodsNames = nestedNeighborhood.map(function(d){return d.key});
    //console.log(neighborhoodsNames);


    //dots
    var durationModule = d3.durationSeries()
        .width(w)
        .height(h)
        .distance(250)
        .names(neighborhoodsNames);

    var plot = d3.select(".container").select('.plot')
        .datum(nestedNeighborhood)
        .call(durationModule);

}




// parse data
function parse(d){

    return {
        startTime: new Date(d.OPEN_DT),
        endTime: new Date(d.CLOSED_DT),
        type: d.TYPE,
        neighborhood: d.neighborhood,

    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}



