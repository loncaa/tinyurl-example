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
● Initialize npm project  
    - express, zod, typescript, dotenv  
● Init GIT  
● Initialize Typescript, create build and debug script  
    - `npx tsc --init`
● Setup Database client
    - `npx prisma init --datasource-provider postgresql`
● Setup Redis client
● Create Dockerfile, install PostgreSQL and Reids on docker, connect with it  
● Create Shortener endpoint  
    - use body validation `Zod validator`  
    - use dummy auth API key  
    - store in PostgreSQL and REDIS 
● Create Auth middleware  
● Create GET endpoint  
    - 

**Dependencies**
`npm i zod winston express cors helmet http-errors http-status-codes morga @prisma/client`
**Dev dependencies**
`npm i --save-dev ts-node typescript dotenv nodemon prisma redis @types/express @types/http-errors @types/cors @types/http-status-codes @types/morgan @types/node @types/winston @types/redis`