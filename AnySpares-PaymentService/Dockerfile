FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/Anyspare-PaymentService-0.0.1-SNAPSHOT.war paymentservice.war

EXPOSE 8181

ENTRYPOINT ["java","-jar","paymentservice.war"]

# docker build -t rahulghadage1310/paymentservice:latest .

# docker push rahulghadage1310/paymentservice:latest


#docker pull rahulghadage1310/discoveryserver:latest
#docker pull rahulghadage1310/servicegateway:latest
#docker pull rahulghadage1310/sellerservice:latest
#docker pull rahulghadage1310/buyerservice:latest
