-- name: GetKey :one
select * from core_kvstore where key = $1;

-- name: GetTx :one
select * from core_tx_results where lower(tx_hash) = lower($1) limit 1;

-- name: TotalTxResults :one
select count(tx_hash) from core_tx_results;

-- name: GetLatestAppState :one
select block_height, app_hash
from core_app_state
order by block_height desc
limit 1;

-- name: GetAppStateAtHeight :one
select block_height, app_hash
from core_app_state
where block_height = $1
limit 1;

-- name: GetAllRegisteredNodes :many
select *
from core_validators;

-- name: GetNodeByEndpoint :one
select *
from core_validators
where endpoint = $1
limit 1;

-- name: GetRegisteredNodesByType :many
select *
from core_validators
where node_type = $1;
