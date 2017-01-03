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
    },

    getArcPoints : function(center, radius, start_angle, end_angle, color) {
        var curve = new THREE.EllipseCurve(
            center.x, center.y,             // ax, aY
            radius, radius,            // xRadius, yRadius
            start_angle, end_angle, // aStartAngle, aEndAngle
            false             // aClockwise
        );

        var deg_angle = 180;
        var pieces = deg_angle;
        var points = curve.getSpacedPoints(pieces);

        return VectorUtils.vec2ToVec3(points);
    },
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
    },

    printLine : function(a, b, color) {
        var material = new THREE.LineBasicMaterial({
            color: color
        });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(a.x, a.y, a.z),
            new THREE.Vector3(b.x, b.y, b.z)
        );
        this.context.addObject(new THREE.Line(geometry, material));
    },

    printArc : function(center, radius, start_angle, end_angle, color) {
       
        var points = PointUtils.getArcPoints(center, radius, start_angle, end_angle);
        PrintUtils.printConnectedLines(points, color)
    },

    printConnectedLines : function(points, color) {
        var path = new THREE.Path();
        var geometry = path.createGeometry( points );

        var material = new THREE.LineBasicMaterial( { color : color } );

        var line = new THREE.Line( geometry, material );

        this.context.addObject( line );
    },

    printPlane : function(position, normal, size, color, opacity) {
        opacity = opacity || 0.45;

        var geometry = new THREE.PlaneGeometry(size, size, size);
        var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide, opacity: opacity, transparent: true} );
        var plane = new THREE.Mesh( geometry, material );
        
        this.context.addObject( plane );

        MatrixUtils.applyMatrix(plane.geometry.vertices, MatrixUtils.rotateAxis(MatrixUtils.AXIS_X, -Math.PI / 2));

        var new_mat;
        var r_xyz_t = MatrixUtils.multiplyMatrices([
            MatrixUtils.lookAt(new THREE.Vector3(0, 0, 0), normal, new THREE.Vector3(0, 1, 0)),
            MatrixUtils.translate3d(position)
        ]);
       
        new_mat = MatrixUtils.multiplyMatrices([
            MatrixUtils.rotateAxis(MatrixUtils.AXIS_X, -Math.PI / 2),
            r_xyz_t]);

        plane.matrixWorld.copy(new_mat);
        plane.matrix.copy(new_mat);
        plane.matrixAutoUpdate = false;

        PrintUtils.printLine(position, (new THREE.Vector3()).copy(position).add(normal.multiplyScalar(20)), color);

    }
};

var VectorUtils = {
    ORIGIN : new THREE.Vector3(0, 0, 0),
    UNIT_X : new THREE.Vector3(1, 0, 0),
    UNIT_Y : new THREE.Vector3(0, 1, 0),
    UNIT_Z : new THREE.Vector3(0, 0, 1),

    isLeftOf : function(v1, v2) {
        var d = VectorUtils.perp3d(v1).dot(v2);
        if(d == 0)
            return 0;
        return (d < 0 ? 1 : -1)
    },

    perp3d : function(v) {
         return  v.z < v.x  ? new THREE.Vector3(v.y, -v.x, 0) : new THREE.Vector3(0, -v.z, v.y);
    },

    vec2ToVec3 : function(vectors) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];
        
        for(var i = 0; i < vectors.length; i++) {
            vectors[i] = (new THREE.Vector3()).copy(vectors[i]);
            vectors[i].z = 0;
        }

        if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    },

    unitVectorAngles : function(v) {
        var v_xz = new THREE.Vector3(v.x, 0, v.z);
        var v_yz = new THREE.Vector3(0, v.y, v.z);

        var result = {
            y : VectorUtils.UNIT_Z.angleTo(v_xz),
            x : VectorUtils.UNIT_Z.angleTo(v_yz)
        };


        var result2 = {
            x: Math.acos(
                VectorUtils.UNIT_Z.dot(v_yz) / (VectorUtils.UNIT_Z.length() * (new THREE.Vector3()).copy(v_yz).length())
            ),
            y: Math.acos(
                VectorUtils.UNIT_Z.dot(v_xz) / (VectorUtils.UNIT_Z.length() * (new THREE.Vector3()).copy(v_xz).length())
            )
        };

        var result3 = {
            x: Math.acos(
                v.z / Math.sqrt(v.y * v.y + v.z * v.z)
            ),
            y: Math.acos(
                v.x / Math.sqrt(v.x * v.x + v.z * v.z)
            )
        };
        console.log(result);
        console.log(result2);
        console.log(result3);
        result.y = 2 * Math.PI - result.y;
        console.log(result);
        return result;
    }
};

