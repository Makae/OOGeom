/*
 * For more infos check:
 * https://wiki.delphigl.com/index.php/Dual_Quaternion
 */
function DualQuaternion(r, d) {    
    this.r = r; // Real part
    this.d = d; // Dual part
}

DualQuaternion.prototype.fromArray = function(arr) {
    this.r = arr[0]; 
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
    /*
     *               p0----------------------------------------------------------------------------------
     * v' = v + 2 * (cross(r.xyz,  cross(r.xyz, v) + r.w*v) + r.w*d.xyz - d.w*r.xyz + cross(r.xyz, d.xyz))
     *               G             E               F    D        C           B        A
     */
    var clc_v = new VectorCalc(v);
    var clc_r = new VectorCalc(this.r.asArray().splice(1));
    var clc_d = new VectorCalc(this.d.asArray().splice(1));
    // var A = clc_r.clone().cross(clc_d);
    // var B = clc_r.clone().multiply(this.d.a);
    // var C = clc_d.clone().multiply(this.r.a);
    // var D = clc_v.clone().multiply(this.r.a);
    // var E = clc_r.clone().cross(clc_v);
    // var F = E.add(D);
    // var G = clc_r.cross(F);
    // var p0 = G.add(C).add(B).add(A);
   
    var p0 = clc_r.cross(
            clc_r.clone()
                .cross(clc_v)
                .add(
                    clc_v.clone().multiplyScalar(this.r.a)
                )
        )
        .add(clc_d.clone().multiplyScalar(this.r.a))
        .add(clc_r.clone().multiplyScalar(this.d.a))
        .add(clc_r.clone().cross(clc_d))

    var v = clc_v.add(p0.multiplyScalar(2));

    return v.result();
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


DualQuaternion.prototype._normalize = function(dq) {
    return [
        dq.r.normalizeApply(),
        dq.d.subtract(dq.r.multiplyScalar(dq.r.dot(dq.d)))
    ]
};