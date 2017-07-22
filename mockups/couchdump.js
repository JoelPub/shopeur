/**
 * Import design docs into remote CouchDB
 * TODO: Error handling if args not valid or set
 *
 */
var couchDbUrl = '';
var couchDbName = '';

if(process.argv[2] && process.argv[3]) {
    couchDbUrl = process.argv[2];
    couchDbName = process.argv[3];
}

var nano = require('nano')(couchDbUrl);
var db = nano.db.use(couchDbName);

function designDoc(designDoc, viewName, mapFunc) {
	var v = {};
	v[viewName] = {
		map: mapFunc
	};

	var view = {
		language: 'javascript',
		views: v
	};

	// Fix: 'Error: self signed certificate'
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	db.insert(view, '_design/' + designDoc, function(err, res) {
		console.log('done', err, res);
	});
}

designDoc('country', 'by_id', function(doc) {
	if(doc.type == 'country') {
		emit(doc.id, doc);
	}
});

designDoc('city', 'by_id', function(doc) {
	if(doc.type == 'city') {
		emit(doc.id, doc);
	}
});

designDoc('cities', 'by_country', function(doc) {
	if(doc.type == 'city') {
		emit(doc.country_id, doc);
	}
});

designDoc('destinations', 'by_city',  function(doc) {
	if(doc.type == 'destination') {
		emit(doc.city_id, doc);
	}
});

designDoc('destination', 'by_id',  function(doc) {
	if(doc.type == 'destination') {
		emit(doc.id, doc);
	}
});

designDoc('brands', 'by_destination', function(doc) {
	if(doc.type == 'brand') {
		emit(doc.id, doc);
	}
});

designDoc('brand', 'by_id', function(doc) {
	if(doc.type == 'brand') {
		emit(doc.id, doc);
	}
});

designDoc('stores', 'by_destination', function(doc) {
	if(doc.type == 'brandstore') {
		emit(doc.destination_id, doc);
	}
});
