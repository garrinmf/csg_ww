function wireEventHandlers()
{
    $(function () {
        $('#nogables').click(function () {
            IntersectGables({id: "nogables", type: "union", objects:[]});
        });   
    });

    $(function () {
        $('#onegable').click(function () {
            IntersectGables({id: "onegable", type: "union", objects:[
                {type: "Gable", options: {center: [0,0.5,0]}}
            ]});
        });   
    });

    $(function () {
        $('#fourgables').click(function () {
            IntersectGables({id: "fourgables", type: "union", objects:[
                {type: "Gable", options: {}},
                {type: "Gable", options: {center: [0,0.5,0]}},
                {type: "Gable", options: {center: [0,1,0]}},
                {type: "Gable", options: {center: [0,1.5,0]}},
            ]});
        });   
    });

    $(function () {
        $('#thirtytwogables').click(function () {
            IntersectGables({id: "thirtytwogables", type: "union", objects: MakeObjects(32, false, true) });
        });   
    });

    $(function () {
        $('#sixtyfourgables').click(function () {
            IntersectGables({id: "sixtyfourgables", type: "union", objects: MakeObjects(64, true, true) });
        });   
    });

    $(function () {
        $('#onetwentyeightgables').click(function () {
            IntersectGables({id: "onetwentyeightgables", type: "union", objects: MakeObjects(128, true, true) });
        });   
    });

    $(function () {
        $('#nogables_ww').click(function () {
            myWorker.postMessage({id: "nogables_ww", type: "union", objects:[]});
        });   
    });

    $(function () {
        $('#onegable_ww').click(function () {
            myWorker.postMessage({id: "onegable_ww", type: "union", objects:[
                {type: "Gable", options: {center: [0,0.5,0]}}
            ]});
        });   
    });

    $(function () {
        $('#fourgables_ww').click(function () {
            myWorker.postMessage({id: "fourgables_ww", type: "union", objects:[
                {type: "Gable", options: {}},
                {type: "Gable", options: {center: [0,0.5,0]}},
                {type: "Gable", options: {center: [0,1,0]}},
                {type: "Gable", options: {center: [0,1.5,0]}},
            ]});
        });   
    });

    $(function () {
        $('#thirtytwogables_ww').click(function () {
            myWorker.postMessage({id: "thirtytwogables_ww", type: "union", objects: MakeObjects(32, false, true) });
        });   
    });

    $(function () {
        $('#sixtyfourgables_ww').click(function () {
            myWorker.postMessage({id: "sixtyfourgables_ww", type: "union", objects: MakeObjects(64, true, true) });
        });   
    });

    $(function () {
        $('#onetwentyeightgables_ww').click(function () {
            myWorker.postMessage({id: "onetwentyeightgables_ww", type: "union", objects: MakeObjects(128, true, true) });
        });   
    });
}
var IntersectGables = function(rawData) {
    var polyhedra = [],
    resultPolyhedron = [],
    polyhedron, i, viewer; 

    if (rawData.objects.length < 1) 
    {
        $("#" + rawData.id + "_message").append("No Polyhedra<br />");
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
        $("#" + rawData.id + "_message").append("Not enough Polyhedra to intersect<br />");
        viewer = new Viewer(polyhedra[0], 300, 300, 7);
        $('#'+rawData.id + "_viewer").append(viewer.gl.canvas);
        return;
    }
    
    resultPolyhedron = polyhedra[0].union(polyhedra[1]);

    $("#" + rawData.id + "_message").append("Union on first two polyhedra<br />");

    for (i = 2; i < polyhedra.length; i ++) 
    {
        resultPolyhedron = resultPolyhedron.union(polyhedra[i]);
        $("#" + rawData.id + "_message").append("Union on " + i + "<br />");
    }
    
    viewer = new Viewer(resultPolyhedron, 300, 300, 7);
    $('#'+rawData.id + "_viewer").append(viewer.gl.canvas);
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


function MakeObjects(count, doX, doY, doZ) {
    var objects = [],
    x = 0,
    y = 0, 
    z = 0;
    for(var i = 0; i < count; i++)
    {
        objects.push(
            {
            type: "Gable", 
            options:{
                center: [x,y,z]
            }
        });

        if (doX) 
            {
                x += 0.5;
            }

            if (doY) 
                {
                    y += 0.5;
                }

                if (doZ) 
                    {
                        z += 0.5;    
                    }
    }

    return objects;
}
