function affine_project_plane() {
    PrintUtils.printPoints(PointUtils.getDefaultPointSet3D(), 0x00ff00/*#color*/);
    var points = PointUtils.getDefaultPointSet();
    
    var plane_position = VectorUtils.ORIGIN.clone();
    var plane_normal = VectorUtils.UNIT_Y.clone();

    var vp = new THREE.Vector3(26/*#float*/, 60/*#float*/, 26/*#float*/)

    var plane_distance = plane_position.clone().add()

    var new_points = [];    
    PrintUtils.printPoints(new_points, 0x00ff00/*#color*/);
    PrintUtils.printPoints(vp, 0xff0000)
    /* Show plane */
    PrintUtils.printPlane(plane_position, plane_normal, 150, 0xddaa00/*#color*/, 0.75);
 }