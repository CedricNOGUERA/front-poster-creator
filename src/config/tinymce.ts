// Configuration TinyMCE
export const TINYMCE_CONFIG = {
  // Clé API optionnelle - vous pouvez l'obtenir gratuitement sur https://www.tiny.cloud/
  API_KEY: import.meta.env.VITE_TINYMCE_API_KEY || '',
  
  // Configuration par défaut
  DEFAULT_CONFIG: {
    height: 150,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'help'
    ],
    toolbar: 'bold italic underline | superscript subscript | forecolor backcolor | ' +
      'alignleft aligncenter alignright | bullist numlist | ' +
      'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; margin: 0; padding: 8px; }',
    branding: false,
    elementpath: false,
    statusbar: false
  }
}
