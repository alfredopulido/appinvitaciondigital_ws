const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();

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

const findOne = async (table,params) => {
    const res = await getByAttribute(table,params);
    if(res.Count>0){
        return res.Items[0];
    } else
        return false;
};

const addOrUpdate = async (table,item) => {
    const params = {
        TableName: table,
        Item: item
    };
    console.log(params)
    return await dynamoClient.put(params).promise();
};

const insertNew = async (table,item) => {
    try {
        /*var params = {
            TableName : "Movies",
            KeySchema: [       
                { AttributeName: "id", KeyType: "HASH"},  //Partition key
                { AttributeName: "title", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [       
                { AttributeName: "id", AttributeType: "S" },
                { AttributeName: "title", AttributeType: "S" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };
        
        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
        */
        var table = "Movies";

        var year = 'GVQL9E8UVHUQAV0PBKKA4LQ09NVV4KQNSO5AEMVJF66Q9ASUAAJG';
        var title = "The Big New Movie";

        var params = {
            TableName:table,
            Item:{
                "id": year,
                "title": title,
                "info":{
                    "plot": "Nothing happens at all.",
                    "rating": 0
                }
            }
        };

        console.log("Adding a new item...");
        dynamoClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    } catch (error) {
        console.log(error)
    }

    /*
    const unique =uuidv4();
    const params = {
        TableName: table,
        Item: {
            "id": unique,
            ...item
        },
    };
    return await addOrUpdate(table,params);
    */
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
    getByAttribute,
    findOne,
    insertNew
};
