
function homogenous_rotation_2d() {
    var points = PointUtils.threePointSet(
        3, 20, 40, 
        3, 20, 40);

    for(var i = 0; i<points.length; i++) {
        showcase.addObject(PointUtils.newThreePoint(points[i]));
    }

    var new_mat = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, THREE.Math.degToRad(45));
    var new_points = MatrixUtils.applyMatrix(points.slice(), new_mat);

    for(var i = 0; i < new_points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ff00);
        showcase.addObject(r_point);
    }

    new_mat = MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, THREE.Math.degToRad(90));
    var new_points = MatrixUtils.applyMatrix(points.slice(), new_mat);
    for(var i = 0; i < new_points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x0000ff);
        showcase.addObject(r_point);
    }

}

