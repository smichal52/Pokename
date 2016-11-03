
//utilities testing
utils = TestCase("utils");
//namespace needed by some functions
app  = {};
//randomize mode
function randomGenMode() {
  if (Math.random()%2 == 0) app.genMode = "rand";
  else                      app.genMode = "seq";
}

//Pokemon ID generation (must be number)
utils.prototype.testA = function() {
  for (var i=0;i<10000;i++) {
    randomGenMode();
    var input = Math.random().toString(36).substring(7);//random string
    assertNumber(getGenId(input));
  }
};

//Next version generation (must be string)
utils.prototype.testB = function() {
  for (var i=0;i<10000;i++) {
    randomGenMode();
    var input = Math.random().toString(36).substring(7);//random string
    assertString(getNewVers(input));
  }
};

//table header resize (must not throw error)
utils.prototype.testC = function() {
  for (var i=0;i<10000;i++) {
    assertNoException(resizeTableHead);
  }
};

//setting up clip copy (must not throw error)
utils.prototype.testD = function() {
  for (var i=0;i<100;i++) {//only 100 for this since its too slow!
    var div =document.createElement('div');
    assertNoException(function(){setupClipCopy(div);});
  }
};

//resizing app (must not throw error)
utils.prototype.testE = function() {
  for (var i=0;i<100;i++) {
    window.innerWidth = getRandomInt(1,10000) + "px";
    assertNoException(resize);
  }
};
