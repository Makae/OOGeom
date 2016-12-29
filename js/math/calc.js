/*
 * For more infos check:
 * https://wiki.delphigl.com/index.php/Dual_Quaternion
 */
function VectorCalc(v) {
    this.v = v;
    this.calculation = [
        v[0],
        v[1],
        v[2]
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
    ]
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

VectorCalc.prototype.sub = function(v2) {
    var v2 = v2 instanceof VectorCalc ? v2.result() : v2;
    this.calculation = [
        this.calculation[0] - v2[0],
        this.calculation[1] - v2[1],
        this.calculation[2] - v2[2]
    ];
    return this;
};
