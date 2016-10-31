function Line(my, y, mz, z) {
    this.my = my;
    this.y = y;
    this.mz = mz | 0;
    this.z = z | 0;
}

Line.prototype.asVectorSet = function() {
    return [
        new THREE.Vector3(0, this.y, this.z),
        new THREE.Vector3(1, 1 * this.my, 1 * this.mx)
    ];
}