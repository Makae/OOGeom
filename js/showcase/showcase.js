var Showcase = function(config) {
  this.container  = config.container;
  this.model   = config.model || null;
  this.camera  = null;
  this.camera_control = null;
  this.scene    = null;
  this.renderer = null;



  this.wireframe = null;
  this.wireframe_active = false;
  this.grid = null;
  this.grid_active = false;
  this.axis = null;
  this.axis_active = false;

  this.callbacks = config.on || {};

  // CAMERA
  this.camera_config = config.camera || {
    'x' : 0,
    'y' : 0,
    'z' : 5,
    'near' : 1,
    'far' : 6000,
    'minDistance': 10,
    'maxDistance' : 1000
  };


  // LIGHT CONFIG
  this.light_config = {};
  var light_config = config.light_config || {};
  this.light_config.ambient = light_config.ambient || {
    'color':  0xffffffff
  };
  this.light_config.point = light_config.point || {
      'color' : 0xffffffff,
      'intensity' : 2,
      'x' : 30,
      'y' : 30,
      'z' : 30,
  };

  this.init();
};

Showcase.prototype.setOrthoDistance = function(dist) {
  var aspect = this.container.offsetWidth / this.container.offsetHeight;
  this.camera.left = -dist * aspect;
  this.camera.right = dist * aspect;
  this.camera.top = dist;
  this.camera.bottom = -dist;
  this.camera.position.z = dist;
}

Showcase.prototype.init = function() {

  //this.camera = new THREE.PerspectiveCamera(this.camera_config.fov, this.container.offsetWidth / this.container.offsetHeight, this.camera_config.near, this.camera_config.far);
  var d = 100;
  var aspect = this.container.offsetWidth / this.container.offsetHeight;
  this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
  // debugger;
  this.camera.position.x = this.camera_config.x;
  this.camera.position.y = this.camera_config.y;
  this.camera.position.z = this.camera_config.z;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  this.scene = new THREE.Scene();

  this.initRoom();
  this.initRenderer();
  this.registerControls(this.model);
  this.initAnimation();
};

Showcase.prototype.initRoom = function() {

  var ambient_light = new THREE.AmbientLight(this.light_config.ambient.color);
  this.scene.add(ambient_light);

  point_light = new THREE.PointLight(this.light_config.point.color, this.light_config.point.intensity);
  point_light.position.set(this.light_config.point.x, this.light_config.point.y, this.light_config.point.z);
  this.scene.add(point_light);

};

Showcase.prototype.loadSkybox = function(skybox_config, success) {
  if(this.skybox)
    this.scene.remove(this.skybox.mesh);

  this.skybox_config = skybox_config;

  this.skybox = new Skybox(skybox_config);
  this.scene.add(this.skybox.mesh);

  if(typeof success == 'function')
    success(this.skybox);
};

Showcase.prototype.initRenderer = function() {
  this.renderer = new THREE.WebGLRenderer({antialiasing: true, preserveDrawingBuffer: true});

  this.renderer.setClearColor(0x555555);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

  this.container.appendChild(this.renderer.domElement);
};

Showcase.prototype.registerControls = function(object) {
  this.camera_control = new THREE.TrackballControls(this.camera, this.renderer.domElement);
  this.camera_control.panCamera = function() {};
  //this.camera_control = new THREE.CustomControls(object, this.renderer.domElement);
  // this.camera_control = new THREE.MouseControls(object);
  // this.camera_control.rotateSpeed = 0.5;
  this.camera_control.minDistance = this.camera_config.minDistance;
  this.camera_control.maxDistance = this.camera_config.maxDistance;
  //this.camera_control.addEventListener( 'change', render );
};

Showcase.prototype.addObject = function(obj) {
    this.scene.add(obj);
}

Showcase.prototype.cleanObjects = function() {
    var found = [];
    for(var i = 0; i < this.scene.children.length; i++) {
      if(showcase.scene.children[0] instanceof THREE.AmbientLight ||
        showcase.scene.children[0] instanceof THREE.PointLight ||
        showcase.scene.children[0] instanceof THREE.LineSegments)
        continue;
      found.push(this.scene.children[i]);
    }

    for(var n = 0; n < found.length; n++)
      this.scene.remove(found[n]);
}

