function homogenous_example_matrix_r3() {
    /* Alte, "affine" Matrix in R^3 für R^3 */
    var mat_affin_rot_y = new THREE.Matrix4().set(
        Math.cos(angle),  0,  Math.sin(angle), 
        0,                  1,  0,
        -Math.sin(angle), 0,  Math.cos(angle)
    );
    
    /* Neue, homogene Matrix in R^4 für R^3 */
    var mat_homogenous_rot_y = new THREE.Matrix4().set(
        Math.cos(angle),  0,  Math.sin(angle), 0,
        0,                 1,  0,                 0,
        -Math.sin(angle), 0,  Math.cos(angle), 0,
        0,                 0,  0,                 1
    );
};

function homogenous_example_translation_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x0c0c0c/*#color*/);
    var x = 25/*#float:5*/;
    var y = 25/*#float:5*/;
    var z = 25/*#float:5*/;
    
    var points = PointUtils.getDefaultPointSet3D();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var matx = new THREE.Matrix4();
    matx.set(
       1, 0, 0, x,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    );
    MatrixUtils.applyMatrix(points, matx);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var maty = new THREE.Matrix4();
    maty.set(
       1, 0, 0, 0,
       0, 1, 0, y,
       0, 0, 1, 0,
       0, 0, 0, 1
    );
    MatrixUtils.applyMatrix(points, maty);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var matz = new THREE.Matrix4();
    matz.set(
       1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, z,
       0, 0, 0, 1
    );
    MatrixUtils.applyMatrix(points, matz);
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var matxyz = new THREE.Matrix4();
    matxyz.set(
       1, 0, 0, x,
       0, 1, 0, y,
       0, 0, 1, z,
       0, 0, 0, 1
    );

    MatrixUtils.applyMatrix(points, matxyz);
    PrintUtils.printPoints(points, 0x00ffff/*#color*/);
}

function homogenous_example_rotation_orign_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    var angle_x = 45/*#float:5:-360:360*/;
    var angle_y = 45/*#float:5:-360:360*/;
    var angle_z = 45/*#float:5:-360:360*/;

    angle_x = THREE.Math.degToRad(angle_x);
    angle_y = THREE.Math.degToRad(angle_y);
    angle_z = THREE.Math.degToRad(angle_z);

    /* Rotate around z-axis */
    var mat_rot_z = new THREE.Matrix4().set(
        Math.cos(angle_z), -Math.sin(angle_z),  0, 0,
        Math.sin(angle_z),  Math.cos(angle_z),  0, 0,
        0,                0,                       1, 0,
        0,                0,                       0, 1
    );
    MatrixUtils.applyMatrix(points, mat_rot_z);
    PrintUtils.printPoints(points, 0x0000ff/*#color*/); 

    var points = PointUtils.getDefaultPointSet3D();
    /* Rotate around x-axis */
    var mat_rot_x = new THREE.Matrix4().set(
        1,                0,                       0, 0,
        0, Math.cos(angle_x),     -Math.sin(angle_x),  0,
        0, Math.sin(angle_x),      Math.cos(angle_x),  0,
        0,                0,                       0, 1
    );
    MatrixUtils.applyMatrix(points, mat_rot_x);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    /* Rotate around y-axis */
    var mat_rot_y = new THREE.Matrix4().set(
        Math.cos(angle_y), 0,Math.sin(angle_y), 0,
        0,                  1,                0, 0,
        -Math.sin(angle_y), 0, Math.cos(angle_y), 0,
        0,                0,                0, 1
    );
    MatrixUtils.applyMatrix(points, mat_rot_y);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    
    /* Rotate around x-, y-, and z-axis */
    var mat_rot_xyz = MatrixUtils.multiplyMatrices([mat_rot_x, mat_rot_y, mat_rot_z]);
    MatrixUtils.applyMatrix(points, mat_rot_xyz);
    PrintUtils.printPoints(points, 0xffff00/*#color*/);
}

