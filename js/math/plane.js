function Plane(a, x, b, y, c, z, d) {
    this.a = a;
    this.x = x;
    this.b = b;
    this.y = y;
    this.c = c;
    this.z = z;
    this.d = d;
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
        new THREE.Vector3(this.a, this.b, this.c)
    ];
}