Showcase.prototype.initAnimation = function() {
  var self = this;

  var update = function() {
    if(self.camera_control)
        self.camera_control.update();

    self.triggerListener('update');
    self.renderer.render(self.scene, self.camera);
  };

  var animate = function() {
    requestAnimationFrame(animate);
    self.triggerListener('animate');
    update();
  };

  animate();
};

Showcase.prototype.setModel = function(model) {
  if(this.model)
    this.scene.remove(this.model);
  this.model = model;
  this.scene.add(this.model);
};

Showcase.prototype.focusModel = function() {
  if(!this.model)
    return;

  this.registerControls(this.model);
  this.camera.lookAt(this.model);
};

Showcase.prototype.registerListener = function(name, callback) {
  if(typeof callback != 'function')
    return;
  this.callbacks[name] = callback;
};

Showcase.prototype.unregisterListener = function(name) {
  if(typeof callback != 'function')
    return;
  this.callbacks[name] = null;
};

Showcase.prototype.triggerListener = function(name, data) {
  if(typeof this.callbacks[name] == 'undefined')
    return;

  this.callbacks[name].apply(this, {
    'evt' : name,
    'showcase' : this,
    'data': data
  });
};


Showcase.prototype.getModel = function() {
  return this.model;
};

Showcase.prototype.toggleWireframe = function() {
    if(!this.wireframe) {
        var model;
        if(this.model instanceof THREE.Group) {
            model = this.model.children[0];
        } else {
            model = this.model;
        }
        this.wireframe = new THREE.WireframeHelper(model, 0xff0000 );
    }

    if(this.wireframe_active)
        this.scene.remove(this.wireframe);
    else
        this.scene.add(this.wireframe);

    this.wireframe_active = !this.wireframe_active;
};

Showcase.prototype.toggleGrid = function() {
    if(!this.grid) {
        var size = 400;
        var step = 10;

        this.grid = new THREE.GridHelper( size, step );
        this.grid.rotation.x = Math.PI / 2;
    }


    if(this.grid_active)
        this.scene.remove(this.grid);
    else
        this.scene.add(this.grid);

    this.grid_active = !this.grid_active;
};

Showcase.prototype.toggleAxis = function() {
    if(!this.axis) {
        this.axis = ShowcaseUtilities.addAxis(this.scene);
        this.axis_active = true;
        return;
    }

    for(var i in this.axis)
        if(this.axis_active)
            this.scene.remove(this.axis[i]);
        else
            this.scene.add(this.axis[i]);

    this.axis_active = !this.axis_active;
};

Showcase.prototype.createModelSnapshot = function(type, padding_w, padding_h, cbk) {
    type = type || 'dataurl';
    var canvas = this.renderer.domElement;

    var c = raptus_theme.showcase3d.showcaseapp.showcase.camera;
    var m = raptus_theme.showcase3d.showcaseapp.getShowcase().model;
    var cw = this.renderer.domElement.width;
    var ch = this.renderer.domElement.height;

    var width  = ShowcaseUtilities.getWidthOfObjectOnScreen(c, m, cw) + padding_w;
    var height = ShowcaseUtilities.getHeightOfObjectOnScreen(c, m, ch) + padding_h;

    var left = (cw  - width) / 2;
    var top  = ((ch  - height) / 2);

    var left_overlap = left + width - cw;
    var top_overlap  = top + height - ch;
    if(top_overlap > 0) {
        top    -= top_overlap / 2;
        height -= top_overlap / 2;
    }

    if(left_overlap > 0) {
        left  -= left_overlap / 2;
        width -= left_overlap / 2;
    }

    left = Math.min(cw, Math.max(0, left));
    top  = Math.min(ch, Math.max(0, top));

    ShowcaseUtilities.createCanvasSnapshot(canvas, left, top, width, height, type, cbk);
};

