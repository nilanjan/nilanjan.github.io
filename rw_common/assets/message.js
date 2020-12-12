
var rapidweaver_should_remember_cookie_setting=true;var rapidweaver_privacy_message_dismiss_button=document.getElementById('rapidweaver_privacy_message_dismiss_button');var rapidweaver_privacy_message_storage_name="has_shown_rapidweaver_privacy_message";rapidweaver_privacy_message_dismiss_button.onclick=function(){rapidweaver_hideMessage();rapidweaver_setCookieSetting(rapidweaver_privacy_message_storage_name,"true");};function rapidweaver_hideMessage(){var message=document.getElementById('rapidweaver_privacy_message');message.parentNode.removeChild(message);}
if(rapidweaver_getCookieSetting(rapidweaver_privacy_message_storage_name)=="true"){rapidweaver_hideMessage();}
function rapidweaver_getCookieSetting(name){var storage=currentStorage();if(storage){return storage.getItem(name);}
return null;}
function rapidweaver_setCookieSetting(name,value){var storage=currentStorage();if(storage){storage.setItem(name,value);}}
function currentStorage(){var storage=window.localStorage;if(!rapidweaver_should_remember_cookie_setting){storage=null;}
return storage;}