require('babel-register')
const { renderToStaticMarkup } = require('react-dom/server')
const typedoc = require('typedoc')
const _ = require('lodash')

const { main } = require('./templates')
const app = new typedoc.Application({
	exclude: '**/node_modules/**',
	ignoreCompilerErrors: true,
	includeDeclarations: true
})

const INTERFACE = 256
const METHOD = 2048

const res = _.chain(app.convert(['../../typings/index.d.ts']).toObject())

const base = res
	.get('children[0].children')
	.filter(({comment}) => comment)
	.map(({name, children, comment}) =>
		[
			name,
			{
				children: _.chain(children)
					.filter(({kind}) => METHOD === kind)
					.tap((v) => console.log(v))
					.map(({name, signatures, inheritedFrom}) => ({
						name,
						signature: _.get(signatures, '0', false),
						parameters: _.get(signatures, '0.parameters', []).map(({name, comment, type}) => [name, comment, type]),
						comment: _.get(signatures, '0.comment.shortText', 'no text'),
						inherited: _.get(inheritedFrom, 'name', false)
					}))
					.value(),
				comment
			}
		]
	)
	.fromPairs()
	.commit()

console.dir(base.get('StringGraph').value(),  { depth: 5 })
console.log('a', renderToStaticMarkup(main(['a'])))
