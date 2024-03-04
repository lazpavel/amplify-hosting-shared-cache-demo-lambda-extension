use std::{convert::Infallible, collections::HashMap};
use warp::Filter;
use std::sync::Arc;
use tokio::sync::Notify; 

use crate::handlers;

pub fn cache_routes(can_shutdown: Arc<Notify>) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    get_item().or(set_item(can_shutdown))
}

fn set_item(can_shutdown: Arc<Notify>) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("set")
        .and(warp::post())
        .and(json_body())
        .and(with_notification(can_shutdown))
        .and_then(handlers::set_handler)
}

fn get_item() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("get" / String)
        .and(warp::get())
        .and_then(handlers::get_handler)
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
