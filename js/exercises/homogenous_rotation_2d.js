
function homogenous_rotation_2d() {
    var points = PointUtils.threePointSet(
        3, 20, 40, 
        3, 20, 40);
    for(var i = 0; i<points.length; i++) {
        showcase.addObject(PointUtils.newThreePoint(points[i]));
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(45));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ff00);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(90));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x0000ff);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(135));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ffff);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(180));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ff00);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(215));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x0000ff);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(260));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ffff);
        showcase.addObject(r_point);
    }

    MatrixUtils.rotateAxis(MatrixUtils.AXIS_Z, points, THREE.Math.degToRad(325));
    for(var i = 0; i<points.length; i++) {
        var r_point = PointUtils.newThreePoint(points[i]);
        GeneralUtils.colorMaterial(r_point, 0x00ff00);
        showcase.addObject(r_point);
    }
}

