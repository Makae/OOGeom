var PointUtils = { 
    threePointSet: function(numX, minX, maxX, 
                           numY, minY, maxY) {
        var set = [];
        var x, y;
        var x_width = maxX - minX;
        var y_width = maxY - minY;
        var x_section_width = x_width / numX;
        var y_section_width = y_width / numY;

        for(var c_x = 0; c_x < numX; c_x++) {
            for(var c_y = 0; c_y < numY; c_y++) {
                x = minX + c_x * x_section_width;
                y = minY + c_y * y_section_width;
                
                set.push(new THREE.Vector3(x, y, 0));
            }
        }

        return set;
    },


    newThreePoint: function(vector) {
        var z = z && typeof z != 'undefined' ? z : 0;
        var point = new THREE.Mesh( new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color:0xff0000}) );
   
        point.position.x = vector.x;
        point.position.y = vector.y;
        point.position.z = vector.z;

        return point;
    }
};

var GeneralUtils = {
    colorMaterial : function(objs, color) {
        var objs_type = objs instanceof Array ? 'array' : 'single';
        objs = objs_type == 'array' ? objs : [objs];
        
        for(var i = 0; i < objs.length; i++)
            objs[i].material.color = new THREE.Color(color);
       
        if(objs_type == 'array')
            return objs;
        return objs[0];
    }
}

var MatrixUtils = {
    AXIS_X : 'x',
    AXIS_Y : 'y',
    AXIS_Z : 'z',
    rotateAxis: function(axis, vectors, angle) {
        var mat;
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];

        switch(axis) {
            case MatrixUtils.AXIS_X:
                throw new Exception("Not yet implemented");
                mat = new THREE.Matrix3().set(
                    math.cos(angle), -math.sin(angle),  0,
                    math.sin(angle),  math.cos(angle),  0,
                    0,                0,                1
                );
            break;
            case MatrixUtils.AXIS_Y:
                throw new Exception("Not yet implemented");
                mat = new THREE.Matrix3().set(
                    math.cos(angle), -math.sin(angle),  0,
                    math.sin(angle),  math.cos(angle),  0,
                    0,                0,                1
                );
            break;

            case MatrixUtils.AXIS_Z:
                mat = new THREE.Matrix3().set(
                    math.cos(angle), -math.sin(angle),  0,
                    math.sin(angle),  math.cos(angle),  0,
                    0,                0,                1
                );
            break;
        }
        
        var vectors = MatrixUtils.applyMatrix(vectors, mat);

        if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    },

    applyMatrix : function(vectors, mat) {
        for(var i = 0; i < vectors.length; i++)
            vectors[i].applyMatrix3(mat);

        return vectors;
    }

}