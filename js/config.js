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
                    /(PrintUtils\.[^\(]+)\(/gi,
                    /(PointUtils\.[^\(]+)\(/gi,
                    /(MatrixUtils\.[^\(]+)\(/gi,
                    /(GeneralUtils\.[^\(]+)\(/gi,
                ]
            },
            {
                'id' : 'threejs-vector3',
                'replace' : '<span data-codepeeker-fn="THREE.Vector3.prototype.$2">$1$2</span>(',
                'patterns' : [
                    /(\.)(applyMatrix3)\(/gi
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