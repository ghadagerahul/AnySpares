FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/Anyspare-SellerService-0.0.1-SNAPSHOT.war sellerservice.war

EXPOSE 8082

ENTRYPOINT ["java","-jar","sellerservice.war"] 

# docker build -t rahulghadage1310/sellerservice:latest .

# docker push rahulghadage1310/sellerservice:latest