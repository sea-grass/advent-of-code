const { debug } = require('./debug')

function DiGraph() {
    this.vertexes = new Map();
    this.edges = new Map();
    this.hasPath = new Set();
}

const prototype = DiGraph.prototype = {};

prototype.addVertex = function (vertex) {
    if (!this.vertexes.has(vertex.name)) {
        debug('adding vertex', vertex);
        
        this.vertexes.set(vertex.name, vertex);
        this.edges.set(vertex.name, new Set());
    }
};

prototype.addEdge = function (edge) {
    this.addWeightedEdge({
        weight: 1,
        ...edge
    });
};

prototype.addWeightedEdge = function (edge) {
    if (!this.vertexes.has(edge.source)) {
        this.addVertex({ name: edge.source });
    }

    if (!this.vertexes.has(edge.dest)) {
        this.addVertex({ name: edge.dest });
    }

    if (this.edges.has(edge.source)) {
        const nodeEdges = this.edges.get(edge.source);
        nodeEdges.add(edge);
    }
};

prototype.pathExists = function (sourceVertexName, destVertexName) {
    if (this.hasPath.has([sourceVertexName, destVertexName])) {
        return true;
    }

    const outboundEdges = this.edges.get(sourceVertexName);
    debug('node and its outbound edges', sourceVertexName, outboundEdges);

    if (outboundEdges.size === 0) {
        return false;
    }

    const outboundEdgeNames = Array.from(outboundEdges).map(edge => edge.dest);

    if (outboundEdgeNames.indexOf(destVertexName) > -1) {
        this.hasPath.add([sourceVertexName, destVertexName]);
        return true;
    }

    for (const edge of outboundEdges) {
        debug('check for path', edge.dest, destVertexName);
        if (this.pathExists(edge.dest, destVertexName)) {
            return true;
        }
    }

    return false;
};

prototype.getVertexValue = function (vertexName) {
    const vertex = this.vertexes.get(vertexName);

    const edges = this.edges.get(vertexName);
    debug('edges', vertexName, edges);

    const edgesValue = Array.from(edges).reduce((totalValue, edge) => {
        const childEdgeWeight = this.getVertexValue(edge.dest);
        debug('edge childEdgeWeight', edge, childEdgeWeight);

        return totalValue + edge.weight + edge.weight * childEdgeWeight;
    }, 0)

    debug('returning ', edgesValue, 'for ', vertexName, vertex)
    return edgesValue;
}

module.exports = {
    DiGraph
};