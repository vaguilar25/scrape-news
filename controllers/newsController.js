var newsModel = require('../models/newsModel.js');
var Note = require('../models/Note.js');
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
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
        console.log("test populate")

        newsModel.find().populate('notes').then(function (newss) {
            // newsModel.find( function (err, newss) {

            return res.render('home', { news: newss });
        });
    },

    /**
     * newsController.list()
     */
    listSaved: function (req, res) {

        console.log("List Saved")
        newsModel.find({ saved: true }).populate('notes').then(function (newss) {
            // newsModel.find( function (err, newss) {

            return res.render('home', { news: newss });
        });
    },


    /**
     * newsController.show()
     */
    show: function (req, res) {
        newsModel.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbNotes) {

                return res.json(dbNotes);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
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
                console.log(element)
                // Save the text of the h4-tag as "title"
                var title = $(element).text();

                // Find the h4 tag's parent a-tag, and save it's href value as "link"
                var link = $(element).parent().attr("href");

                var summary = $(element).next('h5').text()

                // Make an object with data we scraped for this h4 and push it to the results array

                

                results.push({
                    title: title,
                    link: link,
                    summary: summary,
                    saved: false
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
    createNote: function (req, res) {
        console.log("enter");
        console.log("Id" + req.params.id);
        Note.create(req.body)
            .then(function (dbNote) {
                return newsModel.findOneAndUpdate(


                    {
                        _id: req.params.id
                    }, {
                        $push:
                            { notes: dbNote._id }
                    },
                    { new: true });
            }).then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            })
    },

    /**
     * Update Note
     */
    updateNote: function (req, res) {
        var id = req.params.id;

        Note.where({ _id: id }).updateOne({ title: req.body.title, body: req.body.body }, function (err, newss) {
            if (!newss) {
                return res.status(404).json({
                    message: 'No such news'
                });
            }


            return res.render('home', { newss: newss, saved: true });

        })

    },

    /**
    /**
     * newsController.create()
     */
    create: function (req, res) {
        var news = new newsModel({
            title: req.body.title,
            link: req.body.link,
            summary: req.body.summary,
            saved: req.body.saved,
            notes: req.body.notes

        });

        news.save(function (err, news) {
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
        console.log(req.body)
        var id = req.params.id;
        var noteId = req.body.noteId
        console.log("NOTA:", noteId)
        if (typeof (noteId) != "undefined") {
            Note.findByIdAndRemove(noteId).then(function (dbNote) {
                newsModel.where({ _id: id }).updateOne({ saved: req.body.saved }, function (err, newss) {
                    if (!newss) {
                        return res.status(404).json({
                            message: 'No such news'
                        });
                    }
                    if (!newss.saved) {

                    }

                    return res.render('home', { newss: newss, saved: true });

                })
            })
        } else {
            newsModel.where({ _id: id }).updateOne({ saved: req.body.saved }, function (err, newss) {
                if (!newss) {
                    return res.status(404).json({
                        message: 'No such news'
                    });
                }
                if (!newss.saved) {

                }

                return res.render('home', { newss: newss, saved: true });

            })

        }
    },

    /**
     * newsController.show()
     */
    showNote: function (req, res) {
        console.log("Note", req.params.id)

        Note.findOne({ _id: req.params.id })

            .then(function (dbNote) {
                console.log(dbNote)
                return res.json(dbNote);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    },

    /**
     * newsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var noteId = req.body.noteId
        console.log("NOTA DElete:", noteId)
        if (typeof (noteId) != "undefined") {
            newsModel.findByIdAndRemove(id).then(function (dbNote) {

                Note.findByIdAndRemove(noteId, function (err, news) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the news.',
                            error: err
                        });
                    }
                    return res.status(204).json();
                });

            })

        } else {
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
    }
};
