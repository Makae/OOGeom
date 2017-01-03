/*
 * For more infos check:
 * https://wiki.delphigl.com/index.php/Dual_Quaternion
 */
function VectorCalc(v) {
    this.v = v || [0, 0, 0];
    this.calculation = [
        this.v[0],
        this.v[1],
        this.v[2]
    ];
}

VectorCalc.prototype.result = function() {
    return this.calculation;
};

VectorCalc.prototype.clone = function() {
    return new VectorCalc(this.calculation);
};

VectorCalc.prototype.cross = function(v2) {
    var v2 = v2 instanceof VectorCalc ? v2.result() : v2;
    this.calculation = [
        this.calculation[1] * v2[2] - this.calculation[2] * v2[1],
        this.calculation[2] * v2[0] - this.calculation[0] * v2[2],
        this.calculation[0] * v2[1] - this.calculation[1] * v2[0]
    ];
    return this;
};

VectorCalc.prototype.multiply = function(v2) {
    var v2 = v2 instanceof VectorCalc ? v2.result() : v2;
    this.calculation = [
        this.calculation[0] * v2[0],
        this.calculation[1] * v2[1],
        this.calculation[2] * v2[2]
    ];
    return this;
};

VectorCalc.prototype.multiplyScalar = function(s) {
    this.calculation = [
        this.calculation[0] * s,
        this.calculation[1] * s,
        this.calculation[2] * s
    ];
    return this;
};

VectorCalc.prototype.add = function(v2) {
    var v2 = v2 instanceof VectorCalc ? v2.result() : v2;
    this.calculation = [
        this.calculation[0] + v2[0],
        this.calculation[1] + v2[1],
        this.calculation[2] + v2[2]
    ];
    return this;
};

VectorCalc.prototype.subtract = function(v2) {
    var v2 = v2 instanceof VectorCalc ? v2.result() : v2;
    this.calculation = [
        this.calculation[0] - v2[0],
        this.calculation[1] - v2[1],
        this.calculation[2] - v2[2]
    ];
    return this;
};

function PersistentVectorCalc(v) {
    this.parent = new VectorCalc();
    // Call parent constructor
    VectorCalc.call(this, v);
}

PersistentVectorCalc.prototype = Object.create(new VectorCalc());

PersistentVectorCalc.prototype.clone = function() {
    return new PersistentVectorCalc(this.calculation);
};

PersistentVectorCalc.prototype.cross = function(v2) {
    return this.parent.cross.apply(this.clone(), arguments);
};

PersistentVectorCalc.prototype.multiply = function(v2) {
    return this.parent.multiply.apply(this.clone(), arguments);
};

PersistentVectorCalc.prototype.multiplyScalar = function(s) {
    return this.parent.multiplyScalar.apply(this.clone(), arguments);
};

PersistentVectorCalc.prototype.add = function(v2) {
    return this.parent.add.apply(this.clone(), arguments);
};

PersistentVectorCalc.prototype.subtract = function(v2) {
    return this.parent.subtract.apply(this.clone(), arguments);
};
