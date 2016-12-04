var config = {
    app : {
        content_path : "content/",
    },

    block_builder : {
        'threejs-orto' : {
            tpl: "exampleblocks/threejs-orto.html"
        }
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