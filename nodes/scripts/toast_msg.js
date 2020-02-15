function Toast_Msg(RED, msg, msgType) {
	var myNotification = RED.notify('Test toast',{
		type: 'error',
		modal: false
	})
}


module.exports = Toast_Msg;