use lambda_extension::{
    service_fn,
    tracing::{self, info},
    Error, LambdaEvent, NextEvent,
};
use std::sync::Arc;
use tokio::sync::Notify;

mod handlers;
mod routes;

async fn async_work(can_shutdown: Arc<Notify>, server_started: Arc<Notify>) {
    info!("Starting async work");
    let routes = routes::cache_routes(can_shutdown);
    let (_, server) = warp::serve(routes).bind_ephemeral(([127, 0, 0, 1], 8888));
    server_started.notify_one(); // Notify that the server has started
    server.await
}

async fn extension(event: LambdaEvent) -> Result<(), Error> {
    info!("Received event: {:?}", event.next);
    let can_shutdown = Arc::new(Notify::new());
    let server_started = Arc::new(Notify::new());
    let server_future = async_work(can_shutdown.clone(), server_started.clone());
    let _ = tokio::spawn(server_future);
    server_started.notified().await;
    info!("Server started...");

    match event.next {
        NextEvent::Shutdown(_e) => {
            info!("Shutdown event received, waiting for can_shutdown notification");
            can_shutdown.notified().await;
            info!("can_shutdown notification received, shutting down");
            info!("Server task completed, returning");
            Ok(())
        }
        NextEvent::Invoke(_e) => {
            info!("Invoke event received, waiting for can_shutdown notification");
            can_shutdown.notified().await;
            info!("can_shutdown notification received, shutting down");
            info!("Server task completed, returning");
            Ok(())
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    println!("Hello, world! Extension");
    // required to enable CloudWatch error logging by the runtime
    tracing::init_default_subscriber();
    info!("Starting lambda extension");
    lambda_extension::run(service_fn(extension)).await
}
