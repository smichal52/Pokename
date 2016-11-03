

############### get random int between range ###############
getRandomInt = (min,max) -> Math.floor(Math.random() * (max - min + 1)) + min



############### gets all pokemons from pokeapi and sorts them ###############
getAllPokenames = ()-> 
  showLoading()
  url  = "http://pokeapi.co/api/v1/pokedex/1/"
  $.ajax(url:url, dataType:'json').
  done((data)->
    compare = (a,b)->#compare function
      if a.name.toLowerCase() < b.name.toLowerCase() then return -1
      if a.name.toLowerCase() > b.name.toLowerCase() then return  1
      0
    window.pokeNames = data.pokemon.sort(compare)#sort by name
    hideLoading()
  ).
  error(->hideLoading();alert('failed to get data from the pokemon api'))
  
  
############### returns an adjective (randomly or sequentially) ###############
getAdjective = ()->
  if app.genMode == "rand" then id = getRandomInt(0,adjective.length-1)
  else 
    vers = $('#version').val()
    id   = parseInt(vers.split(".")[1])
    if (isNaN(id)) then id = 0
    if (id > adjective.length-1) then id = adjective.length-1
    if (id < 0) then id = 0
  adjective[id]



############### returns a nature (always random) ###############
getNature = ()->index = getRandomInt(0,nature.length-1); nature[index]



############### returns a generated pokemon id (randomly or sequentially) ###############
getGenId = (vers)->
  if (app.genMode == "rand") then getRandomInt(0,777)
  else
    id = parseInt(vers.split(".")[0])
    if isNaN(id)  then return 0
    if (id > 777) then id = 777
    if (id < 0)   then id = 0
    id
    
    
    
############### returns the next version number sequentially ###############
getNewVers = (vers)->
  parts = vers.split(".")
  if (!parts[0]) then parts[0] = 0
  if (parts[1])  then parts[1] = parseInt(parts[1])+1
  else                parts[0] = parseInt(parts[0])+1
  if (parts[1] > 10) 
    parts[0] = parseInt(parts[0])+1
    parts[1] = "00"
  else if (parts[1] <  10) 
    parts[1] = "0"+parts[1]
  parts.join(".")



############### loading feedback ###############
showLoading = ()->$('#loading').css('display','block')
hideLoading = ()->$('#loading').css('display','none')



############### filters keycodes so that only numbers   ###############
############### and some control characters are allowed ###############
filterKeys = (pressedKey, keycodes, el) ->
  #only allow 1 dot
  if ("." in el.value) then keycodes = [13]
  #extra allowed keycodes passed as parameter
  for key in keycodes
    if (pressedKey == key) then return true
  #[numbers], [backspace,tab,delete], [arrows], [numpad]
  keys = [48..57].concat([8,9,46].concat([37..40].concat([96..105])))
  if (pressedKey in keys) then return true
  false



############### checks for mobile client ###############
isMobile =  
  Android: ->/Android/i.test(navigator.userAgent)
  BlackBerry: ->/BlackBerry/i.test(navigator.userAgent)
  iOS: ->/iPhone|iPad|iPod/i.test(navigator.userAgent)
  Windows: ->/IEMobile/i.test(navigator.userAgent)
  any: ->(isMobile.Android() or isMobile.BlackBerry() or isMobile.iOS() or isMobile.Windows())



############### resizes table headers so they stay above their cols ###############
resizeTableHead = ()->
  row = $('#pokelist tr').eq(0)
  $('#main thead th').each((id,el)->
    if (id > 3) then return
    width = row.find('td').eq(id).width()
    width = if (id==0) then 45 else window.innerWidth/6
    $(el).width(width)
  )



############### sets up the copy to clipbard function for a button ###############
setupClipCopy = (btn)->
  if isMobile.any() then return
  #remove previous flash embed
  $('embed').closest('div').remove()
  #set current hovered flash btn
  cliptext = $(btn).closest('tr').find('td').last().text()
  clip = new ZeroClipboard.Client()
  clip.setText(cliptext)
  clip.glue(btn)
  #set tooltip
  $('embed').closest('div').prop('title','Copy to clipboard!')
  #set embeded button height relative to page (or it breaks with scroll)
  ht = $(btn).offset().top
  $('embed').closest('div').css('top',ht+"px")
  #destroy button on mouse leave
  $('embed').closest('div').mouseleave(->$(this).remove())


############### sets the name generation mode based on header checkbox ###############
setGenMode = (el)->
  el = $('#genmode').get(0)
  app.genMode = if el.checked then "rand" else "seq"
  el.title    = if el.checked then "Click to enter sequential generation mode" else "Click to enter random generation mode"
  
  

############### setting layout when window resizes ###############
resize = ()->
  scale = window.innerWidth/450; if (scale > 1) then scale = 1
  $('#main').height(window.innerHeight/scale - 205)
  #set compact class for everything
  if (window.innerWidth < 600) then $('body').addClass('compact') else $('body').removeClass('compact')
  #set special compact class for table
  if      (window.innerWidth < 580) then $('#pokelist').addClass('compact2').removeClass('compact')
  else if (window.innerWidth < 720) then $('#pokelist').addClass('compact').removeClass('compact2')
  else                              $('#pokelist').removeClass('compact compact2')
  #scaling breaks jquery tooltip so temporarily disable it
  #(no problem since it's not needed for mobile)
  if (scale < 1) then $('#tempstyle').html('.ui-tooltip{display:none !important;}')
  else           $('#tempstyle').html('')
  #ensure headers are about their fields
  resizeTableHead()
  #starts zooming out if width too small
  $('body').css('zoom',scale)
window.onresize = resize
resize()