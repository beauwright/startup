class AudioProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{name: 'threshold', defaultValue: 22050}]; // Sets a threshold before firing off (1/2 a second of audio at 44100 Hz)
    }

    constructor() {
        super();
        this.buffer = new Float32Array(0);
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];

        // Accumulate audio data
        const left = input[0];
        this.buffer = this.concatFloat32(this.buffer, left);

        // If we have reached the threshold, convert to Int16 and post to main thread
        if (this.buffer.length >= parameters.threshold[0]) {
            const left16 = this.convertFloat32ToInt16(this.buffer);
            this.port.postMessage({ type: 'micBinaryStream', payload: left16 });
            this.buffer = new Float32Array(0);
        }

        return true;
    }

    concatFloat32(a, b) {
        let c = new Float32Array(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }

    convertFloat32ToInt16(buffer) {
        let l = buffer.length;
        let buf = new Int16Array(l);

        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }

        return buf.buffer;
    }
}

registerProcessor('audio-processor', AudioProcessor);
