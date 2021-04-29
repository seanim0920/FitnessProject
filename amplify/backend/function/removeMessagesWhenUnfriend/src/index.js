/* Amplify Params - DO NOT EDIT
	API_FITNESSPROJECTAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_FITNESSPROJECTAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
require('isomorphic-fetch');
const AWS = require('aws-sdk/global');
const AUTH_TYPE = require('aws-appsync').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag');

const config = {
  url: process.env.API_FITNESSPROJECTAPI_GRAPHQLAPIENDPOINTOUTPUT, //still not sure why the apigraphqlendpoint variable is undefined here but not in the friendrequestresolver function
  region: process.env.AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials,
  },
  disableOffline: true
};

const client = new AWSAppSyncClient(config);

const deletePost =
`
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      createdAt
      updatedAt
      userId
      description
      parentId
      channel
      receiver
      isParent
    }
  }
`;
const postsByChannel = /* GraphQL */ `
  query PostsByChannel(
    $channel: ID
    $parentIdIsParentCreatedAt: ModelPostByChannelCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByChannel(
      channel: $channel
      parentIdIsParentCreatedAt: $parentIdIsParentCreatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        createdAt
        updatedAt
        userId
        description
        parentId
        channel
        receiver
        isParent
        likes
      }
      nextToken
    }
  }
`;

exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    if (record.eventName == "REMOVE") {
      const sender = record.dynamodb.OldImage.sender.S;
      const receiver = record.dynamodb.OldImage.receiver.S;

        (async () => {
          try {
            const results = await client.query({
              query: gql(postsByChannel),
              variables: {
                channel: sender<receiver?sender+receiver:receiver+sender,
              }
            });

            await Promise.all(results.data.postsByChannel.items.map(async (post) => {
              client.mutate({
                mutation: gql(deletePost),
                variables: {
                  input: {
                    createdAt: post.createdAt,
                    userId: post.userId,
                  }
                }
              });
            }));

            callback(null, "successfully deleted messages");
            return;
          } catch (e) {
            console.warn('Error deleting replies: ', e);
            callback(Error(e));
            return;
          }
        })();
    }
  });
};