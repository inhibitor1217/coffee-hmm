# @coffee-hmm/http-api

A main HTTP api service for [Coffee Hmm](https://coffee-hmm.inhibitor.io)

## Table of Contents

- [API Documentation](#api_documentation)
  - [Cafe - Queries](#cafe_queries)
  - [Cafe - Mutations](#cafe_mutations)
  - [Cafe Image - Mutations](#cafe_image_mutations)
  - [Place - Queries](#place_queries)
  - [Place - Mutations](#place_mutations)
  - [User Events](#user_events)

<a name="api_documentation"></a>

## API Documentation

<a name="cafe_queries"></a>

### Cafe - Queries

### `GET /cafe/:cafeId`

Retrieve data of a single cafe.

**Query Parameters**

| **Name**           | **Type**  | **Required?**           | **Description**                                                                                                                                                                                            |
| ------------------ | --------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showHiddenImages` | `boolean` | no (default is `false`) | If `showHiddenImages` is true, then the result includes hidden cafe images. Requires `{ "operationType": "query", "operation": "api.cafe.image.hidden" }` privilege to use this query parameter as `true`. |

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "알레그리아",
    "place": {
      "id": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "판교"
    },
    "metadata": {
      "hour": "09:00 ~ 19:00"
    },
    "state": "active",
    "image": {
      "count": 2,
      "list": [
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 0,
          "isMain": true,
          "metadata": {
            "tag": "입구",
            "width": 1024,
            "height": 1920
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active"
        },
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 1,
          "isMain": false,
          "metadata": {
            "tag": "메뉴"
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active" // "active" | "hidden"
        }
      ] // images are ordered by its index
    },
    "views": {
      "daily": 12,
      "weekly": 45,
      "monthly": 235,
      "total": 372
    },
    "numLikes": 10
  }
}
```

The follows describe the detailed response schema.

```
{
  cafe: {
    id: [uuid],
    createdAt: [ISODateString],
    updatedAt: [ISODateString],
    name: string,
    place: {
      id: [uuid],
      createdAt: [ISODateString],
      updatedAt: [ISODateString],
      name: string
    },
    metadata: JSON,
    state: "active" | "hidden",
    image: {
      count: number,
      list: {
        id: [uuid],
        createdAt: [ISODateString],
        updatedAt: [ISODateString],
        cafeId: [uuid],
        index: number,
        isMain: boolean,
        metadata: JSON,
        relativeUri: string,
        state: "active" | "hidden"
      }[]
    },
    views: {
      daily: number,
      weekly: number,
      monthly: number,
      total: number
    },
    numLikes: number
  }
}
```

To clarify:

- To retrieve hidden cafes or cafe images, `{ operationType: "query", operation: "api.cafe.hidden" }` or `{ operationType: "query", "operation": "api.cafe.image.hidden" }` rules, respectively, is needed to be allowed at the requester's policy. If the requester does not have the privilege, then `403 Forbidden` will be thrown.
- `metadata` fields do not have concrete schema. It is set when the cafe is created or updated, and the data is retrieved as is.
- `image.list` are ordered by its `index`.
- Only one of the image among `image.list` is guaranteed to have `isMain: true`.

> Cafe images were planned to be paginated, but by second thought it was decided against it since there would be few images uploaded per cafe.

### `GET /cafe/feed`

Retrieves a list of cafe as a feed, which is selected randomly (for now), among the list of cafes.

- The list of cafes is **fixed** per user, and per day. Unsigned users will retrieve different result per request.

**Query Parameters**

| **Name**     | **Type** | **Required?** | **Description**                                                                                                                                                                                                                                                                        |
| ------------ | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`      | `int`    | yes           | Max number of items to be retrieved by this query. Max value is 64.                                                                                                                                                                                                                    |
| `cursor`     | `string` | no            | If `cursor` is provided, this query will fetch items after the `cursor`. Use `cursor` for pagination. Initially fetch the feed with no `cursor`, then set the `cursor` from the last request as query parameter to fetch next page.                                                    |
| `identifier` | `string` | no            | `identifier` is used to identify the **unsigned** requester among requests for different pages. If the requester is unsigend, initially fetch the feed with no `identifier`, then set the `identifier` from the first request as the query parameter for fetching the following pages. |

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "cafe": {
    "list": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "알레그리아",
        "place": {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "name": "판교"
        },
        "metadata": {
          "hour": "09:00 ~ 19:00"
        },
        "state": "active",
        "image": {
          "count": 2
        },
        "views": {
          "daily": 12,
          "weekly": 45,
          "monthly": 235,
          "total": 372
        },
        "numLikes": 10
      },
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "알레그리아",
        "place": {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "name": "판교"
        },
        "metadata": {
          "hour": "09:00 ~ 19:00"
        },
        "state": "active",
        "image": {
          "count": 2
        },
        "views": {
          "daily": 12,
          "weekly": 45,
          "monthly": 235,
          "total": 372
        },
        "numLikes": 10
      }
    ]
  },
  "cursor": <cursor-string>, // Set this as query parameter of next request to fetch the next page.
  "identifier": <identifier-string> // Returned only if the requester was not signed. Set this as query parameter of request for next page to ensure that the results are consistent.
}
```

### `GET /cafe/count`

Retrieve the number of cafes.

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "cafe": {
    "count": 99
  }
}
```

**Query Parameters**

| **Name**     | **Type**  | **Required?**           | **Description**                                                                                                                                                                              |
| ------------ | --------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keyword`    | `string`  | no                      | If `keyword` is set, the result will return the number of cafes which name or place is similar with given `keyword`.                                                                         |
| `showHidden` | `boolean` | no (default is `false`) | If `showHidden` is true, then the result includes the cafes which are hidden. Requires `{ "operationType": "query", "operation": "api.cafe.hidden" }` privilege to use this query parameter. |

### `GET /cafe/list`

Retrieve a list of cafes.

**Query Parameters**

| **Name**           | **Type**                                                     | **Required?**                 | **Description**                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`            | `int`                                                        | yes                           | Max number of items to be retrieved by this query. Max value is 64.                                                                                                                                                                 |
| `cursor`           | `string`                                                     | no                            | If `cursor` is provided, this query will fetch items after the `cursor`. Use `cursor` for pagination. Initially fetch the list with no `cursor`, then set the `cursor` from the last request as query parameter to fetch next page. |
| `orderBy`          | `"updatedAt"`, `"name"`, `"place"`, `"state"`, `"numImages"` | no (default is `"updatedAt"`) | Sets how the result will be sorted.                                                                                                                                                                                                 |
| `order`            | `"asc"`, `"desc"`                                            | no (default is `"asc"`)       | Sets how the result will be ordered. (`"asc"` meaning ascending and `"desc"` meaning descending)                                                                                                                                    |
| `keyword`          | `string`                                                     | no                            | If `keyword` is provided, the resulting list will be filetered which consists of cafe with name or place similar with given `keyword`.                                                                                              |
| `showHidden`       | `boolean`                                                    | no (default is `false`)       | If `showHidden` is true, then the result includes the cafes which are hidden. Requires `{ "operationType": "query", "operation": "api.cafe.hidden" }` privilege to use this query parameter.                                        |
| `showHiddenImages` | `boolean`                                                    | no (default is `false`)       | If `showHiddenImages` is true, then the result includes hidden cafe images. Requires `{ "operationType": "query", "operation": "api.cafe.image.hidden" }` privilege to use this query parameter as `true`.                          |

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "cafe": {
    "list": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "알레그리아",
        "place": {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "name": "판교"
        },
        "metadata": {
          "hour": "09:00 ~ 19:00"
        },
        "state": "active",
        "image": {
          "count": 2
        },
        "views": {
          "daily": 12,
          "weekly": 45,
          "monthly": 235,
          "total": 372
        },
        "numLikes": 10
      },
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "알레그리아",
        "place": {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "name": "판교"
        },
        "metadata": {
          "hour": "09:00 ~ 19:00"
        },
        "state": "active",
        "image": {
          "count": 2
        },
        "views": {
          "daily": 12,
          "weekly": 45,
          "monthly": 235,
          "total": 372
        },
        "numLikes": 10
      }
    ]
  },
  "cursor": <cursor-string> // set this as query parameter of next request to fetch the next page.
}
```

<a name="cafe_mutations"></a>

### Cafe - Mutations

### `POST /cafe`

Creates a new cafe.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe"
}
```

**Request Example**

```
{
  "name": "알레그리아",
  "placeId": "11111111-1111-1111-1111-111111111111",
  "metadata": {
    "hour": "09:00 ~ 20:00",
    "tag": ["감성"]
  },
  "state": "hidden" // optional, "active" || "hidden", default set to "hidden"
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "알레그리아",
    "place": {
      "id": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "판교"
    },
    "metadata": {
      "hour": "09:00 ~ 20:00",
      "tag": ["감성"]
    },
    "state": "hidden",
    "image": {
      "count": 0,
      "list": []
    },
    "views": {
      "daily": 0,
      "weekly": 0,
      "monthly": 0,
      "total": 0
    },
    "numLikes": 0
  }
}
```

### `PUT /cafe/:cafeId`

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe",
  "resource": cafeId
}
```

**Request Example**

```
{
  "name": "알레그리아", // optional
  "placeId": "11111111-1111-1111-1111-111111111111", // optional
  "metadata": {
    "hour": "10:00 ~ 22:00",
    "tag": ["감성"]
  }, // optional
  "status": "active" // optional
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "알레그리아",
    "place": {
      "id": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "판교"
    },
    "metadata": {
      "hour": "10:00 ~ 22:00",
      "tag": ["감성"]
    },
    "state": "hidden",
    "image": {
      "count": 2,
      "list": [
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 0,
          "isMain": true,
          "metadata": {
            "tag": "입구",
            "width": 1024,
            "height": 1920
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active"
        },
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 1,
          "isMain": false,
          "metadata": {
            "tag": "메뉴"
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active" // "active" | "hidden"
        }
      ] // images are ordered by its index
    },
    "views": {
      "daily": 12,
      "weekly": 45,
      "monthly": 235,
      "total": 372
    },
    "numLikes": 10
  }
}
```

<a name="cafe_image_mutations"></a>

### Cafe Image - Mutations

### `POST /cafe/:cafeId/image`

Attaches an image to cafe. If this is the first image attached to cafe and `state` is set to `active`, then this image will set as the main image.

First upload the actual image to the resource media server, then use the retrieved uri as request body.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe.*" | "api.cafe.image",
  "resource": cafeId
}
```

**Request Example**

```
{
  "uri": "/images/****************.png",
  "metadata": {
    "tag": "입구",
    "width": 1080,
    "height": 1920
  },
  "state": "hidden" // optional, "active" | "hidden", defaults to "hidden"
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "image": {
      "id": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "cafeId": "11111111-1111-1111-1111-111111111111",
      "index": 2,
      "isMain": false,
      "metadata": {
        "tag": "입구",
        "width": 1080,
        "height": 1920
      }
      "relativeUri": "/images/****************.png",
      "state": "hidden"
    }
  }
}
```

### `PUT /cafe/:cafeId/image`

Reorders the images, or set the main image of cafe.

The indices and `isMain` field should be _consistent_: that is, after updating the cafe image records, the images attached to the cafe should satisfy

- Exactly one of the images should have `isMain: true`.
- The main image of the cafe should have `state: "active"`.
- If there are `n` images, the `index` fields of the images should consist of `0, 1, ..., n-1`.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe.*" | "api.cafe.image",
  "resource": cafeId
}
```

**Request Example**

```
{
  "list": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "index": 0,
      "isMain": false
    },
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "index": 2,
      "isMain": true
    }
  ]
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "image": {
      "count": 3,
      "list": [
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 0,
          "isMain": false,
          "metadata": {
            "tag": "입구",
            "width": 1024,
            "height": 1920
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active"
        },
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 1,
          "isMain": false,
          "metadata": {
            "tag": "입구",
            "width": 1024,
            "height": 1920
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "hidden"
        },
        {
          "id": "11111111-1111-1111-1111-111111111111",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "cafeId": "11111111-1111-1111-1111-111111111111",
          "index": 2,
          "isMain": true,
          "metadata": {
            "tag": "입구",
            "width": 1024,
            "height": 1920
          }
          "relativeUri": "/images/11111111-1111-1111-1111-111111111111",
          "state": "active"
        }
      ]
    }
  }
}
```

### `PUT /cafe/:cafeId/image/:cafeImageId`

Modifies image uri, metadata, or state of an image attached to cafe.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe.*" | "api.cafe.image",
  "resource": cafeImageId
}
```

**Request Example**

```
{
  "uri": "/images/****************.png", // optional
  "metadata": {
    "tag": "입구",
    "width": 1080,
    "height": 1920
  }, // optional
  "state": "active" // optional
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "image": {
      "id": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "cafeId": "11111111-1111-1111-1111-111111111111",
      "index": 2,
      "isMain": false,
      "metadata": {
        "tag": "입구",
        "width": 1080,
        "height": 1920
      }
      "relativeUri": "/images/****************.png",
      "state": "active"
    }
  }
}
```

### `DELETE /cafe/:cafeId/image`

Deletes a list of images attached to cafe.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe.*" | "api.cafe.image",
  "resource": cafeId
}
```

**Request Example**

```
{
  "list": [
    "11111111-1111-1111-1111-11111111111",
    "11111111-1111-1111-1111-11111111111"
  ]
}
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "image": {
      "list": [
        {
          "id": "11111111-1111-1111-1111-111111111111"
        },
        {
          "id": "11111111-1111-1111-1111-111111111111"
        }
      ]
    }
  }
}
```

### `DELETE /cafe/:cafeId/image/:cafeImageId`

Delete an image attached to cafe.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.cafe.*" | "api.cafe.image",
  "resource": cafeImageId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "cafe": {
    "id": "11111111-1111-1111-1111-111111111111",
    "image": {
      "list": [
        {
          "id": "11111111-1111-1111-1111-111111111111"
        }
      ]
    }
  }
}
```

<a name="place_queries"></a>

### Place - Queries

### `GET /place/list`

Retrieve an entire list of places.

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "place": {
    "count": 2,
    "list": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "판교"
      },
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "name": "연남동"
      }
    ]
  }
}
```

