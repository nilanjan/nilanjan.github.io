#!/bin/bash

# Portfolio Deployment Script
# This script builds and deploys the portfolio application

set -e

echo "🚀 Starting portfolio deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v cargo &> /dev/null; then
        print_error "Rust is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Skipping containerized deployment."
    fi
    
    print_status "All dependencies are satisfied"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    cd ..
    print_status "Frontend build completed"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    # Build for release
    cargo build --release
    
    cd ..
    print_status "Backend build completed"
}

# Build Docker image (if Docker is available)
build_docker() {
    if command -v docker &> /dev/null; then
        print_status "Building Docker image..."
        docker build -t portfolio:latest .
        print_status "Docker image built successfully"
    else
        print_warning "Docker not available, skipping container build"
    fi
}

# Deploy to different platforms
deploy() {
    local platform=$1
    
    case $platform in
        "local")
            print_status "Starting local deployment..."
            # Start backend
            cd backend
            cargo run &
            BACKEND_PID=$!
            cd ..
            
            # Start frontend
            cd frontend
            npm run dev &
            FRONTEND_PID=$!
            cd ..
            
            print_status "Local deployment started"
            print_status "Frontend: http://localhost:5173"
            print_status "Backend: http://localhost:3001"
            print_status "Press Ctrl+C to stop"
            
            # Wait for user to stop
            trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
            wait
            ;;
            
        "docker")
            if command -v docker &> /dev/null; then
                print_status "Starting Docker deployment..."
                docker-compose up -d
                print_status "Docker deployment started"
                print_status "Portfolio: http://localhost:8080"
            else
                print_error "Docker is not available"
                exit 1
            fi
            ;;
            
        "production")
            print_status "Production deployment..."
            # Add your production deployment logic here
            # For example, deploying to Vercel, Netlify, or cloud platforms
            print_warning "Production deployment not configured yet"
            ;;
            
        *)
            print_error "Unknown deployment platform: $platform"
            print_status "Available platforms: local, docker, production"
            exit 1
            ;;
    esac
}

# Main execution
main() {
    local platform=${1:-local}
    
    print_status "Portfolio deployment script started"
    
    check_dependencies
    build_frontend
    build_backend
    build_docker
    
    deploy $platform
}

# Run main function with arguments
main "$@" 