#!/bin/bash

# Exit immediately if a command fails
set -e

# ----------- CONFIG -----------
SERVICES=(
"AnySpares-DiscoveryServer"
"AnySpares-ServiceGateway"
"AnySpares-UserService"
"AnySpares-SellerService"
"AnySpares-BuyerService"
"AnySpares-PaymentService"
#"AnySpares-OrderService"
#"AnySpares-TrackingService"
)

BASE_DIR=$(pwd)
WAR_OUTPUTS=()

echo "🚀 Starting WAR build process for all services..."

for DIR in "${SERVICES[@]}"
do
  SERVICE_DIR="$BASE_DIR/$DIR"
  
  echo "----------------------------------------"
  echo "📦 Processing $DIR"

  # Check if directory exists
  if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Directory $DIR not found, skipping..."
    continue
  fi

  cd "$SERVICE_DIR"

  echo "🔨 Running Maven build (war only)..."
  mvn clean install -DskipTests

  # Check if WAR was created
  WAR_FILE=$(find target -maxdepth 1 -type f -name "*.war" | head -n 1)
  if [ -f "$WAR_FILE" ]; then
    WAR_OUTPUTS+=("$WAR_FILE")
    echo "✅ WAR built: $WAR_FILE"
  else
    echo "⚠️ No WAR file found for $DIR"
  fi

done

echo "----------------------------------------"
echo "🎉 WAR build process completed!"
echo "📦 Successfully built WAR files:"

for WAR in "${WAR_OUTPUTS[@]}"
do
  echo "  - $WAR"
done
