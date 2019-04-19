// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    // Prints array of arrays
    // Each inner array is a row
    // 0 = space not filled, 1 = space filled
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    // Given a location on board, with 0 index arrays
    // Toggles between 0 = spaced not filled, 1 = space filled
    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },


    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var isConflict = false;
      var isQueen = false;
      //find out if there is more than 1, 1 in the row.
      for (let i = 0; i < row.length; i++) {
        if (isQueen && row[i] === 1) {
          isConflict = true;
        }
        if (row[i] === 1) {
          isQueen = true;
        }
      }

      return isConflict;
    },


    hasAnyRowConflicts: function() {
      //take grid and
      var grid = this.rows();
      //loop through and
      for (let i = 0; i < grid.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // Pull entire grid
      var grid = this.rows();
      // Loop through each row
      var isConflict = false;
      var isQueen = false;

      for (let i = 0; i < grid.length; i++) {
        if (isQueen && grid[i][colIndex] === 1) {
          isConflict = true;
        }
        if (grid[i][colIndex] === 1) {
          isQueen = true;
        }
      }
      return isConflict;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //take grid and
      var grid = this.rows();
      //loop through and
      for (let i = 0; i < grid.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalRowIndexAtFirstColumn) {
      var grid = this.rows();
      var isConflict = false;
      var isQueen = false;
      var startOfDiag = majorDiagonalRowIndexAtFirstColumn;

      for (let i = 0; i < grid.length; i++) {
        // if (i+startOfDiag >= 0) {
        if (this._isInBounds(i, i + startOfDiag)) { 
          if (isQueen && grid[i][i + startOfDiag] === 1) {
            isConflict = true;
          }
          if (grid[i][i + startOfDiag] === 1) {
            isQueen = true;
          }
        }
      }
      return isConflict;
      //   var rows = this.rows()

      //   var queenFinder = function(row, space, i, rows) {

      //     for (let m = index+1; m <= row.length - 1; m++) {
      //       var compareRow = rows[m+index];
      //       // console.log(compareRow);
      //      //!!!!! we are going outside the box here
      //       var compareSpace = compareRow[i + m];
      //       // console.log(row);
      //       if (compareSpace === 1) {
      //         return true;
      //       }
      //     }
      //     return false;
      //   };
      //   var rowChecker = function(index) {
      //     var row = rows[index]
      //     var hasQueen = false;
      //     var hasConflict = false;
      //     for (let i = 0; i < row.length; i++) {
      //       var space = row[i];
      //       if (space === 1) {
      //         hasQueen = true;
      //       }
      //       if (hasQueen) {
      //         if (queenFinder(row, space, i, rows)) {
      //           hasConflict = true;
      //           return hasConflict;
      //         }
      //       }
      //     }
      //     return hasConflict;
      //   };
      
      // return  rowChecker(index)
       
    },
      
    hasAnyMajorDiagonalConflicts: function() {
      var grid = this.rows();
      var startIndex = -(grid.length - 1);

      for (let i = startIndex; i < grid.length; i++) { //spin oppisite
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
      //   var grid = this.rows();

    //   for(let i = 0; i<grid.length-1; i++) {
    //     if(this.hasMajorDiagonalConflictAt(i)) {
    //       return true;
    //     }
    //   }
    //   console.log(JSON.stringify(grid))
    // return false;
    },




    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var grid = this.rows();
      var isConflict = false;
      var isQueen = false;
      var startOfDiag = minorDiagonalColumnIndexAtFirstRow;

      for (let i = 0; i < grid.length; i++) {
        // if (i+startOfDiag >= 0) {
        // debugger;
        if (this._isInBounds(i, startOfDiag - i)) {
          if (isQueen && grid[i][startOfDiag - i] === 1) {
            isConflict = true;
          }
          if (grid[i][startOfDiag - i] === 1) {
            isQueen = true;
          }
        }
        // startOfDiag = startOfDiag+1;
      }
      return isConflict;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var grid = this.rows();
      var endIndex = (grid.length - 1) + grid.length;

      for (let i = endIndex - 1; i >= 0; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
