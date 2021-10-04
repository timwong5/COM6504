# COM6504
## Install the node modules
`npm install`
## Run this project
`npm run start`
## Example Image URL
`http://www.baidu.com/img/bdlogo.png`
## Errors need to be fixed
+ When refresh the index page, console shows the service-worker "uncaught (in promise) typeerror: failed to execute 'addall' on 'cache': request failed"  
try not refresh the page directly when testing the project. The service-worker can use when first enter the homepage.
+ Can't get the annotation by ajax now - try to fix.
+ Only can show the "History" in front of the users in Chat history - try to fix.
+ When users get chat history, they get a space line under the origin chat history.
+ Sometimes users can't get the image from the Internet - maybe cross-domain problem.
