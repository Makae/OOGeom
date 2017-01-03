function affine_example_rotation_orign() {
    var original_points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);
    PrintUtils.printPoints(original_points, 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);
    /* Neue R^2 Matrix für Berechnungen */
    var new_mat = new THREE.Matrix2().set(
        Math.cos(angle), -Math.sin(angle),
        Math.sin(angle),  Math.cos(angle)
    );
    
    MatrixUtils.applyMatrix(points, new_mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var start_angle = VectorUtils.UNIT_X.angleTo(VectorUtils.toVec3(original_points[0]));

    PrintUtils.printArc(VectorUtils.ORIGIN.clone(), 30, start_angle, start_angle + angle, 0x8f8f30/*#color*/);
}

function affine_example_rotation_point() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(VectorUtils.VEC_2), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    /* center of the defaultPointSet as Default*/
    var r_point_x = 26.6/*#float*/;
    var r_point_y = 26.6/*#float*/;
    var r_point = new THREE.Vector2(r_point_x, r_point_y);

    var angle = THREE.Math.degToRad(45/*#float:5*/);

    var r_point = new THREE.Vector2(r_point_x, r_point_y)

    /* Step 1: Translate for -P.x and -P.y */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x -= r_point_x;
        p.y -= r_point_y;

        points[i] = p;
    }

    var R = new THREE.Matrix2().set(
        Math.cos(angle), -Math.sin(angle),
        Math.sin(angle),  Math.cos(angle)
    );

    /* Step 2: Apply rotation around origin */
    MatrixUtils.applyMatrix(points, R);

    /* Step 3: Translate back for P.x and P.y */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];
        
        p.x += r_point_x;
        p.y += r_point_y;
        
        points[i] = p;
    }
    
    /* make the r_point more visible */
    r_point = VectorUtils.toVec3(r_point);
    r_point.z = 2;
    PrintUtils.printPoints([r_point], 0xffffff/*#color*/);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);
}