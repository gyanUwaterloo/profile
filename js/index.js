var chart = new dc.PieChart("#test");
var tableChart = dc.dataTable("#mytable");
d3.csv("./data/product.csv").then(function(product) {
//ProductId,Image,Description,Rating,NumberRated,Price,Url
  var ndx           = crossfilter(product),
      ratingDimension  = ndx.dimension(function(d) {return d.Rating.substr(0,3);}),
      ratingGroup = ratingDimension.group().reduceCount();
      var generalDim = ndx.dimension(function(d) {return d});
      var generalGroup =      generalDim.group();

  chart
    .width(400)
    .height(480)
    .slicesCap(4)
    .innerRadius(100)
    .dimension(ratingDimension)
    .group(ratingGroup)
    .legend(dc.legend().highlightSelected(true))
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });

    tableChart
      .dimension(generalDim)
      .size(Infinity)
      .columns(['ProductId','Description','Rating','NumberRated','Price'])
      .order(d3.ascending);


  dc.renderAll();
});

