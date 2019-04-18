

const AWS = require('aws-sdk');

const TABLE = 'pictionary';
const dynamodb = new AWS.DynamoDB();
const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  endpoint: "https://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev"
});

module.exports.connect = async event => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'connected to server',
    input: event,
  }),
});


module.exports.disconnect = async event => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'disconnected from server',
    input: event,
  }),
});

// {"action": "send_message", "message": "hello", "game_id": "mygameid", "name": "chirashi"}
module.exports.send_message = async event => {
  // TODO: only allow sends on rooms you're in
  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`
    };
  }
  const { message, game_id } = _parsed;
  var params = {
    ExpressionAttributeValues: {
      ":v1": {
        S: "game_id:connection_id"
      },
      ":gid": {
        S: game_id,
      }
    },
    KeyConditionExpression: "PK = :v1 and begins_with(SK, :gid)",
    TableName: TABLE
  };

  var data;
  try {
    data = await dynamodb.query(params).promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      error: "could not send message"
    };
  }

  await Promise.all(
    data.Items.map(async player => {
      const connectionId = player.SK.S.split(':')[1];

      if (connectionId === event.requestContext.connectionId) {
        return;
      }

      const params = {
        Data: message || '',
        ConnectionId: connectionId
      }

      try {
        await apigatewaymanagementapi.postToConnection(params).promise();
      } catch(error) {
        console.error(`failed to post to connection ${connectionId}, removing...`)
        // TODO: remove item from dynamodb
      }
    })
  )
  return {
    statusCode: 200
  }
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
      error: `Could not parse requested JSON: ${err.stack}`
    };
  }
  const { name, game_id } = _parsed;
  const connectionId = event.requestContext.connectionId;
  const params = {
    Item: {
      PK: {
        S: 'game_id:connection_id',
      },
      SK: {
        S: `${game_id}:${connectionId}`
      },
      name: {
        S: `${name}`
      },
      game_id: {
        S: `${game_id}`
      }
    },
    TableName: TABLE,
  };
  try {
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
