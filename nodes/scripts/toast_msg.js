function Toast_Msg(msg) {
	/*
	RED.notify('Your message here', options)

	This can be called from the script in your admin ui code <nodeName>.html.

	By default, the notification will disappear after a few seconds.

	Options
	type: {success|warning|error=} Adds style to the message box.
	fixed: {boolean=false} Defaults to false, the notification will auto-remove after a few seconds.
	modal: {boolean=false} If true, no other user interactions are allowed until the notification has cleared.
	timeout: {ms=5000}: Specify the time in milliseconds a non-fixed notification will be displayed for.
	id: {string=} Allows a notification to be updated.
	width: {px=} Desired width in pixels. (Will be limited to the parent width)
	Methods
	.close(): Close the notification (useful if fixed option is true).
	update
	hideNotification
	showNotification
	Example
	let myNotification = RED.notify('My message in a box', {
		modal: true,
		fixed: true,
		type: 'warning',
		buttons: [
			{
				'text': 'cancel',
				'click': function(e) {
					myNotification.close()
				}
			},
			{
				'text': 'okay',
				'class': 'primary',
				'click': function(e) {
					myNotification.close()
				},
			},
		],
	})
	*/
	alert(msg);
	
}


module.exports = Toast_Msg;