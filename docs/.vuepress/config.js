module.exports = {
  title: 'Laravel Tips',
  description: 'Awesome Laravel tips and tricks for all artisans. PR and ideas are welcome!',
  themeConfig: {
	smoothScroll: true,
	search: true,
    searchMaxSuggestions: 10,
	searchPlaceholder: 'Search for tip...',
	lastUpdated: 'Last Updated', // string | boolean    
    nextLinks: true,	// default value is true. Set it to false to hide next page links on all pages    
    prevLinks: true,	// default value is true. Set it to false to hide prev page links on all pages
    displayAllHeaders: false, 	// Default: false
	activeHeaderLinks: true, 	// Default: true
	nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/LaravelDaily/laravel-tips' }
    ],	
	sidebar: [
		{
			title: 'API',
			path: 'api.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},
		{
			title: 'Artisan',
			path: 'artisan.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},
		{
			title: 'Auth',
			path: 'auth.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Collections',
			path: 'collections.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'DB Models & Eloquent',
			path: 'db_models_and_eloquent.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Factories',
			path: 'factories.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Log & Debug',
			path: 'log_and_debug.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Mail',
			path: 'mail.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},		
		{
			title: 'Migrations',
			path: 'migrations.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},
		{
			title: 'Models & Relations',
			path: 'models_relations.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Other',
			path: 'other.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},	
		{
			title: 'Routing',
			path: 'routing.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},		
		{
			title: 'Validation',
			path: 'validation.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},		
		{
			title: 'Views',
			path: 'views.md',
			collapsable: false, // optional, defaults to true
			sidebarDepth: 1, 
		},
	],
  },
  
  plugins: [
	'@vuepress/back-to-top',
	'@vuepress/last-updated',
	'@vuepress/medium-zoom'
  ]
}