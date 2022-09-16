const PORT = 8000;
const axios = require('axios').default;
const cheerio = require('cheerio');
const { response } = require('express');
const express = require('express');


const app = express();
const newsPapers = [
    {
        name:'thetimes',
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },
    {
        name:'theguardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''

    },
    {
        name:'telegraph',
        address:'https://www.telegraph.co.uk/climate-change',
        base:"https://www.telegraph.co.uk"
    }
];

const articles = [];

newsPapers.forEach(function(newspaper){
    axios.get(newspaper.address)
    .then(function(response){
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url:newspaper.base + url,
                source:newspaper.name
            })
        })
    })
})




app.get('/',(req,res)=>{
    res.json('Welcome to climate change news API')
    console.log('testing')
})



app.get('/news',(req,res)=>{
    res.json(articles)
    console.log(articles)

})



app.get('/news/:newspaperId',async (req,res)=>{
    const newsId = req.params.newspaperId
    const news = newsPapers.filter(newspaper=> newspaper.name == newsId)[0].address ;
    const newsBase = newsPapers.filter(newspaper=> newspaper.name == newsId)[0].base;
    axios.get(news).then(function(response){
        const htm = response.data;
        const $ = cheerio.load(htm)
        const specArticles = [];
        $('a:contains("climate")',htm).each(function(){
            const title = $(this).text();
            const url = $(this).attr("href");
            specArticles.push({
                title,
                url: newsBase + url,
                source: newsId
                
            })
        })
        res.json(specArticles)
    }).catch(err => console.log(err) )
    //res.json("hi again +++: project Mbappe now filtered ?")
    //console.log(news)
})


app.listen(PORT,()=>{console.log(`server running on port ${PORT} `)})