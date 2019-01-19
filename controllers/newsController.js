var newsModel = require('../models/newsModel.js');
var axios = require("axios");
var cheerio = require("cheerio");
/**
 * newsController.js
 *
 * @description :: Server-side logic for managing newss.
 */
module.exports = {

    /**
     * newsController.list()
     */
    list: function (req, res) {
        newsModel.find(function (err, newss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting news1.',
                    error: err
                });
            }
            //console.log(newss);
            return res.render('home',{news:newss});
        });
    },


    /**
     * newsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        newsModel.findOne({ _id: id }, function (err, news) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting news2.',
                    error: err
                });
            }
            if (!news) {
                return res.status(404).json({
                    message: 'No such news'
                });
            }
            return res.json(news);
        });
    },

    /**
    * newsController.create()
    */
    scrap: function (req, res) {
        axios.get("https://www.nhl.com/").then(function (response) {

            // Load the body of the HTML into cheerio
            var $ = cheerio.load(response.data);

            // Empty array to save our scraped data
            var results = [];

            // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
            $("h4.headline-link").each(function (i, element) {

                // Save the text of the h4-tag as "title"
                var title = $(element).text();

                // Find the h4 tag's parent a-tag, and save it's href value as "link"
                var link = $(element).parent().attr("href");

                // Make an object with data we scraped for this h4 and push it to the results array
                results.push({
                    title: title,
                    link: link
                });
            });
            console.log(results);
            newsModel.create(results, function (err, news) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating news3',
                        error: err
                    });
                }
                return res.status(201).json(news);
            });
        })
    },

    /**
     * newsController.create()
     */
    create: function (req, res) {
        var news = new newsModel({
        	title : req.body.title,
        	link : req.body.link

        });

        news.create(req.body, function (err, news) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating news',
                    error: err
                });
            }
            return res.status(201).json(news);
        });
    },

    /**
     * newsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        newsModel.findOne({ _id: id }, function (err, news) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting news',
                    error: err
                });
            }
            if (!news) {
                return res.status(404).json({
                    message: 'No such news'
                });
            }

            news.title = req.body.title ? req.body.title : news.title;
            news.link = req.body.link ? req.body.link : news.link;

            news.save(function (err, news) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating news.',
                        error: err
                    });
                }

                return res.json(news);
            });
        });
    },

    /**
     * newsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        newsModel.findByIdAndRemove(id, function (err, news) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the news.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
