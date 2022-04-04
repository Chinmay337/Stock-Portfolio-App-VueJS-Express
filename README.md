<link href="style.css" rel="stylesheet" />

# Stock Portfolio Simulator

<hr>
</br>

## Overview

</br>

- Stock Portfolio Application with a VueJS Frontend and Express Backend
- Uses MongoDB with Docker compose for the DB

- There will be 2 types of users

- Administrator
- Normal User

</br>

### Server.js

</br>

- Dependencies - express, body-parser , express-handlebars , js2xmlparser , mongodb , mongoose , yahoo finance
- Main route for <code>app.get('/')</code> redirects to <code>'app/users'</code>
- <code>'/app/users/'</code> is the <k>admin page</k>
- <code>'/app/userDetails/'</code> is the <k>user page</k>
- All of the API routes are in <code>"./routes/index"</code>

</br>

### Admin API's

</br>

- All of the functionality is implemented and exported for the associated routes to <code>server.js</code>
- <code>/api/users<em>[get]</em> (displayAllUsers.js)</code> - this API is used by the admin to view all users
- <code>/api/users<em>[put]</em> (updateUser.js)</code> - this API is used by the admin to update a user
- <code>/api/users<em>[post]</em> (addUser.js)</code> - this API is used by the admin to add a new user
- <code>/api/users<em>[delete]</em> (removeUser.js)</code> - this API is used by the admin to remove a user

- <code>/users/:id<em>[get]</em> (displaySingleUser.js)</code> - this API is used by a normal user to view their portfolio
- <code>/users/:id/cash<em>[post]</em> (addCash.js)</code> - this API is used by a normal user to add Cash to their balance

</br>

### User API's

</br>

- <span>Searchstock.js</span> uses <span>yahoofinance</span> to pull information about stocks
- <code>api/users/:uid/pos<em>[post]</em> (buyStock.js)</code> - Add new stock position (Buy operation)
- <code> api/users/:uid/pos/:id<em>[delete]</em> (sellStock.js)</code>- Sell given stock position
- <code> api/search/:symbol<em>[get]</em> (searchStock.js)</code>- Search for given ticker and get details
