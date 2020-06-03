/**
 * Coordinate class, for measuring distance between tiles
 * Created with tile number and dimension
 */
function Coordinate(index, dim) {
	this.row = index / dim;
	this.col = index % dim;
	this.equals = (other) => {
		if ((this.row === other.row) && (this.col === other.col))
			return true
		else
			return false
	}
	this.dist = (other) => {
		if (this.row === other.row)
			return Math.abs(this.col - other.col)
		else if (this.col === other.col)
			return Math.abs(this.row - other.row)
		return 0
	}
}

module.exports = Coordinate;
