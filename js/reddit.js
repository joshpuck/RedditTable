




//setup and request json
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.reddit.com/r/politics.json?limit=1000');
xhr.responseType = 'json';
xhr.send();

xhr.onload = function() {
  var risingJSON = xhr.response;
  var time = new Date().getTime();



  //First check titles and find most common words
  var titles ;
  
  for(var i=0 ; i < risingJSON['data']['children'].length; i++) {
      titles += risingJSON['data']['children'][i]['data'].title ;
      titles += " " ;
  }

 /*global common*/
  var titles_split_uncommon = removeCommonWords(titles.split(/\s/), common);

  var mostFrequent = nthMostCommon(titles_split_uncommon, 10);
  for (var n= 0; n < mostFrequent.length; n++) {
    console.log(mostFrequent[n]['word']);
  }   

  var dataArray =[];

 // a cleaner way to do this. .foreEach you can't break out of without exception though..
  risingJSON['data']['children'].forEach(function(element) {
      var title = element['data'].title ;
      var score = element['data'].score ;

      // reddit stores utc in seconds but getTime is in milliseconds
      var age = Math.round(((time/1000) - element['data'].created_utc) / 60) ;

      //round to nearest .1
      var hot = Math.round(10*(score / age)) / 10;

      // add data to array
      dataArray.push([hot, score, age, title]);
  });
  
  //load data into #example table... using DataTable with an array argument you have to set the table's header...
  /* global $*/
  $('#example').DataTable( { data: dataArray } );
  
}; 

//ripped from StackOverflow w/ bug fixes and simplication of return
function nthMostCommon(wordsArray, amount) {
    var wordOccurrences = {} ;
    
    //_ is used to avoid reserved words that are already properties
    for (var i = 0; i < wordsArray.length; i++) {
        wordOccurrences['_'+wordsArray[i]] = ( wordOccurrences['_'+wordsArray[i]] || 0 ) + 1;
    }
    var result = Object.keys(wordOccurrences).reduce(function(acc, currentKey) {
        /* you may want to include a binary search here */
        for (var i = 0; i < amount; i++) {
            if (!acc[i]) {
                acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
                break;
            } else if (acc[i].occurences < wordOccurrences[currentKey]) {
                acc.splice(i, 0, { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] });
                if (acc.length > amount)
                    acc.pop();
                break;
            }
        }
        return acc;
    }, []);
    return result;
}


function removeCommonWords(words, common) {
  common.forEach(function(obj) {
    var word = obj.word;
    // while on .indexOf(word) !== -1 means find the entry that matched word until nothing matches it
    while (words.indexOf(word) !== -1) {
      words.splice(words.indexOf(word), 1);
    }
  });
  return words;
};