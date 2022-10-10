// Function for change on dropdown menu
function dropdown(names){

    
   //  console.log(names);
 
    // Read the json file for the data
    d3.json("data/samples.json").then((data) => {
 
    console.log(data);
 
    // Clears dropdown
    d3.select("#selDataset").html("");   
    
    // Select the metadata array and for each item append the item ID and adds ID to dropdown
    data.metadata.forEach(item =>
         {
          // console.log(item.id);
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
         });
    // Selected value is passed
    d3.select("#selDataset").node().value = names;
    
    // Filter Metadata for selected ID from dropdown
    const MetadataID = data.metadata.filter(item=> (item.id == names));
      
    console.log(MetadataID);
    
    const Display = d3.select("#sample-metadata");
    Display.html("");
    Object.entries(MetadataID[0]).forEach(item=> 
       {
          // console.log(item);
          Display.append("p").text(`${item[0]}: ${item[1]}`)
       });
 
    // BAR CHART
 
    // Filter sample array for the selected ID
    const SampleID = data.samples.filter(item => parseInt(item.id) == names);
    
   
    
    // Slice top 10 sample values
    var sampleValue = SampleID[0].sample_values.slice(0,10);
    sampleValue= sampleValue.reverse();
    var otuID = SampleID[0].otu_ids.slice(0,10);
    otuID = otuID.reverse();
    var otuLabels = SampleID[0].otu_labels
    otuLabels = otuLabels.reverse();
 
    
 
    // Y axis of bar chart
    const y_axis = otuID.map(item => 'OTU' + " " + item);
       // console.log(yAxis);
    
    // Define the layout and trace object, edit color and orientation
       const trace_bar= {
       y: y_axis,
       x: sampleValue,
       type: 'bar',
       orientation: "h",
       text:  otuLabels,
       marker: {
          color: 'rgb(255, 204, 102)',
        }
       },
       layout_bar = {
       title: 'Top 10 Operational Taxonomic Units',
       xaxis: {title: 'No. of Samples Collected'},
       yaxis: {title: 'OTU ID'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace_bar], layout_bar,  {responsive: true});    
       
 // BUBBLE CHART
 
 // Remove Sample value and otuID from individual
 var sampleValue_bubble =SampleID[0].sample_values;
 var otuID_bubble= SampleID[0].otu_ids;
 
 // Define the layout, trace object, color and orientation
 const trace_bubble = {
    x: otuID_bubble,
    y: sampleValue_bubble,
    mode: 'markers',
    marker: {
      color: otuID_bubble,
      
      size: sampleValue_bubble,
      colorscale: 'Portland'
    }
  },
 
  layout_bubble= {
    title: '<b>Bubble Chart For Each Sample</b>',
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'No. of Samples Collected'},
    showlegend: false,
    height: 450,
    width: 1100
    };
    
 // Plot using Plotly
 Plotly.newPlot('bubble', [trace_bubble], layout_bubble);
 
 // BONUS: GAUGE CHART

 // Gauge Chart to plot weekly washing frequency 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 
 const washFreq = MetadataID[0].wfreq;
 
 const guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs/Week)" },
      type: "indicator",
      mode: "gauge+number+delta",     
       gauge: {
       axis: { range: [0,9] },
       bar: { color: "#f8ec00" },
       steps: [
          { range: [0, 1], color: "#FFFF33" },
          { range: [1, 2], color: "#FFD433" },
          { range: [2, 3], color: "#FFC433" },
          { range: [3, 4], color: "#FFA533" },
          { range: [4, 5], color: "#FF8D33" },
          { range: [5, 6], color: "#FF6B33" },
          { range: [6, 7], color: "#FF5533" },
          { range: [7, 8], color: "#FF4C33" },
          { range: [8, 9], color: "#FF3C33" },
        ],
       threshold: {
          value: washFreq
        }
      }
    }
  ]; 
  const gaugeLayout = {  width: 600, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plot using Plotly
  Plotly.newPlot('gauge', guageData, gaugeLayout); 
 
 });
 }
 
 // Initial test starts at ID 940
 dropdown(940);
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
   dropdown(d3.event.target.value);
 
 });