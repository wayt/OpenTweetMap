package main

import (
	"flag"
	"fmt"
	"github.com/chimeracoder/anaconda"
	"golang.org/x/net/websocket"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var (
	ConsumerKey       = flag.String("consumer_key", "", "Client App Consumer Key")
	ConsumerSecret    = flag.String("consumer_secret", "", "Client App Consumer Secret")
	AccessToken       = flag.String("access_token", "", "User Access Token")
	AccessTokenSecret = flag.String("access_token_secret", "", "User Access Token Secret")
)

// Echo the data received on the WebSocket.
func EchoServer(ws *websocket.Conn) {

	anaconda.SetConsumerKey(*ConsumerKey)
	anaconda.SetConsumerSecret(*ConsumerSecret)
	twitter := anaconda.NewTwitterApi(*AccessToken, *AccessTokenSecret)

	lastSlashIndex := strings.LastIndex(ws.Config().Location.String(), "/")
	if lastSlashIndex == 0 {
		ws.Write([]byte(`{"error":"no hashtag"}`))
		ws.Close()
		return
	}

	hashTag := ws.Config().Location.String()[lastSlashIndex+1:]
	if len(hashTag) == 0 {
		ws.Write([]byte(`{"error":"empty hashtag"}`))
		ws.Close()
		return
	}

	fmt.Printf("Looking for #%s\n", hashTag)

	sinceId := ""
	for {

		v := url.Values{}
		v.Set("count", "30")
		if len(sinceId) != 0 {
			v.Set("since_id", sinceId)
		}
		result, err := twitter.GetSearch("#"+hashTag, v)
		if err != nil {
			log.Panicf("error: %v\n", err)
		}

		for _, tweet := range result.Statuses {

			fmt.Println(tweet.Text)
			fmt.Println(tweet.Place)
			if len(tweet.Place.BoundingBox.Coordinates) != 0 {

				ws.Write([]byte(fmt.Sprintf(`{"screen_name":"@%s", "name":"%s", "text":"%s", "created_at":"%s", "location":[%f,%f]}`, tweet.User.ScreenName, tweet.User.Name, tweet.Text, tweet.CreatedAt, tweet.Place.BoundingBox.Coordinates[0][0][1], tweet.Place.BoundingBox.Coordinates[0][0][0])))
			}
		}

		sinceId = result.Metadata.MaxIdString

		time.Sleep(2 * time.Second)
	}
}

func main() {

	flag.Parse()

	http.Handle("/track/", websocket.Handler(EchoServer))
	http.Handle("/", http.FileServer(http.Dir("./static")))
	err := http.ListenAndServe(":4242", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}

}
