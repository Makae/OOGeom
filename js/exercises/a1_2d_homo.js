function task_a1_2d_homo_rotation_ursprung() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();

    var new_mat = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, THREE.Math.degToRad(45/*#float*/));
    MatrixUtils.applyMatrix(points, new_mat);
    GeneralUtils.printPoints(points, 0x0000ff/*#color*/);

}

function task_a1_2d_homo_rotation_center() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();
    var center = PointUtils.getCenter(points);
    var R = MatrixUtils.rotatePoint2d(center, MatrixUtils.AXIS_Z, THREE.Math.degToRad(45/*#float*/));
    
    MatrixUtils.applyMatrix(points, R);

    // make the center more visible
    center.z = 2;
    GeneralUtils.printPoints([center], 0xffffff/*#color*/);
    GeneralUtils.printPoints(points, 0xff0000/*#color*/);
}

function task_a1_2d_mirror_origin_line() {
    var points = PointUtils.getDefaultPointSet();
    var line = new THREE.Vector3(2/*#float*/, 2.5/*#float*/, 0/*#float*/);

    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    GeneralUtils.printStraightOriginLine(line, 0xff00ff/*#color*/);

    var mat = MatrixUtils.mirrorOriginLine2d(line);
    MatrixUtils.applyMatrix(points, mat);
    GeneralUtils.printPoints(points); 

}

function task_a1_2d_mirror_arbitrary_line() {
    var points = PointUtils.getDefaultPointSet();
    var my = 2;
    var y = 0;
    var line = new Line(my, y)
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);

    var line_set = line.asVectorSet();
    GeneralUtils.printStraightLine(line_set[1], line_set[0], 0xff00ff/*#color*/);

    var mat = MatrixUtils.mirrorLine2d(line_set[1], line_set[0].y);
    MatrixUtils.applyMatrix(points, mat);
    GeneralUtils.printPoints(points); 

}

function task_a1_2d_shear() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
}

function task_a1_2d_homo_perspective() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet();
    var vanishing_point_a = new THREE.Vector3(200/*#float*/, 600/*#float*/);
    var vanishing_point_b = new THREE.Vector3(-1000/*#float*/, -1000/*#float*/);
    var mat = MatrixUtils.project2(
            vanishing_point_a,
            vanishing_point_b
    );
    
    var new_points = MatrixUtils.applyMatrix(points, mat);
    GeneralUtils.printPoints(new_points, 0x00ff00/*#color*/);
    
    GeneralUtils.printPoints([vanishing_point_a], 0xffffff/*#color*/);
    GeneralUtils.printPoints([vanishing_point_b], 0xffffff/*#color*/);

    new_points = PointUtils.deHomogenize2D(new_points);
    GeneralUtils.printPoints(new_points, 0xff00ff/*#color*/);
 }


