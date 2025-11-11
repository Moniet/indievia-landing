import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all professional profiles with slugs
    const { data: professionals, error } = await supabase
      .from('professional_profiles')
      .select('slug, updated_at')
      .not('slug', 'is', null)

    if (error) {
      console.error('Error fetching professionals:', error)
    }

    const baseUrl = req.headers.get('origin') || 'https://indievia.com'
    
    // Static URLs
    const staticUrls = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/about', priority: '0.8', changefreq: 'monthly' },
      { loc: '/search', priority: '0.9', changefreq: 'daily' },
      { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
      { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    ]

    // Generate sitemap XML with proper formatting
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    // Add static URLs
    staticUrls.forEach(url => {
      sitemapContent += '  <url>\n'
      sitemapContent += `    <loc>${baseUrl}${url.loc}</loc>\n`
      sitemapContent += `    <changefreq>${url.changefreq}</changefreq>\n`
      sitemapContent += `    <priority>${url.priority}</priority>\n`
      sitemapContent += '  </url>\n'
    })
    
    // Add professional profile URLs
    if (professionals && professionals.length > 0) {
      professionals.forEach(pro => {
        sitemapContent += '  <url>\n'
        sitemapContent += `    <loc>${baseUrl}/professional/${pro.slug}</loc>\n`
        sitemapContent += `    <lastmod>${new Date(pro.updated_at || Date.now()).toISOString()}</lastmod>\n`
        sitemapContent += `    <changefreq>weekly</changefreq>\n`
        sitemapContent += `    <priority>0.9</priority>\n`
        sitemapContent += '  </url>\n'
      })
    }
    
    sitemapContent += '</urlset>'

    return new Response(sitemapContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
