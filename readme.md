**Goal**  
-
Create a URL shortener with a JSON RESTful API containing 3 endpoints, one using the GET method which will redirect the user to the original URL, one using the POST method to create a shortened URL, and the other using the GET method to return the app statistics.

**Requirements**  
-
● Create a Dockerfile  
● Created using Node.js  
● You can use Nestjs  
● Cache with Redis
● PostgreSQL database  
● Input JSON validation  
● Error handling eg. HTTP status codes  
● Metrics  

*POST request requirements:*  
● Accepts an optional `short` property that defines what the shortened URL should look like  
● If no `short` property was passed, use a pseudo-randomly generated string  
● If validation fails, return with the proper Restful codes.  
● If the request body is invalid, show an appropriate error  

*GET request requirements:*  
● Redirect to the full-size URL  
● If the URL is invalid, show an appropriate error  

*GET request requirements (statistics):*  
● Return valid data containing app usage statistics.  
● Data should be sorted by period ( day, week, etc.. )  
● Feel free to pre-seed the database to display more data.  

**Execution plan** 
- 
● Initialize npm  
&ensp; - `npm i zod winston express cors helmet http-errors http-status-codes morga uuid @prisma/client moment`  
&ensp; - `npm i --save-dev ts-node typescript dotenv nodemon prisma redis @types/express @types/http-errors @types/cors @types/http-status-codes @types/morgan @types/node @types/winston @types/redis @types/uuid @types/moment`  
● Init GIT  
● Initialize Typescript, create build and debug script  
&ensp; - `npx tsc --init`  
● Setup Database client  
&ensp; - `npx prisma init --datasource-provider postgresql`  
● Setup Redis client  
● Connect server with Docker containers of Redis and Postgresql 
● Create Shortener endpoint  
&ensp;- use body validation `Zod validator`  
&ensp;- use dummy auth API key  
&ensp;- store in PostgreSQL and REDIS 
● Create Auth middleware  
&ensp;- check for auth api key  
● Create GET endpoint
&ensp;- first check Redis then Database  
&ensp;- store metrics into Redis  
&ensp; - redirect to origin url  
● Create Transform statistic function  
● Create GET statistic function  
-

execute migration script in first build:
`docker-compose up --detach --build; docker-compose exec app npm run tables:create`  

**Features**
- 
● Counter: collect redirect counts data on Redis and periodically transfer data to the Postgresql