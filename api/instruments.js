import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    const { method, url } = request;
    const urlParams = new URL(request.url, `http://${request.headers.host}`).searchParams;
    const id = urlParams.get('id');

    try {
        switch (method) {
            case 'GET':
                if (id) {
                    // Get single instrument by ID
                    const { rows } = await sql`SELECT * FROM instruments WHERE id = ${id};`;
                    if (rows.length === 0) {
                        return response.status(404).json({ error: 'Instrument not found' });
                    }
                    return response.status(200).json(rows[0]);
                } else {
                    // Get all instruments
                    const { rows } = await sql`SELECT * FROM instruments ORDER BY name;`;
                    return response.status(200).json(rows);
                }

            case 'POST':
                // Create new instrument
                const { name, category, key } = request.body;
                if (!name || !category || !key) {
                    return response.status(400).json({ error: 'Missing required fields: name, category, key' });
                }
                await sql`INSERT INTO instruments (name, category, key) VALUES (${name}, ${category}, ${key});`;
                return response.status(201).json({ message: 'Instrument created successfully' });

            case 'PUT':
                // Update existing instrument
                if (!id) {
                    return response.status(400).json({ error: 'Missing instrument ID for update' });
                }
                const { name: updateName, category: updateCategory, key: updateKey } = request.body;
                if (!updateName || !updateCategory || !updateKey) {
                    return response.status(400).json({ error: 'Missing required fields: name, category, key' });
                }
                const result = await sql`
                    UPDATE instruments 
                    SET name = ${updateName}, category = ${updateCategory}, key = ${updateKey} 
                    WHERE id = ${id};
                `;
                if (result.rowCount === 0) {
                     return response.status(404).json({ error: 'Instrument not found for update' });
                }
                return response.status(200).json({ message: 'Instrument updated successfully' });

            default:
                // Handle unsupported methods
                response.setHeader('Allow', ['GET', 'POST', 'PUT']);
                return response.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Database Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
} 