

//setup and request json
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.reddit.com/r/politics.json?limit=1000');
xhr.responseType = 'json';
xhr.send();

xhr.onload = function() {
  var risingJSON = xhr.response;
  var time = new Date().getTime();


  var dataArray =[];


  for(var i=0 ; i < risingJSON['data']['children'].length; i++) {
      var title = risingJSON['data']['children'][i]['data'].title ;
      var score = risingJSON['data']['children'][i]['data'].score ;

      // reddit stores utc in seconds but getTime is in milliseconds
      var age = Math.round(((time/1000) - risingJSON['data']['children'][i]['data'].created_utc) / 60) ;

      //round to nearest .1
      var hot = Math.round(10*(score / age)) / 10;

      // add data to array
      dataArray.push([hot, score, age, title]);
  }
  
  console.log(dataArray);

  //load data into #example table...
  $('#example').DataTable( { data: dataArray } );
  
}; 
