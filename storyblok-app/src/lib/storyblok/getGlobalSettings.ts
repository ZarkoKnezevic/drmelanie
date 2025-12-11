import { fetchStory } from './storyblok';
import { env, logger } from '@/utils';

/**
 * Fetch global settings from Storyblok
 * Looks for a story with slug "settings" or "global" and component type "settings"
 * 
 * In production, always uses 'published' version to allow static generation.
 * In development, uses the configured version (usually 'draft').
 */
export async function getGlobalSettings() {
  try {
    // Use 'published' in production for static generation, otherwise use configured version
    const version = env.isProduction ? 'published' : env.storyblok.version;
    
    // Try "settings" first, then "global"
    const slugs = ['settings', 'global'];

    for (const slug of slugs) {
      const { data } = await fetchStory(version, [slug]);

      if (data?.story?.content) {
        const content = data.story.content as {
          component?: string;
          header?: any | any[];
          footer?: any | any[];
          settings?: any[]; // Array of settings blocks (header, footer, etc.)
          // Header and footer might be nested in a blocks array
          body?: any[];
        };

        // Check if header/footer are in a settings array (new structure)
        if (Array.isArray(content.settings) && content.settings.length > 0) {
          const header = content.settings.find(
            (item: any) => item.component === 'header' || item.component === 'Header'
          );
          const footer = content.settings.find(
            (item: any) => item.component === 'footer' || item.component === 'Footer'
          );

          // Ensure header and footer have required properties
          const validHeader = header && header.component && header._uid ? header : null;
          const validFooter = footer && footer.component && footer._uid ? footer : null;

          if (validHeader || validFooter) {
            if (process.env.NODE_ENV === 'development') {
              logger.debug(
                `Global settings found: header=${!!validHeader}, footer=${!!validFooter}`
              );
            }
            return {
              header: validHeader,
              footer: validFooter,
            };
          }
        }

        // Legacy: Extract header/footer if they're direct fields
        // Extract header - handle both single object and array (blocks field)
        let header = null;
        if (content.header) {
          header =
            Array.isArray(content.header) && content.header.length > 0
              ? content.header[0]
              : content.header;
        }

        // Extract footer - handle both single object and array (blocks field)
        let footer = null;
        if (content.footer) {
          footer =
            Array.isArray(content.footer) && content.footer.length > 0
              ? content.footer[0]
              : content.footer;
        }

        // If we found header or footer, return them
        if (header || footer) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug(`Global settings found: header=${!!header}, footer=${!!footer}`);
          }
          return {
            header,
            footer,
          };
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('No global settings found - using default header/footer');
    }

    return {
      header: null,
      footer: null,
    };
  } catch (error: any) {
    // If settings story doesn't exist, return null
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Error fetching global settings: ${error?.message || error}`);
    }
    return {
      header: null,
      footer: null,
    };
  }
}
