const { Client } = require('@notionhq/client');
const ical = require('ical-generator');
const dotenv = require('dotenv');

dotenv.config();

module.exports = async function handler(req, res) {
    const { k } = req.query;

    // Verify access
    if (!k || k !== process.env.SECRET_KEY) {
        return res.status(403).send('Access denied');
    }

    // Initialize Notion client
    const notion = new Client({
        auth: process.env.NOTION_API_KEY,
    });

    try {
        // Query Notion database
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DB_ID,
            filter: {
                and: [
                    {
                        property: 'Date',
                        date: {
                            is_not_empty: true,
                        },
                    },
                    {
                        property: 'Statut',
                        status: {
                            does_not_equal: 'Terminé 🙌',
                        },
                    },
                ],
            },
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                },
            ],
        });

        // Create calendar
        const calendar = ical({
            name: 'Notion Tasks',
            ttl: 'PT5M',
        });

        // Add events
        response.results.forEach((item) => {
            const date = item.properties["Date"].date.start;
            const title = item.properties.Nom.title[0].text.content;

            calendar.createEvent({
                start: date,
                allDay: true,
                summary: title,
                description: item.properties["Matière"].select.name,
                //url: item.url,
            });
        });

        // Send calendar
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="cal.ics"');
        return res.status(200).send(calendar.toString());

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
