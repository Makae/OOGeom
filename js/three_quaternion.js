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

ThreeQuaternion.prototype.add = function(q) {
    var e = this._add(this, q);
    return (new ThreeQuaternion()).fromArray(e);
};

ThreeQuaternion.prototype.subtract = function(q) {
    var e = this._subtract(this, q);
    return (new ThreeQuaternion()).fromArray(e);
};

ThreeQuaternion.prototype.multiply = function(q) {
    var e = this._multiply(this, q);
    return (new ThreeQuaternion()).fromArray(e);
};

ThreeQuaternion.prototype.conjugate = function() {
    var c = this._conjugate(this);
    return (new ThreeQuaternion()).fromArray(c);
};

ThreeQuaternion.prototype.normalize = function(q) {
    var n = this._normalize(this);
    return (new ThreeQuaternion()).fromArray(n);
};

ThreeQuaternion.prototype.fromQuaternion = function(quat) {
    return this.fromArray(quat.asArray());
};