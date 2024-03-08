# About

This is a cli tool to update / delete the places and images by making POST / DELETE API requests to the API.
To use this API, an API Key must be set on the server side with the .env file for development, or with an environmental variable for production.
Then specify that API Key in the request with the x-api-key header.
For more info on this look at the .env_example file.

As of now, since Next.js builds static assets, meaning it will fetch all places at build time, and not dynamically at runtime, to make new changes to the data apply to the production environment, you have to redeploy your application.
We could make it dynamic as well, but that would sacrifice some performance, and since data should not be updated too often, let's leave it like this for now.

# Usage

## Specify variables in a .env file

Contents of .env_example file in the `cli-tool` folder which is where this README is located.
Not to be confused with the .env file in the project root folder.

```
# This is just a template file. To actually use do the following:
# - Rename this file to .env
# - Give appropriate values to the below variables

# API Keys to access admin actions such as DELETE and POST
API_KEY_DEV="..."
API_KEY_PROD="..."

# URL of the server providing the API
BASE_URL_DEV="http://localhost:3000"
BASE_URL_PROD="..."

# Path to the "data" directory without trailing slash
DATA_DIR"/example/path/data"
```

## Structure of local files

Create a "data" and place your data in there with the following structure.
Specify the location of this "data" folder in the `.env` file. (Which is `.env_example` initially)

```
data
├── places.csv
└── images
    ├── shrine-name-1
    │   ├── example_image_1.jpg
    │   ├── example_image_2.png
    │   ├── main.jpg
    │   └── source.json
    ├── shrine-name-2
    │   ├── example_image_1.jpg
    │   ├── example_image_2.png
    │   ├── main.jpg
    │   └── source.json
    │ 
...
```

## places.csv

The places.csv file has all the information about each place.
Here is the schema with an example entry:

| slug        | name        | name_jp    | desc                   | category | prefecture_slug | geocode_latitude | geocode_longitude | gmap_link    | total_reviews | wiki_link    |
| ----------- | ----------- | ---------- | ---------------------- | -------- | --------------- | ---------------- | ----------------- | ------------ | ------------- | ------------ |
| test_shrine | Test Shrine | テスト神社 | This is a test shrine. | SHRINE   | kyoto           | 30.000           | 135.000           | put url here | 12345         | put url here |

## images

Put all the images and their metadata in the images folder.
Each sub-directory in images coresponds to a place.
The sub-directory name in "images" must match the slug in places.csv.
Place any number of images in there. You can put .jpg .jpeg .png .webp in there.
For the main image which is used for the icon and the first image to display in the popup, name it `main.` like `main.jpg` or any other image extension.
The source of the image i.e. where you got the image from is displayed with the image.
You can specify the source in the source.json file.
The structure is as follows.

Example where every image for the place is from the same source.

```
{
  "sources": [
    {
      "images": "all",
      "source_name": "pixabay",
      "source_url": "https://pixabay.com/"
    }
  ]
}

```

Example where we have multiple sources

```
{
  "sources": [
    {
      "images": ["main.jpg", "image1.jpg"],
      "source_name": "pixabay",
      "source_url": "https://pixabay.com/"
    },
    {
      "images": ["image2.jpg", "image3.jpg"],
      "source_name": "another_source_site",
      "source_url": "https://another_source_site.com/"
    }
  ]
}

```

## Compilation

To compile and link the cli-tool, execute the build_cli.sh with `./build_cli.sh`.
Make sure it is executable by doing `chmod +x build_cli.sh`

## Using the cli-tool

It can be used with the tsmj command.
You can check its signature with `tsmj -h`

```
Usage: tsmj [options] [command]

Options:
  -h, --help                                display help for command

Commands:
  getPlaces <env>                           Get all places from database
  deletePlace <env> <place_slug>            Get all places from database
  updatePlace <env> <place_slug> [dataDir]  Update one place
  updatePlaces <env> [sync] [dataDir]       Update all places
  help [command]                            display help for command
```

-   `env` is either `dev` or `prod`.
-   You can set the default path to the `data` directory in the .env file under DATA_DIR or you just specify it here as an argument.
-   Specifying the value "sync" for the argument [sync] of updatePlaces will delete all existing data, and then upload all local data. If set to any other value, it will only upload non-existing places.