Showcase.prototype.toggleGeometryLabels = (function() {
    var enabled = false;
    var sprites = [];

    return function() {
        enabled = !enabled;
        if(enabled) {
            sprites = ShowcaseUtilities.labelGeometry(this.scene, this.model.children[0].geometry);
        } else {
            for(var i = 0; i<sprites.length; i++) {
                scene.remove(sprites[i]);
            }
        }
    }
})();

Showcase.prototype.toggleRaycastDebug = (function() {
    var initialized = false;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var triangles = [];
    var sprites = [];
    var triangle_mat = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    });

    var mouse_move = function(event) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.offsetX / this.offsetWidth ) * 2 - 1;
        mouse.y = - ( event.offsetY /this.offsetHeight ) * 2 + 1;

        console.log(mouse);
    };

    var clean_triangles = function(scene, triangles) {
        for(var i = 0; i < triangles.length; i++)
            scene.remove(triangles[i]);
    };

    var clean_sprites = function(scene, sprites) {
        for(var i = 0; i < sprites.length; i++)
            scene.remove(sprites[i]);
    };

    var add_triangle = function(scene, a, b, c) {
        var geom = new THREE.Geometry();
        // b = new THREE.Vector3(0, 500, 0);
        // a = new THREE.Vector3(500, 0, 0);
        // c = new THREE.Vector3(0, 0, 500);
        geom.vertices.push(a);
        geom.vertices.push(b);
        geom.vertices.push(c);

        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.computeFaceNormals();

        var mesh = new THREE.Mesh(geom, triangle_mat);
        // mesh.position.set(pos.x, pos.y, pos.z);
        // mesh.rotation.set(rot.x, rot.y, rot.z, rot.order);
        // mesh.scale.set(scale.x, scale.y, scale.z);
        // mesh.updateMatrix();

        scene.add(mesh);

        triangles.push(mesh);
    }

    var show_hit = function(scene, objects, camera, mouse, model) {
        clean_triangles(scene, triangles);
        clean_sprites(scene, sprites);
        sprites = [];
        triangles = [];
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(objects);

        var a,b,c;
        for(var i = 0; i < intersects.length; i++) {
            var test = intersects[i];
            if(!test.face)
                continue;

            var geometry = test.object.geometry;
            var iterator = new ShowcaseUtilities.GeometryIterator(geometry);
            iterator.setIndex(test.face.a);
            var triple_v = iterator.current();
            if(!iterator.dataAsVectors()) {
                a = (new THREE.Vector3()).fromArray(triple_v[0]);
                b = (new THREE.Vector3()).fromArray(triple_v[1]);
                c = (new THREE.Vector3()).fromArray(triple_v[2]);
            } else {
                a = triple_v[0];
                b = triple_v[1];
                c = triple_v[2];
            }

            /*
model.position,
                model.rotation,
                model.scale
            */
            // a.applyMatrix4(model.matrix);
            // b.applyMatrix4(model.matrix);
            // c.applyMatrix4(model.matrix);

            var offset = test.point.normalize().negate();
            model.updateMatrixWorld(true);

            sprites = sprites.concat(ShowcaseUtilities.labelFace(scene, [a, b, c], test.face.a + "," + test.face.b + "," + test.face.c));
            add_triangle(
                scene,
                a,// a.add(offset),
                b,// b.add(offset),
                c// c.add(offset)
            );
        }
    }

    var timeout;

    return function() {
        var self = this;
        self.raycast_debug_active = !self.raycast_debug_active;

        var call = function() {
            console.log("called");
            show_hit(self.scene, self.model.children, self.camera, mouse, self.model);
        };

        if(initialized === false) {
            timeout = window.setInterval(call, 50);
            self.renderer.domElement.addEventListener('mousemove', mouse_move, false);
        } else {
            window.clearinterval(timeout);
            window.removeEventListener('mousemove', mouse_move, false);
        }

    }
})();


console.log("LOADED 3D Showcase");