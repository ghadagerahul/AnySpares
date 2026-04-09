FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/AnySpares-DiscoveryServer-0.0.1-SNAPSHOT.war discoveryserver.war

EXPOSE 8761

ENTRYPOINT ["java","-jar","discoveryserver.war"]

# docker build -t rahulghadage1310/discoveryserver:latest .

# docker push rahulghadage1310/discoveryserver:latest