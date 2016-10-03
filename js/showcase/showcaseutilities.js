var ShowcaseUtilities = (function() {
    var DEBUG = false;
    var DEBUG_CTR = 0;

    var GeometryIterator = function(geometry) {
        this.geometry = geometry;
        this.geometry_type = geometry instanceof THREE.BufferGeometry ? this.G_TYPE.BUFFER : this.G_TYPE.OBJECT;
        this.geometry_by_index = false;
        this.increment = this.geometry_type == this.G_TYPE.BUFFER ? 3 : 1;
        this.idx = -this.increment;

        if(this.geometry_type == this.G_TYPE.BUFFER && typeof geometry.attributes.index != 'undefined')
            this.geometry_by_index = true;

    };

    GeometryIterator.prototype.G_TYPE = {
        BUFFER: 0,
        OBJECT: 1
    };

    GeometryIterator.prototype.D_TYPE = {
        VERTICES: 0
    };

    GeometryIterator.prototype.currentIdx = function() {
        return this.idx;
    };

    GeometryIterator.prototype.setIndex = function(idx) {
        this.idx = idx;
    };

    GeometryIterator.prototype.next = function() {
        this.idx += this.increment;
        return this.current();
    };

    GeometryIterator.prototype.current = function() {
        if(this.idx < 0)
            throw "Invalid Index: " + this.idx + " for method GeometryIterator::curent";

        if(this.geometry_type == this.G_TYPE.BUFFER)
            return this._currentAsBuffer();
        else
            return this._currentAsObject();
    };

    GeometryIterator.prototype._currentAsBuffer = function() {
        var data = [];

        var next_idxs = this.currentSubIndexes();
        for(var i = 0; i < next_idxs.length; i++) {
            data.push([
                this.geometry.attributes.position.getX(next_idxs[i]),
                this.geometry.attributes.position.getY(next_idxs[i]),
                this.geometry.attributes.position.getZ(next_idxs[i])
            ]);
        }
        return data;
    };

    GeometryIterator.prototype._currentAsObject = function() {
        var data = [];

        var face = this.geometry.faces[this.idx];
        data.push(this.geometry.vertices[face.a]);
        data.push(this.geometry.vertices[face.b]);
        data.push(this.geometry.vertices[face.c]);


        return data;
    };

    GeometryIterator.prototype.dataAsVectors = function() {
        return this.geometry_type == this.G_TYPE.OBJECT;
    };

    GeometryIterator.prototype.hasNext = function() {
        if(this.geometry_type == this.G_TYPE.BUFFER)
            return this.idx + this.increment < this.geometry.attributes.position.count;
        else
            return this.idx + this.increment < this.geometry.faces.length;
    };

    GeometryIterator.prototype.currentSubIndexes = function() {
        if(this.geometry_by_index)
            return [this.geometry.attributes.index.getX(this.idx),
                    this.geometry.attributes.index.getY(this.idx),
                    this.geometry.attributes.index.getZ(this.idx)];
        return [this.idx, this.idx + 1, this.idx + 2];
    };


    var rad = 2 * Math.PI;
    var half_rad = Math.PI;
    var quart_rad = Math.PI / 2;
    var three_quart_rad = rad * 3 / 4;

    return {
        // Performance optimization, instead of recalculating the values for each operation

        'one_rad': rad,
        'half_rad': half_rad,
        'quart_rad': quart_rad,
        'three_quart_rad': three_quart_rad,

        'UP' :    new THREE.Vector3(0,  1,  0),
        'DOWN' :  new THREE.Vector3(0, -1,  0),
        'FRONT' : new THREE.Vector3(0,  0,  1),
        'BACK' :  new THREE.Vector3(0,  0, -1),
        'RIGHT' : new THREE.Vector3(1,  0,  0),
        'LEFT' :  new THREE.Vector3(-1, 0,  0),

        'MX_ROTATE_FRONT_TO_UP' : (new THREE.Matrix3()).set(
            Math.sin(three_quart_rad), 0, Math.cos(three_quart_rad),
            0,                   1, 0,
            Math.cos(three_quart_rad), 0  -Math.sin(three_quart_rad)
          ),

        'GeometryIterator' : GeometryIterator,

        loadTextureMaterial: function(placeholder, path) {
            var texture = new THREE.Texture(placeholder);
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                overdraw: 0.5
            });

            var image = new Image();

            image.onload = function() {
                texture.image = this;
                texture.needsUpdate = true;
            };
            image.src = path;

            return material;
        },

        loadTextureMaterialsByFragments: function(placeholder, prefix, suffix, fragments) {
            var textures = [];
            for (var i in fragments)
                textures.push(ShowcaseUtilities.loadTextureMaterial(placeholder, prefix + fragments[i] + suffix));

            return textures;
        },

        getTexturePaths: function(prefix, suffix, fragments) {
            var textures = [];
            for (var i in fragments)
                textures.push(prefix + fragments[i] + suffix);
            return textures;
        },

        makeRefractionMaterial: function(cube_texture, map, alpha_map, color, refraction_ratio) {
            var mat = raptus_threejs_materials.MeshReflectionOcclusion({
                color: color,
                envMap: cube_texture,
                map: map,
                alphaMap : alpha_map,
                transparent_color : '#00ff00',
                refractionRatio: refraction_ratio
            });
            // var mat = new THREE.MeshBasicMaterial({
            //     color: color,
            //     envMap: cube_texture,
            //     map: map,
            //     refractionRatio: refraction_ratio
            // });

            return mat;
        },

        reassignUVParameters: function(geometry, config) {
            if (config.type != 'sor')
                return geometry;
            return this._reassignUVinSOR(geometry, config.up);
        },

        _reassignUVinSOR: function(geometry, up) {

            geometry.computeBoundingBox();

            var max, min;
            if(up == ShowcaseUtilities.FRONT) {
                max = geometry.boundingBox.max.z;
                min = geometry.boundingBox.min.z;
            } else {
                max = geometry.boundingBox.max.y;
                min = geometry.boundingBox.min.y;
            }
            var range = max - min;


            var faceVertexUvs = [];

            var align_vector = new THREE.Vector2(0, 1);

            var geometry_iterator = new GeometryIterator(geometry);
            var data_as_vectors = geometry_iterator.dataAsVectors();
            var inc = -1;

            while(geometry_iterator.hasNext()) {
                inc++;
                var triple_v = geometry_iterator.next();
                var v1, v2, v3, v1_rot, v2_rot, v3_rot;
                if(!data_as_vectors) {
                    v1 = (new THREE.Vector3()).fromArray(triple_v[0]);
                    v2 = (new THREE.Vector3()).fromArray(triple_v[1]);
                    v3 = (new THREE.Vector3()).fromArray(triple_v[2]);
                } else {
                    v1 = triple_v[0];
                    v2 = triple_v[1];
                    v3 = triple_v[2];
                }

                // Make a copy of the vectory in order not to move the original
                // Vectors in the following rotation
                v1_rot = (new THREE.Vector3()).fromArray([v1.x, v1.y, v1.z]);
                v2_rot = (new THREE.Vector3()).fromArray([v2.x, v2.y, v2.z]);
                v3_rot = (new THREE.Vector3()).fromArray([v3.x, v3.y, v3.z]);


                v1_rot = v1_rot;

                if(up == ShowcaseUtilities.FRONT) {
                    v1_rot.applyAxisAngle(ShowcaseUtilities.RIGHT, -ShowcaseUtilities.quart_rad);
                    v2_rot.applyAxisAngle(ShowcaseUtilities.RIGHT, -ShowcaseUtilities.quart_rad);
                    v3_rot.applyAxisAngle(ShowcaseUtilities.RIGHT, -ShowcaseUtilities.quart_rad);
                }

                var uv1 = this.getCircleUVVector(v1_rot, align_vector);
                var uv2 = this.getCircleUVVector(v2_rot, align_vector);
                var uv3 = this.getCircleUVVector(v3_rot, align_vector);

                // We have to relocate (min) and rescale to the texture (range)
                uv1.y = (v1_rot.y - min) / range;
                uv2.y = (v2_rot.y - min) / range;
                uv3.y = (v3_rot.y - min) / range;

                // uv1.y = 0;
                // uv2.y = 0.25;
                // uv3.y = 0.5;

                // console.log(v1_rot.x, v1_rot.y);
                // console.log(uv1.x, uv1.y);
                // console.log("...");
                // console.log("...");

                /*
                 * If we are at the very end of the Circle (360°)
                 * Set the correct uv.x value according to the other to vertices
                 */
                this.preventTriangleUVBorderWrap(uv1, uv2, uv3);

                if(geometry instanceof THREE.BufferGeometry) {
                    var idxs = geometry_iterator.currentSubIndexes();
                    geometry.attributes.uv.setXY(idxs[0], uv1.x, uv1.y);
                    geometry.attributes.uv.setXY(idxs[1], uv2.x, uv2.y);
                    geometry.attributes.uv.setXY(idxs[2], uv3.x, uv3.y);
                } else {
                   faceVertexUvs.push([uv1, uv2, uv3]);
                }
            }

            if(!(geometry instanceof THREE.BufferGeometry)) {
                geometry.faceVertexUvs[0] = faceVertexUvs;
            }

            geometry.uvsNeedUpdate = true;
        },
        /**
         * Prevent triangle texture flip at the border ob 0° 360°
         * If a triangle is intersected by the 0-360° border line
         * the uv-values which are on the 0°-Side can't be lower than
         * the one on the 360°-Side or the Texture is displayed in
         * reverse.
         */
        preventTriangleUVBorderWrap : function(uv1, uv2, uv3) {
            if(uv1.x > 0.9 || uv2.x > 0.9 || uv3.x > 0.9) {
                if(uv1.x < 0.1 || uv2.x < 0.1 || uv3.x < 0.1) {
                    if(uv1.x < 0.1) {
                        uv1.x += 1;
                    }
                    if(uv2.x < 0.1) {
                        uv2.x += 1;
                    }
                    if(uv3.x < 0.1) {
                        uv3.x += 1;
                    }
                }
            }
        },

        // blub2
        getMeanX: function(vec1, vec2) {
            return vec1.x + vec2.x / 2;
        },
        /*
         * RED   = X-Axis
         * GREEN  = Y-Axis
         * BLUE = Z-Axis
         */
        addAxis: function(scene) {
            var sceneSize = 9000;
            var lines = [];
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [sceneSize, 0, 0],
                color: 0xff0000,
                scene: scene
            }));
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [-sceneSize, 0, 0],
                color: 0xff0000,
                dashed: true,
                scene: scene
            }));
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [0, sceneSize, 0],
                color: 0x00ff00,
                scene: scene
            }));
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [0, -sceneSize, 0],
                color: 0x00ff00,
                dashed: true,
                scene: scene
            }));
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [0, 0, sceneSize],
                color: 0x0000ff,
                scene: scene
            }));
            lines.push(this.line(scene, {
                begin: [0, 0, 0],
                end: [0, 0, -sceneSize],
                color: 0x0000ff,
                dashed: true,
                scene: scene
            }));
            return lines;
        },

        line: function(scene, cfg) {
            var p = cfg.begin;
            var q = cfg.end;
            if (cfg.color) {
                cfg.colorb = cfg.colorb || cfg.color;
                cfg.colore = cfg.colore || cfg.color;
            }
            var geometry = new THREE.Geometry();
            var material = cfg.dashed ? new THREE.LineDashedMaterial({
                linewidth: 1,
                color: cfg.color,
                dashSize: 1,
                gapSize: 1,
                depthWrite: false
            }) : new THREE.LineBasicMaterial({
                vertexColors: THREE.VertexColors,
                depthWrite: false
            });
            var cp = new THREE.Color(cfg.colorb);
            var cq = new THREE.Color(cfg.colore);

            geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
            geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
            geometry.colors.push(cp, cq);
            geometry.computeLineDistances();

            var line = new THREE.Line(geometry, material, THREE.LinePieces);
            scene.add(line);
            return line;
        },

        /*
         * Returns the textures values based on a circular model
         *
         * @param vertex : The vertex to which the UVVector shall be calculated
         * @param align_vector : The Center of the Circle
         *
         * @return Vector2 : Returns an UV-Vector (V-Value is 0 because it is caluclated in a plane)
         */
        getCircleUVVector: function(vertex, align_vector) {
            /*
             * There is a Problem with spherical objects:
             * when x and z are 0 the texture interpolation (aka. Gradient)
             * Each triplet of vertices which form a face have a different
             * Gradient and ugly edges or extreme distortions are visible
             */
            if (vertex.x === 0 && vertex.z === 0) {
                // console.log("x:0 y:0 -> u: " + 0.5);
                // console.log("------------------------------");
                // console.log("");
                // console.log("");
                return -1;
            }
            // console.log("Gettings u value of: " + counter);
            // console.log(vertex);

            // Create a planar vector in 2D
            var v_xy = new THREE.Vector2(vertex.x, vertex.z);
            // console.log("Planar vector");
            // console.log(vx);
            // console.log("Align vector");
            // console.log(align_vector);
            var angle = this.getAbsAngleCenterVector(align_vector, v_xy);
            // console.log("Angle:" + angle / this.one_rad * 360);

            // Get a Value between 0 and 1
            var u = 1 - angle / this.one_rad;
            // console.log("u: " + u);
            // console.log("------------------------------");
            // console.log("");
            // console.log("");
            return new THREE.Vector2(u, 0);

        },

        /*
         * Determine the angle between the provided vector and
         * a comparison vector (align_vector)
         *
         * Left of vector return_angle < 1xRad
         * Right of vector return_angle > 1xRad
         *
         * @param align_vector : The alignment vector to which the angle should be compared to
         * @param variable_vector : The vector to be compared
         *
         * @return angle : in RAD (Between 0 and 2Rad, where on 1Rad align_vector = varible_vector)
         *
        */
        getAbsAngleCenterVector: function(align_vector, variable_vector) {
            var tmp = new THREE.Vector2(variable_vector.x, variable_vector.y).normalize();
            var a_length = align_vector.length();
            var tmp_length = tmp.length();

            // Gives left or right of the vector (<0 -> Right | >0 -> Left)
            var perp = tmp.x * align_vector.y - tmp.y * align_vector.x;
            var sign = perp >= 0 ? -1 : 1;
            // Gives an angle between 0° and 180° But not if left or right
            var dot = align_vector.dot(tmp);
            // console.log("DotP:" + dot);

            var length = (a_length * tmp_length);
            // console.log("Length^2:" + length);

            var angle = Math.acos(dot / length);
            // console.log("AngelBetween:" + angle / this.one_rad * 360);
            return this.half_rad + sign * angle;

        },

        fmod: function(x, y) {
            //  discuss at: http://phpjs.org/functions/fmod/
            // original by: Onno Marsman
            //    input by: Brett Zamir (http://brett-zamir.me)
            // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //   example 1: fmod(5.7, 1.3);
            //   returns 1: 0.5

            var tmp, tmp2, p = 0,
                pY = 0,
                l = 0.0,
                l2 = 0.0;

            tmp = x.toExponential()
                .match(/^.\.?(.*)e(.+)$/);
            p = parseInt(tmp[2], 10) - (tmp[1] + '').length;
            tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/);
            pY = parseInt(tmp[2], 10) - (tmp[1] + '').length;

            if (pY > p) {
                p = pY;
            }

            tmp2 = (x % y);

            if (p < -100 || p > 20) {
                // toFixed will give an out of bound error so we fix it like this:
                l = Math.round(Math.log(tmp2) / Math.log(10));
                l2 = Math.pow(10, l);

                return (tmp2 / l2)
                    .toFixed(l - p) * l2;
            } else {
                return parseFloat(tmp2.toFixed(-p));
            }
        },

   /*
    * Gets a scaled Canvas Texture which fits the Texture used for the ShowcaseObject
    *
     /.>*----------------* <............\
Label|  |     object     |              |
Edge \.>|________________| <.\          |
        |                |   | Label    | Object
        |     LABEL      |   | Height   | height
        |________________| <./          |
        |                |              |
        |     object     |              |
        *________________* <............/
    *
    * @param source_canvas : DOM-Element of the canvas which contains the label image
    * @param label_height : The height of the physical label in [mm]
    * @param upperlabel_edge : The distance from the top of the physical object to the label in [mm]
    * @param object_height : The height of the physical object [mm]
    */
    getCanvasTexture : function(source_canvas, label_height, upper_label_edge, object_height, callbacks) {
        callbacks = typeof callbacks == 'object' ? callbacks : {};
        var $ = jQuery;
        if(DEBUG) {
            var $body_canvas = $('body>canvas');
            if($body_canvas.length)
                $body_canvas.remove();
        }

        var texture_canvas = document.createElement('canvas');

        var source_ctx  = source_canvas.getContext('2d');
        var texture_ctx = texture_canvas.getContext('2d');

        // The height in "percent" which is used up by the label on the object
        var label_ratio = label_height / object_height;
        // Rescale the texture so that when the label is copied it uses up exactly the height defined in label_ratio (percentage)
        var texture_height = source_ctx.canvas.height / label_ratio;
        var texture_width  = source_ctx.canvas.width;

        var label_edge_ratio = upper_label_edge  / parseInt(object_height);

        var offset_x = 0;
        var offset_y = texture_height * label_edge_ratio;

        if(typeof callbacks['pre_draw'] == 'function') {
            callbacks['pre_draw'](source_ctx, {
                'label_start' : offset_y,
                'label_end' : offset_y + source_canvas.height,
                'label_height' : source_canvas.height
            });
        }

        texture_canvas.setAttribute('height', texture_height);
        texture_canvas.setAttribute('width', texture_width);
        texture_canvas.height = texture_height;
        texture_canvas.width = texture_width;

        texture_ctx.beginPath();

        // Draw for Alpha-Channel image
        texture_ctx.rect(0, 0, texture_canvas.width, texture_canvas.height);
        texture_ctx.fillStyle = 'rgba(255,255,255,0)';
        texture_ctx.fill();
        texture_ctx.fillStyle = 'rgba(255,255,255,1)';
        texture_ctx.drawImage(source_canvas, offset_x, offset_y);


        // Get The AlphaTexture for the AlphaMap
        var imgData = texture_ctx.getImageData(0, 0, texture_ctx.canvas.width, texture_ctx.canvas.height);
        var alpha_texture = this.getAlphaTexture(this.to8BitAlphaImage(imgData), texture_canvas.width, texture_canvas.height);
        alpha_texture.needsUpdate = true;

        // Redraw image for correct background-alpha
        texture_ctx.clearRect(0, 0, texture_canvas.width, texture_canvas.height);
        texture_ctx.rect(0, 0, texture_canvas.width, texture_canvas.height);
        texture_ctx.fillStyle = 'rgba(255,255,255,1)';
        texture_ctx.fill();
        texture_ctx.drawImage(source_canvas, offset_x, offset_y);

        // Show the rendered canvas_label for debugging purposes
        if(DEBUG) {
            $('body').prepend(texture_canvas);
        }

        // Create Image texture for threejs
        var img_texture = new THREE.Texture(texture_canvas);
        img_texture.needsUpdate = true;

        // Prevent problems when unwrapping the texture on an object
        img_texture.wrapS = img_texture.wrapT = THREE.RepeatWrapping;
        alpha_texture.wrapS = alpha_texture.wrapT = THREE.RepeatWrapping;
        return [img_texture, alpha_texture];
    },

    getAlphaTexture : function(alpha_image, width, height) {
        var texture_canvas = document.createElement('canvas');
        var texture_ctx = texture_canvas.getContext('2d');

        texture_canvas.setAttribute('height', height);
        texture_canvas.setAttribute('width', width);

        texture_ctx.putImageData(alpha_image, 0, 0);
        if(DEBUG) {
            jQuery('body').prepend(texture_canvas);
        }
        // canvas contents are used for the texture
        return new THREE.Texture(texture_canvas);
    },

    getTestCanvasTexture : function() {
        var $ = jQuery;

        var texture_canvas = document.createElement('canvas');
        var texture_ctx = texture_canvas.getContext('2d');
        var c_width = 1000;
        var c_height = 1000;
        var n_tiles = 16;
        var t_width = c_width / n_tiles;
        var t_height = c_height / n_tiles;
        var c_block = 255 / n_tiles;

        texture_canvas.setAttribute('width', c_width);
        texture_canvas.setAttribute('height', c_height);
        for(var x = 0; x<=n_tiles; x++) {
            var x_pos = x * t_width;
            var g = x % 2 ? 200 : 100; //Math.min(255, parseInt(c_block * x)+ 80);
            for(var y = 0; y<=n_tiles; y++) {
                var y_pos = y * t_height;
                var r = y % 2 ? 200 : 100; //Math.min(255, parseInt(c_block * x)+ 80);
                var b = y % 2 ? 150 : 100; //Math.min(255, parseInt(c_block * x)+ 80);
                // var g = parseInt(Math.max(0, Math.min(255, 128 + (c_block * y * (y % 2 === 0 ? -1 : 1) / 2))));
                // var b = parseInt(c_block * (n_tiles - y));
                var fillStyle = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                texture_ctx.fillStyle = fillStyle;
                texture_ctx.fillRect(x_pos, y_pos, x_pos + t_width, y_pos + t_height);

                var coords = 'x:' + x + ' y:' + y;
                texture_ctx.fillStyle = '#090909';
                texture_ctx.font = '10px Arial';
                var x_coord = parseInt(x_pos + 5);
                var y_coord = parseInt(y_pos + 15);
                texture_ctx.fillText(coords, x_coord, y_coord);
            }
        }
        var $body_canvas = $('body>canvas');
        if($body_canvas.length)
            $body_canvas.remove();
        $('body').prepend(texture_canvas);
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(texture_canvas);
        texture.needsUpdate = true;
        return texture;
    },



    to8BitAlphaImage : function(img_data, channel, tot_channels, alpha_strength) {
        channel = channel || 3;
        tot_channels = tot_channels || 4;
        alpha_strength = alpha_strength || 0.5;
        for(var i = channel; i < img_data.data.length; i += tot_channels) {
            img_data.data[i-3] = 0; // RED
            img_data.data[i-2] = img_data.data[i]*alpha_strength; // GREEN used by ThreeJS
            img_data.data[i-1] = 0; // BLUE
            img_data.data[i]   = 255; // ALPHA not used by ThreeJS
        }

        return img_data;
    },

    createCanvasSnapshot : function(src_canvas, sX, sY, width, height, type, cbk) {
        var canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        var img = new Image();
        img.onload = function() {
            canvas.getContext('2d').drawImage(img, sX, sY, width, height, 0, 0, width, height);
            // debugger;
            // jQuery('body').prepend(jQuery(img));
            // jQuery('body').prepend(jQuery(canvas));
            if(cbk) {
                var data;
                switch(type) {
                    case "canvas":
                        data = canvas;
                    break;

                    default:
                    case "dataurl":
                        data = canvas.toDataURL()
                    break;
                }
                cbk(data);
            }
        };
        img.src = src_canvas.toDataURL();

    },

    getWidthOfObjectOnScreen : function(p_camera, model, screen_width) {
        var geometry = model.children[0].geometry;
        geometry.computeBoundingBox();

        var max, min;
        max = geometry.boundingBox.max.x;
        min = geometry.boundingBox.min.x;

        var object_width= max - min;

        var distance_object = p_camera.position.distanceTo(new THREE.Vector3(0, 0, 0));

        var alpha = 2 * Math.PI * (p_camera.fov / 2) / 360;

        var object_plane_screen_width = 2 * distance_object * Math.tan(alpha) * p_camera.aspect;
        var object_width_on_screen = screen_width / object_plane_screen_width  * object_width;

        return object_width_on_screen;
    },

    getHeightOfObjectOnScreen : function(p_camera, model, screen_height) {
        var geometry = model.children[0].geometry;
        geometry.computeBoundingBox();

        var max, min;
        max = geometry.boundingBox.max.z;
        min = geometry.boundingBox.min.z;

        var object_height= max - min;

        var distance_object = p_camera.position.distanceTo(new THREE.Vector3(0, 0, 0));

        var alpha = 2 * Math.PI * (p_camera.fov / 2) / 360;

        var object_plane_screen_height = 2 * distance_object * Math.tan(alpha);
        var object_height_on_screen = screen_height / object_plane_screen_height  * object_height;

        return object_height_on_screen;
    },

    showPointData : (function() {
        var sprites = [];

        var update = function() {
            for(var i = 0; i < sprites.length; i++)
                sprites[i][0].lookAt(sprites[i][1].position)
        };

        var interval;
        return function(scene, camera, label, position){
            var spritey = this.makeTextSprite( " " +     label + " ", { fontsize: 48, backgroundColor: {r:100, g:100, b:255, a:1} } );
            spritey.position.setX(position.x);
            spritey.position.setY(position.y);
            spritey.position.setZ(position.z);
            sprites.push([spritey, camera]);
            scene.add(spritey);

            if(!interval)
                interval = window.setInterval(update, 50);
        };
    })(),

    // FROM: http://stemkoski.github.io/Three.js/Labeled-Geometry.html
    makeTextSprite: function( message, parameters ) {
        if ( parameters === undefined ) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 48;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };


        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText( message );
        var textWidth = metrics.width;
        canvas.width = textWidth;
        canvas.height = fontsize + 2;

        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgb(0, 0, 0)";
        context.font = "Bold " + fontsize + "px " + fontface;
        context.fillText(message, 2, fontsize - 2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var sprite  = new THREE.Mesh(new THREE.PlaneGeometry(5, 2), new THREE.MeshBasicMaterial({map:texture}));
        return sprite;
    },

    // function for drawing rounded rectangles
    roundRect : function(ctx, x, y, w, h, r)
    {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    labelGeometry : function(scene, abc) {
        var a = abc[0];
        var b = abc[1];
        var c = abc[2];
        var sprites = [];

        var iterator = new ShowcaseUtilities.GeometryIterator(geometry);
        var ctr = -1;
        while(iterator.hasNext()) {
            ctr++;
            var triple_v = iterator.next();
            if(!iterator.dataAsVectors()) {
                a = (new THREE.Vector3()).fromArray(triple_v[0]);
                b = (new THREE.Vector3()).fromArray(triple_v[1]);
                c = (new THREE.Vector3()).fromArray(triple_v[2]);
            } else {
                a = triple_v[0];
                b = triple_v[1];
                c = triple_v[2];
            }
            var abc = [a,b,c];
           sprites = sprites + labelFace(scene, abc, ctr);

        }
        return sprites;
    },

    labelFace : function(scene, face, face_label) {
        var a = face[0];
        var b = face[1];
        var c = face[2];
        var sprites = [];
        // a + b + (c-b /2) + (b-c/2)
        center = a.clone();
        // AtoB
        center.add(b.add(a.negate()));
        // BtoC / 2
        center.add(c.add(b.negate()).multiplyScalar(0.5));
        // CtoA / 2
        center.add(a.add(c.negate()).multiplyScalar(0.5));

        var spritey = this.makeTextSprite( " " + face_label + " ", { fontsize: 12, backgroundColor: {r:100, g:100, b:255, a:1} } );
        spritey.position = center.multiplyScalar(1.1);
        scene.add( spritey );

        sprites.push(spritey);

        for (var i = 0; i < face.length; i++) {
            var spritey = this.makeTextSprite( " " + i + " ", { fontsize: 12, backgroundColor: {r:255, g:100, b:100, a:1} } );
            spritey.position = face[i].clone().multiplyScalar(1.1);
            scene.add( spritey );

            sprites.push(spritey);
        }
        return sprites;
    },

    isWebGLAvailable : function() {
        if(!window.WebGLRenderingContext)
            return false;

        var canvas = document.createElement("canvas");;
        if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl"))
            return false;

        return true;
    }

  };
})();
