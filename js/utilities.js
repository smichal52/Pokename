var filterKeys, getAdjective, getAllPokenames, getGenId, getNature, getNewVers, getRandomInt, hideLoading, isMobile, resize, resizeTableHead, setGenMode, setupClipCopy, showLoading,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getAllPokenames = function() {
  var url;
  showLoading();
  url = "http://pokeapi.co/api/v1/pokedex/1/";
  return $.ajax({
    url: url,
    dataType: 'json'
  }).done(function(data) {
    var compare;
    compare = function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    };
    window.pokeNames = data.pokemon.sort(compare);
    return hideLoading();
  }).error(function() {
    hideLoading();
    return alert('failed to get data from the pokemon api');
  });
};

getAdjective = function() {
  var id, vers;
  if (app.genMode === "rand") {
    id = getRandomInt(0, adjective.length - 1);
  } else {
    vers = $('#version').val();
    id = parseInt(vers.split(".")[1]);
    if (isNaN(id)) {
      id = 0;
    }
    if (id > adjective.length - 1) {
      id = adjective.length - 1;
    }
    if (id < 0) {
      id = 0;
    }
  }
  return adjective[id];
};

getNature = function() {
  var index;
  index = getRandomInt(0, nature.length - 1);
  return nature[index];
};

getGenId = function(vers) {
  var id;
  if (app.genMode === "rand") {
    return getRandomInt(0, 777);
  } else {
    id = parseInt(vers.split(".")[0]);
    if (isNaN(id)) {
      return 0;
    }
    if (id > 777) {
      id = 777;
    }
    if (id < 0) {
      id = 0;
    }
    return id;
  }
};

getNewVers = function(vers) {
  var parts;
  parts = vers.split(".");
  if (!parts[0]) {
    parts[0] = 0;
  }
  if (parts[1]) {
    parts[1] = parseInt(parts[1]) + 1;
  } else {
    parts[0] = parseInt(parts[0]) + 1;
  }
  if (parts[1] > 10) {
    parts[0] = parseInt(parts[0]) + 1;
    parts[1] = "00";
  } else if (parts[1] < 10) {
    parts[1] = "0" + parts[1];
  }
  return parts.join(".");
};

showLoading = function() {
  return $('#loading').css('display', 'block');
};

hideLoading = function() {
  return $('#loading').css('display', 'none');
};

filterKeys = function(pressedKey, keycodes, el) {
  var key, keys, _i, _len;
  if ((__indexOf.call(el.value, ".") >= 0)) {
    keycodes = [13];
  }
  for (_i = 0, _len = keycodes.length; _i < _len; _i++) {
    key = keycodes[_i];
    if (pressedKey === key) {
      return true;
    }
  }
  keys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].concat([8, 9, 46].concat([37, 38, 39, 40].concat([96, 97, 98, 99, 100, 101, 102, 103, 104, 105])));
  if ((__indexOf.call(keys, pressedKey) >= 0)) {
    return true;
  }
  return false;
};

isMobile = {
  Android: function() {
    return /Android/i.test(navigator.userAgent);
  },
  BlackBerry: function() {
    return /BlackBerry/i.test(navigator.userAgent);
  },
  iOS: function() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },
  Windows: function() {
    return /IEMobile/i.test(navigator.userAgent);
  },
  any: function() {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows();
  }
};

resizeTableHead = function() {
  var row;
  row = $('#pokelist tr').eq(0);
  return $('#main thead th').each(function(id, el) {
    var width;
    if (id > 3) {
      return;
    }
    width = row.find('td').eq(id).width();
    width = id === 0 ? 45 : window.innerWidth / 6;
    return $(el).width(width);
  });
};

setupClipCopy = function(btn) {
  var clip, cliptext, ht;
  if (isMobile.any()) {
    return;
  }
  $('embed').closest('div').remove();
  cliptext = $(btn).closest('tr').find('td').last().text();
  clip = new ZeroClipboard.Client();
  clip.setText(cliptext);
  clip.glue(btn);
  $('embed').closest('div').prop('title', 'Copy to clipboard!');
  ht = $(btn).offset().top;
  $('embed').closest('div').css('top', ht + "px");
  return $('embed').closest('div').mouseleave(function() {
    return $(this).remove();
  });
};

setGenMode = function(el) {
  el = $('#genmode').get(0);
  app.genMode = el.checked ? "rand" : "seq";
  return el.title = el.checked ? "Click to enter sequential generation mode" : "Click to enter random generation mode";
};

resize = function() {
  var scale;
  scale = window.innerWidth / 450;
  if (scale > 1) {
    scale = 1;
  }
  $('#main').height(window.innerHeight / scale - 205);
  if (window.innerWidth < 600) {
    $('body').addClass('compact');
  } else {
    $('body').removeClass('compact');
  }
  if (window.innerWidth < 580) {
    $('#pokelist').addClass('compact2').removeClass('compact');
  } else if (window.innerWidth < 720) {
    $('#pokelist').addClass('compact').removeClass('compact2');
  } else {
    $('#pokelist').removeClass('compact compact2');
  }
  if (scale < 1) {
    $('#tempstyle').html('.ui-tooltip{display:none !important;}');
  } else {
    $('#tempstyle').html('');
  }
  resizeTableHead();
  return $('body').css('zoom', scale);
};

window.onresize = resize;

resize();
