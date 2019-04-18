

const AWS = require('aws-sdk');

const TABLE = 'pictionary';
const dynamodb = new AWS.DynamoDB();

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

// {"action": "join", "message": "hello", "game_id": "mygameid", "name": "chirashi"}
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
        S: `${game_id}:${connectionId},`
      },
      Name: {
        S: `${name}`
      },
      GameID: {
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
