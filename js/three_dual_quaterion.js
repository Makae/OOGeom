function ThreeDualQuaternion(r, d) {
     this.parent = this.__proto__;
    // Call parent constructor
    DualQuaternion.call(this, r, d);
}

ThreeDualQuaternion.prototype = Object.create(new DualQuaternion());

ThreeDualQuaternion.prototype.applyToVector = function(vec) {
    var v = DualQuaternion.prototype.applyToVector.call(
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



ThreeDualQuaternion.prototype.multiply = function(dq) {
    var ndq = this._multiply(this, dq);
    return (new ThreeDualQuaternion()).fromArray(ndq);
};

ThreeDualQuaternion.prototype.add = function(dq) {
    var ndq = this._add(this, dq);
    return (new ThreeDualQuaternion()).fromArray(ndq);
};

ThreeDualQuaternion.prototype.subtract = function(dq) {
    var ndq = this._subtract(this, dq);
    return (new ThreeDualQuaternion()).fromArray(ndq);
};

ThreeDualQuaternion.prototype.conjugate = function() {
    var c = this._conjugate(this);
    return (new ThreeDualQuaternion()).fromArray(c);
};

ThreeDualQuaternion.prototype.normalize = function(dq) {
    var n = this._normalize(this);
    return (new ThreeDualQuaternion()).fromArray(n);
};

ThreeDualQuaternion.prototype.fromQuaternion = function(quat) {
    return this.fromArray(quat.asArray());
};