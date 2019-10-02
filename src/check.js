const {runInParallel, delay} = require('./utils/async')
const {range} = require('./utils/array')


async function main() {

    const stubTasks = range(50).map(n => () => delay(500).then(() => {
        return `#${n} completed`
    }))

    return runInParallel(stubTasks, 5, res => {console.log(res)})
}

main()
    .then(console.log)
    .catch(console.error)