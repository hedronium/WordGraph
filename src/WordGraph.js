var Server = require('ws').Server;
var Actions = require('./Actions');
var Node = require('./Node');

var WordGraph = function () {
  this.connections = [];
  this.server = null;

  this.node_list = [];
  this.node_graph = {};

  this.controllers = {};
  this.controllers.guesser = new (require('./Controllers/Guesser'))(this);
  this.controllers.learner = new (require('./Controllers/Learner'))(this);

  this.start_node = new Node('#[start-query]', 'misc');
  this.end_node = new Node('#[end-query]', 'misc');
}

WordGraph.prototype.registerRoutes = function (connection) {
  connection.on('message', function (message) {
    var data = JSON.parse(message);

    switch (data.action) {
      case Actions.typing:
        this.controllers.guesser.guess(connection, data);
        break;

      case Actions.searched:
        this.controllers.learner.learn(data);
        break;
    }
  });
};

WordGraph.prototype.registerHandler = function () {
  this.server.on('connection', function (connection) {
    this.connections.push(connection);
    this.registerRoutes(connection);
  }.bind(this));
};

WordGraph.prototype.start = function (port) {
  port = port||8090;

  this.server = new Server({
    port: port
  });

  this.registerHandler();

  // console.log(this.controllers);

  this.controllers.learner.learn({ text: 'Why is the sky blue' });
  this.controllers.learner.learn({ text: 'Why do clouds float' });
  this.controllers.learner.learn({ text: 'Why are the oceans blue' });
  this.controllers.learner.learn({ text: 'Why are cats so cute' });
  this.controllers.learner.learn({ text: 'How does a magnetron work' });
  this.controllers.learner.learn({ text: 'How does a plant breathe' });
  this.controllers.learner.learn({ text: 'How to make a electromagnet' });
  this.controllers.learner.learn({ text: 'How many continents are there' });
  this.controllers.learner.learn({ text: 'How many oceans are there' });
  this.controllers.learner.learn({ text: 'is the sky really blue' });
  this.controllers.learner.learn({ text: 'is ebay owned by google' });
  this.controllers.learner.learn({ text: 'does google own ebay' });
  this.controllers.learner.learn({ text: 'boston dynamics' });
  this.controllers.learner.learn({ text: 'how to change facebook language' });
  this.controllers.learner.learn({ text: 'are the oceans really blue' });
  this.controllers.learner.learn({ text: 'how deep are the oceans' });

  this.controllers.learner.index();

  this.controllers.guesser.guess({ text: 'why' });

  // this.controllers.learner.debug(this.start_node);

  return this.server;
};

module.exports = WordGraph;
