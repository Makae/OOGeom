function task_quaternion_axis() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();
    /* Around z-axis / 90deg */
    var quaternion90 = (new ThreeQuaternion()).fromEuler(
        [0, 0, 1],
        THREE.Math.degToRad(90/*#float*/)
    );
    // test
    QuatUtils.applyQuaternion(points, quaternion90);
    GeneralUtils.printPoints(points, 0x0000ff/*#color*/);

    var points = PointUtils.getDefaultPointSet3D();
    
    /* Around z-axis / 90deg */
    var quaternion_30 = (new ThreeQuaternion()).fromEuler(
        [0, 0, 1],
        THREE.Math.degToRad(-30/*#float*/)
    );

    QuatUtils.applyQuaternion(points, quaternion_30);
    GeneralUtils.printPoints(points, 0x00ffff/*#color*/);

}

function task_quaternion_3daxis() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();
    /* Around z-axis / 90deg */
    var quaternion90xy = (new ThreeQuaternion()).fromEuler(
        [0, 1 / Math.sqrt(2), 1 / Math.sqrt(2)],
        THREE.Math.degToRad(-90/*#float*/)
    );
    // test
    QuatUtils.applyQuaternion(points, quaternion90xy);
    GeneralUtils.printPoints(points, 0x0000ff/*#color*/);
}

function task_quaternion_translation() {
    GeneralUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    
    var points = PointUtils.getDefaultPointSet3D();
    /* Around z-axis / 90deg */
    // var quaternionZ = (new ThreeQuaternion()).fromArray([0, 0, 0, -2])
    
    // test
    QuatUtils.applyQuaternion(points, quaternionZ);
    GeneralUtils.printPoints(points, 0x0000ff/*#color*/);
}
