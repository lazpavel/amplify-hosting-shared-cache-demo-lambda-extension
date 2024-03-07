use aws_sdk_lambda::{primitives::Blob, types::InvocationType, Client};
use lambda_extension::tracing::info;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, convert::Infallible, sync::Arc, time::Instant};
use tokio::sync::Notify;
use warp::http::StatusCode;

#[derive(Deserialize)]
struct Payload {
    message: String,
    data: String,
}

#[derive(Serialize)]
struct Request {
    operation: String,
    key: String,
    data: Option<String>,
}

pub async fn get_handler(
    key: String,
    client: Arc<Client>,
) -> Result<Box<dyn warp::Reply>, Infallible> {
    let request = Request {
        operation: "get".to_string(),
        key,
        data: None,
    };

    let request = serde_json::to_string(&request).expect("failed to serialize request");
    let start = Instant::now();
    let resp = client
        .invoke()
        .function_name("amplify-hosting-shared-cache-demo")
        .invocation_type(InvocationType::RequestResponse)
        .payload(Blob::new(request))
        .send()
        .await;
    info!("latency L3 (get) {:?}", start.elapsed());
    match resp {
        Ok(resp) => match resp.payload {
            Some(payload) => {
                let payload = String::from_utf8(payload.into_inner()).unwrap();
                let payload: Payload =
                    serde_json::from_str(payload.as_str()).expect("payload was not valid JSON");
                info!("get response message: {}", payload.message);
                Ok(Box::new(warp::reply::json(&payload.data)))
            }
            None => {
                info!("get response message: {}", "no data");
                Ok(Box::new(warp::reply::json(&"{}")))
            }
        },
        Err(e) => {
            info!("get response message: {}", e);
            Ok(Box::new(warp::reply::json(&"{}")))
        },
    }
}

pub async fn set_handler(
    body: HashMap<String, String>,
    client: Arc<Client>,
    notification: Arc<Notify>,
) -> Result<impl warp::Reply, Infallible> {
    let key = body.get("key").unwrap().to_string();
    let data = body.get("data").unwrap().to_string();

    let request = Request {
        operation: "set".to_string(),
        key,
        data: Some(data),
    };

    let request = serde_json::to_string(&request).expect("failed to serialize request");
    let start = Instant::now();
    let resp = client
        .invoke()
        .function_name("amplify-hosting-shared-cache-demo")
        .invocation_type(InvocationType::RequestResponse)
        .payload(Blob::new(request))
        .send()
        .await;
    info!("latency L3 (set) {:?}", start.elapsed());
    notification.notify_one();
    match resp {
        Ok(_) => {
            info!("set response message: {}", "success");
            Ok(StatusCode::CREATED)
        }
        Err(e) => {
            info!("set response message: {}", e);
            Ok(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn unblock_shutdown_handler(
    notification: Arc<Notify>,
) -> Result<impl warp::Reply, Infallible> {
    notification.notify_one();
    Ok(StatusCode::CREATED)
}