Simple REST API for testing purposes. Uses https://github.com/typicode/json-server

To start the REST, simply run `yarn run start`. Make sure, you've already
run `yarn install`.

This will start a server on `http://localhost:3002/`. Initial data is in
`db.json`.

To get retrieve data:

- `http://localhost:3002/posts` - Get a list of all posts.
- `http://localhost:3002/posts/1` - Get details for a specific post.
- `http://localhost:3002/comments?postId=1` - Get comments for a specific post.

To delete a post:

```
DELETE http://localhost:3002/posts/1?_dependent=comments HTTP/1.1
```

To update a comment:

```
PATCH http://localhost:3002/comments/318 HTTP/1.1
Content-Type: application/json
{"body": "New comment text"}
```

To create a new comment for the post with ID 21 (will generate an ID for the comment):

```
POST http://localhost:3002/comments HTTP/1.1
Content-Type: application/json
{"body":"Comment text","postId":"21","likes":4,"user":{"id":"38","username":"ariar","fullName":"Aria Roberts"}}
```

To create a new post:

```
POST http://localhost:3002/posts HTTP/1.1
Content-Type: application/json
{"title":"Post title","body":"Post content","tags":["french","american"],"reactions":{"likes":1,"dislikes":2},"views":5,"userId":136}
```
