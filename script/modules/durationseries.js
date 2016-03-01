d3.durationSeries = function (){

    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =800,
        h =600,
        m ={t:50,r:25,b:50,l:25},
        chartW = w - m.l- m.r,
        chartH = h - m.t -m.b,
        distanceAxisY = 170, // distance margin-text
        valueAccessor = function(d){return d},
        neighborhoodsNames = [],
        scaleX = d3.scale.linear().domain([0,400]).range([0, w-distanceAxisY]),
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([h,0]);


function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;

        scaleX = d3.scale.linear().domain([0,400]).range([0, chartW-distanceAxisY]);
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([chartH,0]);

    _selection.each(function draw (data){
        //AXIS
        var axisX = d3.svg.axis()
            .scale(scaleX)
            .ticks(10)
            .orient("top");

        var axisY = d3.svg.axis()
            .orient('left')
            .tickSize(-w)
            .scale(scaleY);

        //Step 1: does <svg> element exist? If it does, update width and height; if it doesn't, create <svg>
        var svg = d3.select(".plot")
            .selectAll('svg')
            .data([data]);

        var svgEnter = svg.enter()
            .append('svg');

        //Step 2: create layers of DOM individually
        svg.attr('width',w).attr('height',h);

        //2.1 axis
        svg.append('g')
            .attr('class','axis axis-x')
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")")
            .call(axisX);

        svg.append('g')
            .attr('class','axis axis-y')
            .attr("transform","translate("+(distanceAxisY-5+m.l)+","+ m.t+")")
            .call(axisY);

        //2.2 interval
        interval = svg
            .append("g")
            .attr("class", "interval")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");

        interval
            .selectAll(".dotsRange")
            .data(data)
            .enter()
            .append("line")
            .attr("class","dotsRange")
            .attr("x1",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return}
                });
                return scaleX(minDuration)
            })
            .attr("x2",function(d,i){
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    //console.log(neighborhood.duration);
                    return neighborhood.duration}else{return}
                });
                return scaleX(maxDuration)
            })
            .attr("y1",function(d){
                return scaleY(d.key)})
            .attr("y2",function(d){
                return scaleY(d.key)});

        //2.3 MAX
        dots1 = svg
            .append("g")
            .attr("class", "dotsMax")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");
        dots1
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                console.log(d);
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    //console.log(neighborhood.duration);
                    return neighborhood.duration}else{return}
                });
                return scaleX(maxDuration)
                })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.4 MIN
        dots2 = svg
            .append("g")
            .attr("class", "dotsMin")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");
        dots2
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return}
                });
                return scaleX(minDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.5 mean
        dots3 = svg
            .append("g")
            .attr("class", "dotsMean")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");
        dots3
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                meanDuration = d3.mean(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return}
                });
                return scaleX(meanDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.6 median
        dots3 = svg
            .append("g")
            .attr("class", "dotsMedian")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");
        dots3
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                medianDuration = d3.median(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return}
                });
                return scaleX(medianDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        });
    }

    exports.width = function(_x){
        if(!arguments.length) return w;

        w = _x;
        return this;
    };

    exports.height = function(_h){
        if(!arguments.length) return h;
        h = _h;
        return this;
    };

    exports.distance = function(_distanceAxisY){
        if(!arguments.length) return distanceAxisY;
        distanceAxisY = _distanceAxisY;
        return this;
    };
    exports.names = function(_neighborhoodsNames){
        if(!arguments.length) return neighborhoodsNames;
        neighborhoodsNames = _neighborhoodsNames;
        return this;
    };
    return exports
};
