// Import required modules and classes
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// --------------------------------------------------------------------------
import { AppModule } from './app.module';
// --------------------------------------------------------------------------
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

/**
 * Asynchronous function that starts the NestJS application
 */
async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Set global application prefix to 'api'
  app.setGlobalPrefix('api');

  // Enable compression and cookie parsing middleware
  app.use(compression());
  app.use(cookieParser());

  // Use global validation pipe for request data validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable Cross-Origin Resource Sharing (CORS) for a specific origin with credentials
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:5200'],
    credentials: true,
  });

  // Configure Swagger API documentation
  const options = new DocumentBuilder()
    .setTitle("Stock Control API's")
    .setDescription('')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey', // This should be apiKey
        name: 'x-api-key', // This is the name of the key you expect in header
        in: 'header',
      },
      'access-key' // This is the name to show and used in Swagger
    )
    .build();

  // Create Swagger API documentation
  const document = SwaggerModule.createDocument(app, options);

  // Set up Swagger UI for the '/swagger' endpoint
  SwaggerModule.setup('swagger', app, document);

  // Start the NestJS application and listen on port 8080
  await app.listen(8080);
}

// Call the bootstrap function to start the application
bootstrap();
