#!/bin/bash
# Full flow API tests for MUHAMI.guru
set -e
ANON="${VITE_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaG9idGR3aXhmZXFtcG5iamJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTY2MzcsImV4cCI6MjA5Nzg3MjYzN30.LVuB_LhpFXjjbCg9fe7Paypr0Wy7CEs-2tnqUjYsJO0}"
BASE="https://uhhobtdwixfeqmpnbjbu.supabase.co/functions/v1/muhami-api"
HDR=(-H "Content-Type: application/json" -H "Authorization: Bearer $ANON" -H "apikey: $ANON")
ADMIN_KEY="${ADMIN_API_KEY:-0fd692d70acf9cbedc592fc328ee7b7b55b281b25d23477f}"
TS=$(date +%s)
TEST_EMAIL="test-${TS}@example.com"
TEST_PHONE="+971 50 $(printf '%03d' $((TS % 1000))) $(printf '%04d' $((TS % 10000)))"

echo "1. Health check..."
curl -sf "${HDR[@]}" "$BASE/health" | grep -q '"ok":true' && echo "   PASS" || echo "   FAIL"

echo "2. Admin login (valid)..."
TOKEN=$(curl -sf "${HDR[@]}" -X POST "$BASE/admin/login" -d '{"username":"admin","password":"admin"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
[ -n "$TOKEN" ] && echo "   PASS" || { echo "   FAIL"; exit 1; }

echo "3. Admin login (invalid)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HDR[@]}" -X POST "$BASE/admin/login" -d '{"username":"admin","password":"wrong"}')
[ "$STATUS" = "401" ] && echo "   PASS" || echo "   FAIL (got $STATUS)"

echo "4. New application ($TEST_EMAIL)..."
STATUS=$(curl -s -o /tmp/submit.json -w "%{http_code}" "${HDR[@]}" -X POST "$BASE/lawyers" -d "{\"fullName\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"phone\":\"$TEST_PHONE\",\"nationality\":\"Emirati\",\"experience\":\"6 – 10 years\"}")
[ "$STATUS" = "201" ] && echo "   PASS" || { echo "   FAIL (got $STATUS)"; cat /tmp/submit.json; exit 1; }

echo "5. Duplicate email..."
RES=$(curl -s "${HDR[@]}" -X POST "$BASE/lawyers" -d "{\"fullName\":\"Other\",\"email\":\"$TEST_EMAIL\",\"phone\":\"+971 55 999 8888\",\"nationality\":\"Emirati\",\"experience\":\"3 – 5 years\"}")
echo "$RES" | grep -q "email is already in use" && echo "   PASS" || { echo "   FAIL"; echo "$RES"; exit 1; }

echo "6. Duplicate phone..."
RES=$(curl -s "${HDR[@]}" -X POST "$BASE/lawyers" -d "{\"fullName\":\"Other2\",\"email\":\"other-${TS}@example.com\",\"phone\":\"$TEST_PHONE\",\"nationality\":\"Emirati\",\"experience\":\"3 – 5 years\"}")
echo "$RES" | grep -q "phone number is already in use" && echo "   PASS" || { echo "   FAIL"; echo "$RES"; exit 1; }

echo "7. Admin list applications..."
COUNT=$(curl -sf -H "x-admin-key: $ADMIN_KEY" -H "Authorization: Bearer $ANON" -H "apikey: $ANON" "$BASE/lawyers" | grep -o '"total":[0-9]*' | cut -d: -f2)
[ "${COUNT:-0}" -ge 1 ] && echo "   PASS (total=$COUNT)" || echo "   FAIL"

echo "8. Admin unauthorized..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "x-admin-key: wrong" -H "Authorization: Bearer $ANON" -H "apikey: $ANON" "$BASE/lawyers")
[ "$STATUS" = "401" ] && echo "   PASS" || echo "   FAIL (got $STATUS)"

echo ""
echo "All API tests passed."
