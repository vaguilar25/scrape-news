var newsModel = require('../models/newsModel.js');
var Note = require('../models/Note.js');
var axios = require("axios");
var cheerio = require("cheerio");

//mongoose.Promise = global.Promise
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

        newsModel.find().populate('notes').then(function (newss) {
            // newsModel.find( function (err, newss) {

            return res.render('home', { news: newss });
        });
    },

    /**
     * newsController.listSaved() Get all saved news
     */
    
    listSaved: function (req, res) {

        console.log("List Saved")
        newsModel.find({ saved: true }).populate('notes').then(function (newss) {
            // newsModel.find( function (err, newss) {

            return res.render('home', { news: newss });
        });
    },


    /**
     * newsController.show() Find onde news with the note
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
       * newsController.create() Scrap News
       */
    scrap: function (req, res) {

        async function getAxiosData() {
            try {
                return await axios.get('https://www.nhl.com/')
            } catch (error) {
                console.error(error)
            }
        }

        //use await insite async function
        async function processData() {
            var response = await getAxiosData();

            // Load the body of the HTML into cheerio
            var $ = cheerio.load(response.data);

            // Empty array to save our scraped data
            var results = [];

            // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
            $("h4.headline-link").each(function (i, element) {
                //console.log(element)
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
         
            var newNews = [];
            for (i = 0; i < results.length; i++) {
                console.log("RESULT", results[i].link)
                //for use await use try and catch
                try {
                    var news = await newsModel.findOne({ link: results[i].link })

                    console.log("LOG", news)
                    if (news ===null) {
                        newNews.push(results[i])
                    }

                } catch (e) {
                    console.log(e);
                    
                }
              
            }
            //crate new news only
            newsModel.create(newNews, function (err, news) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating news3',
                        error: err
                    });
                }
                return res.redirect('/?newArticles='+newNews.length)
            });
        }

        processData()


    },

    /**
     * newsController.create() create note for news
     */
    createNote: function (req, res) {
     
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
     * newsController.create() Create news only
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
     * newsController.update() Update note
     */
    update: function (req, res) {

        var id = req.params.id;
        var noteId = req.body.noteId
        //Update news that have notes
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
            // update news that have empty notes
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
       //Remove news that have notes
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
             //Remove news that have notes
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
