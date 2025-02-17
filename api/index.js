import { Client } from '@notionhq/client';
import ical from 'ical-generator';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    const { db, k } = req.query;

    // Verify access
    if (!db || !k || k !== process.env.SECRET_KEY) {
        return res.status(403).send('Access denied');
    }

    // Initialize Notion client
    const notion = new Client({
        auth: process.env.NOTION_API_KEY,
    });

    try {
        // Query Notion database
        const response = await notion.databases.query({
            database_id: db,
            filter: {
                and: [
                    {
                        property: process.env.NOTION_DATE_PROPERTY_NAME,
                        date: {
                            is_not_empty: true,
                        },
                    },
                    {
                        property: process.env.NOTION_STATUS_PROPERTY_NAME,
                        status: {
                            does_not_equal: process.env.NOTION_EXCLUDE_STATUS,
                        },
                    },
                ],
            },
            sorts: [
                {
                    property: process.env.NOTION_DATE_PROPERTY_NAME,
                    direction: 'descending',
                },
            ],
        });

        // Create calendar
        const calendar = ical({
            name: 'Notion Tasks',
            ttl: process.env.TTL || 'PT5M',
        });

        // Add events
        response.results.forEach((item) => {
            const date = item.properties[process.env.NOTION_DATE_PROPERTY_NAME].date.start;
            const title = item.properties.Name.title[0].text.content;

            calendar.createEvent({
                start: date,
                allDay: true,
                summary: title,
                description: item.url,
            });
        });

        // Debug mode
        if (process.env.DEBUG_MODE === 'true') {
            return res.status(200).send(calendar.toString());
        }

        // Send calendar
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="cal.ics"');
        return res.status(200).send(calendar.toString());

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
