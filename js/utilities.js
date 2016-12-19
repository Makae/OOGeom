var PointUtils = { 
    getDefaultPointSet : function() {
        return PointUtils.threePointSet(
        3, 20, 40, 
        3, 20, 40
        );
    },

    getDefaultPointSet3D : function() {
        return PointUtils.three3dPointSet(
        3, 20, 40, 
        3, 20, 40,
        3, 20, 40
        );
    },

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
                
                set.push(new THREE.Vector3(x, y, 1));
            }
        }

        return set;
    },

    three3dPointSet: function(numX, minX, maxX, 
                              numY, minY, maxY,
                              numZ, minZ, maxZ) {
        var set = [];
        var x, y, z;
        var x_width = maxX - minX;
        var y_width = maxY - minY;
        var z_width = maxZ - minZ;
        var x_section_width = x_width / numX;
        var y_section_width = y_width / numY;
        var z_section_width = z_width / numZ;

        for(var c_x = 0; c_x < numX; c_x++) {
            for(var c_y = 0; c_y < numY; c_y++) {
                for(var c_z = 0; c_z < numZ; c_z++) {
                    x = minX + c_x * x_section_width;
                    y = minY + c_y * y_section_width;
                    z = minZ + c_z * z_section_width;
                    
                    set.push(new THREE.Vector3(x, y, z));
                }
            }
        }

        return set;
    },

    newThreePoint: function(vector) {
        var z = z && typeof z != 'undefined' ? z : 1;
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
    },
    clone : function(data) {
        return JSON.parse(JSON.stringify(data));
    }
};

var PrintUtils = {
    context : null,
    setContext : function(ctxt) {
        this.context = ctxt;
    },

    printPoints : function(points, color) {
        for(var i = 0; i < points.length; i++) {
            var r_point = PointUtils.newThreePoint(points[i]);
            GeneralUtils.colorMaterial(r_point, color);
            this.context.addObject(r_point);
        }
    },

    printStraightOriginLine : function(_line, color) {
        var material = new THREE.LineBasicMaterial({
            color: color
        });

        var line = _line.normalize();

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(-line.x * 10000, -line.y * 10000, -line.z * 10000),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(line.x * 10000, line.y * 10000, line.z * 10000)
        );
        this.context.addObject(new THREE.Line(geometry, material));
    },

    printStraightLine : function(inclination, offset, color) {
        var material = new THREE.LineBasicMaterial({
            color: color
        });

        var inclination = inclination.normalize();

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(0 - inclination.x * 10000, offset.y - inclination.y * 10000, offset.z - inclination.z * 10000),
            new THREE.Vector3(0, offset.y, offset.z),
            new THREE.Vector3(0 + inclination.x * 10000, offset.y + inclination.y * 10000, offset.z + inclination.z * 10000)
        );
        this.context.addObject(new THREE.Line(geometry, material));
    }
}

var VectorUtils = {
    isLeftOf : function(v1, v2) {
        var d = VectorUtils.perp3d(v1).dot(v2);
        if(d == 0)
            return 0;
        return (d < 0 ? 1 : -1)
    },

    perp3d : function(v) {
         return  v.z < v.x  ? new THREE.Vector3(v.y, -v.x, 0) : new THREE.Vector3(0, -v.z, v.y);
    }
};