var MatrixUtils = {
    AXIS_X : 'x',
    AXIS_Y : 'y',
    AXIS_Z : 'z',

    MAT_2: 2,
    MAT_3: 3,
    MAT_4: 4,

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
        var new_mat = new THREE.Matrix3().set(
            1,           0, 0,
            0,           1, 0,
            1/u.x, 1/v.y, 1
        );

        return new_mat;
    },

    projectOnPlane : function(normal) {
        // [abcd]T × [pqr1] − (au + bv + cw + d)I

    },

    houseHolder : function(normal, mat_type) {
        var mat_type = mat_type || MatrixUtils.MAT_4;
        var I = MatrixUtils.generateMatrixOfType(mat_type);
        var HH = (new THREE.Matrix3()).set(
            normal.x * normal.x, normal.x * normal.y, normal.x * normal.z,
            normal.y * normal.x, normal.y * normal.y, normal.y * normal.z,
            normal.z * normal.x, normal.z * normal.y, normal.z * normal.z
        );

        HH = mat_type == MatrixUtils.MAT_3 ? HH : MatrixUtils.mat3ToMat4(HH);
        return MatrixUtils.subtract(I, HH.multiplyScalar(2));

    },

    subtract : function(m1, m2) {
        var mat = MatrixUtils.generateSameMatrixType(m1);
        for(var e = 0; e < mat.elements.length; e++)
            mat.elements[e] = 0;

        for(var i = 0; i < m1.elements.length; i++)
            mat.elements[i] = m1.elements[i] - m2.elements[i];

        return mat;
    },

    add : function(m1, m2) {
        var mat = MatrixUtils.generateSameMatrixType(m1);
        for(var e = 0; e < mat.elements.length; e++)
            mat.elements[e] = 0;
        for(var i = 0; i < m1.element.length; i++)
            mat.elements[i] = m1.elements[i] + m1.elements[i];
        return mat;
    },

    /*
     * Adds an array of matrices together and returns the result
     */
    addMatrices : function(matrices) {
        if(!(matrices instanceof Array))
            return matrices;

        if(matrices.length == 1)
            return matrices[0];

        var mat = MatrixUtils.generateSameMatrixType(matrices[0]);
        for(var e = 0; e < mat.elements.length; e++)
            mat.elements[e] = 0;

        for(var m = 0; m < matrices.length; m++) {
            var c_mat = matrices[m];
            for(var i = 0; i < c_mat.elements.length; i++) {
                mat.elements[i] += c_mat.elements[i];
            }
        }

        return mat;
    },

    generateSameMatrixType : function(matrix) {
        return MatrixUtils.generateMatrixOfType(MatrixUtils.getMatrixType(matrix));
    },

    generateMatrixOfType : function(type) {
        var mat;
        switch(type) {
            case MatrixUtils.MAT_2:
                mat = new THREE.Matrix2();
            break;

            case MatrixUtils.MAT_3:
                mat = new THREE.Matrix3();
            break;
            
            case MatrixUtils.MAT_4:
                mat = new THREE.Matrix4();
            break;
        }
        return mat;

    },

    /*
     * Multiplies an array of matrices together and returns the result
     */
    multiplyMatrices : function(matrices) {

        if(!(matrices instanceof Array))
            return matrices;

        if(matrices.length == 1)
            return matrices[0];

        if(matrices.length == 0)
            return new THREE.Matrix4();

        switch(MatrixUtils.getMatrixType(matrices[0])) {
            case MatrixUtils.MAT_2:
                return MatrixUtils.multiplyMatrices2(matrices);
            break;

            case MatrixUtils.MAT_3:
                return MatrixUtils.multiplyMatrices3(matrices);
            break;
            
            case MatrixUtils.MAT_4:
                return MatrixUtils.multiplyMatrices4(matrices);
            break;
        }

        return mat;
    },

    multiplyMatrices3 : function(matrices) {
        var mat = matrices[matrices.length - 1];
        for(var i = matrices.length - 2; i >= 0; i--) {
            mat = MatrixUtils.multiply3x3(matrices[i], mat);
        }
        return mat;
    },

    multiplyMatrices4 : function(matrices) {
        var new_mat = new THREE.Matrix4();
        for(var i = matrices.length - 1; i >= 0; i--) {
            new_mat.multiply(matrices[i]);
        }
        return new_mat;
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
            rev_stack.unshift(MatrixUtils.getInverseMatrix(matrices[i]));
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

    rotateAxis: function(axis, angle, mat_type) {
        var mat;
        mat_type = typeof mat_type != "undefined" ? mat_type : MatrixUtils.MAT_4;
        switch(mat_type) {
            case MatrixUtils.MAT_2:
                mat = MatrixUtils.rotateAxis2(axis, angle);
            break;

            case MatrixUtils.MAT_3:
                mat = MatrixUtils.rotateAxis3(axis, angle);
            break;
            
            case MatrixUtils.MAT_4:
                mat = MatrixUtils.rotateAxis4(axis, angle);
            break;
        }

       return mat
    },

    rotateAxis3 : function(axis, angle) {
        var mat;
        switch(axis) {
            case MatrixUtils.AXIS_X:
                mat = new THREE.Matrix3().set(
                    1,                 0,                  0,
                    0, Math.cos(angle),     -Math.sin(angle),
                    0, Math.sin(angle),      Math.cos(angle)
                );
            break;
            case MatrixUtils.AXIS_Y:
                mat = new THREE.Matrix3().set(
                    Math.cos(angle),  0, Math.sin(angle),
                    0,                  1,                0,
                    -Math.sin(angle), 0, Math.cos(angle)
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
        return mat;
    },

    rotateAxis4 : function(axis, angle) {
        var mat;
        switch(axis) {
            case MatrixUtils.AXIS_X:
                mat = new THREE.Matrix4().set(
                    1,                 0,                  0, 0,
                    0,   Math.cos(angle),   -Math.sin(angle), 0,
                    0,   Math.sin(angle),    Math.cos(angle), 0,
                    0,                 0,                  0, 1
                );
            break;
            case MatrixUtils.AXIS_Y:
                mat = new THREE.Matrix4().set(
                    Math.cos(angle), 0, Math.sin(angle),  0,
                                  0, 1,               0,  0,
                   -Math.sin(angle), 0, Math.cos(angle),  0,
                                  0, 0,                0, 1
                );
            break;

            case MatrixUtils.AXIS_Z:
                mat = new THREE.Matrix4().set(
                    Math.cos(angle), -Math.sin(angle),  0, 0,
                    Math.sin(angle),  Math.cos(angle),  0, 0,
                                  0,                0,  1, 0,
                                  0,                0,  0, 1
                );
            break;
        }
        return mat;
    },

    rotateOriginAxis : function(axis, angle) {
        var new_axis = (new THREE.Vector3()).copy(axis).normalize();

        var angles = VectorUtils.unitVectorAngles(new_axis);
        var Rx   = MatrixUtils.rotateAxis4(MatrixUtils.AXIS_Z, -angles.x);
        var Ry   = MatrixUtils.rotateAxis4(MatrixUtils.AXIS_Y, angles.y);
        var Rz   = MatrixUtils.rotateAxis4(MatrixUtils.AXIS_Z, angle);
        var Rx_1 = MatrixUtils.getInverseMatrix(Rx);
        var Ry_1 = MatrixUtils.getInverseMatrix(Ry);

        return MatrixUtils.multiplyMatrices([Rx, Ry, Rz, Ry_1, Rx_1]);

    },

    rotateOriginAxisCondensed : function(axis, angle) {
        var u = (new THREE.Vector3()).copy(axis).normalize();
        var sin = Math.sin;
        var cos = Math.cos;

        return new THREE.Matrix4().set(
            u.x * u.x + cos(angle) * (1 - u.x * u.x),          u.x * u.y * (1 - cos(angle)) - u.z * sin(angle),   u.x * u.z * (1 - cos(angle) + u.y * sin(angle)), 0,
            u.x * u.y * (1 - cos(angle)) + u.z * sin(angle),   u.y * u.y + cos(angle) * (1 - u.y * u.y),          u.y * u.z * (1 - cos(angle) - u.x * sin(angle)), 0,
            u.x * u.z * (1 - cos(angle)) - u.y * sin(angle),   u.y * u.z * (1 - cos(angle)) + u.x * sin(angle),   u.z * u.z + cos(angle) * (1 - u.z * u.z),        0,
                                                          0,                                                 0,                                          0,        1
        );

    },

    rotateOriginEuler : function(axes, angles, mat_type) {
        mat_type = mat_type || MatrixUtils.MAT_4;

        if(axes.length != angles.length)
            throw new Error("Same number of axes and angles are necessary");

        var mats = [];
        for(var a = 0; a < axes.length; a++)
            mats.push(MatrixUtils.rotateAxis(axes[a], angles[a], mat_type));

        return MatrixUtils.multiplyMatrices(mats);

    },

    rotateOriginAxisRodrigues : function(axis, angle, mat_type) {
        mat_type = mat_type || MatrixUtils.MAT_4;

        // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
        var norm_axis = (new THREE.Vector3()).copy(axis).normalize();
        var I = new THREE.Matrix3();
        var N = new THREE.Matrix3();

        N.set(
                  0,      -norm_axis.z,  norm_axis.y,
             norm_axis.z,            0, -norm_axis.x,
            -norm_axis.y,  norm_axis.x,            0
        );
        var NN = MatrixUtils.multiply3x3(N, N);

        // R_n(phi) = I + N * sin(phi) + N^2 * (1 - cos(phi))
        var new_matrix = MatrixUtils.addMatrices([
            I, 
            N.multiplyScalar(Math.sin(angle)), 
            NN.multiplyScalar(1 - Math.cos(angle))
        ]);

        if(mat_type == MatrixUtils.MAT_4)
            return MatrixUtils.mat3ToMat4(new_matrix);

        return new_matrix;

    },

    translate2d : function(vector) {
        return new THREE.Matrix3().set(
            1, 0, vector.x,
            0, 1, vector.y,
            0, 0, 1
        );
    },

    translate3d : function(vector) {
        return new THREE.Matrix4().set(
            1, 0, 0, vector.x,
            0, 1, 0, vector.y,
            0, 0, 1, vector.z,
            0, 0, 0, 1
        );
    },

    rotatePoint2d : function(point, axis, rad) {
        var T = MatrixUtils.translate2d(new THREE.Vector3(-point.x, -point.y, -point.z));
        var R = MatrixUtils.rotateAxis(axis, rad, MatrixUtils.MAT_3);
        var T_1 = MatrixUtils.getInverseMatrix(T);
        
        var new_mat = MatrixUtils.multiplyMatrices([T_1, R, T]);
        return new_mat;
    },

    mirrorOriginLine2d: function(line) {
        var x_axis = new THREE.Vector3(1, 0, 0);
        /* check if the line vector is on the left or on the right of the x-axis */
        var onTheRight = -1 * VectorUtils.isLeftOf(line, x_axis);
        /* This is necessary for determining the direction of the angle */
        var angleToX = onTheRight * line.angleTo(x_axis);

        var R = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, angleToX, MatrixUtils.MAT_3);
        var M = MatrixUtils.mirrorOnXAxis();
        var R_1 = MatrixUtils.getInverseMatrix(R);

        var new_mat = MatrixUtils.multiplyMatrices([R, M, R_1]);

        return new_mat;
    },

    mirrorLine2d: function(line, offsetY) {
        var x_axis = new THREE.Vector3(1, 0, 0);
        var onTheRight = -1 * VectorUtils.isLeftOf(line, x_axis);
        var angleToX = onTheRight * line.angleTo(x_axis);
        
        var T = MatrixUtils.translate2d(new THREE.Vector3(0, -offsetY));
        var T_1 = MatrixUtils.getInverseMatrix(T);
        
        var R = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, angleToX);
        var R_1 = MatrixUtils.getInverseMatrix(R);
        var M = MatrixUtils.mirrorOnXAxis();
        

        var mso = MatrixUtils.matrixStackOrder([T], R);
        var new_mat = MatrixUtils.multiplyMatrices(mso);

        return new_mat;
    },

    mirrorOnMainPlane4: function(plane_normal) {
        var mat;
        switch(plane_normal) {
            case MatrixUtils.AXIS_X:
                mat = new THREE.Matrix4().set(
                  -1, 0, 0, 0,
                   0, 1, 0, 0,
                   0, 0, 1, 0,
                   0, 0, 0, 1
                );
            break;
            case MatrixUtils.AXIS_Y:
                mat = new THREE.Matrix4().set(
                   1,  0, 0, 0,
                   0, -1, 0, 0,
                   0,  0, 1, 0,
                   0,  0, 0, 1
                );
            break;

            case MatrixUtils.AXIS_Z:
                mat = new THREE.Matrix4().set(
                   1, 0,  0, 0,
                   0, 1,  0, 0,
                   0, 0, -1, 0,
                   0, 0,  0, 1
                );
            break;
        }
        return mat;
    },

    mirrorOnMainPlane3: function(plane_normal) {
        var mat;
        switch(plane_normal) {
            case MatrixUtils.AXIS_X:
                mat = new THREE.Matrix3().set(
                  -1, 0, 0,
                   0, 1, 0,
                   0, 0, 1
                   
                );
            break;
            case MatrixUtils.AXIS_Y:
                mat = new THREE.Matrix3().set(
                   1,  0, 0,
                   0, -1, 0,
                   0,  0, 1
                );
            break;

            case MatrixUtils.AXIS_Z:
                mat = new THREE.Matrix3().set(
                   1, 0,  0,
                   0, 1,  0,
                   0, 0, -1
                );
            break;
        }
        return mat;
    },

    mirrorOnXAxis: function() {
        return new THREE.Matrix3().set(
            1,  0, 0,
            0, -1, 0,
            0,  0, 1
        );
    },

    lookAt : function(eye, target, up) {
        return (new THREE.Matrix4()).lookAt(eye, target, up);
    },

    getInverseMatrix : function(mat) {
        switch(MatrixUtils.getMatrixType(mat)) {
            case MatrixUtils.MAT_2:
                return MatrixUtils.getInverseMatrix2(mat);
            break;

            case MatrixUtils.MAT_3:
                return MatrixUtils.getInverseMatrix3(mat);
            break;
            
            case MatrixUtils.MAT_4:
                return MatrixUtils.getInverseMatrix4(mat);
            break;
        }
    },

    getInverseMatrix2 : function(mat) {
        return (new THREE.Matrix3()).getInverse(mat);
    },

    getInverseMatrix3 : function(mat) {
        console.log(mat);
        return (new THREE.Matrix3()).getInverse(mat);
    },

    getInverseMatrix4 : function(mat) {
        return (new THREE.Matrix4()).getInverse(mat);
    },

    mat3ToMat4 : function(mat3) {
        return new THREE.Matrix4().set(
            mat3.elements[0], mat3.elements[3], mat3.elements[6], 0,
            mat3.elements[1], mat3.elements[4], mat3.elements[7], 0,
            mat3.elements[2], mat3.elements[5], mat3.elements[8], 0,
                           0,                0,                0, 1
        );
    },

    applyMatrix : function(vectors, mat) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];

        switch(MatrixUtils.getMatrixType(mat)) {
            case MatrixUtils.MAT_2:
                vectors = MatrixUtils.applyMatrix2(vectors, mat);
            break;

            case MatrixUtils.MAT_3:
                vectors = MatrixUtils.applyMatrix3(vectors, mat);
            break;
            
            case MatrixUtils.MAT_4:
                vectors = MatrixUtils.applyMatrix4(vectors, mat);
            break;
        }

         if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    },

    applyMatrix2 : function(vectors, mat) {
        for(var i = 0; i < vectors.length; i++)
            vectors[i].applyMatrix2(mat);
        return vectors;
    },

    applyMatrix3 : function(vectors, mat) {
        for(var i = 0; i < vectors.length; i++)
            vectors[i].applyMatrix3(mat);
        return vectors;
    },
    
    applyMatrix4 : function(vectors, mat) {
        for(var i = 0; i < vectors.length; i++)
            vectors[i].applyMatrix4(mat);
        return vectors;
    },

    getMatrixType : function(mat) {
        if(mat instanceof THREE.Matrix4) {
            return MatrixUtils.MAT_4;
        } else if(mat instanceof THREE.Matrix3) {
            return MatrixUtils.MAT_3;
        } else if(mat instanceof THREE.Matrix2) {
            return MatrixUtils.MAT_2;
        }

        return undefined;
    }



};

