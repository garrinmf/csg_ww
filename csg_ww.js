importScripts('csg.js');

onmessage = function(event) {
    var rawData = event.data,
    polyhedra = [],
    resultPolyhedron = [],
    polyhedron, i; 

    if (rawData.objects.length < 1) 
    {
        postMessage({id: rawData.id, message: "No polyhedra"});   
        return;
    }

    for (i = 0; i < rawData.objects.length; i++) 
    {
        polyhedron = rawData.objects[i];
        polyhedra.push(knownMethods[polyhedron.type](polyhedron.options));

        if (polyhedron.rotate) 
        {
            polyhedra[i] = rotate(polyhedra[i], polyhedron.rotate);
        }
    }

    if (polyhedra.length < 2) 
    {
        postMessage({id: rawData.id, message: "Not enough polyhedra to intersect"});   
        postMessage({id: rawData.id, resultSet: polyhedra[0]});   
        return;
    }
    
    resultPolyhedron = polyhedra[0].union(polyhedra[1]);

    postMessage({id: rawData.id, message: "Union on first 2 polyhedra"});   

    for (i = 2; i < polyhedra.length; i ++) 
    {
        resultPolyhedron = resultPolyhedron.union(polyhedra[i]);
        postMessage({id: rawData.id, message: "Union on " + i});   
    }
    
    postMessage({id: rawData.id, resultSet: resultPolyhedron});
};

var rotate = function(polyhedra, angle){
    var polygons = polyhedra.toPolygons();

    for(var iPoly = 0; iPoly < polygons.length ; iPoly++){
        for(var iVertice = 0 ; iVertice < polygons[iPoly].vertices.length ; iVertice++){
            var pos = polygons[iPoly].vertices[iVertice].pos;

            polygons[iPoly].vertices[iVertice].pos.y = pos.y * Math.cos(angle) - pos.z * Math.sin(angle);
            polygons[iPoly].vertices[iVertice].pos.z = pos.y * Math.sin(angle) + pos.z * Math.cos(angle);
        }
    }

    return CSG.fromPolygons(polygons);
};

var knownMethods = {
    Pyramid: function(options) {
        options = options || {};
        var c = new CSG.Vector(options.center || [0, 0, 0]);
        var r = !options.radius ? [1, 1, 1] : options.radius.length ? options.radius : [options.radius, options.radius, options.radius];

        var vectors = [
            new CSG.Vector(c.x + r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x + r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x, c.y, c.z + r[2])];

            var normals = [
                new CSG.Vector(1, 0, 1), 
                new CSG.Vector(-1, 0, 1), 
                new CSG.Vector(0, 1, 1), 
                new CSG.Vector(0, -1, 1), 
                new CSG.Vector(0, 0, -1)];

                for (var n = 0; n < normals.length; n++) {
                    normals[n] = normals[n].unit();
                }

                return CSG.fromPolygons([
                    new CSG.Polygon([new CSG.Vertex(vectors[0], normals[0]), new CSG.Vertex(vectors[4], normals[0]), new CSG.Vertex(vectors[1], normals[0])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[1], normals[3]), new CSG.Vertex(vectors[4], normals[3]), new CSG.Vertex(vectors[2], normals[3])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[2], normals[1]), new CSG.Vertex(vectors[4], normals[1]), new CSG.Vertex(vectors[3], normals[1])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[3], normals[2]), new CSG.Vertex(vectors[4], normals[2]), new CSG.Vertex(vectors[0], normals[2])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[0], normals[4]), new CSG.Vertex(vectors[1], normals[4]), new CSG.Vertex(vectors[2], normals[4]), new CSG.Vertex(vectors[3], normals[4])])]);
    },
    Gable: function(options) {
        options = options || {};
        var c = new CSG.Vector(options.center || [0, 0, 0]);
        var r = !options.radius ? [1, 1, 1] : options.radius.length ? options.radius : [options.radius, options.radius, options.radius];

        var vectors = [
            new CSG.Vector(c.x + r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x + r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x + r[0], c.y, c.z + r[2]),
            new CSG.Vector(c.x - r[0], c.y, c.z + r[2])];

            var normals = [
                new CSG.Vector( 1, -1, 0), 
                new CSG.Vector(-1, -1, 0), 
                new CSG.Vector(-1,  1, 0), 
                new CSG.Vector( 1,  1, 0), 
                new CSG.Vector( 1,  0, 1),
                new CSG.Vector(-1,  0, 1)];

                for (var n = 0; n < normals.length; n++) {
                    normals[n] = normals[n].unit();
                }

                return CSG.fromPolygons([
                    new CSG.Polygon([new CSG.Vertex(vectors[0], normals[0]), new CSG.Vertex(vectors[4], normals[0]), new CSG.Vertex(vectors[1], normals[0])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[1], normals[3]), new CSG.Vertex(vectors[4], normals[3]), new CSG.Vertex(vectors[5], normals[3]), new CSG.Vertex(vectors[2], normals[3])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[2], normals[1]), new CSG.Vertex(vectors[5], normals[1]), new CSG.Vertex(vectors[3], normals[1])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[3], normals[2]), new CSG.Vertex(vectors[5], normals[5]), new CSG.Vertex(vectors[4], normals[2]), new CSG.Vertex(vectors[0], normals[2])]), 
                    new CSG.Polygon([new CSG.Vertex(vectors[0], normals[4]), new CSG.Vertex(vectors[1], normals[4]), new CSG.Vertex(vectors[2], normals[4]), new CSG.Vertex(vectors[3], normals[4])])]);
    },
    Plane: function(options) {
        options = options || {};
        var c = new CSG.Vector(options.center || [0, 0, 0]);
        var r = !options.radius ? [1, 1, 1] : options.radius.length ? options.radius : [options.radius, options.radius, options.radius];

        var vectors = [
            new CSG.Vector(c.x + r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x + r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y - r[1], c.z), 
            new CSG.Vector(c.x - r[0], c.y + r[1], c.z), 
            new CSG.Vector(c.x, c.y, c.z + r[2])];

            var normals = [
                new CSG.Vector(1, 0, 1), 
                new CSG.Vector(-1, 0, 1), 
                new CSG.Vector(0, 1, 1), 
                new CSG.Vector(0, -1, 1), 
                new CSG.Vector(0, 0, -1)];

                for (var n = 0; n < normals.length; n++) {
                    normals[n] = normals[n].unit();
                }

                return CSG.fromPolygons([
                    new CSG.Polygon([new CSG.Vertex(vectors[0], normals[0]), new CSG.Vertex(vectors[4], normals[0]), new CSG.Vertex(vectors[1], normals[0])])]);
    }
};
