var config = {
    app : {
        content_path : "content/",
    },

    example_block: {
    },

    codepeeker: {
        width: 640,
        height: 600,
        codelinks : [
            {
                'id' : 'utils',
                'replace' : '<span data-codepeeker-fn="$1">$1</span>(',
                'patterns' : [
                    /(PrintUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /(PointUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /(VectorUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /(MatrixUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /(GeneralUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /(DualQuatUtils\.[a-zA-Z0-9_]+)\(/gi,
                    /[^l](QuatUtils\.[a-zA-Z0-9_]+)\(/gi
                ]
            },
            {
                'id' : 'threejs-vector3',
                'replace' : '<span data-codepeeker-fn="THREE.Vector3.prototype.$2">$1$2</span>(',
                'patterns' : [
                    /(\.)(applyMatrix3)\(/gi
                ]
            },
            {
                'id' : 'quaternion',
                'replace' : '<span data-codepeeker-fn="Quaternion.prototype.$2">$1</span>',
                'patterns' : [
                    /(quaternion[a-zA-Z0-9_]*\.([a-zA-Z0-9_]+)\()/gi
                ]
            },
            {
                'id' : 'dual-quaternion',
                'replace' : '<span data-codepeeker-fn="DualQuaternion.prototype.$2">$1</span>',
                'patterns' : [
                    /(dual_quaternion[a-zA-Z0-9_]*\.([a-zA-Z0-9_]+)\()/gi
                ]
            },
            {
                'id' : 'complex-numbers',
                'replace' : '<span data-codepeeker-fn="Complex.prototype.$2">$1</span>',
                'patterns' : [
                    /(complex[a-zA-Z0-9_]*\.([a-zA-Z0-9_]+)\()/gi
                ]
            }
        ]
    },

    block_builder : {
        'threejs-orto' : {
            tpl: "exampleblocks/threejs-orto.html"
        },
        'code' : {
            tpl: "exampleblocks/code.html"
        },
    },

    camera : {
      orto: {
        'x' : 0,
        'y' : 0,
        'z' : 200,
        'near' : 1,
        'far' : 6000,
        'fov' : 60,
        'minDistance' : 100,
        'maxDistance' : 6000 / 8
      }
    }
};