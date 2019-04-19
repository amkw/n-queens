/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other




window.findNRooksSolution = function(n) {
  var solution = new Board({n: n});
  var rows = solution.rows();
  for (let j = 0; j < rows.length; j++) {
    var row = rows[j];

   
    for (let i = 0; i < row.length; i++) {
      var space = row[i];
      if (space === 0) {
        solution.togglePiece(j, i);
      }
      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(j, i);
      }
    }
  }
  return rows;
};

// create board
//add once peice to board
// solution.hasAnyRooksConflicts
 
  
//   console.log("-- - - - - - - - - -grid before ", solution)
//   for(let i =0; i<n; i++){
//     // console.log("solution", solution)
//     solution.attributes[i][i] = 1;
    
//   }
// console.log("grid after ", solution.attributes)

//   // start at top left, toggle piece
//   console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution;
  var changer = 0;
  //fixme
  // console.log("BOARD line 70: ", solution)
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[1]];
  }
  var counter;
  var changer = 0;

  // - - - - - - - - - - - -

  var board = new Board ({n});
  solution = board.rows();


  // if(board.hasAnyQueensConflicts()){
  //   for(let k = 0; k < n; k++) {
  //      var cache = {};
  //      var placed = false;
  //     // while
  //     while(!placed){
  //     var randomNum = Math.floor(math.random()*n) 
  //     if(!cache[randomNum]){
  //       randomNum =Math.floor(math.random()*n) 
  //     }
  //     cache[randomNum] = true;
  //     board.togglePiece(k, randomNum)
  //     if(board.hasAnyQueensConflicts()){
  //       board.togglePiece(k, randomNum)
  //     } else {
  //       placed=true;
  //     }
  //   }
  // }
  // }

  // - - - - - - - - 
  while (counter !== n) {
    var board = new Board ({n});
    solution = board.rows();
    console.log('board ', board);
    console.log('n is ', n);

    board.togglePiece(0, Math.floor(Math.random() * n));
    // changer++
    counter = 1;
   
    for (let j = 1; j < solution.length; j++) {
      var row = solution[j];
      // console.log("- - - - - - row: ", row)
      for (let i = 0; i < row.length; i++) {
        var space = row[i];

        // console.log("space:- - - - - -  ", space)
        if (space === 0) {
          counter++;
          board.togglePiece(j, i);
        }
        if (board.hasAnyQueensConflicts()) {
          counter--;
          board.togglePiece(j, i);
        }
        // console.log("BOARD line 84: ", solution)
      }

    }
    if (n === 4) {
      console.log('- - - - - - - ', counter);
      console.log('is this it ', solution);
    }
    // if(n !== counter){
    //   // console.log("counter", counter)
       
    //   // changer++
    //   // recursiveHelper(changer)
    // }
  }
  // -- - - - - - - - - -
  return solution;
};
  


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
