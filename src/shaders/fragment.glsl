uniform float time;
uniform float mixFactor; 
uniform sampler2D tex1;
uniform sampler2D tex2;
varying vec2 vUv;

void main(){
    vec4 texColor1 = texture2D(tex1, vUv);
    vec4 texColor2 = texture2D(tex2, vUv);

    vec4 mixedColor = mix(texColor1, texColor2, mixFactor);

    if(mixedColor.r < 0.1 && mixedColor.b < 0.1 && mixedColor.g < 0.1){
        discard;
    }
    gl_FragColor = mixedColor;
}