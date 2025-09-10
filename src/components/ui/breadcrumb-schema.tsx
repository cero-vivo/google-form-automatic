import React from 'react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbSchema({ items, className = "" }: BreadcrumbSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.href && { "item": `https://fastform.pro${item.href}` })
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="h-4 w-4 text-gray-400 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              {item.href ? (
                <a 
                  href={item.href} 
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs for common pages
export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const base = [{ name: "Inicio", href: "/" }];
  
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return base;
  
  const crumbs = [...base];
  
  // Map specific routes
  const routeMap: Record<string, { name: string; href: string }> = {
    'dashboard': { name: "Dashboard", href: "/dashboard" },
    'create': { name: "Crear Formulario", href: "/create" },
    'docs': { name: "Documentación", href: "/docs" },
    'pricing': { name: "Precios", href: "/pricing" },
    'auth': { name: "Autenticación", href: "/auth" },
    'login': { name: "Iniciar Sesión", href: "/auth/login" },
    'faq': { name: "FAQ", href: "/faq" },
    'about': { name: "Sobre Nosotros", href: "/about" },
  };
  
  segments.forEach(segment => {
    const mapped = routeMap[segment];
    if (mapped) {
      crumbs.push(mapped);
    } else {
      // Handle dynamic segments or unknown routes
      const name = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      crumbs.push({ name, href: `/${crumbs.map(c => c.href).join('/')}` });
    }
  });
  
  return crumbs;
};