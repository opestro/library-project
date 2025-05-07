/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("historical_documents")

  // remove field
  collection.fields.removeById("select_status")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1843675174",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file3892009019",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "audio/mpeg",
      "audio/mp4"
    ],
    "name": "voice",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "file2093472300",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "video/mp4",
      "audio/mp4",
      "video/webm"
    ],
    "name": "video",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("historical_documents")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select_status",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "draft",
      "published",
      "archived"
    ]
  }))

  // remove field
  collection.fields.removeById("text1843675174")

  // remove field
  collection.fields.removeById("file3892009019")

  // remove field
  collection.fields.removeById("file2093472300")

  return app.save(collection)
})
