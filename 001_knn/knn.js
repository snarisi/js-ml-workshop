
//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

var vectorAdd = function (v1, v2) {
	return v1.map(function (_, i) {
		return v1[i] + v2[i];
	});
};

var vectorSub = function (v1, v2) {
	return v1.map(function (_, i) {
		return v1[i] - v2[i];
	});
};

var eNorm = function (arr) {
	return Math.sqrt(
		arr.reduce(function(old, n) {
			return old + n*n
		},0));
};

var distance = function (vector1, vector2) {
	var n = vector1.length;
	if (vector2.length !== n) return;

	return eNorm(vectorSub(vector2, vector1));
};

var getDistances = function (vector, data) {
	return data.map(function (v) {
		return [distance(v[0], vector), v[1]];
	});
};

var sortByDistance = function (array) {
	return array.sort(function (a, b) {
		if (a[0] < b[0]) return -1;
		else return 1;
	});
};

var getDistanceAndSort = function (vector, data) {
	return data.sort(function (a, b) {
		if (distance(vector, a[0]) < distance(vector, b[0])) return -1;
		else return 1;
	});
};

var getMajority = function (k, array) {
	var count = {};
	var maxCount = 0;
	var prediction;
	var maj;

	for (var i = 0; i < k; i++) {
		prediction = array[i][1];
		count[prediction] = count[prediction] || 0;
		count[prediction]++;
		if (count[prediction] > maxCount) {
			maj = prediction;
			maxCount = count[prediction];
		}
	}
	return maj;
};

KNN.prototype.train = function (data) {
	this.points = this.points.concat(data);
};

KNN.prototype._distance = distance;
KNN.prototype._distances = getDistances;
KNN.prototype._sorted = function (array) {
	return sortByDistance(array).map(function (elm) {
		return elm[1];
	});
};
KNN.prototype._majority = getMajority;

KNN.prototype.predictSingle = function (vector) {
	var distances = getDistances(vector, this.points);
	var sortedDistances = sortByDistance(distances);
	// var sortedDistances = getDistanceAndSort(vector, this.points);
	var majority = getMajority(this.kSize, sortedDistances);
	return majority;
};

KNN.prototype.predict = function (data) {
	return data.map(ele => this.predictSingle(ele));
};

KNN.prototype.score = function (data) {
	var corr = 0,
		prediction;

	data.forEach(elm => {
		prediction = this.predictSingle(elm[0]);
		if (prediction === elm[1]) corr++;
	});
	return corr / data.length;
};

module.exports = KNN
