#ifdef GL_ES
	#ifndef GL_FRAGMENT_PRECISION_HIGH	// highp may not be defined
		#define highp mediump
	#endif
	precision highp float; // default precision needs to be defined
#endif

// inputs from vertex shader
in vec2 tc;	// used for texture coordinate visualization

// output of the fragment shader
out vec4 fragColor;


void main()
{
	fragColor = vec4(tc.xy, 0, 1);
}