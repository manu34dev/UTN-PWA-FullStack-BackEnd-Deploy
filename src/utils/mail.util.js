import transporter from "../config/transporter.config.js"

/*
 * Sends an email with a verification subject and the provided text as HTML content.
 * 
 * @param {string} text - The text content to be included in the email body.
 * @param {string} to - The recipient's email address.
 */
const sendEmail = async (options) =>{
    try {
    let response = await transporter.sendMail(options)
}
/* 
{
  accepted: [ 'molinajr40@gmail.com' ],
  rejected: [],
  ehlo: [
    'SIZE 35882577',
    '8BITMIME',
    'AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH',
    'ENHANCEDSTATUSCODES',
    'PIPELINING',
    'CHUNKING',
    'SMTPUTF8'
  ],
  envelopeTime: 577,
  messageTime: 599,
  messageSize: 276,
  response: '250 2.0.0 OK  1731805055 d2e1a72fcca58-724770ee95csm3726456b3a.27 - gsmtp',
  envelope: { from: '', to: [ 'molinajr40@gmail.com' ] },
  messageId: '<f832727a-2d40-b824-6589-8ad7b24c21f7@localhost>'
} 
*/
    catch (error) {
        //para trackear el error mejor
        console.error('Error al enviar mail:', error)
        //para que la funcion que invoque a esta funcion tambien le salte el error
        throw error
    }
}
/* 
sendEmail({
    html:'Hola desde node.js',
    subject:'verificacion de email',
    to: 'molinajr40@gmail.com'
})
 */
export {sendEmail}
