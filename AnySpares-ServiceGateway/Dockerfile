FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/AnySpares-ServiceGateway-0.0.1-SNAPSHOT.war servicegateway.war

EXPOSE 8181

ENTRYPOINT ["java","-jar","servicegateway.war"]

# docker build -t rahulghadage1310/servicegateway:latest .

# docker push rahulghadage1310/servicegateway:latest


#docker pull rahulghadage1310/discoveryserver:latest
#docker pull rahulghadage1310/servicegateway:latest
#docker pull rahulghadage1310/sellerservice:latest
#docker pull rahulghadage1310/buyerservice:latest
