function Plane(a, b, c, x, y, z, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.x = x;
    this.y = y;
    this.z = z;

    this.d = d || 0;
}

Plane.prototype.fromNormalVector = function(position, normal) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;

    this.a = normal.x;
    this.b = normal.y;
    this.c = normal.z;
    
    this.d =  this.a * this.x + this.b * this.y + this.c * this.z;
}


Plane.prototype.asVectorSet = function() {
    return [
        new THREE.Vector3(this.x, this.y, this.z),
        new THREE.Vector3(this.a, this.b, this.c),
        this.d
    ];
}