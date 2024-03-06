use std::{collections::HashMap, convert::Infallible};
use lambda_extension::tracing::info;
use warp::http::StatusCode;
use std::sync::Arc;
use tokio::sync::Notify; 

pub async fn get_handler(
    key: String,
) -> Result<Box<dyn warp::Reply>, Infallible> {
    info!("get handler: {:?}", key);
    Ok(Box::new(warp::reply::json(&"{}")))
}

pub async fn set_handler(
    body: HashMap<String, String>,
    notification: Arc<Notify>,
) -> Result<impl warp::Reply, Infallible> {
    info!("set handler: {:?}", body);
    notification.notify_one();
    Ok(StatusCode::CREATED)
}
