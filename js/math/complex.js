function Complex(real, imaginary) {
    this.real = real;
    this.imaginary = imaginary;
}

Complex.prototype.getImaginary = function() {
    return this.imaginary;
}

Complex.prototype.getReal = function() {
    return this.real;
}

Complex.prototype.getAngle = function() {
    if(this.real > 0) {
        return Math.atan(this.imaginary / this.real);
    } else if(this.real == 0) {
        if(this.imaginary > 0) {
            return Math.PI / 2;
        } else if(this.imaginary < 0) {
            return -Math.PI / 2;
        } else if (this.imaginary == 0){
            return undefined;
        }
    } else if (this.real < 0) {
        if(this.imaginary  >= 0) {
            return Math.atan(this.imaginary / this.real) + Math.PI;
        } else if(this.imaginary < 0) {
            return Math.atan(this.imaginary / this.real) - Math.PI;
        }
    }
}

Complex.prototype.getRadius = function() {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
}