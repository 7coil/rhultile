const DICTIONARY = [
  'b', 'd', 'p', 'q'
]

const WORD_LENGTH = 3

/**
 * Convert a string to a blursed string.
 * @param {string} str The string that should be converted according to the dictionary
 */
const encode = (str) => {
  const encoder = new TextEncoder();

  return Array.from(encoder.encode(str))
    .map(byte =>
      [
        byte & 0b00000011,
        byte >> 2 & 0b00000011,
        byte >> 4 & 0b00000011,
        byte >> 6 & 0b00000011,
      ]
        .map(doubleBits => DICTIONARY[doubleBits])
        .join('')
    )
    .join('')
}

/**
 * Convert a blursed string into a string.
 * @param {string} str The blursed string that should be re-converted back into a normal link
 */
const decode = (str) => {
  const decoder = new TextDecoder();

  const array = Array.from(str.match(new RegExp(`.{1,4}`, 'g')))
    .map(blursedByte =>
      DICTIONARY.indexOf(blursedByte.charAt(0)) |
      DICTIONARY.indexOf(blursedByte.charAt(1)) << 2 |
      DICTIONARY.indexOf(blursedByte.charAt(2)) << 4 |
      DICTIONARY.indexOf(blursedByte.charAt(3)) << 6
    )
  
    return decoder.decode(new Uint8Array(array))
}

const redirect = window.location.hash;
const textInput = document.getElementById('text')
const submitInput = document.getElementById('submit')
const output = document.getElementById('output')

if (redirect.startsWith('#')) {
  let newUrl = decode(redirect.substring(1));

  if (newUrl.length) {
    window.location.href = newUrl
  }
} else {
  submitInput.addEventListener('click', () => {
    output.innerText = `${window.location.href}#${encode(textInput.value)}`
  })
}
