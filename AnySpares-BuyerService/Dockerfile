FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/Anyspare-BuyerService-0.0.1-SNAPSHOT.war buyerservice.war

EXPOSE 8083

ENTRYPOINT ["java","-jar","buyerservice.war"] 

# docker build -t rahulghadage1310/buyerservice:latest .

# docker push rahulghadage1310/buyerservice:latest