function Quaternion(a, i, j, k) {
    this.a = a;
    this.i = i;
    this.j = j;
    this.k = k;
    
}

Quaternion.prototype.fromArray = function(arr) {
    this.a = arr[0]; 
    this.i = arr[1]; 
    this.j = arr[2];
    this.k = arr[3];

    return this;
};

Quaternion.prototype.asArray = function() {
    var arr = [];
    arr[0] = this.a; 
    arr[1] = this.i; 
    arr[2] = this.j;
    arr[3] = this.k;

    return arr;
};

/**
 * The axis has to be normalized
 */
Quaternion.prototype.fromEuler = function(axis, angle) {
    var e = this._fromEuler(axis, angle);
    return this.fromArray(e);
}

Quaternion.prototype.applyToVector = function(v) {
    var q = new Quaternion(0, v[0], v[1], v[2]);
    // q*vq
    var q_vq = this.conjugate().multiply(q).multiply(this);
    
    v[0] = q_vq.i;
    v[1] = q_vq.j;
    v[2] = q_vq.k;

    return v;
};

// Applies it to the context quaternion
Quaternion.prototype.multiplyApply = function(q) {
    var e = this._multiply(this, q);
    return this.fromArray(e);
};

Quaternion.prototype.addApply = function(q) {
    var e = this._add(this, q);
    return this.fromArray(e);
};

Quaternion.prototype.subtractApply = function(q) {
    var e = this._subtract(this, q);
    return this.fromArray(e);
};

Quaternion.prototype.add = function(q) {
    var e = this._add(this, q);
    return (new Quaternion()).fromArray(e);
};

Quaternion.prototype.subtract = function(q) {
    var e = this._subtract(this, q);
    return (new Quaternion()).fromArray(e);
};

Quaternion.prototype.multiply = function(q) {
    var e = this._multiply(this, q);
    return (new Quaternion()).fromArray(e);
};

Quaternion.prototype.multiplyScalar = function(s) {
    var e = this._multiplyScalar(this, s);
    return (new Quaternion()).fromArray(e);
};

Quaternion.prototype.multiplyScalarApply = function(s) {
    var e = this._multiplyScalar(this, s);
    return this.fromArray(e);;
};

Quaternion.prototype.magnitude = function() {
    return Math.sqrt(this.a * this.a + this.i * this.i + this.j * this.j + this.k * this.k);
}

Quaternion.prototype.conjugate = function() {
    var c = this._conjugate(this);
    return (new Quaternion()).fromArray(c);
};

Quaternion.prototype.normalize = function() {
    var n = this._normalize(this);
    return (new Quaternion()).fromArray(n);
};

Quaternion.prototype.normalizeApply = function() {
    var e = this._normalize(this);
    return this.fromArray(e);
};

Quaternion.prototype.dot = function(q) {
    return this._dot(this, q);
};

Quaternion.prototype.isUnit = function() {
    var n = this.normalize();

    if(n.a + n.i + n.j + n.k == 1)
        return true;
    return false;
};

Quaternion.prototype.isPure = function() {
    if(this.a == 0)
        return true;
    return false;
};


// More Infos: http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
Quaternion.prototype._fromEuler = function(axis, angle) {
    angle /= 2;
    var s_ha = Math.sin(angle);

    return [
        Math.cos(angle),
        s_ha * axis[0],
        s_ha * axis[1],
        s_ha * axis[2]
    ];
}

Quaternion.prototype._add = function(q1, q2) {
    return [
        q1.a + q2.a,
        q1.i + q2.i, 
        q1.j + q2.j,
        q1.k + q2.k,
    ];
};

Quaternion.prototype._subtract = function(q1, q2) {
    return [
        q1.a - q2.a,
        q1.i - q2.i, 
        q1.j - q2.j,
        q1.k - q2.k,
    ];
};

Quaternion.prototype._multiply = function(q1, q2) {
    // Formula for Quaternion multiplication:
    // (r1, v1)*(r2, v2) = (r1*r2 - v1°v2, r1*v2 + r2*v1 + v1 x v2)
    // Cross product
    // var cross = [
    //     q1.j * q2.k - q1.k * q2.j,
    //     q1.k * q2.i - q1.i * q2.k
    //     q1.i * q2.j - q1.j * q2.i,
    // ];

    return [
    // q1   * q2   - v1 ° v2
        q1.a * q2.a - q1.i * q2.i - q1.j * q2.j - q1.k * q2.k,
    //  r1   * v2   + r2   * v1   + v1 x v2
        q1.a * q2.i + q2.a * q1.i + q1.j * q2.k - q1.k * q2.j,
        q1.a * q2.j + q2.a * q1.j + q1.k * q2.i - q1.i * q2.k,
        q1.a * q2.k + q2.a * q1.k + q1.i * q2.j - q1.j * q2.i
    ];
};

Quaternion.prototype._multiplyScalar = function(q, s) {
    return [
        q.a * s,
        q.i * s,
        q.j * s,
        q.k * s
    ];
};

Quaternion.prototype._dot = function(q1, q2) {
    return q1.a * q2.a + q1.i * q2.i + q1.j * q2.j + q1.k * q2.k;
}

Quaternion.prototype._conjugate = function(q) {
    return [
        this.a,
        -this.i, 
        -this.j,
        -this.k
    ];
};

// Check: https://ch.mathworks.com/help/aerotbx/ug/quatnormalize.html
Quaternion.prototype._normalize = function(q) {
    var magnitude = this.magnitude();
    return [
        this.a / magnitude,
        this.i / magnitude, 
        this.j / magnitude,
        this.k / magnitude
    ];
};