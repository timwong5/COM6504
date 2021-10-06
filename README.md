# COM6504
## Install the node modules
`npm install`
## Run this project
`npm run start`
## Example Image URL
`http://www.baidu.com/img/bdlogo.png`
## To read the documentation
Click the doc\index.html to read it
## Errors need to be fixed
+ Need to claer the Browser Data at the first time running
+ The speed of getting the annotation data is too slow - I don't know why.
+ When refresh the index page, console shows the service-worker "uncaught (in promise) typeerror: failed to execute 'addall' on 'cache': request failed". Try not refresh the page directly when testing the project. The service-worker can use when first enter the homepage.
+ Only can show the "History" in front of the users in Chat history - try to add.
+ When users get chat history, they get a space line under the origin chat history. It seems that the welcome information's problem - I don't know how to solve it.
+ Sometimes users can't get the image from the Internet - maybe cross-domain problem.
