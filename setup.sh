#!/bin/bash

# Exit on error
set -e

# ===== Python setup =====
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r python/requirements.txt

# ===== Node setup =====
echo "Installing Node dependencies..."
npm install

echo "Setup complete!"
