var Node = require('../Node');

var Learner = function (app) {
  this.app = app||null;
};

Learner.prototype.debug = function (node) {
  // console.log(node.connection_table.t0[0].value, ' ->');
};

Learner.prototype.sorter = function (connection_a, connection_b) {
  if (connection_a.value === connection_b.value) {
    if (connection_a.label > connection_b.label) {
      return 1;
    } else if (connection_a.label < connection_b.label) {
      return -1;
    } else {
      return 0;
    }
  } else if (connection_a.value > connection_b.value) {
    return 1;
  } else {
    return -1;
  }
};

Learner.prototype.index = function () {
  for (var key in this.app.nodes_list) {
    var node = this.app.nodes_list[key];

    node.connection_list.sort(this.sorter);

    for (var lab_key in node.connection_table) {
      node.connection_table[lab_key].sort(this.sorter);
    }
  }
};

Learner.prototype.learn = function (data) {
  var terms = data.text.toLowerCase().split(" ");
  var nodes_list  = [];
  var nodes = {};

  for (var index in terms) {
    var term = terms[index];

    if (term in this.app.node_graph) {
      nodes[term] = this.app.node_graph[term];
    } else {
      var node = new Node(term, 'word');
      nodes[term] = node;

      this.app.node_list.push(node);
      this.app.node_graph[term] = node;
    }

    nodes_list.push(nodes[term]);
  }

  var j = 0;
  var x= 0;

  for (var i = 0; i < (nodes_list.length - 1); i++) {
    var node_a = nodes_list[i];

    for (j = i+1, x = 0; j < nodes_list.length && x < 4; j++, x++) {
      var node_b = nodes_list[j];
      var label = 't'+x;
      var reverse_label = 'r'+label;

      var connection_a = node_a.connect(node_b, label);
      connection_a.incrementValue();

      var connection_b = node_b.connect(node_a, reverse_label);
      connection_b.incrementValue();
    }

    if (j === nodes_list.length && x < 4) {
      var connection_e = node_a.connect(this.app.end_node, 't'+x);
      connection_e.incrementValue();
    }

    if (i < 4) {
      var connection_s = this.app.start_node.connect(node_a, 't'+i);
      connection_s.incrementValue();

      var connection_sr = node_a.connect(this.app.start_node, 'rt'+i);
      connection_sr.incrementValue();
    }
  }

  this.app.start_node.connect(nodes_list[0], 't0');

  // nodes_list[0].connect(this.app.start_node, 'misc');
  nodes_list[nodes_list.length - 1].connect(this.app.end_node, 't0');

  // for (var key in this.app.node_list) {
    // console.log(this.app.node_list[key].connection_list[0]);
  // }
  // console.log(JSON.stringify(this.app.start_node));
};

module.exports = Learner;
