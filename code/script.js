var setText = function(elements, possibleSubs){
  var h1 = elements[0];

  var item = h1;
  var text = h1.innerText;

  if(h1.children==0){
    var item = h1.children[0];
    var text = item.innerText;
  }

  var sub = possibleSubs[Math.floor(Math.random()*possibleSubs.length)];
  item.innerText = sub + ' ' + text;
}

var getHeaders = function(tags){
  return tags.filter(function(item){ 
    var children = item.children;
    if(item.children.length == 0) {
      return true;
    }
    var first = item.children[0];
    if(first.tagName === 'A') {
      return true;
    }
  })
}

var start = function() {
  var possibleSubs = ["Harry Potter and the"];

  var headers = document.getElementsByTagName('h1');
  var tags =  Array.prototype.slice.call( headers, 0 );

  var validElements = getHeaders(tags);

  if(validElements.length == 0) return;

  setText(validElements, possibleSubs);
}

start();