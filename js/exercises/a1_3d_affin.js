function affine_example_translation_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x0c0c0c/*#color*/);
    var x = 25/*#float:5*/;
    var y = 25/*#float:5*/;
    var z = 25/*#float:5*/;
    
    var translation = new THREE.Vector3(x, y, z);

    var points = PointUtils.getDefaultPointSet3D();
    /* Translate for P.x by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x += translation.x;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Translate for P.y by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.y += translation.y;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Translate for P.z by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.z += translation.z;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Translate for P by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x += translation.x;
        p.y += translation.y;
        p.z += translation.z;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0xffffff/*#color*/);

    var from = PointUtils.getCenter(PointUtils.getDefaultPointSet3D());
    PrintUtils.printLine(
        from, 
        from.clone().add(translation),
        0xff00ff/*#color*/
    );
}


function affine_project_plane() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    var points = PointUtils.getDefaultPointSet();
    
    var plane_position = VectorUtils.ORIGIN.clone();
    var plane_normal = VectorUtils.UNIT_Y.clone();

    var vp = new THREE.Vector3(26/*#float*/, 60/*#float*/, 26/*#float*/)

    var plane_distance = plane_position.clone().add()

    var new_points = [];    
    PrintUtils.printPoints(new_points, 0x00ff00/*#color*/);
    PrintUtils.printPoints(vp, 0xff0000)
    /* Show plane */
    PrintUtils.printPlane(plane_position, plane_normal, 150, 0xddaa00/*#color*/, 0.75);
 }

function affine_example_rotation_orign_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    var angle_x = 45/*#float:5:-360:360*/;
    var angle_y = 45/*#float:5:-360:360*/;
    var angle_z = 45/*#float:5:-360:360*/;

    angle_x = THREE.Math.degToRad(angle_x);
    angle_y = THREE.Math.degToRad(angle_y);
    angle_z = THREE.Math.degToRad(angle_z);

    /* Rotate around z-axis */
    var mat_rot_z = new THREE.Matrix3().set(
        Math.cos(angle_z), -Math.sin(angle_z),  0,
        Math.sin(angle_z),  Math.cos(angle_z),  0,
        0,                0,                       1
    );
    MatrixUtils.applyMatrix(points, mat_rot_z);
    PrintUtils.printPoints(points, 0x0000ff/*#color*/); 

    var points = PointUtils.getDefaultPointSet3D();
    /* Rotate around x-axis */
    var mat_rot_x = new THREE.Matrix3().set(
        1,                0,                       0,
        0, Math.cos(angle_x),     -Math.sin(angle_x),
        0, Math.sin(angle_x),      Math.cos(angle_x)
    );
    MatrixUtils.applyMatrix(points, mat_rot_x);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Rotate around y-axis */
    var mat_rot_y = new THREE.Matrix3().set(
        Math.cos(angle_y), 0,Math.sin(angle_y),
        0,                  1,                0,
        -Math.sin(angle_y), 0, Math.cos(angle_y)
    );
    MatrixUtils.applyMatrix(points, mat_rot_y);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    
    /* Rotate around x-, y-, and z-axis */
    var mat_rot_xyz = MatrixUtils.multiplyMatrices([mat_rot_x, mat_rot_y, mat_rot_z]);
    MatrixUtils.applyMatrix(points, mat_rot_xyz);
    PrintUtils.printPoints(points, 0xffff00/*#color*/);
}

 function affine_rotate_euler_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    var alpha = 45/*#float:10:-360:360*/;
    var beta  = 45/*#float:10:-360:360*/;
    var gamma = 45/*#float:10:-360:360*/;

    alpha = THREE.Math.degToRad(alpha);
    beta  = THREE.Math.degToRad(beta);
    gamma = THREE.Math.degToRad(gamma);

    /* Using Proper Euler angle: x-y-x  => x (alpha), y' (beta), x'' (gamma) */
    /* Check MatrixUtils.rotateAxis3() */
    var mat_euler = MatrixUtils.rotateOriginEuler(
        [MatrixUtils.AXIS_X, MatrixUtils.AXIS_Y, MatrixUtils.AXIS_X],
        [alpha,              beta,               gamma],
        MatrixUtils.MAT_3
    );

    var center = PointUtils.getCenter(points);
    var arc_pos = new THREE.Vector3(center.x, 0, 0);
    var radius = Math.min(center.length(), 80);
    
    MatrixUtils.applyMatrix(points, mat_euler);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

}


