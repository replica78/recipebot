var fs = require('fs');
var parse = require('csv-parse');
var _ = require('lodash');

var recipesHelper = (function () {

	return {
		query: function (dishType, number, cb) {
			if( !number ) number = 5;
			
			// @TODO: Add verification there are enough recipes in CSV to return
			fs.createReadStream(__dirname + '/'+dishType+'.csv')
				.pipe(parse({delimiter: ',', columns: true}, function(err, recipes){
				
				var returnRecipes = _.sample(number);

				cb(returnRecipes);
				dishName = recipes[0].title
				dishLink = recipes[0].link
				cb(dishName);
				cb(dishLink);
			}));
		},	
	};

})();

module.exports = recipesHelper;