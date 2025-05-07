/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("historical_documents")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "file556499676",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "attachements",
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

  // remove field
  collection.fields.removeById("file556499676")

  return app.save(collection)
})