function homogenous_example_rotation_complex_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    var real = 30/*#float:5*/;
    var imaginary = 30/*#float:5*/;
    var complex = new Complex(real, imaginary);

    var angle = complex.getAngle();
    
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var new_mat = new THREE.Matrix4().set(
        Math.cos(angle), -Math.sin(angle),  0,
        Math.sin(angle),  Math.cos(angle),  0,
        0,                0,                   1
    );
    
    MatrixUtils.applyMatrix(points, new_mat);

    var point_real   = new THREE.Vector3(real,         0, 0);
    var point_imag   = new THREE.Vector3(0,    imaginary, 0);
    var point_meet   = new THREE.Vector3(real, imaginary, 0);
    var point_origin = new THREE.Vector3(0,            0, 0);

    PrintUtils.printLine(point_real, point_meet, 0x8f3030/*#color*/);
    PrintUtils.printLine(point_imag, point_meet, 0x308f30/*#color*/);
    PrintUtils.printLine(point_origin, point_meet, 0xafafaf/*#color*/);

    PrintUtils.printPoints(points, 0xff0000/*#color*/); 

    var radius = Math.min(complex.getRadius(), 80);
    PrintUtils.printArc(point_origin, radius, 0, angle, 0x8f8f30/*#color*/);
}

function homogenous_example_rotation_point_r3() {
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

    var T =   MatrixUtils.translate3d(new THREE.Vector3(-r_point.x, -r_point.y, -r_point.z));
    var Rx =  MatrixUtils.rotateAxis4(MatrixUtils.AXIS_X, alpha);
    var Ry =  MatrixUtils.rotateAxis4(MatrixUtils.AXIS_Y, beta);
    var Rz =  MatrixUtils.rotateAxis4(MatrixUtils.AXIS_Z, gamma);
    var T_1 = MatrixUtils.getInverseMatrix(T);

    var new_mat = MatrixUtils.multiplyMatrices([T, Rx, Ry, Rz, T_1]);


    MatrixUtils.applyMatrix(points, new_mat);

    /* make the r_point more visible */
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);
    PrintUtils.printPoints([r_point], 0xff0000/*#color*/);
}

function homogenous_mirror_axis_r3() {
    var points = PointUtils.getDefaultPointSet3D();
    var line = new THREE.Vector3(1, 0, 0);

    var mirror_x = -1/*#float:2:-1:1*/;
    var mirror_y = 1/*#float:2:-1:1*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix4().set(
        mirror_x,  0,  0,
        0,  mirror_y,  0,
        0,         0,   1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);  

}

function homogenous_mirror_origin_line_r3() {
    var points = PointUtils.getDefaultPointSet3D();
    var declination = 2.5/*#float:0.1*/;
    var line = new THREE.Vector3(1, declination, 0);

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    PrintUtils.printStraightOriginLine(line, 0xff00ff/*#color*/);

    /* MIRROR on a straight line which is going through the origin*/
    var mat = MatrixUtils.mirrorOriginLine2d(line);

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 

}

function homogenous_shear_r3() {
    var points = PointUtils.getDefaultPointSet3D();
    var line = new THREE.Vector3(1, 0, 0);

    var shear_x = 0.5/*#float:0.1:-100:100*/;
    var shear_y = 0/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix4().set(
        1, shear_x,  0,
        shear_y, 1,  0,
        0,       0,   1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}

function homogenous_perspective_two_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();
    var vanishing_point_x = new THREE.Vector3(40/*#float:10*/, 0);
    var vanishing_point_y = new THREE.Vector3(0, -90/*#float:10*/);
    var mat = MatrixUtils.project2(
            vanishing_point_x,
            vanishing_point_y
    );
    
    var new_points = MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(new_points, 0x3344ff/*#color*/);
    

    new_points = PointUtils.deHomogenize2D(new_points);

    /* Visualize Projection */
    PrintUtils.printPoints([vanishing_point_x], 0xffffff/*#color*/);
    PrintUtils.printPoints([vanishing_point_y], 0xffffff/*#color*/);
    PrintUtils.printLine(vanishing_point_x, new_points[0], 0xafafaf/*#color*/);
    PrintUtils.printLine(vanishing_point_x, new_points[2], 0xafafaf/*#color*/);
    PrintUtils.printLine(vanishing_point_y, new_points[0], 0xafafaf/*#color*/);
    PrintUtils.printLine(vanishing_point_y, new_points[6], 0xafafaf/*#color*/);

    PrintUtils.printPoints(new_points, 0xff0000/*#color*/);
 }