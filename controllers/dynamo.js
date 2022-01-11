const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const getALL = async (table) => {
    const params = {
        TableName: table,
    };
    const records = await dynamoClient.scan(params).promise();
    return records;
};

const getById = async (table,id) => {
    const params = {
        TableName: table,
        Key: {
            id,
        },
    };
    return await dynamoClient.get(params).promise();
};

const getByAttribute = async (table,params) => {
    let q='';
    let v={};
    let n={};
    for (let key in params){
        const i=Object.keys(params).indexOf(key);
        q+=((i>0)?' and ':'')+`#${key} = :value${i}`;
        v={
            ...v,
            [":value"+i]:params[key]
        }
        n={
            ...n,
            ["#"+key]:key
        }
    }
    const query = {
        TableName: table,
        FilterExpression: q,
        ExpressionAttributeValues:v,
        ExpressionAttributeNames:n
    };
    return await dynamoClient.scan(query).promise();
};

const addOrUpdate = async (table,item) => {
    const params = {
        TableName: table,
        Item: item,
    };
    return await dynamoClient.put(params).promise();
};

const deleteById = async (table,id) => {
    const params = {
        TableName: table,
        Key: {
            id,
        },
    };
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    getALL,
    getById,
    addOrUpdate,
    deleteById,
    getByAttribute
};
