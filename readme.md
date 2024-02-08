**Url Shortener**  
-
Create a URL shortener with a JSON RESTful API containing 3 endpoints, one using the GET method which will redirect the user to the original URL, one using the POST method to create a shortened URL, and the other using the GET method to return the app statistics.

Execute migration script in first build:  
`docker-compose up --detach --build; docker-compose exec app npm run tables:create`  

**Requirements**  
-
● Node.js   
● Cache with Redis  
● PostgreSQL database  
● Input JSON validation  
● Error handling eg. HTTP status codes 
● Dockerfile   
● Metrics  

**Endpoints**  
-
**shorten url**  
● Accepts an optional `short` property that defines what the shortened URL should look like  
● If no `short` property was passed, use a pseudo-randomly generated string  

[POST] URI: `/api/shorten`  
[REQUIRED]  
headers: `X-API-KEY`  - user api key  
body: `full`  - full url for shortening

[OPTIONAL]
body: `short`  - custom shortening id  



**redirect to origin**  
● Redirect to the full-size URL  

[GET] URI: `/:id`
[REQUIRED]  
query: `id` - id of the short url    

**fetch statistics data**  
● Return valid data containing app usage statistics.  
● Data should be sorted by period ( day, week, etc.. )  

[GET] URI: `/api/statistics/:id`  
[REQUIRED]  
headers: `X-API-KEY`  - user api key  
query: `id` - id of the short url  

[OPTIONAL]  
period - period of statistic data ("week", "year", "day", "hour", "month")  
order - "asc", "desc"  
cursor - id of the last short ulr from the list  
take - quantity of returned statistics data (no more than 100)  
from - date as a starting point of statistics  ("YYYY-MM-DD")  



**Scaling features**
- 
● Counter: collect redirect counts data on Redis and periodically transfer data to the Postgresql