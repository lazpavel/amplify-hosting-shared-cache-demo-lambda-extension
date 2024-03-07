use aws_sdk_lambda::Client;
use lambda_extension::tracing::info;
use std::sync::Arc;
use std::{collections::HashMap, convert::Infallible};
use tokio::sync::Notify;
use warp::Filter;

use crate::handlers;

pub fn cache_routes(
    client: Arc<Client>,
    can_shutdown: Arc<Notify>,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    info!("setting up routes");
    get_item(client.clone())
        .or(set_item(client.clone(), can_shutdown.clone()))
        .or(unblock_shutdown(can_shutdown.clone()))
}

fn set_item(
    client: Arc<Client>,
    can_shutdown: Arc<Notify>,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("set")
        .and(warp::post())
        .and(json_body())
        .and(with_client(client))
        .and(with_notification(can_shutdown))
        .and_then(handlers::set_handler)
}

fn get_item(
    client: Arc<Client>,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("get" / String)
        .and(warp::get())
        .and(with_client(client))
        .and_then(handlers::get_handler)
}

fn unblock_shutdown(
    can_shutdown: Arc<Notify>,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("unblock")
        .and(with_notification(can_shutdown))
        .and_then(handlers::unblock_shutdown_handler)
}

fn json_body() -> impl Filter<Extract = (HashMap<String, String>,), Error = warp::Rejection> + Clone
{
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}

fn with_notification(
    notification: Arc<Notify>,
) -> impl Filter<Extract = (Arc<Notify>,), Error = Infallible> + Clone {
    warp::any().map(move || notification.clone())
}

fn with_client(
    client: Arc<Client>,
) -> impl Filter<Extract = (Arc<Client>,), Error = Infallible> + Clone {
    warp::any().map(move || client.clone())
}
