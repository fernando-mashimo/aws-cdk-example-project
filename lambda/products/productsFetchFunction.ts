import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";

export const handler = async (
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	const lambdaRequestId = context.awsRequestId;
	const apiRequestId = event.requestContext.requestId;
	console.info(
		`API Gateway RequestId: ${apiRequestId}\nLambda RequestId: ${lambdaRequestId}`
	);

	const method = event.httpMethod;

	if (event.resource === "/products") {
		if (method === "GET") {
			console.info("GET /products");

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "GET /products - OK",
				}),
			};
		}
	}

	return {
		statusCode: 400,
		body: JSON.stringify({
			message: "Bad request",
		}),
	};
};
