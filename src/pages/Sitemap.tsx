import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('sitemap');
        
        if (error) throw error;
        
        // Replace current page with XML content
        document.open();
        document.write(data);
        document.close();
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        document.open();
        document.write('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
        document.close();
      }
    };

    fetchSitemap();
  }, []);

  return null;
};

export default Sitemap;
