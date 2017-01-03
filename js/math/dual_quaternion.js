/*
 * For more infos check:
 * https://wiki.delphigl.com/index.php/Dual_Quaternion
 */
function DualQuaternion(r, d) {
    if(r instanceof Quaternion)
        r.normalizeApply();
    this.r = r; // Real part
    this.d = d; // Dual part
}

DualQuaternion.prototype.fromArray = function(arr) {
    this.r = arr[0].normalize(); 
    this.d = arr[1]; 

    return this;
};

DualQuaternion.prototype.asArray = function() {
    var arr = [];
    arr[0] = this.r; 
    arr[1] = this.d; 

    return arr;
};

DualQuaternion.prototype.applyToVector = function(v) {

    var p = new DualQuaternion(
        new Quaternion(1, 0, 0, 0), 
        new Quaternion(0, v[0], v[1], v[2])
    );

    // qpq*
    var q = this.normalize();
    var q_1 = this.conjugate();
    var result = q.multiply(p).multiply(q_1);
    
    v[0] = result.d.i;
    v[1] = result.d.j;
    v[2] = result.d.k;

    return v;


};

// Applies it to the context quaternion
DualQuaternion.prototype.multiplyApply = function(dq) {
    var ndq = this._multiply(this, dq);
    return this.fromArray(ndq);
};

DualQuaternion.prototype.addApply = function(dq) {
    var ndq = this._add(this, dq);
    return this.fromArray(ndq);
};

DualQuaternion.prototype.multiply = function(dq) {
    var ndq = this._multiply(this, dq);
    return (new DualQuaternion()).fromArray(ndq);
};

DualQuaternion.prototype.add = function(dq) {
    var ndq = this._add(this, dq);
    return (new DualQuaternion()).fromArray(ndq);
};

DualQuaternion.prototype.subtract = function(dq) {
    var ndq = this._subtract(this, dq);
    return (new DualQuaternion()).fromArray(ndq);
};

DualQuaternion.prototype.conjugate = function() {
    var c = this._conjugate(this);
    return (new DualQuaternion()).fromArray(c);
};

DualQuaternion.prototype.normalize = function() {
    var n = this._normalize(this);
    return (new DualQuaternion()).fromArray(n);
};

DualQuaternion.prototype.normalizeApply = function() {
    var ndq = this._normalize(this);
    return this.fromArray(ndq);
};

DualQuaternion.prototype.isUnit = function() {
    // Unshure if correct
    var n = this.r.conjugate().multiply(this.d).add(this.d.conjugate().multiply(this.r));
    n.normalize();

    if(n.a + n.i + n.j + n.k == 0)
        return true;
    return false;
};

DualQuaternion.prototype.isPure = function() {
};

DualQuaternion.prototype._add = function(dq1, dq2) {
    return [
        dq1.r.add(dq2.r),
        dq1.d.add(dq2.d)
    ];
};

DualQuaternion.prototype._subtract = function(dq1, dq2) {
    return [
        dq1.r.subtract(dq2.r),
        dq1.d.subtract(dq2.d)
    ];
};

DualQuaternion.prototype._multiply = function(dq1, dq2) {
    return [
        dq1.r.multiply(dq2.r),
        dq1.r.multiply(dq2.d).add(dq1.d.multiply(dq2.r))
    ];
};


// Check: http://stackoverflow.com/questions/23174899/properly-normalizing-a-dual-quaternion
DualQuaternion.prototype._normalize = function(dq) {
    var magnitude = dq.r.magnitude();
    return [
        dq.r.multiplyScalar(1 / magnitude),
        dq.d.multiplyScalar(1 / magnitude)
    ]
};

// Check: http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/other/dualQuaternion/functions/index.htm
// Important to take the third conjugate!
DualQuaternion.prototype._conjugate = function(dq) {
    return [
        dq.r.conjugate(),
        dq.d.conjugate().multiplyScalar(-1)
    ]
};