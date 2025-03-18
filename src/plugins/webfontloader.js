export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader');

  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'],
    },
    custom: {
      families: ['Material Icons'], // Add Material Design Icons
      urls: ['https://fonts.googleapis.com/icon?family=Material+Icons'], // Load from Google Fonts
    },
  });
}