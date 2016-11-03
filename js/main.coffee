init = ()->

  #gets all pokemon names
  getAllPokenames()

  #set jquery ui tooltips
  $(document).tooltip(track:true)
  $(document).click(->$('.ui-tooltip').hide())#hide tooltip istantly when parent is clicked

  #set path for clipboard tool (uses flash) 
  if !isMobile.any() then ZeroClipboard.setMoviePath('js/ZeroClipboard.swf')

  ################## apps namespace and pokename model ######################################
  window.app = {}
  setGenMode()#set generation mode
  app.Pokemon = Backbone.Model.extend(
    defaults: 
      version:   ''
      name:      ''
      nature:    ''
      adjective: ''
  )

  ########## view for single pokename item ##################################################
  # renders individual pokename items
  app.PokeView = Backbone.View.extend(
    #row creation based on template
    tagName: 'tr'
    template: _.template($('#item-template').html())

    #render added model to view
    render: ->
      this.$el.html(this.template(this.model.toJSON()))
      this #enable chained calls

    #initialize view of model  
    initialize: ->
      this.model.on('change', this.render, this)
      this.model.on('destroy', this.remove, this)

    #all relevant events
    events: 
      'click label'     : 'edit'
      'keypress .edit'  : 'updateOnEnter'
      'blur .edit'      : 'close'
      'click .destroy'  : 'destroy'
      'click .copy'     : ->alert('not supported here!')
      'keydown .version': (e)->filterKeys(e.keyCode,[13,110,190],e.target)
      'hover .copy'     : (e)->setupClipCopy(e.target)

    #clicking to edit a table field
    edit: (e)->
      app.editedSomething = false
      cell = $(e.target).parent('td')
      cell.addClass('editing')
      cell.find('input').focus()
      cell.find('input').select()

    #leaving an edited field (it's saved)
    close: (e)->
      cell  = $(e.target).parent('td')
      row   = $(cell).closest('tr').get(0)
      value = cell.find('input').val().trim()
      field = cell.find('input').attr('prop')
      obj   = {}; obj[field]= value
      if (value) then this.model.save(obj)
      cell.removeClass('editing')
      if (app.editedSomething) then $(row).addClass('new-item')
      #reset copy to clip field text
      $(row).find('td:last').text(this.model.get('adjective')+" "+this.model.get('name'))

    #saves edited field when enter is pressed
    updateOnEnter: (e)->
      if (e.which == 13) then this.close(e)
      else       app.editedSomething = true

    #removes an item
    destroy: ->
      this.model.destroy()
      resizeTableHead()
  )


  ############# collection of stored pokenames ###################################################
  app.PokeList = Backbone.Collection.extend(
    #model that this collection will use
    model: app.Pokemon
    #storage the collection will use
    localStorage: new Store("backbone-pokemons")
    #sorting based on name (1st) and adjective (2nd)
    comparator: (pok)->(pok.get("name")+" "+pok.get("adjective")).toLowerCase()
  )
  #initialize collection (fetches locally stored data)
  app.pokeList = new app.PokeList()



  ############### app view #######################################################################
  #renders the full list of pokemon items calling PokeView for each one.
  app.AppView = Backbone.View.extend(
    #cache all the relevant view
    el: '#pokeapp'
    initialize: ->
      this.input = this.$('#version')
      app.pokeList.on('add',   this.addOneR, this)
      app.pokeList.on('reset', this.addAll,  this)
      app.pokeList.fetch() #Loads list from local storage

    #header ui events
    events:
      'focus #version':    ->setTimeout('$("#version").select()',50)
      'keypress #version': 'generatePokename'
      'keydown #version':  (e)->filterKeys(e.keyCode,[13,110,190],e.target)
      'click #generate':   ->this.generatePokename()
      'click #sorttable':  ->app.pokeList.sort();this.addAll()
      'click #genmode':    ->setGenMode()
      'click #clear':      'clear'

    #generated a new pokename
    generatePokename: (e)->
      if (e and e.which != 13) then return
      if (!this.input.val().trim()) then return
      gen     = getGenId(this.$('#version').val())
      pokemon = window.pokeNames[gen]
      app.pokeList.create(this.newAttributes(pokemon))
      this.input.val(getNewVers(this.input.val()))

    #ads a new item to top of the table
    addOneR: (pok)->
      if (app.addTimer) then clearTimeout(app.addTimer)
      view = new app.PokeView(model: pok)
      $(view.render().el).addClass('new-item')
      this.$('#pokelist').prepend(view.render().el)
      app.addTimer = setTimeout('resizeTableHead()', 1000)

    #ads a new item to bottom of the table (called by addAll only)
    addOne: (pok)->
      view = new app.PokeView(model: pok)
      this.$('#pokelist').append(view.render().el)

    #adds all models of the collection to this view
    addAll: ->
      this.$('#pokelist').html('')
      app.pokeList.each(this.addOne, this)

    #clear all collection items (also deletes them from local storage)
    clear: ->_.invoke(app.pokeList.toArray(), 'destroy');

    #generated attributes of model
    newAttributes: (data)->
        version:   this.input.val().trim()
        name:      data.name
        nature:    getNature()
        adjective: getAdjective()
  );

  #initialize the app view
  app.appView = new app.AppView()
  
$(->init())