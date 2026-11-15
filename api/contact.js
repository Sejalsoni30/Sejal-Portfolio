const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { full_name, email, service_required, budget, project_details } = body;

        if (!full_name || !email || !project_details) {
            return res.status(400).json({
                error: 'Missing required fields: full_name, email, and project_details are required.'
            });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                error: 'Supabase credentials are not configured in environment variables.'
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('contacts')
            .insert([{
                full_name,
                email,
                service_required: service_required || 'General Contact Inquiry',
                budget: budget || 'Not specified',
                project_details,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Server error processing contact submission' });
    }
};
