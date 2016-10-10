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
    },

    getCenter : function(vectors) {
        var center = new THREE.Vector3(0, 0, 0);
        for(var i = 0; i < vectors.length; i++) {
            center.x += vectors[i].x;
            center.y += vectors[i].y;
            center.z += vectors[i].z;
        }

        center.x /= vectors.length;
        center.y /= vectors.length;
        center.z /= vectors.length;

        return center;
    },

    deHomogenize2D : function(vectors) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];
        debugger;
        for(var i = 0; i < vectors.length; i++) {
            if(vectors[i].z != 1 && vectors[i].z != 0){
                vectors[i].x /= vectors[i].z
                vectors[i].y /= vectors[i].z
                vectors[i].z = 1;
            }
        }

        if(vectors_type == 'array')
            return vectors;
        return vectors[0];
    }
};

var GeomUtils = {
    makeQuad : function(v1, v2) {
        var triangleGeometry = new THREE.Geometry();
        
        var v3 = new THREE.Vector3(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), v1.z);
        var v4 = new THREE.Vector3(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), v1.z);

        triangleGeometry.vertices.push(v1);
        triangleGeometry.vertices.push(v2);
        triangleGeometry.vertices.push(v3);
        triangleGeometry.vertices.push(v4);
        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        triangleGeometry.faces.push(new THREE.Face3(2, 3, 0));

        return triangleGeometry;
    }

}

var GeneralUtils = {
    colorMaterial : function(objs, color) {
        var objs_type = objs instanceof Array ? 'array' : 'single';
        objs = objs_type == 'array' ? objs : [objs];
        
        for(var i = 0; i < objs.length; i++)
            objs[i].material.color = new THREE.Color(color);
       
        if(objs_type == 'array')
            return objs;
        return objs[0];
    },

    printPoints : function(points, color) {
        for(var i = 0; i<points.length; i++) {
            var r_point = PointUtils.newThreePoint(points[i]);
            GeneralUtils.colorMaterial(r_point, color);
            showcase.addObject(r_point);
        }
    },

    clone : function(data) {
        return JSON.parse(JSON.stringify(data));
    }
}

var MatrixUtils = {
    AXIS_X : 'x',
    AXIS_Y : 'y',
    AXIS_Z : 'z',

    project2: function(u, v) {
        var mat_u = new THREE.Matrix3().set(
            1,           0, 0,
            0,           1, 0,
            -1/u.x, -1/u.y, 1
        );

        if(typeof v == 'undefined')
            return mat_u;

        var mat_v = new THREE.Matrix3().set(
            1,           0, 0,
            0,           1, 0,
            -1/v.x, -1/v.y, 1
        );

        var new_mat = MatrixUtils.multiply3x3(mat_u, mat_v);
        return new_mat;
    },

    multiply3x3 : function(mat1, mat2) {
        var new_mat = new THREE.Matrix3();
        var ea = mat1.elements;
        var eb = mat2.elements;
        // new_mat.set(
        //     ea[0] * eb[0] + ea[0] * eb[3] + ea[0] * eb[6],
        //     ea[1] * eb[0] + ea[1] * eb[3] + ea[1] * eb[6],
        //     ea[2] * eb[0] + ea[2] * eb[3] + ea[2] * eb[6],
        //     ea[3] * eb[1] + ea[3] * eb[4] + ea[3] * eb[7],
        //     ea[4] * eb[1] + ea[4] * eb[4] + ea[4] * eb[7],
        //     ea[5] * eb[1] + ea[5] * eb[4] + ea[5] * eb[7],
        //     ea[6] * eb[2] + ea[6] * eb[5] + ea[6] * eb[8],
        //     ea[7] * eb[2] + ea[7] * eb[5] + ea[7] * eb[8],
        //     ea[8] * eb[2] + ea[8] * eb[5] + ea[8] * eb[8]
        //     );
        new_mat.set(
           ea[0]*eb[0] + ea[0]*eb[1] + ea[0]*eb[2],
           ea[3]*eb[3] + ea[3]*eb[4] + ea[3]*eb[5],
           ea[6]*eb[6] + ea[6]*eb[7] + ea[6]*eb[8],

           ea[1]*eb[0] + ea[1]*eb[1] + ea[1]*eb[2],
           ea[4]*eb[3] + ea[4]*eb[4] + ea[4]*eb[5],
           ea[7]*eb[6] + ea[7]*eb[7] + ea[7]*eb[8],

           ea[2]*eb[0] + ea[2]*eb[1] + ea[2]*eb[2],
           ea[5]*eb[3] + ea[5]*eb[4] + ea[5]*eb[5],
           ea[8]*eb[6] + ea[8]*eb[7] + ea[8]*eb[8]
        );

        return new_mat;
    },

    rotateAxis: function(axis, angle) {
        var mat;

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

       return mat
    },

    translate2d : function(vector) {
        return new THREE.Matrix3().set(
            1, 0, vector.x,
            0, 1, vector.y,
            0, 0, 1
        );
    },

    rotatePoint2d : function(point, axis, rad) {
        var T = MatrixUtils.translate2d(new THREE.Vector3(-point.x, -point.y, -point.z));
        
        var T_1 = MatrixUtils.getInverseMatrix3(T);
        var R = MatrixUtils.rotateAxis(axis, rad);

        var new_mat = MatrixUtils.multiply3x3(T_1, MatrixUtils.multiply3x3(R, T));
        return new_mat;
    },

    getInverseMatrix3 : function(mat3) {
        debugger;
        var inv = (new THREE.Matrix3()).getInverse(mat3).multiplyScalar(mat3.determinant());
        return inv;
    },



    mat3ToMat4 : function(mat3) {
        return new THREE.Matrix4().set(
            mat3[0], mat3[3], mat3[6], 0,
            mat3[1], mat3[4], mat3[7], 0,
            mat3[2], mat3[5], mat3[8], 0,
                  0,       0,       0, 1
        );
    },

    applyMatrix : function(vectors, mat) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];

        for(var i = 0; i < vectors.length; i++)
            vectors[i].applyMatrix3(mat);

         if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    }

}