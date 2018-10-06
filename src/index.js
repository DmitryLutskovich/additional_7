module.exports = function solveSudoku(matrix) {
	Sudoku = function(in_val) {
		var backtracking_call = 0;
		var solved = [];
		var steps = 0;

		initSolved(in_val);
		solve();

		function initSolved(in_val) {
			steps = 0;
			var suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			for ( var i=0; i<9; i++) {
				solved[i] = [];
				for ( var j=0; j<9; j++ ) {
					if ( in_val[i][j] ) {
						solved[i][j] = [in_val[i][j], 'in', []];
					}
					else {
						solved[i][j] = [0, 'unknown', suggest];
					}
				}
			}
		};

		function solve() {
			var changed = 0;
			do {
				changed = updateSuggests();
				steps++;
				if ( 81 < steps ) {
					break;
				}
			} while (changed);

			if ( !isSolved() && !isFailed() ) {
				backtracking();
			}
		};

		function updateSuggests() {
			var changed = 0;
			var buf = arrayDiff(solved[1][3][2], rowContent(1));
			buf = arrayDiff(buf, colContent(3));
			buf = arrayDiff(buf, sectContent(1, 3));
			for ( var i=0; i<9; i++) {
				for ( var j=0; j<9; j++) {
					if ( 'unknown' != solved[i][j][1] ) {
						continue;
					}
					changed += solveSingle(i, j);
					changed += solveHiddenSingle(i, j);
				}
			}
			return changed;
		};

		function solveSingle(i, j) {
			solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
			solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
			solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
			if ( 1 == solved[i][j][2].length ) {
				markSolved(i, j, solved[i][j][2][0]);
				return 1;
			}
			return 0;
		};

		function solveHiddenSingle(i, j) {
			var less_suggest = lessRowSuggest(i, j);
			var changed = 0;
			if ( 1 == less_suggest.length ) {
				markSolved(i, j, less_suggest[0]);
				changed++;
			}
			var less_suggest = lessColSuggest(i, j);
			if ( 1 == less_suggest.length ) {
				markSolved(i, j, less_suggest[0]);
				changed++;
			}
			var less_suggest = lessSectSuggest(i, j);
			if ( 1 == less_suggest.length ) {
				markSolved(i, j, less_suggest[0]);
				changed++;
			}
			return changed;
		};

		function markSolved(i, j, solve) {
			solved[i][j][0] = solve;
			solved[i][j][1] = 'solved';
		};

		function rowContent(i) {
			var content = [];
			for ( var j=0; j<9; j++ ) {
				if ( 'unknown' != solved[i][j][1] ) {
					content[content.length] = solved[i][j][0];
				}
			}
			return content;
		};

		function colContent(j) {
			var content = [];
			for ( var i=0; i<9; i++ ) {
				if ( 'unknown' != solved[i][j][1] ) {
					content[content.length] = solved[i][j][0];
				}
			}
			return content;
		};

		function sectContent(i, j) {
			var content = [];
			var offset = sectOffset(i, j);
			for ( var k=0; k<3; k++ ) {
				for ( var l=0; l<3; l++ ) {
					if ( 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
						content[content.length] = solved[offset.i+k][offset.j+l][0];
					}
				}
			}
			return content;
		};

		function lessRowSuggest(i, j) {
			var less_suggest = solved[i][j][2];
			for ( var k=0; k<9; k++ ) {
				if ( k == j || 'unknown' != solved[i][k][1] ) {
					continue;
				}
				less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
			}
			return less_suggest;
		};

		function lessColSuggest(i, j) {
			var less_suggest = solved[i][j][2];
			for ( var k=0; k<9; k++ ) {
				if ( k == i || 'unknown' != solved[k][j][1] ) {
					continue;
				}
				less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
			}
			return less_suggest;
		};

		function lessSectSuggest(i, j) {
			var less_suggest = solved[i][j][2];
			var offset = sectOffset(i, j);
			for ( var k=0; k<3; k++ ) {
				for ( var l=0; l<3; l++ ) {
					if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
						continue;
					}
					less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
				}
			}
			return less_suggest;
		};

		function arrayDiff (ar1, ar2) {
			var arr_diff = [];
			for ( var i=0; i<ar1.length; i++ ) {
				var is_found = false;
				for ( var j=0; j<ar2.length; j++ ) {
					if ( ar1[i] == ar2[j] ) {
						is_found = true;
						break;
					}
				}
				if ( !is_found ) {
					arr_diff[arr_diff.length] = ar1[i];
				}
			}
			return arr_diff;
		};

		function arrayUnique(ar){
			var sorter = {};
			for(var i=0,j=ar.length;i<j;i++){
				sorter[ar[i]] = ar[i];
			}
			ar = [];
			for(var i in sorter){
				ar.push(i);
			}
			return ar;
		};

		function sectOffset(i, j) {
			return {
				j: Math.floor(j/3)*3,
				i: Math.floor(i/3)*3
			};
		};

		this.html = function() {
			var html = [];
			for ( var i=0; i<9; i++) {
				html[i] = [];
				for ( var j=0; j<9; j++ ) {
					html[i][j] = solved[i][j][0];
				}

			}
			return html;
		};

		function isSolved() {
			var is_solved = true;
			for ( var i=0; i<9; i++) {
				for ( var j=0; j<9; j++ ) {
					if ( 'unknown' == solved[i][j][1] ) {
						is_solved = false;
					}
				}
			}
			return is_solved;
		};

		this.isSolved = function() {
			return isSolved();
		};

		function isFailed() {
			var is_failed = false;
			for ( var i=0; i<9; i++) {
				for ( var j=0; j<9; j++ ) {
					if ( 'unknown' == solved[i][j][1] && !solved[i][j][2].length ) {
						is_failed = true;
					}
				}
			}
			return is_failed;
		};

		this.isFailed = function() {
			return isFailed();
		};

		function backtracking() {
			backtracking_call++;
			var in_val = [[], [], [], [], [], [], [], [], []];
			var i_min=-1, j_min=-1, suggests_cnt=0;
			for ( var i=0; i<9; i++ ) {
				in_val[i].length = 9;
				for ( var j=0; j<9; j++ ) {
					in_val[i][j] = solved[i][j][0];
					if ( 'unknown' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
						suggests_cnt = solved[i][j][2].length;
						i_min = i;
						j_min = j;
					}
				}
			}

			for ( var k=0; k<suggests_cnt; k++ ) {
				in_val[i_min][j_min] = solved[i_min][j_min][2][k];
				var sudoku = new Sudoku(in_val);
				if ( sudoku.isSolved() ) {
					out_val = sudoku.solved();
					for ( var i=0; i<9; i++ ) {
						for ( var j=0; j<9; j++ ) {
							if ( 'unknown' == solved[i][j][1] ) {
								markSolved(i, j, out_val[i][j][0])
							}
						}
					}
					return;
				}
			}
		};

		this.solved = function() {
			return solved;
		};
	};

	var sud = new Sudoku(matrix);
	sud.solved();
	return sud.html();
}
