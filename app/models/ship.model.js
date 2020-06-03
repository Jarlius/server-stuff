/**
 * Ship class, to check obstruction between gameboard lines
 * Uses coordinate class but doesn't rely on it in compile time
 */
function Ship(c1,c2) {
	this.c1 = c1;
	this.c2 = c2;
	this.size = c1.dist(c2)+1;
	this.equals = (other_ship) => {
		if ((this.c1.equals(other_ship.c1) && this.c2.equals(other_ship.c2)) ||
			(this.c1.equals(other_ship.c2) && this.c2.equals(other_ship.c1)))
			return true;
		return false;
	}
	this.horizontal = () => {
		if (this.c1.row === this.c2.row)
			return true;
		return false;
	}
	this.obstructs = (other_ship) => {
		var this_c;
		var other_c;
		if (this.horizontal() !== other_ship.horizontal()) {
			var middle;
			if (this.horizontal()) {
				this_c = [this.c1.col,this.c2.col];
				other_c = [other_ship.c1.row,other_ship.c2.row];
				middle = [this.c1.row,other_ship.c1.col];
			} else {
				this_c = [this.c1.row,this.c2.row];
				other_c = [other_ship.c1.col,other_ship.c2.col];
				middle = [this.c1.col,other_ship.c1.row];
			}
			if ((Math.min(...this_c) <= middle[1] && middle[1] <= Math.max(...this_c)) &&
				(Math.min(...other_c) <= middle[0] && middle[0] <= Math.max(...other_c))) {
				return true;
			}
			return false;
		} else {
			if (this.horizontal() && other_ship.horizontal()) {
				if (this.c1.row === other_ship.c1.row) {
					this_c = [this.c1.col,this.c2.col];
					other_c = [other_ship.c1.col,other_ship.c2.col];
				} else
					return false;
			} else {
				if (this.c1.col === other_ship.c1.col) {
					this_c = [this.c1.row,this.c2.row];
					other_c = [other_ship.c1.row,other_ship.c2.row];
				} else
					return false;
			}
			if (Math.min(...this_c) > Math.max(...other_c) || 
				Math.min(...other_c) > Math.max(...this_c))
				return false;
			return true;
		}
	}
}

module.exports = Ship;
