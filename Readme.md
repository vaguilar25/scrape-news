# All the News That's Fit to Scrape

web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, I'll flex mine Mongoose and Cheerio muscles to scrape news from another site.

## Topics that we have covered

* Use of Git: Creating a repository
```
    * clone 
    * add 
    * commit 
    * push
```

* Deploy to Heroky
```
    * git remote –v  
    * heroku create
    * git commit -am "<message>"
    * git push heroku master 
    *heroku addons:create mongolab
```

* Use of NodeJs, Express, JavaScript, Jquery,Mongoose,Axios
```
├── controllers
│   └── newsController.js
│   
├── models
│   ├── newsModels.js
│   └── Note.js
│
├── node_modules
│ 
├── package.json
│
├── public
│     └── 
│       ├── css
│       │   └── style.css
│       └── js
│           └── app.js
│
├── routes
│   └── newsRoutes.js
│
└── views
│    ├── partials
│           ├── notes
│                ├── notes.handlebars
│    ├── home.handlebars
│
├── server.js
``` 

* NPM Used
```

        npm install body-parser
        npm install express
        npm install express-handlebars
        npm install async
        npm install axios
        npm install cheerio
        npm install mongoose
        npm install mongoose-cli
        npm install path       
        
``` 


* Demo Server:

 https://scrapenewsnhl.herokuapp.com/

## Built With

* [Visual Studio Code](https://code.visualstudio.com/) - The editor used
* [GitHub](https://github.com/) - Version Control
* [Heroku](https://heroku.com) - Deployment

## Versioning

I use [GitHub](https://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/vaguilar25/scrape-news). 

## Authors

* **Vivian Aguilar** 

## Acknowledgments

* Jerome Chenette
* Sasha Pastel
* Jimmy Tu
