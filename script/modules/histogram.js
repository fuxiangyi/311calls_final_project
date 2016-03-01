d3.timeSeries = function(){
    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =800,
        h =600,
        m ={t:50,r:25,b:50,l:25},
        chartW = w - m.l- m.r, 
        chartH = h - m.t -m.b,
        maxY = function(d){return d.length}
        layout = d3.layout.histogram()
        timeRange = [new Date(), new Date()],
        binSize = d3.time.day,
        valueAccessor = function(d){return d},
        scaleX = d3.time.scale().domain(timeRange).range([0,chartW]),
        scaleY = d3.scale.linear().domain([0,maxY]).range([chartH,0]);
        

    //export part
    
function exports (selection){

        chartW = w - m.l- m.r;   
        chartH = h - m.t -m.b;
       
  var bins = binSize.range(timeRange[0],timeRange[1]);
      bins.unshift(timeRange[0]);
      bins.push(timeRange[1]);

 layout
               .range(timeRange)
               .bins(bins); 


                scaleX.domain(timeRange).range([0,chartW]);
                scaleY.domain([0,maxY]).range([chartH,0]);

         selection.each(function(d){
          //console.log(d);
        
            layout
               .value(valueAccessor)
               .range(timeRange)
               .bins(bins); 
            var data = layout(d);
            console.log(data);
            
           
            var line = d3.svg.line()
                         .x(function(d){ return scaleX(d.x.getTime()+ d.dx/2)})
                         .y(function(d){ return scaleY(d.y)})
                         .interpolate('basis');
            var area = d3.svg.area()
                         .x(function(d){return scaleX(d.x.getTime() + d.dx/2);})
                         .y0(chartH)
                         .y1(function(d){return scaleY(d.y);})
                         .interpolate('basis');
            // draw aixs 
             var axisX = d3.svg.axis()
                           .orient('bottom')
                           .scale(scaleX)
                           .ticks(d3.time.year);
              
            var axisY = d3.svg.axis()
                            .scale(scaleY)
                            .ticks(5)
                            .orient("left");
            
            //appand line, area, axisX to svg element
             var svg = d3.select(this)
                 .selectAll('svg')
                 .data([d]); // d3.select(this) = each picked one in selection

             var svgEnter = svg.enter()
                 .append('svg');

             svg
                 .attr('width',w)
                 .attr('height',h);// you need to append the w, h to the svg
                        
            // svgEnter
            // .datum(data);

            svgEnter.append('g')
               .attr("class","area")
               .attr("transform","translate("+m.l+","+m.t+")")
               .append("path")
               .datum(data)
               .attr("d",area);
            
            svgEnter.append('g')
               .attr("class","line")
               .attr("transform","translate("+m.l+","+m.t+")")
               .append("path")
               .datum(data)
               .attr("d",line);
            
            svg.append('g').attr('class','axis').attr('transform','translate('+m.l+','+(m.t+chartH)+')').call(axisX);
            svg.append('g').attr('class','axis').attr('transform','translate('+m.l+','+m.t+')').call(axisY);

});


}


    // getter and setter function which access the variables up to internal variables. 

exports.width = function(_x){  
if(!arguments.length) return w
   
   w = _x;
   return this;
}

exports.height = function(_h){
if(!arguments.length) return h
    
    h = _h;
    return this;
}
exports.value = function(_v){
if(!arguments.length) return layout.value();

    valueAccessor = _v;
    layout.value(_v);
    return this;
}

exports.timeRange = function(_r){
    if(!arguments.length) return timeRange
       
      timeRange = _r;
      return this;
}
exports.binSize = function(_b){
if(!arguments.length) return binSize

    binSize = _b

    return this;
}
exports.maxY=function(_d){
  if(!arguments.length) return maxY;
  maxY = _d;
  return this;
}


return exports
}