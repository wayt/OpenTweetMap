# OpenTweetMap

## How to run the project
### Server-side

1. Create a twitter app and get access tokens and consumer keys
2. `ln -s client/build/ static/`
3. `go run app.go -access_token="" -access_token_secret="" -consumer_key="" -consumer_secret=""`


### Client-side
1. Install bower, grunt-cli and sass
2. `sudo npm i ; bower install -g`
3. `grunt`
4. Go to localhost:4242 and enjoy