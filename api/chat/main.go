package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"

	// ag "github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

const tableName = "pictionary"

var access string
var secret string

type Response events.APIGatewayProxyResponse

type handler struct {
	ddb dynamodbiface.DynamoDBAPI
	agw *apigatewaymanagementapi.ApiGatewayManagementApi
}

type Message struct {
	Action  string `json:"action"`
	Event   string `json:"event"`
	Message string `json:"message"`
	GameID  string `json:"game-id"`
	Name    string `json:"name"`
}

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, req events.APIGatewayWebsocketProxyRequest) (Response, error) {
	sess := session.New()
	// fmt.Printf("sessino: %+v", sess.Config)

	h := handler{
		ddb: dynamodb.New(sess, aws.NewConfig().WithRegion("us-west-2")),
		agw: apigatewaymanagementapi.New(sess, aws.NewConfig().WithRegion("us-west-2")),
	}
	message := &Message{}
	json.Unmarshal([]byte(req.Body), message)
	fmt.Printf("%+v", req)
	if message.Event == "join" {
		return h.join(ctx, req, message)
	} else if message.Event == "broadcast" {
		return h.broadcast(ctx, req, message)
	}

	return Response{}, fmt.Errorf("connection handler: do not understand event type %s", req.RequestContext.EventType)
}

// {"action": "chat", "event": "join", "message": "hello", "game-id": "mygameid", "name": "chirashi"}
func (h *handler) join(ctx context.Context, req events.APIGatewayWebsocketProxyRequest, message *Message) (Response, error) {
	_, err := h.ddb.PutItem(&dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String("game-id:connection-id"),
			},
			"SK": {
				S: aws.String(fmt.Sprintf("%s:%s", message.GameID, req.RequestContext.ConnectionID)),
			},
			"Name": {
				S: aws.String(message.Name),
			},
			"GameID": {
				S: aws.String(message.GameID),
			},
		},
		TableName: aws.String(tableName),
	})

	if err != nil {
		return Response{
			Body: err.Error(),
		}, fmt.Errorf("could not join game-id %s: %s", message.GameID, err)
	}

	return Response{StatusCode: 200, Body: fmt.Sprintf("joined game id %s as %s", message.GameID, message.Name)}, nil
}

type connectionIDRecord struct {
	SK string
}

func (h *handler) broadcast(ctx context.Context, req events.APIGatewayWebsocketProxyRequest, message *Message) (Response, error) {
	res, err := h.ddb.Query(&dynamodb.QueryInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":v1": {
				S: aws.String("game-id:connection-id"),
			},
			":gid": {
				S: aws.String(message.GameID),
			},
		},
		KeyConditionExpression: aws.String("PK = :v1 and begins_with(SK, :gid)"),
		TableName:              aws.String(tableName),
	})

	if err != nil {
		return Response{
			Body: err.Error(),
		}, fmt.Errorf("failed to broadcast to game-id %s: %s", message.GameID, err)
	}

	for _, connection := range res.Items {
		var s string
		dynamodbattribute.NewDecoder().Decode(connection["SK"], &s)

		connectionID := strings.Split(s, ":")[1]
		h.agw.ClientInfo.Endpoint = "https://noc8wkkta6.execute-api.us-west-2.amazonaws.com/prod"
		connectionsReq, _ := h.agw.PostToConnectionRequest(&apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(connectionID),
			Data:         []byte("hello"),
		})
		connectionsReq.SetBufferBody([]byte(message.Message))
		err := connectionsReq.Send()
		if err != nil {
			fmt.Println(err)
		}
	}

	return Response{StatusCode: 200, Body: "broadcasted"}, nil
}

func main() {
	lambda.Start(Handler)
}
