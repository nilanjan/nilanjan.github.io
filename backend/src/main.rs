use axum::{
    extract::Json,
    http::Method,
    response::Json as JsonResponse,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    id: String,
    title: String,
    description: String,
    technologies: Vec<String>,
    github_url: Option<String>,
    live_url: Option<String>,
    image_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ContactMessage {
    name: String,
    email: String,
    message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    message: Option<String>,
}

async fn health_check() -> JsonResponse<ApiResponse<String>> {
    JsonResponse(ApiResponse {
        success: true,
        data: Some("Portfolio API is running!".to_string()),
        message: None,
    })
}

async fn get_projects() -> JsonResponse<ApiResponse<Vec<Project>>> {
    let projects = vec![
        Project {
            id: "1".to_string(),
            title: "Graphics Architecture Research".to_string(),
            description: "Advanced research in tile-based and immediate-mode computer graphics rendering techniques for low-power, high-efficiency mobile graphics pipelines.".to_string(),
            technologies: vec!["Rust".to_string(), "C++".to_string(), "OpenGL".to_string(), "Vulkan".to_string()],
            github_url: None,
            live_url: None,
            image_url: Some("/assets/graphics-research.jpg".to_string()),
        },
        Project {
            id: "2".to_string(),
            title: "AR/VR Graphics Pipeline".to_string(),
            description: "Development of graphics pipeline architecture for augmented and virtual reality devices with focus on performance optimization.".to_string(),
            technologies: vec!["Rust".to_string(), "WebGL".to_string(), "WebXR".to_string(), "Three.js".to_string()],
            github_url: Some("https://github.com/nilanjan/ar-vr-pipeline".to_string()),
            live_url: Some("https://ar-vr-demo.example.com".to_string()),
            image_url: Some("/assets/ar-vr-pipeline.jpg".to_string()),
        },
        Project {
            id: "3".to_string(),
            title: "Portfolio Website".to_string(),
            description: "Modern portfolio website built with React and Rust, showcasing full-stack development skills and modern web technologies.".to_string(),
            technologies: vec!["React".to_string(), "TypeScript".to_string(), "Rust".to_string(), "Axum".to_string(), "Tailwind CSS".to_string()],
            github_url: Some("https://github.com/nilanjan/portfolio".to_string()),
            live_url: Some("https://nilanjan.github.io".to_string()),
            image_url: Some("/assets/portfolio.jpg".to_string()),
        },
    ];

    JsonResponse(ApiResponse {
        success: true,
        data: Some(projects),
        message: None,
    })
}

async fn submit_contact(Json(payload): Json<ContactMessage>) -> JsonResponse<ApiResponse<String>> {
    // In a real application, you would save this to a database
    // For now, we'll just log it and return a success response
    tracing::info!("Received contact message from {} ({})", payload.name, payload.email);
    tracing::info!("Message: {}", payload.message);

    JsonResponse(ApiResponse {
        success: true,
        data: Some("Message received successfully!".to_string()),
        message: Some("Thank you for your message. I'll get back to you soon!".to_string()),
    })
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any)
        .allow_headers(Any);

    // Build our application with a route
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/projects", get(get_projects))
        .route("/api/contact", post(submit_contact))
        .layer(cors);

    // Run it
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));
    tracing::info!("Portfolio backend listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
