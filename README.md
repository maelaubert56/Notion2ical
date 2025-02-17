# Notion2ical

This is a simple Node.js script streaming Notion database items/pages with a date into the iCalendar format.

## Prerequisites

- Node.js >= 14
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

2. Create an .env file from the example, and set up the variables explained below.

```bash
cp .env.example .env
```

Set up a [Notion integration](https://developers.notion.com/docs/create-a-notion-integration) to receive an API key.

The iCal feed will be accessible through `https://www.yourdomain.com/index.php?k=<SECRET_KEY>`.

To run this script, you will need to add the following environment variables to your .env file

`DEBUG_MODE` Debugging mode (prints content if true)

`SECRET_KEY` Security key preventing public accessing public access

`NOTION_API_KEY` Notion API key

`NOTION_DB_ID` Notion database ID

`NOTION_DATE_PROPERTY_NAME` Notion property name containing the task dateask date

`NOTION_STATUS_PROPERTY_NAME` Notion property name containing the status

`NOTION_EXCLUDE_STATUS` Notion status to exclude in the iCal feedUDE_STATUS` Notion status to exclude in the iCal feed

`TTL` Suggested update frequency for clients in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) formatfor clients in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) format

## ChangelogCan be found [here](CHANGELOG.md)## Changelog

Can be found [here](CHANGELOG.md)## Changelog
