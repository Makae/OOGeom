function run_tests() {
    testMatrixMultiplication();
    testQuaternionApply();
}

function testQuaternionApply() {
  var v = new THREE.Vector3(10, 10, 0);
  var q = (new ThreeQuaternion()).fromEuler(
    // Around z-axis
    [0, 0, 1],
    // 90°,
    THREE.Math.degToRad(90)
  );

  console.log(q);
  console.log(v);
  var v_new = q.applyToVector(v);
  console.log(v_new);

  if(v_new.x == 0 && v_new.y == Math.sqrt(Math.pow(10,2) + Math.pow(10,2)))
      console.log("Passed: testQuaternionApply()");
  else
      console.error("Failed: testQuaternionApply()");
}

function testMatrixMultiplication() {
    var mat_result = [
        330, 396, 462,
        726, 891, 1056,
        1122, 1386, 1650
    ];

    var mat1 = new THREE.Matrix3().set(
        1,2,3,
        4,5,6,
        7,8,9
    );

    var mat2 = new THREE.Matrix3().set(
        11,22,33,
        44,55,66,
        77,88,99
    );
    
    var new_mat = MatrixUtils.columnsToRows(MatrixUtils.multiply3x3(mat1, mat2));

    if(JSON.stringify(new_mat) == JSON.stringify(mat_result))
        console.log("Passed: testMatrixMultiplication()");
    else
        console.error("Failed: testMatrixMultiplication()");

}

function testDotProduct() {
  var v1 = new THREE.Vector3(1, 0, 0);
  var v2 = new THREE.Vector3(1, -1, 0);
  var v3 = new THREE.Vector3(1, 1, 0);
  var v4 = new THREE.Vector3(-1, 1, 0);
  var v5 = new THREE.Vector3(-1, -1, 0);

  console.log("Is v2 left of v1 ? A: " + VectorUtils.isLeftOf(v1, v2));
  console.log("Is v3 left of v1 ? A: " + VectorUtils.isLeftOf(v1, v3));
  console.log("Is v4 left of v1 ? A: " + VectorUtils.isLeftOf(v1, v4));
  console.log("Is v5 left of v1 ? A: " + VectorUtils.isLeftOf(v1, v5));
}