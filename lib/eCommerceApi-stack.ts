import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";

interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodejs.NodejsFunction;
}

export class ECommerceApiStack extends cdk.Stack { // classe que define o API Gateway
	constructor(scope: Construct, id: string, props: ECommerceApiStackProps) { // toda classe que extende de cdk.Stack deve receber 3 argumentos
		super(scope, id, props); // chama o construtor da classe pai

    const logGroup = new cwLogs.LogGroup(this, "ECommerceApiLogs"); // cria um novo grupo de logs para a API Gateway
		const api = new apiGateway.RestApi(this, "ECommerceApi", { // cria um novo recurso de API Gateway, do tipo RestApi
			restApiName: "ECommerceApi",
			description: "API Gateway for E-Commerce App",
      // cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
		});

    const productsFecthIntegration = new apiGateway.LambdaIntegration(props.productsFetchHandler); // cria uma integração com a função productsFetchHandler
    // "GET /products"
    const productsResource = api.root.addResource("products"); // adiciona um recurso chamado "products" ao recurso raiz da API
    productsResource.addMethod("GET", productsFecthIntegration); // adiciona um método GET ao recurso "products" e integra com a função productsFetchHandler
	}
}
