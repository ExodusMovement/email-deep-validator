const EmailValidator = require('../lib')
const logger = require('../lib/logger')

const validator = new EmailValidator({
  timeout: 10000,
  fromAddress: 'no-reply@foobar.com',
  portList: [25, 467, 587],
  useOpenSSL: true,
})

const isEmailValid = ({ wellFormed, validDomain, validMailbox }) => {
  const vals = [wellFormed, validDomain, validMailbox]
  for (const val of vals) {
    // we ignore null & undefined values -> that means the validator could not perform the check
    if (val === false) return false
  }
  return true
}

const addresses = [
  'support@exodus.com',
  'fverwgerpgkpokgp@exodus.com',
  'consulting@dooglio.net',
  'no-exist@dooglio.net',
  'foobar1235@hotmail.com',
  'fredsbank1234@live.com',
  'fredsbank1234459345439@yahoo.com',
  'fredsmith@yahoo.com',
  'frwjgrg34t4p3kvpkpokapokg@yahoo.com',
  'dooglio@gmail.com',
  'fredflinston123465@gmail.com',
  'foobar@protonmail.com',
  'foobar1234533353@protonmail.com',
]

async function validateAll() {
  for (const address of addresses) {
    let result = await validator.verify(address)
    const valid = isEmailValid(result)
    logger.info(`address '${address}' done, validMailbox=${result.validMailbox}, validEmail=${valid}`)
  }
}

validateAll()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    logger.error(err)
    process.exit(1)
  })

