

//setup and request json
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.reddit.com/r/politics.json?limit=1000');
xhr.responseType = 'json';
xhr.send();

// onload is "new" and is just readyState === 4
xhr.onload = function() {
  var risingJSON = xhr.response;
  var time = new Date().getTime();


  var statusHTML = '<table id="#reddittable"><tr> <th>score/min</th> <th>score</th> <th>min</th> <th>headline</th> </tr>' ;


  for(var i=0 ; i < risingJSON['data']['children'].length; i++) {
      var title = risingJSON['data']['children'][i]['data'].title ;
      var score = risingJSON['data']['children'][i]['data'].score ;

      
      // reddit stores utc in seconds but getTime is in milliseconds
      var age = Math.round(((time/1000) - risingJSON['data']['children'][i]['data'].created_utc) / 60) ;

      //round to nearest .1 (10*hot/10=hot)
      var hot = Math.round(10*(score / age)) / 10;

      // add row
      statusHTML += `<tr> <td>${hot}</td> <td>${score}</td> <td>${age}</td> <td>${title}</td> </tr>`;
  }

  statusHTML += '</table>';
  document.getElementById('rising').innerHTML = statusHTML;
  document.getElementById('#reddittable').DataTable();

}; 
