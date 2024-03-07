use lambda_extension::{
    service_fn,
    tracing::{self, info},
    Error, LambdaEvent, NextEvent,
};
use std::sync::Arc;
use tokio::sync::Notify;
use aws_sdk_lambda::Client;
use aws_config::BehaviorVersion;
use aws_sdk_lambda as lambda;
use std::time::Instant;

mod handlers;
mod routes;

async fn async_work(client: Arc<Client>, can_shutdown: Arc<Notify>, server_started: Arc<Notify>) {
    info!("starting http extension server...");
    let routes = routes::cache_routes(client, can_shutdown);
    let (_, server) = warp::serve(routes).bind_ephemeral(([127, 0, 0, 1], 8888));
    server_started.notify_one(); // Notify that the server has started
    server.await
}

async fn extension(can_shutdown: Arc<Notify>, event: LambdaEvent) -> Result<(), Error> {
    info!("received event: {:?}", event.next);
    match event.next {
        NextEvent::Shutdown(_e) => {
            info!("shutdown event received, waiting for can_shutdown notification");
            can_shutdown.notified().await;
            info!("can_shutdown notification received, shutting down");
            info!("server task completed, returning");
            Ok(())
        }
        NextEvent::Invoke(_e) => {
            info!("invoke event received, waiting for can_shutdown notification");
            can_shutdown.notified().await;
            info!("can_shutdown notification received, shutting down");
            info!("server task completed, returning");
            Ok(())
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let start = Instant::now();
    info!("starting extension...");
    let client = Arc::new(lambda::Client::new(
        &aws_config::load_defaults(BehaviorVersion::latest()).await,
    ));

    let can_shutdown = Arc::new(Notify::new());
    let server_started = Arc::new(Notify::new());
    let server_future = async_work(client, can_shutdown.clone(), server_started.clone());
    let _ = tokio::spawn(server_future);
    server_started.notified().await;
    info!("server started...");
    info!("latency L4 (Cold Start) {:?}", start.elapsed());

    // required to enable CloudWatch error logging by the runtime
    tracing::init_default_subscriber();
    lambda_extension::run(service_fn(|event| {
        extension(can_shutdown.clone(), event)
    })).await
}
