var start = function(recognize_client) {
    if (_is_recording) {
        console.log("_is_recording=" + _is_recording);
        return;
    }
    _is_recording = true;

    chrome.tabCapture.capture({
        audio : true,
        video : false
    }, function(audio_stream) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaStreamSource(audio_stream);
        source.connect(audioCtx.destination);

        _media_recorder_handler = new MediaRecorderWrapper(audio_stream);

        _media_recorder_handler.ondataavailable = function (audio_buffer_obj) {
            recognize_client.record_callback(audio_buffer_obj);
        };

        if(!_media_recorder_handler.start(_record_time_ms)) {
            recognize_client.record_callback({"status":-1, "data": "start error: can not record audio."});
        }
    });
};