
function Matrix2() {

    this.elements = new Float32Array( [
        1, 0,
        0, 1,
    ]);

    if ( arguments.length > 0 ) {

        console.error( 'THREE.Matrix2: the constructor no longer reads arguments. use .set() instead.' );

    }

}

Matrix2.prototype = {

    constructor: Matrix2,

    isMatrix2: true,

    set: function (n11, n12, n21, n22) {

        var te = this.elements;

        te[ 0 ] = n11; te[ 2 ] = n12;
        te[ 1 ] = n21; te[ 3 ] = n22;

        return this;

    },

    identity: function () {

        this.set(
            1, 0,
            0, 1
        );

        return this;

    },

    clone: function () {

        return new Matrix2().fromArray( this.elements );

    },

    copy: function ( m ) {

        this.elements.set( m.elements );

        return this;

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        for( var i = 0; i < 4; i ++ ) {

            this.elements[ i ] = array[ i + offset ];

        }

        return this;

    },

    multiply: function ( m, n ) {

        if ( n !== undefined ) {

            console.warn( 'THREE.Matrix2: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
            return this.multiplyMatrices( m, n );

        }

        return this.multiplyMatrices( this, m );

    },


    multiplyMatrices: function ( a, b ) {

        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;

        var a11 = ae[ 0 ], a12 = ae[ 2 ];
        var a21 = ae[ 1 ], a22 = ae[ 3 ];

        var b11 = be[ 0 ], b12 = be[ 2 ];
        var b21 = be[ 1 ], b22 = be[ 3 ];

        te[ 0 ] = a11 * b11 + a12 * b21;
        te[ 1 ] = a21 * b11 + a22 * b21;
        te[ 2 ] = a11 * b12 + a12 * b22;
        te[ 3 ] = a21 * b12 + a22 * b22;


        return this;

    },

    multiplyScalar: function ( s ) {

        var te = this.elements;

        te[ 0 ] *= s;
        te[ 1 ] *= s; 
        te[ 2 ] *= s;
        te[ 3 ] *= s;

        return this;

    },

    getInverse: function (mat2) {
        var mat3 = new THREE.Matrix3();
        mat3.set(
            mat2.elements[0], mat2.elements[2], 0,
            mat2.elements[1], mat2.elements[3], 0,
            0,                               0, 1
        );

        var inv = (new THREE.Matrix3()).getInverse(mat3);
        return (new THREE.Matrix2()).set(
            inv.elements[0], inv.elements[3],
            inv.elements[1], inv.elements[4]
        );
    }


};

THREE.Matrix2 = Matrix2;