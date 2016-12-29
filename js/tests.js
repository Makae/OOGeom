function run_tests() {
    testMatrixMultiplication();
    testQuaternionApply();
    testVectorCalc();
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

function testVectorCalc() {
  var v1 = [10, 15, -5];
  var v2 = [-1.758, 44, 2];
  var v3 = [0, -2, 3];

  var v1_t = (new THREE.Vector3()).fromArray(v1);
  var v2_t = (new THREE.Vector3()).fromArray(v2);
  var v3_t = (new THREE.Vector3()).fromArray(v3);

  var s1 = 12.4;
  var s2 = 1/3;
  var s3 = -0.5;

  clc_v1 = new VectorCalc(v1);
  clc_v2 = new VectorCalc(v2);
  clc_v3 = new VectorCalc(v3);

  var res_clc_1 = clc_v1.clone().multiply(clc_v2).result();
  var res_clc_2 = clc_v1.clone().cross(clc_v2).result();
  var res_clc_3 = clc_v1.clone().add(clc_v2).result();
  var res_clc_4 = clc_v1.clone().sub(clc_v2).result();
  var res_clc_5 = clc_v1.clone().multiplyScalar(s3).result();

  var res_clc_1_1 = clc_v2.clone().multiply(clc_v1).result();
  var res_clc_1_2 = clc_v3.clone().cross(clc_v1).result();
  var res_clc_1_3 = clc_v2.clone().add(clc_v2).result();
  var res_clc_1_4 = clc_v2.clone().sub(clc_v3).result();
  var res_clc_1_5 = clc_v1.clone().multiplyScalar(s1).result();

  var res_clc_2_1 = clc_v3.clone().multiply(clc_v1).result();
  var res_clc_2_2 = clc_v3.clone().cross(clc_v2).result();
  var res_clc_2_3 = clc_v2.clone().add(clc_v2).result();
  var res_clc_2_4 = clc_v1.clone().sub(clc_v3).result();
  var res_clc_2_5 = clc_v2.clone().multiplyScalar(s2).result();

  debugger;
  if(
      (new THREE.Vector3()).fromArray(v1).multiply(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_1)) &&
      (new THREE.Vector3()).fromArray(v1).cross(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_2)) &&
      (new THREE.Vector3()).fromArray(v1).add(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_3)) &&
      (new THREE.Vector3()).fromArray(v1).sub(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_4)) &&
      (new THREE.Vector3()).fromArray(v1).multiplyScalar(s3).equals((new THREE.Vector3()).fromArray(res_clc_5)) &&

      (new THREE.Vector3()).fromArray(v2).multiply(v1_t).equals((new THREE.Vector3()).fromArray(res_clc_1_1)) &&
      (new THREE.Vector3()).fromArray(v3).cross(v1_t).equals((new THREE.Vector3()).fromArray(res_clc_1_2)) &&
      (new THREE.Vector3()).fromArray(v2).add(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_1_3)) &&
      (new THREE.Vector3()).fromArray(v2).sub(v3_t).equals((new THREE.Vector3()).fromArray(res_clc_1_4)) &&
      (new THREE.Vector3()).fromArray(v1).multiplyScalar(s1).equals((new THREE.Vector3()).fromArray(res_clc_1_5)) &&

      (new THREE.Vector3()).fromArray(v3).multiply(v1_t).equals((new THREE.Vector3()).fromArray(res_clc_2_1)) &&
      (new THREE.Vector3()).fromArray(v3).cross(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_2_2)) &&
      (new THREE.Vector3()).fromArray(v2).add(v2_t).equals((new THREE.Vector3()).fromArray(res_clc_2_3)) &&
      (new THREE.Vector3()).fromArray(v1).sub(v3_t).equals((new THREE.Vector3()).fromArray(res_clc_2_4)) &&
      (new THREE.Vector3()).fromArray(v2).multiplyScalar(s2).equals((new THREE.Vector3()).fromArray(res_clc_2_5))
    )
      console.log("Passed: testVectorCalc()");
  else
      console.error("Failed: testVectorCalc()");
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