function affine_example_rotation_point_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    /* center of the defaultPointSet as Default*/
    var r_point_x = 26.6/*#float*/;
    var r_point_y = 26.6/*#float*/;
    var r_point_z = 26.6/*#float*/;

    var alpha = THREE.Math.degToRad(45/*#float:5*/);
    var beta  = THREE.Math.degToRad(45/*#float:5*/);
    var gamma = THREE.Math.degToRad(45/*#float:5*/);

    var r_point = new THREE.Vector3(r_point_x, r_point_y, r_point_z)

/* Step 1: Translate for -P.x, -P.y and -P.z */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x -= r_point.x;
        p.y -= r_point.y;
        p.z -= r_point.z;

        points[i] = p;
    }

    /* Step 2: Apply rotation around origin */
    var Rx =  MatrixUtils.rotateAxis3(MatrixUtils.AXIS_X, alpha);
    var Ry =  MatrixUtils.rotateAxis3(MatrixUtils.AXIS_Y, beta);
    var Rz =  MatrixUtils.rotateAxis3(MatrixUtils.AXIS_Z, gamma);
    var R = MatrixUtils.multiplyMatrices([Rx, Ry, Rz]);
    MatrixUtils.applyMatrix(points, R);

    /* Step 3: Translate back for P.x, P.y and P.z  */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];
        
        p.x += r_point.x;
        p.y += r_point.y;
        p.z += r_point.z;
        
        points[i] = p;
    }
    
    /* make the r_point more visible */
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);
    PrintUtils.printPoints([r_point], 0xff0000/*#color*/);
}

function affine_rotate_origin_axis_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);
    var axis = new THREE.Vector3(
        1/*#float:1*/,
        3/*#float:1*/,
        3/*#float:1*/
    );

    var axis_normed = axis.clone().normalize();
       
    var axis_line = axis.clone().multiplyScalar(500);
    PrintUtils.printLine(VectorUtils.ORIGIN.clone(), 
        axis_line, 
        0xc0c0c0/*#color*/
    );

    var points = PointUtils.getDefaultPointSet3D();
    new_mat =  MatrixUtils.multiplyMatrices([MatrixUtils.rotateOriginAxis(axis_normed, angle)]);
    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0x00a000/*#color*/);

    /* Projection on XZ-Plane, for angle of y-Axis */
    var v_xz = (new THREE.Vector3(axis_normed.x, 0, axis_normed.z));
    PrintUtils.printLine(VectorUtils.ORIGIN, v_xz.clone().multiplyScalar(200), 0xff00ff/*#color*/);
    
    /* Projection on YZ-Plane, for angle of x-Axis */
    var v_yz = (new THREE.Vector3(0, axis_normed.y, axis_normed.z));
    PrintUtils.printLine(VectorUtils.ORIGIN, v_yz.clone().multiplyScalar(200), 0x00ffff/*#color*/);

}

function affine_mirror_plane_r3() {
    var points = PointUtils.getDefaultPointSet3D();
    /* E = ax + by + cz + d = 0 */
    var a = 1/*#float:0.4*/;
    var b = 1/*#float:0.4*/;
    var c = 1/*#float:0.4*/;
    var x = 0/*#float:0.4*/;
    var y = 0/*#float:0.4*/;
    var z = 0/*#float:0.4*/;

    var plane = new Plane(
        a, b, c,
        x, y, z
    );

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);

    var plane_data = plane.asVectorSet();
    var position = plane_data[0];
    var normal = plane_data[1];

    var points = PointUtils.getDefaultPointSet3D();
    /* Translate for P by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x -= position.x;
        p.y -= position.y;
        p.z -= position.z;

        points[i] = p;
    }
    
    /* Mirror Points by using HouseHolder Matrix */
    var HH  = MatrixUtils.houseHolder(normal.normalize(), MatrixUtils.MAT_3);
    MatrixUtils.applyMatrix(points, HH);

    /* Translate for P by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x += position.x;
        p.y += position.y;
        p.z += position.z;

        points[i] = p;
    }

    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    /* Show plane */
    PrintUtils.printPlane(position, normal, 150, 0xddaa00/*#color*/, 0.75);
}

function affine_shear_r3() {
    var points = PointUtils.getDefaultPointSet3D();

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix3().set(
                1, 0.1/*#float:0.1:-100:100*/, 0/*#float:0.1:-100:100*/,
        0.1/*#float:0.1:-100:100*/,         1, 0/*#float:0.1:-100:100*/,
        0/*#float:0.1:-100:100*/, 0.1/*#float:0.1:-100:100*/,         1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}

function affine_scale_r3() {
    var points = PointUtils.getDefaultPointSet3D();

    var scale_x = 1.3/*#float:0.1:-100:100*/;
    var scale_y = 0.6/*#float:0.1:-100:100*/;
    var scale_z = 1.2/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix3().set(
        scale_x,       0,         0,
        0,       scale_y,         0,
        0,              0,   scale_z
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}
