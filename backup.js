axios.get("https://www.nhl.com/").then(function (response) {
            //   axios.get("https://www.nhl.com/",async(req,response)=>{
            // Load the body of the HTML into cheerio
            var $ = cheerio.load(response.data);

            // Empty array to save our scraped data
            var results = [];

            // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
            $("h4.headline-link").each(function (i, element) {
                // console.log(element)
                // Save the text of the h4-tag as "title"
                var title = $(element).text();
                var link = $(element).parent().attr("href");
                // Find the h4 tag's parent a-tag, and save it's href value as "link"
                // var link = $(element).parent().attr("href");

                var summary = $(element).next('h5').text()

                // Make an object with data we scraped for this h4 and push it to the results array

                // var find = await newsModel.findOne({link:link})
                //console.log("Find", find)
                newsModel.find({ link: link }, function (err, data) {

                    //console.log("data", data)
                    //console.log("Errror",err)
                    if (data === "null") {
                        results.push({
                            title: title,
                            link: link,
                            summary: summary,
                            saved: false
                        });
                    }
                }
                )
                //.then(function (dbFind) {
                ///if exist not push
                //  console.log(dbFind)
                //console.log("dbFindLength" , typeof(dbFind))
                //  if (typeof(dbFind) === "undefinded") {
                //    results.push({
                //      title: title,
                //    link: link,
                //  summary: summary,
                //saved: false
                ///});
                //}



            });
            // console.log(results);
            // var exist=[]
            // results.foreach( function(element) {
            //   newsModel.findOne({link:element.link}).then(function (dbFind) {
            ///if exist not push

            //     return res.render('home', { news: newss });
            // });
            //})

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






        async function processData() {
            var response = await getAxiosData();
            var $ = cheerio.load(response.data);

            // Empty array to save our scraped data
            var results = [];
            //async.each($("h4.headline-link"),function(data,myPromise){
            //eachAsync($("h4.headline-link"),function ( element,i,done)  {    
           $("h4.headline-link").each(function (i, element) {
                var title = $(element).text();
                var link = $(element).parent().attr("href");
                var summary = $(element).next('h5').text()
                // var data =  await getData(link);
                // console.log("data",data);
                console.log("find", title)
                //var news =  getData(link)

                //await myPromise
                //var result = getData();

                try {
                    var news = await newsModel.findOne({ link: link })
                    console.log ("LOG", news)
                } catch (e) {
                    console.log(e);
                }
                console.log("NEWSASYNC",result)
                //console.log("AWAIT news" , news)
                //  process.nextTick(function () { 
                //   console.log( "Data ", getData(link))
                //  newsModel.findOne({title:title}).then(function (dbNews) {
                //   console.log("NEW", dbNews)
                //})

                //}
                //);
                //  console.log ("Data" , data)
                //newsModel.findOne({link:link}).exec().then(function(result) {
                //   console.log("Resultado", result)
                /// })

            })
        }
        processData()
        console.log("==========================================")

        async function getData(link) {
            try {
                // var newss =  newsModel.find({ link: link }).exec()
                newsModel.findOne({ link: link }).exec().then(function (newss) {
                    console.log("NEEWWWW", newss);
                    return newss
                }).catch(function (err) {
                    console.log(err)
                    return err
                })


            } catch (error) {
                console.error(error)
            }
        }

        var myPromise = (link) => {
            return new Promise((resolve, reject) => {

                newsModel.find({ link: link })
                    .limit(1)
                    .toArray(function (err, data) {
                        err
                            ? reject(err)
                            : resolve(data[0]);
                    });
            });
        };