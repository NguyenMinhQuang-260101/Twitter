type Handle = () => Promise<string>
const name: string = 'Nguyễn Minh Quang'

const handle: Handle = () => Promise.resolve(name)

console.log(name)
handle().then(console.log)
