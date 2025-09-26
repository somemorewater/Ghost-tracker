#!/bin/bash

# Exit on error
set -e

# ===== Python setup =====
echo "Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r python/requirements.txt

# ===== Node setup =====
echo "Installing Node dependencies..."
npm install

echo "Setup complete!"
