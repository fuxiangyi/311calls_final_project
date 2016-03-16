var m = {t:30,r:100,b:30,l:100},
    w = d3.select('.plot').node().clientWidth- m.l- m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

//import data
//d3.csv('data/metadata.csv',parseMetadata);
//d3.csv('data/311calls-reduced.csv',parse,dataLoaded);

var queue = d3_queue.queue()
    .defer(d3.csv,'../data/311calls-reduced.csv',parse)
    .defer(d3.csv,'../data/metadata.csv',parseType)
    .await(dataLoaded);


var globalDispatcher = d3.dispatch('changetype');

var neighborhood_name = [];

function dataLoaded (err,rows,types){

    d3.select(".type-list").on("change", function (){
        globalDispatcher.changetype(this.value);
        // this = selection the user picked
        //when the user selects another option in the list, the event is called "change"
    });



    // get the duration of each case
    rows.forEach(function(d){
        if(+d.endTime != NaN){
        d.duration =  Math.abs(d.startTime - d.endTime)/(1000*60*60*24); //in days
        }else{}
    });

    //max and min duration
    //console.log(d3.extent(rows,function(d){return d.duration}));

    var data = rows;

    var calls = crossfilter(data);

    var callsByType = calls.dimension(function(d){return d.type});

    callsType = callsByType.filter("Abandoned Bicycle").top(Infinity);
    console.log(callsType);


    //nest by type and then by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function(d){return name = d.neighborhood})
        .entries(callsType);


    var neighborhoodsNames = nestedNeighborhood.map(function(d){return d.key});
    console.log(nestedNeighborhood);


    //dots
    var durationModule = d3.durationSeries()
        .width(w)
        .height(h)
        .distance(250)
        .daysDuration([0,400])
        .names(neighborhoodsNames);


    var plot = d3.select(".container").select('.plot')
        .datum(nestedNeighborhood)
        .call(durationModule);

    //Dispatch function


    globalDispatcher.on("changetype", function (type){
        callsByType.filterAll();
        callsType = callsByType.filter(type).top(Infinity);

        var nestedNeighborhoodInDispatch = d3.nest()
            .key(function(d){return name = d.neighborhood})
            .entries(callsType);

        plot.datum(nestedNeighborhoodInDispatch)
            .call(durationModule)
    });

}




// parse data
function parse(d){

    return {
        startTime: new Date(d.OPEN_DT),
        endTime: new Date(d.CLOSED_DT),
        type: d.TYPE,
        neighborhood: d.neighborhood,
    };


}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

function parseType(n){
    d3.select(".type-list") //class in the html file
        .append("option") //it has to be called this name
        .html(n.type)
        .attr("value", n.type)
}

