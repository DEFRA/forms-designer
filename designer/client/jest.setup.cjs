const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

process.env.REACT_LOG_LEVEL = 'silent'

configure({ adapter: new Adapter() })