var MatrixUtils = {
    AXIS_X : 'x',
    AXIS_Y : 'y',
    AXIS_Z : 'z',

    columnsToRows : function(matrix, type) {
        var type = type | 3;
        var new_matrix = new Array(type * type);
        var elms = matrix.elements;

        for(var i = 0; i < elms.length; i++) {
            idx = (i % type) * type + Math.floor(i / type);
            new_matrix[i] = elms[idx];
        }
        return new_matrix;
    },

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


    /*
     * Multiplies an array of matrices together and returns the result
     */
    multiplyMatrices : function(matrices) {
        if(!(matrices instanceof Array))
            return matrices;

        if(matrices.length == 1)
            return matrices[0];

        // var new_mat = MatrixUtils.multiply3x3(T_1, MatrixUtils.multiply3x3(R, T));
        var mat = matrices[matrices.length - 1];
        for(var i = matrices.length - 2; i >= 0; i--) {
            mat = MatrixUtils.multiply3x3(matrices[i], mat);
            // DEBUG
            //mat +=  
        }
        return mat;
    },

    /**
     * This method provides a shorthand for creating a matrix stack order
     * which is then used by multiplyMatrices.
     *
     * matrixStackOrder([A,B,C,D], F) -> [A, B, C, D, F, D_1, C_1, B_1, A_1]
     *
     *
     * @param matrices Array<Mat3> - An array of matrices
     * @param apply_matrix Mat3 - The Matrix in the middle of the sandwich
     * 
     */
    matrixStackOrder : function(matrices, apply_matrix) {
        if(!(matrices instanceof Array))
            matrices = [matrices];

        var mats = [];
        var rev_stack = []
        //for(var i = matrices.length - 1; i >= 0; i--) {
        for(var i = 0; i < matrices.length; i++) {
            mats.push(matrices[i]);
            rev_stack.unshift(MatrixUtils.getInverseMatrix3(matrices[i]));
            // DEBUG
            //rev_stack.unshift(matrices[i] + "_1");
        }
        
        mats.push(apply_matrix);
        
        for(var n = 0; n < rev_stack.length; n++) {
            mats.push(rev_stack[n]);
        }
        
        return mats;
    },

    multiply3x3 : function(mat1, mat2) {
        var new_mat = new THREE.Matrix3();
        var ea = mat1.elements;
        var eb = mat2.elements;

        new_mat.set(
           ea[0]*eb[0] + ea[3]*eb[1] + ea[6]*eb[2],
           ea[0]*eb[3] + ea[3]*eb[4] + ea[6]*eb[5],
           ea[0]*eb[6] + ea[3]*eb[7] + ea[6]*eb[8],

           ea[1]*eb[0] + ea[4]*eb[1] + ea[7]*eb[2],
           ea[1]*eb[3] + ea[4]*eb[4] + ea[7]*eb[5],
           ea[1]*eb[6] + ea[4]*eb[7] + ea[7]*eb[8],

           ea[2]*eb[0] + ea[5]*eb[1] + ea[8]*eb[2],
           ea[2]*eb[3] + ea[5]*eb[4] + ea[8]*eb[5],
           ea[2]*eb[6] + ea[5]*eb[7] + ea[8]*eb[8]
        );
        return new_mat;
    },

    rotateAxis: function(axis, angle) {
        var mat;

        switch(axis) {
            case MatrixUtils.AXIS_X:
                throw new Error("Not yet implemented");
                mat = new THREE.Matrix3().set(
                    Math.cos(angle), -Math.sin(angle),  0,
                    Math.sin(angle),  Math.cos(angle),  0,
                    0,                0,                1
                );
            break;
            case MatrixUtils.AXIS_Y:
                throw new Error("Not yet implemented");
                mat = new THREE.Matrix3().set(
                    Math.cos(angle), -Math.sin(angle),  0,
                    Math.sin(angle),  Math.cos(angle),  0,
                    0,                0,                1
                );
            break;

            case MatrixUtils.AXIS_Z:
                mat = new THREE.Matrix3().set(
                    Math.cos(angle), -Math.sin(angle),  0,
                    Math.sin(angle),  Math.cos(angle),  0,
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
        var R = MatrixUtils.rotateAxis(axis, rad);
        var T_1 = MatrixUtils.getInverseMatrix3(T);
        
        var new_mat = MatrixUtils.multiplyMatrices([T_1, R, T]);
        // console.log(new_mat);
        return new_mat;
    },

    mirrorOriginLine2d: function(line) {
        var x_axis = new THREE.Vector3(1, 0, 0);
        /* check if the line vector is on the left or on the right of the x-axis */
        var onTheRight = -1 * VectorUtils.isLeftOf(line, x_axis);
        /* This is necessary for determining the direction of the angle */
        var angleToX = onTheRight * line.angleTo(x_axis);

        var R = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, angleToX);
        var M = MatrixUtils.mirrorOnXAxis();
        var R_1 = MatrixUtils.getInverseMatrix3(R);

        var new_mat = MatrixUtils.multiply3x3(R, MatrixUtils.multiply3x3(M, R_1));

        return new_mat;
    },

    mirrorLine2d: function(line, offsetY) {
        var x_axis = new THREE.Vector3(1, 0, 0);
        var onTheRight = -1 * VectorUtils.isLeftOf(line, x_axis);
        var angleToX = onTheRight * line.angleTo(x_axis);
        
        console.log(offsetY);
        var T = MatrixUtils.translate2d(new THREE.Vector3(0, -offsetY));
        var T_1 = MatrixUtils.getInverseMatrix3(T);
        
        console.log(angleToX);
        var R = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, angleToX);
        var R_1 = MatrixUtils.getInverseMatrix3(R);
        var M = MatrixUtils.mirrorOnXAxis();
        

        var mso = MatrixUtils.matrixStackOrder([T], R);
        var new_mat = MatrixUtils.multiplyMatrices(mso);

        // new_mat = MatrixUtils.multiply3x3(MatrixUtils.multiply3x3(MatrixUtils.multiply3x3(MatrixUtils.multiply3x3(T, R), M), R_1), T_1);
         // new_mat = MatrixUtils.multiply3x3(T_1, R_1);
         // new_mat2 = MatrixUtils.multiply3x3(R, T);
         // new_mat3 = MatrixUtils.multiply3x3(new_mat, M);
         // new_mat4 = MatrixUtils.multiply3x3(new_mat3, new_mat2);
        return new_mat;
    },

    mirrorOnXAxis: function() {
        return new THREE.Matrix3().set(
            1,  0, 0,
            0, -1, 0,
            0,  0, 1
        );
    },

    getInverseMatrix3 : function(mat3) {
        var inv = (new THREE.Matrix3()).getInverse(mat3);
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

};

var QuatUtils = {
    applyQuaternion : function(vectors, quaternion) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];
        
        for(var i = 0; i < vectors.length; i++)
            quaternion.applyToVector(vectors[i]);

         if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    }
};

var DOMUtils = {
    hasClass : function(element, cls) {
        return ( (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + cls + " ") > -1 )
    }
}