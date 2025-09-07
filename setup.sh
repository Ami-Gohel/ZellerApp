#!/bin/bash

echo "🚀 Setting up Zeller React Native App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install iOS dependencies if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing iOS dependencies..."
    cd ios && pod install && cd ..
fi

echo "✅ Setup complete!"
echo ""
echo "To run the app:"
echo "  iOS: npm run ios"
echo "  Android: npm run android"
echo ""
echo "To start the mock server:"
echo "  cd ../mock-server && yarn install && yarn start"
echo ""
echo "To run tests:"
echo "  npm test"


