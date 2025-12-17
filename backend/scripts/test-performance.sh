#!/bin/bash

# Performance Test Script for SMANSA API
# Usage: ./scripts/test-performance.sh [endpoint]

API_BASE="${API_URL:-http://localhost:8000/api/v1}"
ENDPOINT="${1:-staff}"
ITERATIONS="${2:-5}"

echo "🚀 Performance Test for $API_BASE/$ENDPOINT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Response Time
echo "⏱️  Test 1: Response Time (${ITERATIONS} iterations)"
echo "─────────────────────────────────────────────────"

total_time=0
min_time=999999
max_time=0

for i in $(seq 1 $ITERATIONS); do
    start=$(date +%s%N)
    response=$(curl -s -o /dev/null -w "%{http_code},%{time_total}" "$API_BASE/$ENDPOINT")
    end=$(date +%s%N)

    http_code=$(echo $response | cut -d',' -f1)
    time_total=$(echo $response | cut -d',' -f2)
    time_ms=$(echo "$time_total * 1000" | bc)
    time_int=${time_ms%.*}

    if [ "$http_code" = "200" ]; then
        echo "  Request $i: ✓ ${time_ms}ms (Status: $http_code)"
    else
        echo "  Request $i: ✗ ${time_ms}ms (Status: $http_code)"
    fi

    total_time=$(echo "$total_time + $time_ms" | bc)

    if (( $(echo "$time_ms < $min_time" | bc -l) )); then
        min_time=$time_ms
    fi
    if (( $(echo "$time_ms > $max_time" | bc -l) )); then
        max_time=$time_ms
    fi
done

avg_time=$(echo "scale=2; $total_time / $ITERATIONS" | bc)
echo ""
echo "  Results:"
echo "    Min: ${min_time}ms"
echo "    Max: ${max_time}ms"
echo "    Avg: ${avg_time}ms"

if (( $(echo "$avg_time < 200" | bc -l) )); then
    echo "  ✓ Average response time is good (<200ms)"
elif (( $(echo "$avg_time < 500" | bc -l) )); then
    echo "  ⚠ Average response time is acceptable (<500ms)"
else
    echo "  ✗ Average response time is slow (>500ms)"
fi

echo ""

# Test 2: Cache Headers
echo "📦 Test 2: Cache Headers"
echo "─────────────────────────────────────────────────"

headers=$(curl -sI "$API_BASE/$ENDPOINT")
cache_control=$(echo "$headers" | grep -i "cache-control" | cut -d':' -f2 | xargs)
etag=$(echo "$headers" | grep -i "etag" | cut -d':' -f2 | xargs)
vary=$(echo "$headers" | grep -i "vary" | cut -d':' -f2 | xargs)

echo "  Cache-Control: ${cache_control:-Not set}"
echo "  ETag: ${etag:-Not set}"
echo "  Vary: ${vary:-Not set}"

if [[ "$cache_control" == *"public"* ]]; then
    echo "  ✓ Response is cached (public)"
elif [[ "$cache_control" == *"no-cache"* ]]; then
    echo "  ⚠ Response is not cached"
fi

echo ""

# Test 3: Response Size
echo "📏 Test 3: Response Size"
echo "─────────────────────────────────────────────────"

size_info=$(curl -sI "$API_BASE/$ENDPOINT" | grep -i "content-length" | cut -d':' -f2 | xargs)
if [ -n "$size_info" ]; then
    size_kb=$(echo "scale=2; $size_info / 1024" | bc)
    echo "  Content-Length: ${size_info} bytes (${size_kb}KB)"
else
    # Get actual response size
    actual_size=$(curl -s "$API_BASE/$ENDPOINT" | wc -c)
    size_kb=$(echo "scale=2; $actual_size / 1024" | bc)
    echo "  Response Size: ${actual_size} bytes (${size_kb}KB)"
fi

echo ""

# Test 4: Data Count
echo "📊 Test 4: Data Count"
echo "─────────────────────────────────────────────────"

data_count=$(curl -s "$API_BASE/$ENDPOINT" | grep -o '"id":' | wc -l)
echo "  Items in response: $data_count"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Performance test completed!"
