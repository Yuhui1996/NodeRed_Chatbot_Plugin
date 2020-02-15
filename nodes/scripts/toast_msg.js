function Toast_Msg(RED, msg, msgType) {
	RED.notify('Test toast',{
		type: 'error',
		modal: false
	})
}


module.exports = Toast_Msg;