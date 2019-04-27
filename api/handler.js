

const AWS = require('aws-sdk');

const TABLE = 'pictionary';
const dynamodb = new AWS.DynamoDB();
const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev',
});

module.exports.connect = async (event) => {
  const { connectionId } = event.requestContext;
  const params = {
    Item: {
      PK: {
        S: 'connection_id',
      },
      SK: {
        S: `${connectionId}`,
      },
    },
    TableName: TABLE,
  };
  try {
    const data = await dynamodb.putItem(params).promise();
    console.log(`createChatMessage data=${JSON.stringify(data)}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'added connection to db',
        input: event,
      }),
    };
  } catch (error) {
    console.log(`connect ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `Could not create connection: ${error.stack}`,
    };
  }
};


module.exports.disconnect = async (event) => {
  const { connectionId } = event.requestContext;
  const params = {
    Key: {
      PK: {
        S: 'connection_id',
      },
      SK: {
        S: `${connectionId}`,
      },
    },
    TableName: TABLE,
  };
  try {
    const gameConnections = await dynamodb.getItem({
      Key: {
        PK: {
          S: 'connection_id',
        },
        SK: {
          S: connectionId,
        },
      },
      TableName: TABLE,
    }).promise();

    console.log(gameConnections);
    console.log(gameConnections.Item.game_ids.SS);

    const gameConnectionIds = gameConnections.Item.game_ids.SS || [];

    gameConnectionIds.forEach(async (gameId) => {
      await dynamodb.deleteItem({
        Key: {
          PK: {
            S: 'game_id:connection_id',
          },
          SK: {
            S: `${gameId}:${connectionId}`,
          },
        },
        TableName: TABLE,
      }).promise();
    });

    const data = await dynamodb.deleteItem(params).promise();
    console.log(`createChatMessage data=${JSON.stringify(data)}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'deleted connection from db',
        input: event,
      }),
    };
  } catch (error) {
    console.log(`disconnect ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `Could not remove connection: ${error.stack}`,
    };
  }
};

// {"action": "send_message", "message": "hello", "game_id": "mygameid", "name": "chirashi"}
module.exports.send_message = async (event) => {
  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`,
    };
  }
  const { message, game_id: gameId, name } = _parsed;
  const params = {
    ExpressionAttributeValues: {
      ':v1': {
        S: 'game_id:connection_id',
      },
      ':gid': {
        S: gameId,
      },
    },
    KeyConditionExpression: 'PK = :v1 and begins_with(SK, :gid)',
    TableName: TABLE,
  };

  let data;
  try {
    data = await dynamodb.query(params).promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      error: 'could not send message',
    };
  }

  await Promise.all(
    data.Items.map(async (player) => {
      const connectionId = player.SK.S.split(':')[1];

      if (connectionId === event.requestContext.connectionId) {
        return;
      }

      const payload = {
        name,
        message,
      };
      const params = {
        Data: JSON.stringify(payload),
        ConnectionId: connectionId,
      };

      try {
        await apigatewaymanagementapi.postToConnection(params).promise();
      } catch (error) {
        console.error(`failed to post to connection ${connectionId}, removing...`);
        // TODO: remove item from dynamodb
      }
    }),
  );
  return {
    statusCode: 200,
  };
};

// {"action": "join", "game_id": "mygameid", "name": "chirashi"}
module.exports.join = async (event) => {
  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`,
    };
  }
  const { name, game_id: gameId } = _parsed;
  const { connectionId } = event.requestContext;
  const params = {
    Item: {
      PK: {
        S: 'game_id:connection_id',
      },
      SK: {
        S: `${gameId}:${connectionId}`,
      },
      name: {
        S: `${name}`,
      },
      game_id: {
        S: `${gameId}`,
      },
    },
    TableName: TABLE,
  };
  try {
    const addGameData = await dynamodb.updateItem({
      ExpressionAttributeNames: {
        '#GID': 'game_ids',
      },
      ExpressionAttributeValues: {
        ':gid': {
          SS: [gameId],
        },
      },
      Key: {
        PK: {
          S: 'connection_id',
        },
        SK: {
          S: connectionId,
        },
      },
      UpdateExpression: 'ADD #GID :gid',
      TableName: TABLE,
    }).promise();

    console.log(`joined game: ${addGameData}`);

    const data = await dynamodb.putItem(params).promise();
    console.log(`createChatMessage data=${JSON.stringify(data)}`);
    return { statusCode: 200, body: JSON.stringify(`joined game with id ${event.requestContext.connectionId}`) };
  } catch (error) {
    console.log(`createChatMessage ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `Could not join game: ${error.stack}`,
    };
  }
};
