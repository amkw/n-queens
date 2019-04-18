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
      for(let i = 0; i < row.length; i++) {
        if (isQueen && row[i] === 1) {
          isConflict = true;
        }
         if (row[i] ===1) {
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
        if(this.hasRowConflictAt(i)) {
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
    hasMajorDiagonalConflictAt: function(majorDiagonalRowIndexAtFirstColumn) {
      var i = majorDiagonalRowIndexAtFirstColumn;
      // console.log("this: ", this, " - - - - - " ,i)
      var grid = this.rows();
      var row = grid[i];
      var hasQueen = {
        0: false,
        1: false,
        2: false,
        3: false
      }
      var hasConflict = {
        0: false,
        1: false,
        2: false,
        3: false
      }

      var compareRow = grid[i+1];
      for (let j = 0; j < row.length; j++) {
        var compareSpace = compareRow[j+1];
        var currentSpace = row[j];
        if(currentSpace === 1){
          hasQueen[j] = true;
        }
        if(compareSpace === 1 && hasQueen[j]) {
          hasConflict[j] = true;
        }
      }

      return hasConflict;
      // todo: conflict not adjacent
      // todo: build hasQueen and hasConflict programmatically
    },

    // test if any major diagonals on this board contain conflicts
  hasAnyMajorDiagonalConflicts: function() {
    var grid = this.rows();
      //call func above
      // for loop
      for (let i = 0; i < grid.length; i++) {
        if ( i === grid.length-1) {
          return false;
        }
        var conflictObj = this.hasMajorDiagonalConflictAt(i);
        for (var key in conflictObj) {
          if (conflictObj[key]) {
            return true;
          }
        }
      }
      // get keys
      //use keys to get values
      //if true => true
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
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
