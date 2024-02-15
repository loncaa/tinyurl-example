# Url Shortener  
URL shortener with a JSON RESTful API containing 3 endpoints. 
- GET method that redirects the user to the original URL. 
- POST method to create a shortened URL
- GET method to return the app statistics

## Build  
Execute migration script in first build:  
`docker-compose up --detach --build; docker-compose exec app npm run tables:create`  

## Database seeds
To seed the database with short URL id:`example` and statistic data for period:`weeks` execute npm script:  
`npm run tables:seedWeeks`  

**Localhost environment variables**  
Create a `.env` file in the root of the project and populate it with variables:  
```
DATABASE_URL=
REDIS_URL=
SERVER_PORT=
HOST=
NODE_ENV=development
```  
  
    
# API Endpoints
## Shorten url 
Accepts an optional `short` property that defines what the shortened URL should look like  
If no `short` property was passed, pseudo-randomly generated string is used for ID
```
[POST] URI: `/api/shorten`  
```
#### HEADERS   
| Field | Required | Description |
|------ | ---------| ----------- |
| x-api-key | true | user api key, in this version it is required just to not be an empty string|

#### BODY PAYLOAD  
| Field | Required | Description |
|------ | ---------| ----------- |
| full  | true | full url ready for shortening
| short | false | custom shortening id  


## Redirect to origin
Redirects to the full-size URL  

```
[GET] URI: `/:id`  
```  

#### URL PARAMS  
| Field | Required | Description |
|------ | ---------| ----------- |
| id    | true     | id of the short url |

## Fetch statistics data  
Returns valid data containing app usage statistics.  
```
[GET] URI: `/api/statistics/:id`  
```  
  
#### HEADERS   
| Field | Required | Description |
|------ | ---------| ----------- |
| x-api-key | true | user api key, in this version it is required just to not be an empty string|  

#### URL PARAMS  
| Field | Required | Description |
|------ | ---------| ----------- |
| id    | true     | id of the short url|

#### URL QUERY  
| Field | Required | Description | Requirements |
|------ | ---------| ----------- | ---- |
| period  | true | period of data | "week", "year", "day", "hour", "month"
|order | false | type of ordering | "asc", "desc"
|cursor | false | ID of the last short URL from the list 
|take | false | quantity of returned statistics data | no more than 100
| from | false | date as a starting point of statistics | "YYYY-MM-DD"


## Scaling features
### Caching  
Instead of connecting to database on every request, Redis is used as a cache layer. Redis keys are checked first, and then if data is not found on Redis, server connects to the Database and fetches the data.  

### Counting visits  
To prevent many connections to the database, Redis is used as a data aggregator. When a user uses a short URL, the backend increases Redis correlated keys to that short URL and increases them by 1, also Redis sets the timer key to expire in N milliseconds.  
After the timer key expires, Redis publishes an event that tigers the job which persists Redis data into a database.