<a name="place_mutations"></a>

### Place - Mutations

### `POST /place`

Creates a new place. The `name` should not exist among already existing places.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.place"
}
```

**Request Example**

```
{
  "name": "판교"
}
```

**Response Example**

```
{
  "place": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "판교"
  }
}
```

### `PUT /place/:placeId`

Updates a place. The `name` should not exist among already existing places.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.place",
  "resource": placeId
}
```

**Request Example**

```
{
  "name": "판교"
}
```

**Response Example**

```
{
  "place": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "판교"
  }
}
```

### `DELETE /place`

Delete a list of places. The requester should have privileges to mutate all of the given places. The places requested to be deleted should not have any cafes connected to them.

**Required Rule**

```
[
  {
    "operationType": "mutation",
    "operation": "*" | "api.*" | "api.place",
    "resource": list[0]
  },
  ...
]
```

**Request Example**

```
{
  "list": [
    "11111111-1111-1111-1111-111111111111",
    "11111111-1111-1111-1111-111111111111",
    "11111111-1111-1111-1111-111111111111",
    "11111111-1111-1111-1111-111111111111"
  ]
}
```

**Response Example**

```
{
  "place": {
    "list": [
      {
        "id": "11111111-1111-1111-1111-111111111111"
      },
      {
        "id": "11111111-1111-1111-1111-111111111111"
      },
      {
        "id": "11111111-1111-1111-1111-111111111111"
      },
      {
        "id": "11111111-1111-1111-1111-111111111111"
      }
    ]
  }
}
```

### `DELETE /place/:placeId`

Deletes a single place. The place requested to be deleted should not have any cafes connected to it.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "api.*" | "api.place",
  "resource": placeId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "place": {
    "id": "11111111-1111-1111-1111-111111111111"
  }
}
```

<a name="user_events"></a>

### User Events

### `POST /event`

Reports a new event.

The list of categories and event names:

| **Category** | **Name** | **Value** | **Description**                                                           |
| ------------ | -------- | --------- | ------------------------------------------------------------------------- |
| `CAFE`       | `VIEW`   | `cafeId`  | A cafe view event. This event will be counted to the `views` of the cafe. |

**Request Example - Cafe View Event**

```
{
  "category": "CAFE",
  "name": "VIEW",
  "value": "11111111-1111-1111-1111-111111111111"
}
```

**Response Example**

```
{
  "event": {
    "id": "11111111-1111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "userId": "11111111-1111-1111-1111-111111111111" // this will be set as null, if user is not signed
    "category": "CAFE",
    "name": "VIEW",
    "label": <label> // nullable
    "value": <value> // nullable
  }
}
```
