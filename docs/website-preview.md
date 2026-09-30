# Website Preview Pipeline

A preview build is a separate persisted object from the website build.

## States
queued → building → passed/failed → expired

A passed build requires real build evidence. A preview URL is only recorded when an actual preview provider returns one. A queued or generated project must never be described as live.
