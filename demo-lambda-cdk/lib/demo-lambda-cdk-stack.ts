import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class DemoLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaExtension = new lambda.LayerVersion(
      this,
      "DemoLambdaExtension",
      {
        code: lambda.Code.fromAsset("../demo-lambda-extension/target/lambda/"),
      }
    );

    const lambdaHandler = new lambda.Function(this, "DemoLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_LATEST,
      timeout: cdk.Duration.seconds(30),
      handler: "dist/index.handler",
      code: lambda.Code.fromAsset("../demo-lambda-handler"),
      layers: [lambdaExtension],
    });

    lambdaHandler.addEnvironment(
      "AWS_LAMBDA_EXTENSIONS",
      lambdaExtension.layerVersionArn
    );
  }
}
