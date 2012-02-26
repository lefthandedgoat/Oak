(function() {
  var unwantedGame, unwantedGameView, unwantedGames, unwantedGamesUrl, unwantedGamesView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  unwantedGamesUrl = "";
  this.unwanted = {
    init: function(urls) {
      unwantedGamesUrl = urls.unwantedGamesUrl;
      return this.view = new unwantedGamesView();
    },
    getUnwantedGames: function() {
      return this.view.refresh();
    }
  };
  unwantedGame = Backbone.Model.extend({
    name: function() {
      return this.get("Name");
    },
    shortName: function() {
      var name;
      name = this.name();
      if (name.length > 21) {
        name = name.substring(0, 20) + "... ";
      }
      return name += " (" + this.console() + ")";
    },
    console: function() {
      return this.get("Console");
    },
    undo: function() {
      return $.post(this.get("UndoNotInterested"), {}, __bind(function() {
        preferred.getPreferredGames();
        return this.change();
      }, this));
    }
  });
  unwantedGames = Backbone.Collection.extend({
    model: unwantedGame,
    url: function() {
      return unwantedGamesUrl;
    }
  });
  unwantedGamesView = Backbone.View.extend({
    el: "#unwantedGames",
    initialize: function() {
      _.bindAll(this, 'render');
      this.unwantedGames = new unwantedGames();
      this.unwantedGames.bind('reset', this.render);
      return this.unwantedGames.fetch();
    },
    refresh: function() {
      return this.unwantedGames.fetch();
    },
    render: function() {
      $(this.el).empty();
      this.unwantedGames.each(__bind(function(game) {
        return this.addGame(game);
      }, this));
      return $(this.el).append($("<div />").css({
        clear: "both"
      }));
    },
    addGame: function(game) {
      var view;
      view = new unwantedGameView({
        model: game
      });
      view.render();
      return $(this.el).append(view.el);
    }
  });
  unwantedGameView = Backbone.View.extend({
    className: 'gameBoxSmall',
    initialize: function() {
      _.bindAll(this, "render", "apply");
      return this.model.bind('change', this.apply);
    },
    apply: function() {
      return $(this.el).fadeOut();
    },
    events: {
      "click .cancel": "undo"
    },
    undo: function() {
      return this.model.undo();
    },
    render: function() {
      var game;
      game = $.tmpl(this.gameTemplate, {
        gameName: this.model.shortName()
      });
      $(this.el).html(game);
      toolTip.init(game.find(".cancel"), "UndoUnwantedGame", "Want to give the game another shot?<br/>Remove it from qurantine.", "You get the idea...<br/>Remove it from qurantine.", function() {
        return game.offset().left + 100;
      }, function() {
        return game.offset().top + -25;
      });
      return this;
    },
    gameTemplate: '\
    <div class="menubar">\
      <a href="javascript:;" \
         style="text-decoration: none; color: black; float: right; padding-left: 15px" \
         class="cancel">&nbsp;</a>\
      <div style="clear: both">&nbsp;</div>\
    </div>\
    <div style="font-size: 12px; height: 70px; padding-bottom: 3px">\
      ${gameName}<br/>\
    </div>\
    '
  });
}).call(this);
