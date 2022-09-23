const {
  CreateTagsCommand,
  RunInstancesCommand,
  EC2Client
} = require("@aws-sdk/client-ec2");
const REGION = "ap-southeast-1"; 
// Create anAmazon EC2 service client object.
const ec2Client = new EC2Client({ region: REGION });


// Set the parameters
const instanceParams = {
  ImageId: 'ami-07651f0c4c315a529', //AMI_ID
  InstanceType: "t2.micro",
  KeyName: "aws-training", //KEY_PAIR_NAME
  MinCount: 1,
  MaxCount: 1,
};

const run = async () => {
  try {
    const data = await ec2Client.send(new RunInstancesCommand(instanceParams));
    console.log(data.Instances[0].InstanceId);
    const instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    const tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: "Name",
          Value: "Thinh-SDK",
        },
      ],
    };
    try {
      await ec2Client.send(new CreateTagsCommand(tagParams));
      console.log("Instance tagged");
    } catch (err) {
      console.log("Error", err);
    }
  } catch (err) {
    console.log("Error", err);
  }
};
run();
