import {
  initSQS,
  sendToDeadLetterQueue,
  GrayLogger,
} from "./helpers";
import { graylog } from "graylog2";
import { URL_SQS } from "./config";
import { Consumer } from "sqs-consumer";
import { AnnotationService } from "./services/annotation.service";
import { Injectable } from "@nestjs/common";

const graylog = new GrayLogger();

@Injectable()
export class sqsService {
  constructor(
    private readonly annotationService: AnnotationService
  ) {}

  async startSQS() {
    const sqs = initSQS();

    const app = Consumer.create({
      queueUrl: URL_SQS,
      batchSize: 10,
      waitTimeSeconds: 10,
      handleMessageBatch: async (messages) => {
        try {
    
    
          const promises = messages.map((message) => {
            const data = JSON.parse(message.Body);
            graylog.log(`Processing message: ${message.MessageId}`);
    
            return this.annotationService.saveAnnotations(data)
          });
          await Promise.all(promises);
        } catch (error) {
          app.emit("error", new Error(error.message));
        }
      },
      sqs,
    });
    
    app.on("error", async (err) => {
      graylog.log("error")
      console.error("queue error", err.message);
      await sendToDeadLetterQueue();
    });
    
    app.on("processing_error", async (err) => {
      graylog.log("processing_error")
      console.error("processing_error", err.message);
      await sendToDeadLetterQueue();
    });
    
    app.on('timeout_error', (err) => {
      graylog.log("timeout_error")
    
      console.error(err.message);
    });
    
    app.on("message_received", async (message) => {
      graylog.log("message_received")
    })
    
    app.on("empty", () => {
      graylog.log("the queue is empty")
    });
    
    console.log("Queue service is running");
    graylog.log("Queue service is running");

    return app.start();
  }
}
