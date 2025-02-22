# Use the official Gradle image as the base image
FROM gradle:jdk-21-and-23-graal AS build

# Set the working directory
WORKDIR /app

# Copy the build.gradle and any other necessary configuration files
COPY ./build.gradle /app
COPY ./settings.gradle /app
COPY ./gradlew /app
COPY ./gradle /app/gradle
COPY ./src /app/src

# Build the application
RUN gradle clean build -x test

# Create a new image for running the application
FROM openjdk:21-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port on which the Spring Boot application will run
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]
