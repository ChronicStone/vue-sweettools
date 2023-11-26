export function getFileTypeIcon(fileName: string) {
  const ext = fileName.split('.').pop() ?? ''
  const iconMap = [
    { ext: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico', 'webp'], icon: 'material-symbols:image' },
    { ext: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'wma'], icon: 'material-symbols:library-music' },
    {
      ext: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'wmv', 'mpg', 'mpeg', 'flv', '3gp'],
      icon: 'material-symbols:video-library-outline',
    },
    { ext: ['pdf'], icon: 'material-symbols:picture-as-pdf' },
    { ext: ['doc', 'docx', 'rtf'], icon: 'file-icons:microsoft-word' },
    { ext: ['xls', 'xlsx'], icon: 'file-icons:microsoft-excel' },
    { ext: ['ppt', 'pptx'], icon: 'file-icons:microsoft-powerpoint' },
    { ext: ['zip', 'rar', 'tar', 'gz'], icon: 'material-symbols:folder-zip' },
    { ext: ['psd'], icon: 'file-icons:adobe-photoshop' },
    { ext: ['ai'], icon: 'file-icons:adobe-illustrator' },
    { ext: ['indd'], icon: 'file-icons:adobe-indesign' },
    { ext: ['svg'], icon: 'teenyicons:svg-solid' },
    { ext: ['xls', 'xlsx'], icon: 'file-icons:microsoft-excel' },
    { ext: ['doc', 'docx'], icon: 'file-icons:microsoft-word' },
    { ext: ['ppt', 'pptx'], icon: 'file-icons:microsoft-powerpoint' },
    { ext: ['txt'], icon: 'material-symbols:text-snippet' },
    { ext: ['csv'], icon: 'teenyicons:csv-solid' },
    { ext: ['html', 'htm'], icon: 'ph:file-html-fill' },
    { ext: ['css'], icon: 'ph:file-css-fill' },
    { ext: ['js'], icon: 'ph:file-js-fill' },
    { ext: ['json'], icon: 'bxs:file-json' },
    { ext: ['xml'], icon: 'mdi:file-xml' },
  ]

  return iconMap.find(v => v.ext.includes(ext))?.icon ?? 'mdi:file'
}
