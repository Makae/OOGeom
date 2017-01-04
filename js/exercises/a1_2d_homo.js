function homogenous_example_matrix() {
    /* Alte, "affine" Matrix in R^2 für R^2 */
    var mat_affin = new THREE.Matrix2().set(
        Math.cos(angle), -Math.sin(angle),
        Math.sin(angle),  Math.cos(angle)
    );
    
    /* Neue, homogene Matrix in R^3 für R^2 */
    var mat_homogenous = new THREE.Matrix3().set(
        Math.cos(angle), -Math.sin(angle),  0,
        Math.sin(angle),  Math.cos(angle),  0,
        0,                0,                   1
    );
};

function homogenous_example_translation() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0xff0000/*#color*/);
    var x = -25/*#float:5*/;
    var y = -40/*#float:5*/;

    var translation = new THREE.Vector2(x, y);

    var points = PointUtils.getDefaultPointSet();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var matx = new THREE.Matrix3();
    matx.set(
       1, 0, translation.x,
       0, 1, 0,
       0, 0, 1
    );
    MatrixUtils.applyMatrix(points, matx);
    PrintUtils.printPoints(points, 0x0000ff/*#color*/);

    var points = PointUtils.getDefaultPointSet();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var maty = new THREE.Matrix3().set(
       1, 0, 0,
       0, 1, translation.y,
       0, 0, 1
    );
    MatrixUtils.applyMatrix(points, maty);
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);


    var points = PointUtils.getDefaultPointSet();
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var matxy = new THREE.Matrix3().set(
       1, 0, translation.x,
       0, 1, translation.y,
       0, 0, 1
    );

    MatrixUtils.applyMatrix(points, matxy);
    PrintUtils.printPoints(points, 0x00ffff/*#color*/);
}

function homogenous_example_rotation_orign() {
    var original_points = PointUtils.getDefaultPointSet();
    PrintUtils.printPoints(original_points, 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);

    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var new_mat = new THREE.Matrix3().set(
        Math.cos(angle), -Math.sin(angle),  0,
        Math.sin(angle),  Math.cos(angle),  0,
        0,                0,                   1
    );
    
    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var start_angle = VectorUtils.UNIT_X.angleTo(original_points[0]);

    PrintUtils.printArc(VectorUtils.ORIGIN.clone(), 30, start_angle, start_angle + angle, 0x8f8f30/*#color*/);
}

function homogenous_example_rotation_complex() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();

    var real = 30/*#float:5*/;
    var imaginary = 30/*#float:5*/;
    var complex = new Complex(real, imaginary);

    var angle = complex.getAngle();
    
    /* Neue R^3 Matrix für Berechnungen in R^2 */
    var new_mat = new THREE.Matrix3().set(
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

function homogenous_example_rotation_point() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();

    /* center of the defaultPointSet as Default*/
    var r_point_x = 26.6/*#float*/;
    var r_point_y = 26.6/*#float*/;
    var alpha = THREE.Math.degToRad(45/*#float:5*/);

    var r_point = new THREE.Vector3(r_point_x, r_point_y, 1)

    var R = MatrixUtils.rotatePoint2d(
        r_point, 
        MatrixUtils.AXIS_Z, 
        alpha
    );
    
    MatrixUtils.applyMatrix(points, R);

    /* make the r_point more visible */
    r_point.z = 2;
    PrintUtils.printPoints([r_point], 0xffffff/*#color*/);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);
}

function homogenous_mirror_axis() {
    var points = PointUtils.getDefaultPointSet();

    var mirror_x = -1/*#float:2:-1:1*/;
    var mirror_y = 1/*#float:2:-1:1*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix3().set(
        mirror_x,  0,  0,
        0,  mirror_y,  0,
        0,         0,   1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);  

}

function homogenous_mirror_origin_line() {
    var points = PointUtils.getDefaultPointSet();
    var declination = 2.5/*#float:0.1*/;

    /* ThreeJS cant calculate the angleTo on a Vector2 */
    var line = new THREE.Vector3(1, declination, 0);

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    PrintUtils.printStraightOriginLine(line, 0xff00ff/*#color*/);

    /* MIRROR on a straight line which is going through the origin*/
    var mat = MatrixUtils.mirrorOriginLine2d(line);

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 

}

function homogenous_shear() {
    var points = PointUtils.getDefaultPointSet();

    var shear_x = 0.5/*#float:0.1:-100:100*/;
    var shear_y = 0.7/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix3().set(
        1, shear_x,  0,
        shear_y, 1,  0,
        0,       0,   1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}

function homogenous_scale() {
    var points = PointUtils.getDefaultPointSet();

    var scale_x = 0.5/*#float:0.1:-100:100*/;
    var scale_y = 0.3/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix3().set(
        scale_x,   0, 0,
        0,   scale_y, 0,
        0,          0, 1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}

function homogenous_perspective_two() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();
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
    PrintUtils.printLine(vanishing_point_x, new_points[0], 0xaf0000/*#color*/);
    PrintUtils.printLine(vanishing_point_x, new_points[2], 0xaf0000/*#color*/);
    PrintUtils.printLine(vanishing_point_y, new_points[0], 0x0000af/*#color*/);
    PrintUtils.printLine(vanishing_point_y, new_points[6], 0x0000af/*#color*/);

    PrintUtils.printPoints(new_points, 0xff0000/*#color*/);
 }