var QuatUtils = {
    applyQuaternion : function(vectors, quaternion) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];
        
        for(var i = 0; i < vectors.length; i++) {
            quaternion.applyToVector(vectors[i]);
        }

         if(vectors_type == 'single')
            return vectors[0];
        return vectors;
    }
};

var DualQuatUtils = {
    
    applyQuaternion : function(vectors, quaternion) {
        var vectors_type = vectors instanceof Array ? 'array' : 'single';
        vectors = vectors_type == 'array' ? vectors : [vectors];
        
        for(var i = 0; i < vectors.length; i++) {
            quaternion.applyToVector(vectors[i]);
        }

         if(vectors_type == 'single')
            return vectors[0];
        
        return vectors;
    },

    translate3d : function(v) {
        var r = new ThreeQuaternion(1, 0, 0, 0);
        var d = new ThreeQuaternion(0, v.x / 2, v.y / 2, v.z / 2);

        return new ThreeDualQuaternion(r, d);
    },

    rotateAxis : function(axis, angle) {
        var a = axis.normalize();

        var r = new ThreeQuaternion(
            Math.cos(angle / 2), 
            a.x * Math.sin(angle / 2), 
            a.y * Math.sin(angle / 2), 
            a.z * Math.sin(angle / 2)
        );
        var d = new ThreeQuaternion(0, 0, 0, 0);

        return new ThreeDualQuaternion(r, d);
    }
}

var DOMUtils = {
    hasClass : function(element, cls) {
        return ( (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + cls + " ") > -1 )
    }
}