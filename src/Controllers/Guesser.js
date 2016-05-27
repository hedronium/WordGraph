var Guesser = function (app) {
  this.app = app||null;
};

Guesser.prototype.recurse = function (out, nodes) {
  var nodes_list = nodes.slice(0);
  var next_words = [];

  var key = 't0';

  if (nodes_list[nodes_list.length - 1].value === '#[end-query]') {
    out.push(nodes_list);
    return;
  }

  for (var key in nodes_list[nodes_list.length - 1].connection_table.t0) {
    var word = {
      node: null,
      weight: null
    };

    var connection = nodes_list[nodes_list.length - 1].connection_table.t0[key];
    word.node = connection.dest;
    word.weight = connection.value/connection.source.sumConnections();

    for (var j = 1; j < 4 && j < nodes_list.length; j++) {
      var connections = nodes_list[nodes_list.length - j - 1].connection_hash['t'+j];

      if (word.node.value in connections) {
        var connection = connections[word.node.value];
        word.weight += (connection.value/connection.source.sumConnections())/Math.pow(j, 1);
      } else {
        word.weight = null;
        break;
      }
    }

    if (word.weight !== null) {
      next_words.push(word);
    }
  }

  next_words.sort(function (word_a, word_b) {
    return word_a - word_b;
  });

  for (var n = 0, x = 0; n < next_words.length && x < 10; n++, x++) {
    var array = nodes_list.slice(0);

    array.push(next_words[n].node);

    this.recurse(out, array);
  }
};

Guesser.prototype.guess = function (query) {
  var terms = query.text.split(' ');
  var nodes_list = [];

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i];
    var node = this.app.node_graph[term];
    nodes_list.push(node);
  }

  var out = [];
  this.recurse(out, nodes_list);

  for (var i = 0; i < out.length; i++) {
    var suggestion = out[i];
    var str = '';

    for (var j = 0; j < suggestion.length; j++) {
      var node = suggestion[j];

      if (node.label !== 'misc') {
        str += ' '+node.value;
      }
    }

    console.log(str);
  }
};

module.exports = Guesser;
