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


function homogenous_rotate_euler_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();

    var alpha = 45/*#float:10:-360:360*/;
    var beta  = 45/*#float:10:-360:360*/;
    var gamma = 45/*#float:10:-360:360*/;

    alpha = THREE.Math.degToRad(alpha);
    beta  = THREE.Math.degToRad(beta);
    gamma = THREE.Math.degToRad(gamma);

    /* Using Proper Euler angle: x-y-x  => x (alpha), y' (beta), x'' (gamma) */
    var mat_euler = MatrixUtils.rotateOriginEuler(
        [MatrixUtils.AXIS_X, MatrixUtils.AXIS_Y, MatrixUtils.AXIS_X],
        [alpha,              beta,               gamma]
    );

    var center = PointUtils.getCenter(points);
    var arc_pos = new THREE.Vector3(center.x, 0, 0);
    var radius = Math.min(center.length(), 80);
    
    MatrixUtils.applyMatrix(points, mat_euler);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

}

function homogenous_example_rotation_quaternion_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var axis_a = new THREE.Vector3(1/*#float:0.1*/, 0/*#float:0.1*/, 0/*#float:0.1*/);
    var axis_b = new THREE.Vector3(0/*#float:0.1*/, 1/*#float:0.1*/, 0/*#float:0.1*/);
    var axis_c = new THREE.Vector3(0/*#float:0.1*/, 0/*#float:0.1*/, 1/*#float:0.1*/);

    var angle_a = 30/*#float:15*/;
    var angle_b = 45/*#float:15*/;
    var angle_c = 90/*#float:15*/;

    axis_a = axis_a.normalize();
    axis_b = axis_b.normalize();
    axis_c = axis_c.normalize();
    
    var quaternion_a = (new ThreeQuaternion()).fromEuler(
        [axis_a.x, axis_a.y, axis_a.z],
        THREE.Math.degToRad(angle_a)
    );

    var quaternion_b = (new ThreeQuaternion()).fromEuler(
        [axis_b.x, axis_b.y, axis_b.z],
        THREE.Math.degToRad(angle_b)
    );

    var quaternion_c = (new ThreeQuaternion()).fromEuler(
        [axis_c.x, axis_c.y, axis_c.z],
        THREE.Math.degToRad(angle_c)
    );

    var quaternion_ab  = (new ThreeQuaternion()).fromQuaternion(quaternion_a.multiply(quaternion_b));
    var quaternion_bc  = (new ThreeQuaternion()).fromQuaternion(quaternion_b.multiply(quaternion_c));
    var quaternion_abc = (new ThreeQuaternion()).fromQuaternion(quaternion_a.multiply(quaternion_bc));

    var points = PointUtils.getDefaultPointSet3D();
    QuatUtils.applyQuaternion(points, quaternion_abc);
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);

    PrintUtils.printLine(VectorUtils.ORIGIN, 
        axis_a.multiplyScalar(500), 
        0xc000c0/*#color*/
    );

    PrintUtils.printLine(VectorUtils.ORIGIN, 
        QuatUtils.applyQuaternion(axis_b, quaternion_a).multiplyScalar(500), 
        0xc0c000/*#color*/
    );

    PrintUtils.printLine(VectorUtils.ORIGIN, 
        QuatUtils.applyQuaternion(axis_c, quaternion_ab).multiplyScalar(500), 
        0x00c0c0/*#color*/
    );

}

function homogenous_example_dual_quaternion_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);
    
    var translation = new THREE.Vector3(42/*#float:2*/, 10/*#float:2*/, 10/*#float:2*/);
    var axis = new THREE.Vector3(1/*#float:0.1*/, 1.5/*#float:0.1*/, 0/*#float:0.1*/);
    var angle = THREE.Math.degToRad(125/*#float:10*/);
    
    axis = axis.normalize();
    
    var dual_quat_t = DualQuatUtils.translate3d(translation);
    console.log(dual_quat_t);
    console.log("---");
    var dual_quat_r = DualQuatUtils.rotateAxis(axis, angle);


    var points = PointUtils.getDefaultPointSet3D();
    DualQuatUtils.applyQuaternion(points, dual_quat_t);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    DualQuatUtils.applyQuaternion(points, dual_quat_r);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var dual_quat = dual_quat_t.multiply(dual_quat_r);

    var points = PointUtils.getDefaultPointSet3D();
    DualQuatUtils.applyQuaternion(points, dual_quat);
    PrintUtils.printPoints(points, 0xffffff/*#color*/);

    PrintUtils.printLine(VectorUtils.ORIGIN, 
        axis.multiplyScalar(500), 
        0xc000c0/*#color*/
    );

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
    debugger;   
    var new_mat = MatrixUtils.multiplyMatrices([T, Rx, Ry, Rz, T_1]);

    MatrixUtils.applyMatrix(points, new_mat);

    /* make the r_point more visible */
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);
    PrintUtils.printPoints([r_point], 0xff0000/*#color*/);
}

function homogenous_rotate_origin_axis_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);
    var axis = new THREE.Vector3(
        1/*#float:1*/,
        1/*#float:1*/,
        1/*#float:1*/
    );

    var axis_normed = (new THREE.Vector3()).copy(axis).normalize();
       
    var axis_line = (new THREE.Vector3()).copy(axis).multiplyScalar(500);
    PrintUtils.printLine(VectorUtils.ORIGIN, 
        axis_line, 
        0xc0c0c0/*#color*/
    );

    var points = PointUtils.getDefaultPointSet3D();
    new_mat =  MatrixUtils.multiplyMatrices([MatrixUtils.rotateOriginAxis(axis_normed, angle)]);
    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0x00a000/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();
    new_mat =  MatrixUtils.multiplyMatrices([MatrixUtils.rotateOriginAxisCondensed(axis_normed, angle)]);
    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0xa00000/*#color*/);
}


function homogenous_rotate_origin_axis_rodrigues_r3() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0xc0c0c0/*#color*/);

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);
    var axis = new THREE.Vector3(
        1/*#float:1*/,
        1/*#float:1*/,
        1/*#float:1*/
    );

    axis = axis.normalize();
       
    var axis_line = (new THREE.Vector3()).copy(axis).multiplyScalar(500);
    PrintUtils.printLine(VectorUtils.ORIGIN, 
        axis_line, 
        0xc0c0c0/*#color*/
    );

    var points = PointUtils.getDefaultPointSet3D();
    var new_mat = MatrixUtils.rotateOriginAxisRodrigues(axis, angle);

    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0x00a000/*#color*/);

}

function homogenous_mirror_plane_r3() {
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

    /* Make transformation */
    var T   = MatrixUtils.translate3d((new THREE.Vector3().copy(position)).multiplyScalar(-1));
    var HH  = MatrixUtils.houseHolder(normal.normalize());
    /* Because we have now mirrored coordinates */
    var T2 = T;

    var points = PointUtils.getDefaultPointSet3D();
    var new_mat =  MatrixUtils.multiplyMatrices([T, HH, T2]);

    MatrixUtils.applyMatrix(points, new_mat);

    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    /* Show plane */
    PrintUtils.printPlane(position, normal, 150, 0xddaa00/*#color*/, 0.75);
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