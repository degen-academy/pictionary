

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


module.exports.join = async (event) => {
  const params = {
    Item: {
      PK: {
        S: 'connection-id',
      },
      SK: {
        S: event.requestContext.connectionId,
      },
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
