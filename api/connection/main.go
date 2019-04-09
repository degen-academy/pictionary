package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

const tableName = "pictionary"

type Response events.APIGatewayProxyResponse

type handler struct {
	ddb dynamodbiface.DynamoDBAPI
}

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, req events.APIGatewayWebsocketProxyRequest) (Response, error) {
	sess := session.New()
	h := handler{
		ddb: dynamodb.New(sess, aws.NewConfig().WithRegion("us-west-2")),
	}

	if req.RequestContext.EventType == "CONNECT" {
		return h.connect(ctx, req)
	} else if req.RequestContext.EventType == "DISCONNECT" {
		return h.disconnect(ctx, req)
	}

	return Response{}, fmt.Errorf("connection handler: do not understand event type %s", req.RequestContext.EventType)
}

func (h *handler) connect(ctx context.Context, req events.APIGatewayWebsocketProxyRequest) (Response, error) {
	_, err := h.ddb.PutItem(&dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String("connection-id"),
			},
			"SK": {
				S: aws.String(req.RequestContext.ConnectionID),
			},
		},
		TableName: aws.String(tableName),
	})

	if err != nil {
		return Response{StatusCode: 500}, fmt.Errorf("failed to put connection-id %s in dynamo: %s", req.RequestContext.ConnectionID, err)
	}

	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            "connected",
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}
	return resp, nil
}

func (h *handler) disconnect(ctx context.Context, req events.APIGatewayWebsocketProxyRequest) (Response, error) {
	_, err := h.ddb.DeleteItem(&dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String("connection-id"),
			},
			"SK": {
				S: aws.String(req.RequestContext.ConnectionID),
			},
		},
		TableName: aws.String(tableName),
	})

	if err != nil {
		return Response{StatusCode: 500}, fmt.Errorf("failed to remove connection-id %s from dynamo: %s", req.RequestContext.ConnectionID, err)
	}
	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            "disconencted",
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}
	return resp, nil
}

func main() {
	lambda.Start(Handler)
}
