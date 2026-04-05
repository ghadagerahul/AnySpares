FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/Anyspare-UserService-0.0.1-SNAPSHOT.war userservice.war

EXPOSE 8181

ENTRYPOINT ["java","-jar","userservice.war"]

# docker build -t rahulghadage1310/userservice:latest .

# docker push rahulghadage1310/userservice:latest


#docker pull rahulghadage1310/discoveryserver:latest
#docker pull rahulghadage1310/servicegateway:latest
#docker pull rahulghadage1310/sellerservice:latest
#docker pull rahulghadage1310/buyerservice:latest
