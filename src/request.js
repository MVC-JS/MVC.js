/**
 * Send an AJAX XMLHttpRequest
 * @param {string} protocol
 * @param {string} url
 * @param [data]
 * @returns {Promise}
 */
MVC.request = function(protocol, url, data) {
    return new Promise(function(success, error){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open(protocol, url);
        if(data === undefined){
            httpRequest.send()
        }else{
            var dataToSend;
            if(typeof data === "object"){
                dataToSend = JSON.stringify(data);
                httpRequest.setRequestHeader("Content-Type", "application/json");
            }else{
                dataToSend = data;
            }
            httpRequest.send(dataToSend);
        }

        httpRequest.onload = function () {
            if(httpRequest.status === 200){
                var response = httpRequest.response;

                //try to parse the data as JSON, if it fails then it's not JSON
                try {
                    response = JSON.parse(response.toString());
                } catch(err) {
                    //we don't care if it fails, since that just means it wasn't JSON and we didn't need to do anything
                }

                success(response);
            }else{
                error("HTTP Request Error: Status Code - " + httpRequest.status);
            }
        }
    })
}