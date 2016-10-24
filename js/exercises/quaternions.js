function task_quaternion_axis() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00);
    
    var points = PointUtils.getDefaultPointSet3D();
    /* Around z-axis / 90deg */
    var quaternion90 = (new ThreeQuaternion()).fromEuler(
        [0, 0, 1],
        THREE.Math.degToRad(90)
    );
    // test
    QuatUtils.applyQuaternion(points, quaternion90);
    GeneralUtils.printPoints(points, 0x0000ff);

    var points = PointUtils.getDefaultPointSet3D();
    
    /* Around z-axis / 90deg */
    var quaternion_30 = (new ThreeQuaternion()).fromEuler(
        [0, 0, 1],
        THREE.Math.degToRad(-30)
    );

    QuatUtils.applyQuaternion(points, quaternion_30);
    GeneralUtils.printPoints(points, 0x00ffff);

}

