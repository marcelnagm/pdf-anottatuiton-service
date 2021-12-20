import aws from "aws-sdk";
import { AWS_REGION, DLQ_URL_SQS, ARN_DLQ } from "../config";

export const sendToDeadLetterQueue = async () => {
  aws.config.update({ region: AWS_REGION });
  console.log("Trying on error");

  const sqs = new aws.SQS({ apiVersion: "2012-11-05" });

  const params = {
    Attributes: {
      RedrivePolicy: `{"deadLetterTargetArn":"${ARN_DLQ}","maxReceiveCount":"10"}`,
    },
    QueueUrl: DLQ_URL_SQS,
  };

  return sqs.setQueueAttributes(params).promise();
};
