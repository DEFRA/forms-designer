import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import cssnanoPresetDefault from 'cssnano-preset-default'

/**
 * @type {Config}
 */
export default {
  plugins: [
    // Add vendor prefixes
    autoprefixer({
      env: 'stylesheets'
    }),

    // Apply CSS optimisations
    cssnano({
      preset: cssnanoPresetDefault({
        env: 'stylesheets'
      })
    })
  ]
}

/**
 * @typedef {import('postcss-load-config').Config} Config
 */
