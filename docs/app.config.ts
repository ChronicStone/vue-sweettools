export default defineAppConfig({
  docus: {
    title: 'Sweettools | High-quality DX & type-safety focused suite of Vue 3 UI components & utilities',
    description: 'High-quality DX & type-safety focused suite of Vue 3 UI components & utilities. Forms, DataTables, Excel import, and more !',
    image: '/cover.png',

    socials: {
      twitter: '',
      github: 'https://github.com/ChronicStone/vue-sweettools',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      }
    },

    github: {
      dir: '.starters/default/content',
      branch: 'main',
      repo: 'Vue-Sweettools',
      owner: 'ChronicStone',
      edit: true,
      baseUrl: 'https://github.com/ChronicStone/vue-sweettools'
    },

    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },

    main: {
      padded: true,
      fluid: true
    },

    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true
    },

    titleTemplate: '%s · Sweettools'
  }
})