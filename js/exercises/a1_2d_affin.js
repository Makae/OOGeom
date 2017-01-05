function affine_example_translation() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet(), 0xc0c0c0/*#color*/);
    var x = -40/*#float:5*/;
    var y = -25/*#float:5*/;

    var translation = new THREE.Vector2(x, y);

    var points = PointUtils.getDefaultPointSet();
    /* Translate for P.x by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x += translation.x;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0xff0000/*#color*/);

    var points = PointUtils.getDefaultPointSet();
    /* Translate for P.y by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.y += translation.y;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0x00ff00/*#color*/);

    var points = PointUtils.getDefaultPointSet();
    /* Translate for P.x and P.y by adding the coordinates */
    for(var i = 0; i < points.length; i++) {
        var p = points[i];

        p.x += translation.x;
        p.y += translation.y;

        points[i] = p;
    }
    PrintUtils.printPoints(points, 0xffffff/*#color*/);

}

function affine_example_rotation_orign() {
    var original_points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);
    PrintUtils.printPoints(original_points, 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    var angle = 45/*#float:5:-360:360*/;
    angle = THREE.Math.degToRad(angle);
    /* Neue 2x2 Matrix für Berechnungen */
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

        p.x -= r_point.x;
        p.y -= r_point.y;

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
        
        p.x += r_point.x;
        p.y += r_point.y;
        
        points[i] = p;
    }
    
    /* make the r_point more visible */
    r_point = VectorUtils.toVec3(r_point);
    r_point.z = 2;
    PrintUtils.printPoints([r_point], 0xffffff/*#color*/);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);
}


function affine_mirror_axis() {
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    var mirror_x = -1/*#float:2:-1:1*/;
    var mirror_y = 1/*#float:2:-1:1*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(VectorUtils.VEC_2), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix2().set(
        mirror_x,  0,
        0,  mirror_y
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/);  

}

function affine_mirror_origin_line() {
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);
    var declination = 2.5/*#float:0.1*/;    
    /* ThreeJS cant calculate the angleTo on a Vector2 */
    var line = new THREE.Vector3(1, declination, 0);


    PrintUtils.printPoints(PointUtils.getDefaultPointSet(VectorUtils.VEC_2), 0x00ff00/*#color*/);
    PrintUtils.printStraightOriginLine(line, 0xff00ff/*#color*/);

    /* MIRROR on a straight line which is going through the origin*/
    var mat = MatrixUtils.mirrorOriginLine2d(line, MatrixUtils.MAT_2);
    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 

}

function affine_shear() {
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    var shear_x = 0.5/*#float:0.1:-100:100*/;
    var shear_y = 0.3/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(VectorUtils.VEC_2), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix2().set(
        1, shear_x,
        shear_y, 1
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}

function affine_scale() {
    var points = PointUtils.getDefaultPointSet(VectorUtils.VEC_2);

    var scale_x = 0.5/*#float:0.1:-100:100*/;
    var scale_y = 0.5/*#float:0.1:-100:100*/;

    PrintUtils.printPoints(PointUtils.getDefaultPointSet(VectorUtils.VEC_2), 0x00ff00/*#color*/);

    var mat =  new THREE.Matrix2().set(
        scale_x, 0,
        0,   scale_y
    );

    MatrixUtils.applyMatrix(points, mat);
    PrintUtils.printPoints(points, 0xff0000/*#color*/); 
}