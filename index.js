/* Copyright (C) Crossborders LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Greg Hedges <gregh@rain.agency>, April 2016
 */

var Botkit = require('botkit')
var Witbot = require('witbot')
var fs = require('fs');
var parse = require('csv-parse');
var _ = require('lodash');
var recipes = require('./recipes');

var slackToken = process.env.SLACK_TOKEN
var witbot = Witbot(process.env.WIT_TOKEN)
var controller = Botkit.slackbot({ debug: false })
var openWeatherApiKey = process.env.OPENWEATHER_KEY

controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) {
  if (err) throw new Error('Error connecting to Slack: ', err)
  console.log('Connected to Slack')
})

controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
	var wit = witbot.process(message.text, bot, message)

	wit.hears('hello', 0.5, function (bot, message, outcome) {
		bot.reply(message, 'Hello to you as well! How can I help you today?')
	})

	wit.hears('recipe_get', 0.5, function (bot, message, outcome) {
		bot.reply(message, 'I\'d be happy to help. What are you in the mood for? I can give you meat, seafood, pasta, soup or vegetarian dishes. Which would you like?')
	})

	var weather = require('./weather')(openWeatherApiKey)

	wit.hears('weather', 0.5, function (bot, message, outcome) {
		console.log(outcome.entities.location)
		if (!outcome.entities.location || outcome.entities.location.length === 0) {
			bot.reply(message, "I\'d love to give you the weather, but for where?")
			return
		}

		var location = outcome.entities.location[0].value
		weather.get(location, function (error, msg) {
			if (error) {
				console.error(error)
				bot.reply(message, 'Uh oh, there was a problem with getting the weather.')
				return
			}
			bot.reply(message, msg)
		})
	})

	wit.hears('dish_type', 0.5, function (bot, message, outcome) {
		if (!outcome.entities.dish_type || outcome.entities.dish_type.length === 0) {
			bot.reply(message, "I\'d love to help, but what kind of dish are you looking to make? I can give you meat, seafood, pasta, soup or vegetarian dishes. Which would you like?")
			return
		}

		var dishType = outcome.entities.dish_type[0].value
		var allRecipes = 'test'

		console.log(outcome.entities.dish_type)
		if (dishType === 'chicken') {
			recipes.query('chicken', 5, function(recipesList){
				var currentRecipe = 0;
				if (allRecipes !== '') {
					var allRecipes = recipesList
					console.log(allRecipes)
				} 
				
			});

			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'It doesn\'t get much easier than this. Chicken and rice bake together in a creamy mushroom sauce for a one-dish winner the whole family will enjoy!',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/one-dish-chicken-rice-bake-large-24702.jpg',
			        'title': 'One Dish Chicken & Rice Bake',
			        "title_link": "http://www.campbellskitchen.com/recipes/one-dish-chicken-rice-bake-24702",
			        'text': 'It doesn\'t get much easier than this. Chicken and rice bake together in a creamy mushroom sauce for a one-dish winner the whole family will enjoy!\n\nView This recipe: http://www.campbellskitchen.com/recipes/one-dish-chicken-rice-bake-24702 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "5 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "55 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			    
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'beef') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'Slow cooking this tender pot roast with some flavorful vegetables and a few on-hand ingredients yields mouthwatering results. Put it together in the morning, and when it\'s time for dinner, it\'s done!',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/slow-cooker-savory-pot-roast-large-27270.jpg',
			        'title': 'Slow Cooker Savory Pot Roast',
			        "title_link": "http://www.campbellskitchen.com/recipes/slow-cooker-savory-pot-roast-27270",
			        'text': 'Slow cooking this tender pot roast with some flavorful vegetables and a few on-hand ingredients yields mouthwatering results. Put it together in the morning, and when it\'s time for dinner, it\'s done!\n\nView This recipe: http://www.campbellskitchen.com/recipes/slow-cooker-savory-pot-roast-27270 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "10 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "3 hours"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'turkey') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'This comforting casserole is similar to classic tuna noodle casserole, but it uses turkey instead. It\'s a flavorful way to use leftovers, or to satisfy those who don\'t like tuna.',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/turkey-noodle-casserole-large-27348.jpg',
			        'title': 'Turkey Noodle Casserole',
			        "title_link": "http://www.campbellskitchen.com/recipes/turkey-noodle-casserole-27348",
			        'text': 'This comforting casserole is similar to classic tuna noodle casserole, but it uses turkey instead. It\'s a flavorful way to use leftovers, or to satisfy those who don\'t like tuna.\n\nView This recipe: http://www.campbellskitchen.com/recipes/turkey-noodle-casserole-27348 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "20 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "35 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'pork') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'If you\'ve never had pork chops from a slow cooker before, this is the recipe to try. Just 5 ingredients, hardly any work, and you get tender and delicious results.',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/slow-cooker-pork-chops-large-25964.jpg',
			        'title': 'Slow Cooker Pork Chops',
			        "title_link": "http://www.campbellskitchen.com/recipes/slow-cooker-pork-chops-25964",
			        'text': 'If you\'ve never had pork chops from a slow cooker before, this is the recipe to try. Just 5 ingredients, hardly any work, and you get tender and delicious results.\n\nView This recipe: http://www.campbellskitchen.com/recipes/slow-cooker-pork-chops-25964 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "5 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "8 hours"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'seafood') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'This out-of-the-ordinary pizza combines bacon and clams to create a flavorful, herb-scented pizza in no time. But what makes it really good is the puff pastry crust. Yum!',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/bacon-and-clam-white-pizza-large-50001.jpg',
			        'title': 'Bacon and Clam White Pizza',
			        "title_link": "http://www.campbellskitchen.com/recipes/bacon-and-clam-white-pizza-50001",
			        'text': 'This out-of-the-ordinary pizza combines bacon and clams to create a flavorful, herb-scented pizza in no time. But what makes it really good is the puff pastry crust. Yum!\n\nView This recipe: http://www.campbellskitchen.com/recipes/bacon-and-clam-white-pizza-50001 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "15 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "1 hour 25 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'pasta') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'Just 4 ingredients combine for a simple skillet dish that\'s loaded with fabulous flavor. Sautèed sweet Italian sausage and sliced zucchini combine with portobello mushroom soup and cooked pasta for a delicious meal that\'s an absolute winner!',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/speedy-sausage-rigatoni-large-61895.jpg',
			        'title': 'Speedy Sausage Rigatoni',
			        "title_link": "http://www.campbellskitchen.com/recipes/speedy-sausage-rigatoni-61895",
			        'text': 'Just 4 ingredients combine for a simple skillet dish that\'s loaded with fabulous flavor. Sautèed sweet Italian sausage and sliced zucchini combine with portobello mushroom soup and cooked pasta for a delicious meal that\'s an absolute winner!\n\nView This recipe: http://www.campbellskitchen.com/recipes/speedy-sausage-rigatoni-61895 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "15 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "15 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'soup') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'Everything you love about loaded baked potatoes can be found in a bowl of this homemade soup that everyone will enjoy. It\'s rich and creamy, and full of great flavor that is sure to make this soup a cold weather favorite!',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/loaded-potato-soup-large-61918.jpg',
			        'title': 'Loaded Potato Soup',
			        "title_link": "http://www.campbellskitchen.com/recipes/loaded-potato-soup-61918",
			        'text': 'Everything you love about loaded baked potatoes can be found in a bowl of this homemade soup that everyone will enjoy. It\'s rich and creamy, and full of great flavor that is sure to make this soup a cold weather favorite!\n\nView This recipe: http://www.campbellskitchen.com/recipes/loaded-potato-soup-61918 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "25 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "40 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'vegetarian') {
			bot.reply(message, 'Sure, let me grab a *' + dishType + '* recipe for you...')
			var reply_with_attachments = {
			    'username': 'recipebot' ,
			    'text': 'How does this sound?',
			    'attachments': [
			      {
			        'fallback': 'This creamy, crowd-pleasing side dish features summer squash, carrots, stuffing mix and cheese baked in a creamy sauce. Crispy on top and creamy in the center, it\'s a winner on any menu.',
			        'image_url': 'http://www.campbellskitchen.com/recipeimages/squash-casserole-large-24122.jpg',
			        'title': 'Squash Casserole',
			        "title_link": "http://www.campbellskitchen.com/recipes/squash-casserole-24122",
			        'text': 'This creamy, crowd-pleasing side dish features summer squash, carrots, stuffing mix and cheese baked in a creamy sauce. Crispy on top and creamy in the center, it\'s a winner on any menu.\n\nView This recipe: http://www.campbellskitchen.com/recipes/squash-casserole-24122 \n\n',
			        "fields": [
		                {
		                    "title": "Prep Time",
		                    "value": "15 minutes"
		                },
		                {
		                    "title": "Total Time",
		                    "value": "40 minutes"
		                }
		            ],
			        'color': '#bf132b',
			        'author_name': 'Campbell\'s Kitchen'
			      }
			    ],
			    'icon_url': 'http://www.greghedgesdesign.com/images/CK_echo_icon_red.png'
			}
			bot.reply(message, reply_with_attachments);
		} else if (dishType === 'meat') {
			bot.reply(message, 'I\'ve got all types of meat recipes. Do you want chicken, beef, pork or turkey?')
		} else {
			bot.reply(message, 'Sorry, I didn\'t catch that, I can give you meat, seafood, pasta, soup or vegetarian dishes. Which would you like?')
		}
	})
})

