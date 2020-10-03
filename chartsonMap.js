$(document).ready(function(){

    // hook up an event handler for the load button click
    // wait to initialize until the button is clicked

    // $("#initializeButton").click(function(){
      $(document).ready(function () {

        //disable the buttion after it has been clicked
        // $("initializeButton").prop('disabled', true);

        tableau.extensions.initializeAsync().then(function(){


//  //  After initialization, ask Tableau what sheets are available
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

    // Find a specific worksheet
    var worksheet = worksheets.find(function (sheet) {
      return sheet.name === "Name of Worksheet I want";
    });

    // Or iterate through the array of worksheets
    worksheets.forEach(function (worksheet) {
      //  process each worksheet...
      // get the summary data for the sheet
 worksheet.getSummaryDataAsync().then(function (sumdata) {

  var width = 860;
  var height = 500;
  var radius = 30;

  var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
	
var g1 = svg.append("g"); // background
var g2 = svg.append("g"); // pie charts

// Projection variables
var projection = d3.geoMercator()
				   .center([110,18])
				   .scale(650)
				   .translate([width/2,height/2]);
				   
var path = d3.geoPath().projection(projection);

// Pie chart variables:
var arc = d3.arc()
			.innerRadius(0)
			.outerRadius(radius);
			
var pie = d3.pie()
			.sort(null)
			.value(function(d) { return d; });
			
var color = d3.schemeReds[4]

// Draw geographic features
d3.json("world.json", function(error, world) {
    g1.insert("path", ".land")
		.datum(topojson.feature(world, world.objects.countries))
		.attr("class", "land")
		.attr("d", path);
		
	g1.append("path")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);
});


// Draw pie charts,

  const worksheetData = sumdata;
  // The getSummaryDataAsync() method returns a DataTable
  // Map the DataTable (worksheetData) into a format for display, etc.

console.log('site ' , sumdata._data[0][0]._value, 'test2: ', 
sumdata._data[0][1]._value);

for (i=0; i<sumdata._data.length; i++){
  for (j=0; j<sumdata._data[0].length; j++){
    console.log('data('+i.toString()+','+j.toString()+')', 
    sumdata._data[i][j]._value)
  }
}

var agingProfile =[];

for(i=0; i<sumdata._data.length-3; i=i+4){

       agingProfile[parseInt(i/4)] = 
    {
      site : sumdata._data[i][0]._value,
      lat: JSON.stringify(sumdata._data[i][2]._value),
      lon: JSON.stringify(sumdata._data[i][3]._value),
      aging:  [sumdata._data[i+3][4]._value, sumdata._data[i+2][4]._value, 
              sumdata._data[i+1][4]._value, sumdata._data[i][4]._value]

    }
  
}

console.log('length of array:'+ agingProfile.length);
console.log(agingProfile);
console.log('lon:' + agingProfile['lon'], 'lat:' + agingProfile.lat);

var points = g2.selectAll("g")
		.data(agingProfile)
		.enter()
		.append("g")
    .attr("transform",function(d) 
    { 
      console.log('aging: ' + agingProfile)
      console.log('hello:', d.lon, d.lat)
      console.log('hello:', projection([d.lon, d.lat]))
      console.log('testings', agingProfile.lon, agingProfile.lat)
    
      return "translate("+projection(
     [d.lon, d.lat])+")" })
		.attr("class","pies")

    	points.append("text")
    .attr("y", -radius - 5)
    .text(function(d){
        console.log(d.site)
        return d.site})
    .style('text-anchor','middle');
    

    	var arc = d3.arc()
	  .innerRadius(radius*0.65)
	  .outerRadius(radius)	

	var pies = points.selectAll(".pies")
		.data(function(d){
      console.log(d.aging);
      return pie(d.aging)
    })
		.enter()
		.append('g')
		.attr('class','arc');
	
	pies.append("path")
	  .attr('d',arc)
      .attr("fill",function(d,i){
           return color[i+1];     
            });

  });
    });   
        }, function(err){
            //something went wrong in initialization
            $("#resultBox").html("Error while Initializing: " + err.toString());
          });
 
    });

    
});