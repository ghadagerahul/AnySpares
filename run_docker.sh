#!/bin/bash

# Exit immediately if a command fails
set -e

# ----------- CONFIG -----------
DOCKER_USERNAME="rahulghadage1310"

# List of services with image names
SERVICES=(
"AnySpares-DiscoveryServer:discoveryserver"
"AnySpares-ServiceGateway:servicegateway"
"AnySpares-UserService:userservice"
"AnySpares-SellerService:sellerservice"
"AnySpares-BuyerService:buyerservice"
"AnySpares-PaymentService:paymentservice"
#"AnySpares-TrackingService:trackingservice"
#"AnySpares-OrderService:orderservice"
#"AuthenticationService:authservice"
)

BASE_DIR=$(pwd)

echo "🔍 Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null
then
  echo "❌ Docker is not installed"
  exit 1
fi

# Check Docker permissions using sudo
if ! sudo docker info &> /dev/null
then
  echo "❌ Cannot access Docker with sudo."
  echo "👉 Make sure Docker is installed and sudo works."
  exit 1
fi

# Check Docker login using sudo
if ! sudo docker info | grep -q "Username"; then
  echo "⚠️ Docker not logged in. Please login to Docker Hub."
  sudo docker login
  echo "✅ Docker login successful"
else
  echo "✅ Docker already logged in"
fi

echo "🚀 Starting Docker build & push process for all services..."

# ----------- PROCESS -----------

for SERVICE in "${SERVICES[@]}"
do
  IFS=":" read DIR IMAGE <<< "$SERVICE"
  SERVICE_DIR="$BASE_DIR/$DIR"

  echo "----------------------------------------"
  echo "📦 Processing $DIR"

  # Check if Dockerfile exists
  if [ ! -f "$SERVICE_DIR/Dockerfile" ]; then
    echo "⚠️ No Dockerfile found in $DIR, skipping..."
    continue
  fi

  cd "$SERVICE_DIR"

  echo "🐳 Building Docker image with sudo..."
  sudo docker build -t $DOCKER_USERNAME/$IMAGE:latest .

  echo "📤 Pushing Docker image to Docker Hub with sudo..."
  sudo docker push $DOCKER_USERNAME/$IMAGE:latest

done

echo "----------------------------------------"
echo "✅ All Docker images built and pushed successfully!"
