'use strict';

const 
  logger = require('./logger'),
  { spawn } = require('child_process'),
  { Duplex } = require('stream'); 

class SslSocket extends Duplex {
    #openssl
    constructor(port, host) {
      super()
      const parameters = [
        's_client',
        '-starttls',
        'smtp',
        '-connect',
        `${host}:${port}`,
      ]
      const pushData = (data) => { 
        data.toString().split('\n').forEach((line) => {
          if (line.match(/^[0-9][0-9][0-9] /)) {
            logger.trace('OpenSSL data received:', data.toString())
            this.push(line.trim())
          }
        })
      }
      this.#openssl = spawn('openssl', parameters)
      this.#openssl.stdout.on('data', (data) => {
        logger.trace('OpenSSL stdout data received:', data.toString())
        pushData(data)
      });
      this.#openssl.stderr.on('data', (data) => {
        logger.trace('OpenSSL stderr data received:', data.toString())
        pushData(data)
      });
      this.#openssl.on('close', () => {
        logger.trace('OpenSSL session closed.')
        this.destroy()
      });
    }
  
    _read(size) {
        logger.trace('OpenSSL _read() called with size=', size)
    }
  
    _write(chunk, encoding, callback) {
        logger.trace('OpenSSL _write() called with chunk=', chunk.toString())
        this.#openssl.stdin.write(chunk, encoding, callback)
    }
};

module.exports = SslSocket;

