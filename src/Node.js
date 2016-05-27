var EventEmitter = require('events').EventEmitter;
var Util = require('util');
var Connection = require('./Connection');

var Node = function (value, label) {
  this.label = label||null;
  this.value = value||null;

  this.connection_list = [];
  this.connection_table = {};
  this.connection_hash = {};

  this.sum_con = null;
};

Util.inherits(Node, EventEmitter);

Node.prototype.connect = function (to, label) {
  if (!(label in this.connection_table)) {
    this.connection_table[label] = [];
    this.connection_hash[label] = {};
  }

  if (!(to.value in this.connection_hash[label])) {
    var connection = new Connection(this, to, label);
    this.connection_list.push(connection);
    this.connection_hash[label][to.value] = connection;
    this.connection_table[label].push(connection);

    connection.on('increment', function () {
      if (this.sum_con !== null) {
        this.sum_con++;
      }
    }.bind(this));

    return connection;
  } else {
    return this.connection_hash[label][to.value];
  }
}

Node.prototype.sumConnections = function () {
  if (this.sum_con === null) {
    for (var key in this.connection_list) {
      this.sum_con += this.connection_list[key].value;
    }
  }

  return this.sum_con;
};

module.exports = Node;
