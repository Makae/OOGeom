function task_quaternion_euler() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet(), 0x00ff00);
    
    var points = PointUtils.getDefaultPointSet();

    var quaternion90 = (new ThreeQuaternion()).fromEuler(
        // Around z-axis
        [0, 0, 1],
        // 90°,
        THREE.Math.degToRad(90)
    );

    QuatUtils.applyQuaternion(points, quaternion90);
    GeneralUtils.printPoints(points, 0x0000ff);

    var points = PointUtils.getDefaultPointSet();

    var quaternion_30 = (new ThreeQuaternion()).fromEuler(
        // Around z-axis
        [0, 0, 1],
        // 90°,
        THREE.Math.degToRad(-30)
    );

    QuatUtils.applyQuaternion(points, quaternion_30);
    GeneralUtils.printPoints(points, 0x00ffff);

}