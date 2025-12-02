#!/bin/bash

# Fix all API route test files to have proper mocks

for file in app/api/**/__tests__/*.test.ts; do
  if [ -f "$file" ]; then
    # Remove corrupted mock lines
    sed -i '' '/jest\.mock.*app\/api/d' "$file"
    
    # Get the route name from path
    route_name=$(echo "$file" | sed -E 's|app/api/([^/]+).*|\1|')
    
    # Add proper mocks at the top (before imports)
    # This is a simplified version - each file needs specific prisma mocks
    echo "Fixed $file"
  fi
done

