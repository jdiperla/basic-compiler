var visualization = {};

visualization.SyntaxVisualizer = function () {
}
visualization.SyntaxVisualizer.prototype.getVisNode = function (tree, index, level) {
    function getColorForSymbol(symbol) {
        if (symbol instanceof grammar.Terminal) {
            return '#80bfff';
        }
        if (symbol instanceof grammar.NonTerminal) {
            return '#9fdf9f';
        }
        return '#9292b9';
    }
    var stringTree = "UNDEFINED";
    return {
        id: tree.id,
        label: '#' + tree.id + '[' + index + '] ' + tree.toString(),
        color: getColorForSymbol(tree.symbol),
        level: level
    };
}
visualization.SyntaxVisualizer.prototype.getVisNodes = function (tree, index, level) {
    var that = this;

    var nodes = [];
    // add nodes from children
    if (tree.hasChildren()) {
        var children = tree.getChildren();
        for (var i = 0; i < children.length; i++) {
            nodes = nodes.concat(that.getVisNodes(children[i], i, level + 1));         
        }
    }
    // add self
    nodes.push(that.getVisNode(tree, index, level));
    return nodes;
}
visualization.SyntaxVisualizer.prototype.getVisEdges = function (tree) {
    var that = this;

    var edges = [];
    // add edges from children
    if (tree.hasChildren()) {
        var children = tree.getChildren();
        children.forEach(function (child) {
            edges = edges.concat(that.getVisEdges(child));
        });
    }
    // add edge to parent
    var parent = tree.getParent();
    if (parent) {
        edges.push({ from: tree.getParent().id, to: tree.id });
    }
    return edges;
}
visualization.SyntaxVisualizer.prototype.visualize = function (htmlHostId, tree) {

    var that = this;
    var visNodes = new vis.DataSet(that.getVisNodes(tree, 0, 0));
    var visEdges = new vis.DataSet(that.getVisEdges(tree));
    
    //parse to vis network
    var data = {
        nodes: visNodes,
        edges: visEdges
    };
    var options = {
        edges: { arrows: 'to' },
        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: true,
                levelSeparation: 150,
                nodeSpacing: 1000,
                treeSpacing: 200,
                blockShifting: true,
                parentCentralization: true,
                direction: 'UD',        // UD, DU, LR, RL
                sortMethod: 'hubsize'   // hubsize, directed
            }
        },
        physics: {
            hierarchicalRepulsion: {
                centralGravity: 0.0,
                springLength: 100,
                springConstant: 0.01,
                nodeDistance: 300,
                damping: 0.09
            }
        }
    };

    // draw network
    var network = null;
    $(document).ready(function () {
        var container = document.getElementById(htmlHostId);
        network = new vis.Network(container, data, options);
    });

    return network;
}