import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'

import hapiVision from '@hapi/vision'
import nunjucks from 'nunjucks'
import resolvePkg from 'resolve/sync.js'

import pkg from '../../../package.json' with { type: 'json' }

import config from '~/src/config.js'

export const viewPlugin = {
  plugin: hapiVision,
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return (context) => {
            if (context.nonce) {
              delete Object.assign(context, {
                script_nonce: context['script-nonce']
              })['script-nonce']
              delete Object.assign(context, {
                style_nonce: context.style_nonce
              }).style_nonce
            }

            const html = template.render(
              context /* , function (err, value) {
              console.error(err)
            } */
            )
            return html
          }
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure(
            options.path,
            {
              autoescape: true,
              watch: false
            }
          )

          return next()
        }
      }
    },
    path: [
      resolve(config.appDir, 'views'),
      resolve(dirname(resolvePkg('govuk-frontend/package.json'))),
      resolve(dirname(resolvePkg('govuk-frontend/package.json')), 'components')
    ],
    context: {
      appVersion: pkg.version,
      assetPath: `${config.appPathPrefix}/assets`
    }
  }
}
