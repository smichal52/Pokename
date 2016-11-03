var init;

init = function() {
  getAllPokenames();
  $(document).tooltip({
    track: true
  });
  $(document).click(function() {
    return $('.ui-tooltip').hide();
  });
  if (!isMobile.any()) {
    ZeroClipboard.setMoviePath('js/ZeroClipboard.swf');
  }
  window.app = {};
  setGenMode();
  app.Pokemon = Backbone.Model.extend({
    defaults: {
      version: '',
      name: '',
      nature: '',
      adjective: ''
    }
  });
  app.PokeView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#item-template').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    initialize: function() {
      this.model.on('change', this.render, this);
      return this.model.on('destroy', this.remove, this);
    },
    events: {
      'click label': 'edit',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close',
      'click .destroy': 'destroy',
      'click .copy': function() {
        return alert('not supported here!');
      },
      'keydown .version': function(e) {
        return filterKeys(e.keyCode, [13, 110, 190], e.target);
      },
      'hover .copy': function(e) {
        return setupClipCopy(e.target);
      }
    },
    edit: function(e) {
      var cell;
      app.editedSomething = false;
      cell = $(e.target).parent('td');
      cell.addClass('editing');
      cell.find('input').focus();
      return cell.find('input').select();
    },
    close: function(e) {
      var cell, field, obj, row, value;
      cell = $(e.target).parent('td');
      row = $(cell).closest('tr').get(0);
      value = cell.find('input').val().trim();
      field = cell.find('input').attr('prop');
      obj = {};
      obj[field] = value;
      if (value) {
        this.model.save(obj);
      }
      cell.removeClass('editing');
      if (app.editedSomething) {
        $(row).addClass('new-item');
      }
      return $(row).find('td:last').text(this.model.get('adjective') + " " + this.model.get('name'));
    },
    updateOnEnter: function(e) {
      if (e.which === 13) {
        return this.close(e);
      } else {
        return app.editedSomething = true;
      }
    },
    destroy: function() {
      this.model.destroy();
      return resizeTableHead();
    }
  });
  app.PokeList = Backbone.Collection.extend({
    model: app.Pokemon,
    localStorage: new Store("backbone-pokemons"),
    comparator: function(pok) {
      return (pok.get("name") + " " + pok.get("adjective")).toLowerCase();
    }
  });
  app.pokeList = new app.PokeList();
  app.AppView = Backbone.View.extend({
    el: '#pokeapp',
    initialize: function() {
      this.input = this.$('#version');
      app.pokeList.on('add', this.addOneR, this);
      app.pokeList.on('reset', this.addAll, this);
      return app.pokeList.fetch();
    },
    events: {
      'focus #version': function() {
        return setTimeout('$("#version").select()', 50);
      },
      'keypress #version': 'generatePokename',
      'keydown #version': function(e) {
        return filterKeys(e.keyCode, [13, 110, 190], e.target);
      },
      'click #generate': function() {
        return this.generatePokename();
      },
      'click #sorttable': function() {
        app.pokeList.sort();
        return this.addAll();
      },
      'click #genmode': function() {
        return setGenMode();
      },
      'click #clear': 'clear'
    },
    generatePokename: function(e) {
      var gen, pokemon;
      if (e && e.which !== 13) {
        return;
      }
      if (!this.input.val().trim()) {
        return;
      }
      gen = getGenId(this.$('#version').val());
      pokemon = window.pokeNames[gen];
      app.pokeList.create(this.newAttributes(pokemon));
      return this.input.val(getNewVers(this.input.val()));
    },
    addOneR: function(pok) {
      var view;
      if (app.addTimer) {
        clearTimeout(app.addTimer);
      }
      view = new app.PokeView({
        model: pok
      });
      $(view.render().el).addClass('new-item');
      this.$('#pokelist').prepend(view.render().el);
      return app.addTimer = setTimeout('resizeTableHead()', 1000);
    },
    addOne: function(pok) {
      var view;
      view = new app.PokeView({
        model: pok
      });
      return this.$('#pokelist').append(view.render().el);
    },
    addAll: function() {
      this.$('#pokelist').html('');
      return app.pokeList.each(this.addOne, this);
    },
    clear: function() {
      return _.invoke(app.pokeList.toArray(), 'destroy');
    },
    newAttributes: function(data) {
      return {
        version: this.input.val().trim(),
        name: data.name,
        nature: getNature(),
        adjective: getAdjective()
      };
    }
  });
  return app.appView = new app.AppView();
};

$(function() {
  return init();
});
