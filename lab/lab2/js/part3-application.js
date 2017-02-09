/* =====================
  Lab 2, part3: a full application (stretch goal)

  We're going to use the skills we've just been practicing to write a full application
  which is responsive to user input.
  At your disposal are a set of variables which we use to track user input (see
  part3-main.js and part3-setup.js for more details on how this is done — we'll
  cover this topic at a later date). Their values will be logged to console to
  aid in debugging.

  In this lab, which is very much open-ended, your task is to use the value of
  these variables to define the functions below. Try to come up with interesting
  uses of the provided user input.

  Some ideas:
    There are two numeric fields: can you write this application to filter
    using both minimum and maximum?
    There is a boolean (true/false) field: can you write your code to filter according
    to this boolean? (Try to think about how you could chop up this data to make this meaningful.)
    There is a string field: can you write your code to filter/search based on user
    input?

  Remember, this is open-ended. Try to see what you can produce.
===================== */

/* =====================
  Define a resetMap function to remove markers from the map and clear the array of markers
===================== */
var resetMap = function() {
  /* =====================
    Fill out this function definition
  ===================== */
  _.each(temp, function(mk){
    map.removeLayer(mk);
  });
};

/* =====================
  Define a getAndParseData function to grab our dataset through a jQuery.ajax call ($.ajax). It
  will be called as soon as the application starts. Be sure to parse your data once you've pulled
  it down!
===================== */

var getAndParseData = function() {
  /* =====================
    Fill out this function definition
  ===================== */
  var parsedData;
  $.ajax({
    url:"https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-crime-snippet.json",
    async: false
  })
  .done(function(rawData){
    parsedData=JSON.parse(rawData);
  });
  return parsedData;
};

var names = Object.keys(getAndParseData()[0]);
/*reference:
Array[9]
0:"District"
1:"PSA"
2:"Dispatch Date/Time"
3:"DC Number"
4:"Location Block"
5:"UCR Code"
6:"General Crime Category"
7:"Lat"
8:"Lng"*/

var districts = _.indexBy(getAndParseData(),names[0]);
var crimeCat = _.indexBy(getAndParseData(), names[6]); //object
var crimeCatNames = Object.keys(crimeCat);
console.log(crimeCatNames); //as reference for searching the crime

/* =====================
  Call our plotData function. It should plot all the markers that meet our criteria (whatever that
  criteria happens to be — that's entirely up to you)
===================== */
var temp;
var plotData = function() {
  /* =====================
    Fill out this function definition
  ===================== */
  if (booleanField){
    var a = Number(numericField1);
    var b = Number(numericField2);
    var stringP1=stringField.split(',')[0].toUpperCase();
    var stringP2=function(stringField){
      if(stringField.split(',')[1] !== undefined) {
        return stringField.split(',')[1].toUpperCase();
      }
    };
    var districtString = (stringP1===names[0].toUpperCase() && a>=0 && b>=0 && b>=a);
    var monthString = (stringP1==="MONTH" || stringP1==="DATE" && a>=0 && b>=0 && b>=a);
    var crimeSearch =function(str){
      return _.filter(crimeCatNames, function(names){
      return names.toUpperCase().includes(str);}).length>=0;
    };

    //If the string input is "distric", the filter the distric id
    if(districtString){
      var selectDistricts = _.filter(getAndParseData(), function(obj){return obj[names[0]]>=a && obj[names[0]]<=b;});

      temp = _.map(selectDistricts, function(subObj1){return L.marker([subObj1[names[7]], subObj1[names[8]]])
        .bindPopup(subObj1[names[6]]);});

      _.each(temp, function(mk){mk.addTo(map);});
    }else if (monthString && crimeSearch(stringP2(stringField))) {

    //If the input is like: "month,other assault" (no space after comma),
    // then filter the month (from the numericFields) and the matched crime category.
    //however, this works better when using a dropdown menu with all the crime Categories provided
      var selectCrime = _.filter(getAndParseData(), function(obj){
        return parseFloat(obj[names[2]].split('/')[0])>=a &&
        parseFloat(obj[names[2]].split('/')[0])<=b &&
        obj[names[6]].toUpperCase().includes(stringP2(stringField));
      });

      temp = _.map(selectCrime, function(subObj1){return L.marker([subObj1[names[7]], subObj1[names[8]]])
        .bindPopup(subObj1[names[6]]);});

      _.each(temp, function(mk){mk.addTo(map);});
    }else if (monthString) {

    //If the string input is only "month" or "date", then filter the month
      var selectMonth = _.filter(getAndParseData(), function(obj){
        return parseFloat(obj[names[2]].split('/')[0])>=a &&
        parseFloat(obj[names[2]].split('/')[0])<=b;
      });

      temp = _.map(selectMonth, function(subObj1){return L.marker([subObj1[names[7]], subObj1[names[8]]])
        .bindPopup(subObj1[names[6]]);});

      _.each(temp, function(mk){mk.addTo(map);});
    }else if (crimeSearch(stringP1)){

      //If the string is only crime type input, then filter the crimes containing matching strings
      var selectOnlyCrime = _.filter(getAndParseData(), function(obj){
        return obj[names[6]].toUpperCase().includes(stringP1);
      });

      temp = _.map(selectOnlyCrime, function(subObj1){return L.marker([subObj1[names[7]], subObj1[names[8]]])
        .bindPopup(subObj1[names[6]]);});

      _.each(temp, function(mk){mk.addTo(map);});
    }
  }else{

    //if the booleanField is unchecked, then plot all the crime datapoints onto the map
    temp = _.map(getAndParseData(), function(subObj1){return L.marker([subObj1[names[7]], subObj1[names[8]]])
      .bindPopup(subObj1[names[6]]);});

    _.each(temp, function(mk){mk.addTo(map);});
  }
};
