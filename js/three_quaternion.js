function ThreeQuaternion(a, i, j, k) {
     this.parent = this.__proto__;
    // Call parent constructor
    Quaternion.call(this, a, i, j, k);
}

ThreeQuaternion.prototype = Object.create(new Quaternion());

ThreeQuaternion.prototype.applyToVector = function(vec) {
    var v = Quaternion.prototype.applyToVector.call(
        this, 
        [
            vec.x,
            vec.y,
            vec.z
        ]
    );

    vec.x = v[0];
    vec.y = v[1];
    vec.z = v[2];

    return vec;

};