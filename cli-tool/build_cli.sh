echo "Compiling..."
tsc
chmod +x cli.js
echo "Linking, to make globally available..."
npm link > /dev/null 2>&1
echo "Done!"

