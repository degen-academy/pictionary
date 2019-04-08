package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	ag "github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
)

func main() {
	lambda.Start(handle)
}

type a struct{}

func handle() (*a, error) {
	fmt.Println("asdf")
	// creds := credentials.NewEnvCredentials()
	// signer := v4.NewSigner(creds)
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-west-2"),
	}))
	client := ag.New(sess)
	connectionID := "XxoHKe2DvHcAdgQ="
	client.ClientInfo.Endpoint = "https://0sn07huhd5.execute-api.us-west-2.amazonaws.com/prod"
	req, _ := client.PostToConnectionRequest(&ag.PostToConnectionInput{
		ConnectionId: aws.String(connectionID),
		Data:         []byte("hello"),
	})
	req.SetBufferBody([]byte("hello"))
	err := req.Send()
	fmt.Println(err)

	return nil, nil
}
