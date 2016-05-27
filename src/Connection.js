var EventEmitter = require('events').EventEmitter;
var Util = require('util');

var Connection = function (source, dest, label) {
  this.label = label||null;
  this.value = 0;

  this.source = source||null;
  this.dest = dest||null;
}

Util.inherits(Connection, EventEmitter);

Connection.prototype.getValue = function () {
  return this.value;
};

Connection.prototype.setValue = function (value) {
  this.value = value||this.value;

  this.emit('update:value');

  return this;
};

Connection.prototype.incrementValue = function () {
  this.value++;

  this.emit('update:value');
  this.emit('increment');

  return this.value;
};

module.exports = Connection;
