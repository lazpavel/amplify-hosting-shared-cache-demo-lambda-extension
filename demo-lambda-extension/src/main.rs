use lambda_extension::{service_fn, tracing::{self, info}, Error, LambdaEvent, NextEvent};
use std::sync::Arc;
use tokio::sync::Notify; 

mod handlers;
mod routes;

async fn async_work(can_shutdown: Arc<Notify>) {
    info!("Starting async work");
    let routes = routes::cache_routes(can_shutdown);
    warp::serve(routes).run(([127, 0, 0, 1], 8888)).await;
}

async fn extension(event: LambdaEvent) -> Result<(), Error> {
    info!("Received event: {:?}", event.next);
    let can_shutdown = Arc::new(Notify::new());
    let server_task = tokio::spawn(async_work(can_shutdown.clone()));

    match event.next {
        NextEvent::Shutdown(_e) => {
            can_shutdown.notified().await;
            let _ = server_task.await;
            Ok(())
        }
        NextEvent::Invoke(_e) => {
            can_shutdown.notified().await;
            let _ = server_task.await;
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