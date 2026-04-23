#!/bin/sh
node scripts/syncDb.js
node scripts/seedDb.js
node server.js