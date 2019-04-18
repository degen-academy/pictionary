'use strict';

module.exports.connect = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'connected to server',
      input: event,
    }),
  };
}


module.exports.disconnect = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'disconnected from server',
      input: event,
    }),
  };
}


module.exports.join = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'joined',
      input: event,
    }),
  };
}